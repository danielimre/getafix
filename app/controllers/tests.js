/**
 * Module dependencies.
 */
var mysql = require('mysql'),
    q = require('q'),
    mongoose = require('mongoose'),
    TestSet = mongoose.model('TestSet'),
    Test = mongoose.model('Test'),
    Checkpoint = mongoose.model('Checkpoint'),
    KeyValue = mongoose.model('KeyValue'),
    _ = require('underscore');

var pool = mysql.createPool({
  host     : 'xxx',
  port     : 3306,
  user     : 'xxx',
  password : 'xxx',
  database : 'testmanager_reporting'
});

function query(queryStr, params) {
  var deferred = q.defer();
  pool.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(queryStr, params, function(err, rows) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(rows);  
        }
      });
      
    }
  });
  return deferred.promise;
}

function findOrCreate(Type, keys, model) {
  var deferred = q.defer();
  Type.findOne(keys, Object.keys(keys).join(' '), function(err, found) {
    if (err) {
      deferred.reject(err);
    } else if (found === null) {
      Type.create(model, function(err, created, numOfChanges) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(created);
        }
      });
    } else {
      deferred.resolve(found);
    }
  });
  return deferred.promise;
}

function saveModel(model) {
  var deferred = q.defer();
  model.save(function(err, saved) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(saved);
    }
  });
  return deferred.promise;
}

function updateModel(Type, conditions, update, options) {
  var deferred = q.defer();
  Type.update(conditions, update, options, function(err, numberAffected) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(numberAffected === 1);
    }
  });
  return deferred.promise;
}

/**
 * List of all testruns.
 */
exports.importruns = function(req, res) {
    //return res.jsonp('disabled');
    var purgeDbTasks = [
      TestSet.remove({}).exec(),
    ];
    console.log('Purging DB...');
    var seq = q.all(purgeDbTasks);
    /*
    seq.then(function() {
      //return query('select count(*) from (select distinct setname, setdate from TEST_RUN_DATA) a');
      return query('select count(*) from TEST_RUN_DATA as t where concat(t.setname, unix_timestamp(t.setdate)) in (select concat(a.name, unix_timestamp(a.latest)) from (select SetName as name, max(SetDate) as latest from TEST_RUN_DATA group by SetName) as a)');
    })*/
    seq.then(function(c) {
      console.log(c);
      console.log('Fetching data from mysql db...');
      //return query('select d.*, m.* from TEST_RUN_DATA d left join TEST_RUN_MESSAGE m on d.TestRunMessageId = m.MessageId order by id limit 1');
      return query('select t.*, m.* from TEST_RUN_DATA as t left join TEST_RUN_MESSAGE m on t.TestRunMessageId = m.MessageId where concat(t.setname, unix_timestamp(t.setdate)) in (select concat(a.name, unix_timestamp(a.latest)) from (select SetName as name, max(SetDate) as latest from TEST_RUN_DATA group by SetName) as a)');
    })
    .then(function(rows) {
      console.log(rows.length + ' rows fetched');
      var deferred = q.defer();
      var seq = q('init');
      var i = 0;
      function next() {
        if (i < rows.length) {
          importRow(rows[i]).then(function(saved) {
            //console.log('this was saved', JSON.stringify(saved, undefined, 2))
            i++;
            if (i % 100 === 0) {
              console.log(i + '/' + rows.length);
            }
            seq = seq.then(next);
          });
        } else {
          deferred.resolve('done');
        }
      }
      seq.then(next);
      return deferred.promise;
    }).then(function(result) {
      res.jsonp('import done: ' + result);
    }).fail(function(err) {
      console.log('error:', err);
      res.jsonp(err);
    });
};

function importRow(row) {
  //console.log(row);
  var deferred = q.defer();
  var testsetName = row.SetName.trim();
  findOrCreate(TestSet, {'name': testsetName, 'created': row.SetDate}, {'name': testsetName, 'created': row.SetDate})
  .then(function(testset) {
    //console.log('got ', JSON.stringify(testset, undefined, 2));
    var testName = row.TestName.trim(),
        paramName = row.ParamName.trim(),
        test = new Test({'name': testName, 'variant': paramName, 'start': row.StartDate, 'end': row.StopDate, 'state': row.ResultState});
    if (row.ErrorMessage) {
      test.error = {
        message: row.ErrorMessage,
        comment: row.Comment,
        type: row.Type
      };
    }
    return q({testset: testset, test: test, update: {$push: {}, $inc: {}}});
  })
  .then(function(p) {
    return query('select * from TEST_RUN_CHECKPOINTS where testrunid = ?', row.Id).then(function(checkpoints) {
      checkpoints.forEach(function(checkpoint) {
        p.test.checkpoints.push(new Checkpoint({
          message: checkpoint.Message,
          mainType: checkpoint.MainType,
          subType: checkpoint.SubType,
          state: checkpoint.ResultState
        }));
      });
      return q(p);
    });
  })
  .then(function(p) {
    return query('select * from TEST_RUN_PARAMS where testrunid = ?', row.Id).then(function(params) {
      params.forEach(function(param) {
        p.test.params.push(new KeyValue({
          key: param.ParamKey,
          value: param.ParamValue
        }));
      });
      return q(p);
    });
  })
  .then(function(p) {
    //please note that env only exists when creating testset
    if (p.testset.env != null) {
      return query('select * from TEST_RUN_ENVIRONMENT where testrunid = ?', row.Id).then(function(envs) {
        envsToAdd = [];
        envs.forEach(function(env) {
           envsToAdd.push(new KeyValue({
            key: env.EnvKey,
            value: env.EnvValue
          }));
        });
        p.update.$push.env = {$each: envsToAdd};
        return q(p);
      });
    }
    return q(p);
  })
  .then(function(p) {
    p.update.$push.tests = p.test;
    if (p.test.state === 'PASSED') {
      p.update.$inc = {'state.passed' : 1} ;
    } else {
      p.update.$inc = {'state.failed' : 1} ;
    }
    
    //console.log(p.update);
    return updateModel(TestSet, {_id: p.testset._id}, p.update);
  })
  .done(function(saved) {
    deferred.resolve(saved);
  });
  return deferred.promise;
}

exports.allSets = function(req, res) {
    TestSet.find({}, 'name created state', function(err, testSets) {
      if (err) {
        res.jsonp(err);
      } else {
        res.jsonp(testSets);
      }
    });
};

exports.testsForSet = function(req, res) {
    TestSet.findOne({_id: req.params.setId}, 'tests.name tests.variant tests.start tests.end tests.state tests.error.message', function(err, testSets) {
      if (err) {
        res.jsonp(err);
      } else {
        res.jsonp(testSets.tests);
      }
    });
};

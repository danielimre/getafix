/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TestSetSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    state: {
        passed: {
            type: Number,
            default: 0
        },
        failed: {
            type: Number,
            default: 0
        }
    },
    env: [KeyValueSchema],
    tests: [TestSchema]
});

var TestSchema = new Schema({
    name: {
        type: String,
        trim: true
    },
    variant: {
        type: String,
        trim: true
    },
    params: [KeyValueSchema],
    checkpoints: [CheckpointSchema],
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    state: {
        type: String,
        default: 'PENDING',
        trim: true
    },
    error: {
        message: {
            type: String,
            trim: true
        },
        comment: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            trim: true
        }
    }
});

var CheckpointSchema = new Schema({
    message: {
        type: String,
        trim: true
    },
    mainType: {
        type: String,
        trim: true
    },
    subType: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
});

var KeyValueSchema = new Schema({
    key: {
        type: String,
        trim: true
    },
    value: {
        type: String,
        trim: true
    }
});

mongoose.model('TestSet', TestSetSchema);
mongoose.model('Test', TestSchema);
mongoose.model('KeyValue', KeyValueSchema);
mongoose.model('Checkpoint', CheckpointSchema);
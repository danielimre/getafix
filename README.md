# Getafix - the test manager

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/).
* MongoDB - Download and Install [MongoDB](http://www.mongodb.org/downloads) - Make sure it's running on the default port (27017).

### Optional
* Grunt - Download and Install [Grunt](http://gruntjs.com).

## Additional information
Based on [MEAN stack](https://github.com/MikeFielden/The-MEAN-Stack).

Main technologies used:
* Express - Defined as npm module in the [package.json](package.json) file.
* Mongoose - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.
* UI Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Quick Install

  Install dependencies:

    $ npm install

  Export the node Path to load your lib into project (default in HEROKU)

    $ export NODE_PATH=lib

  We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:

    $ npm install -g grunt-cli
    $ grunt

  When not using grunt you can use:

    $ node server
    
  Then open a browser and go to:

    http://localhost:3000

## Configuration

All configuration is specified in the [config](config/) folder, particularly the [config.js](config/config.js) file. 

### Environmental Settings

There are three environments provided by default, __development__, __test__, and __production__. Each of these environments has the following configuration options:
* db - This is the name of the MongoDB database to use, and is set by default to __getafix-dev__ for the development environment.

* Social Registration - Facebook, GitHub, Google, Twitter. You can specify your own social accounts here for each social platform, with the following for each provider:
	* clientID
	* clientSecret
	* callbackURL

To run with a different environment, just specify NODE_ENV as you call grunt:

    $ NODE_ENV=test grunt

If you are using node instead of grunt, it is very similar:

    $ NODE_ENV=test node server

> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## Credits

Based on the great [MEAN stack](https://github.com/MikeFielden/The-MEAN-Stack).

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

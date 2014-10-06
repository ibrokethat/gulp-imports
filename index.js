'use strict';
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (options) {
  options = options || {};

  var registry = 'import * as registry from \'../node_modules/superposition/node_modules/super-registry\'\n';

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {

      cb(null, file);
      return;
    }

    if (file.isStream()) {

      cb(new gutil.PluginError('gulp-esperanto', 'Streaming not supported'));
      return;
    }

    try {

      var file_name = file.path.split(file.base)[1].split('.')[0];
      var mod_name = file_name.replace(/\//g, '_');

      file_name = './' + file_name;

      var contents = registry + 'import * as ' + mod_name + ' from \'' + file_name +'\';\n';

      contents += 'registry.add(\'' + file_name + '\', ' + mod_name + ');\n';

      file.contents = new Buffer(contents);

      this.push(file);

      registry = '';
    }
    catch (err) {

      this.emit('error', new gutil.PluginError('gulp-esnext', err, {fileName: file.path}));
    }

    cb();
  });
};
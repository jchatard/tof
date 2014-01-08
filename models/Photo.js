var Backbone = require('backbone')
  , execSync = require('execSync')
  , path     = require('path')
  , fs       = require('fs')
  , _        = require('underscore')
  , _s       = require('underscore.string')
  , Photo    = Backbone.Model.extend({
  initialize: function() {
    // Compute default data
    this.set('filename', path.basename(this.get('path')));
    this.set('folder', _.last(path.dirname(this.get('path')).split(path.sep)));
    this.set('src', this.publicPath().replace('public', ''));
    this.set('exifFilePath', this.publicPath().replace('.jpg', '.meta.json'));
    this.set('exif', this.loadExif());

    // Set title and caption
    this.set('title', this.getExifValue('Title'));
    this.set('caption', this.getExifValue('Image Description'));
  },
  defaults: {
    title: null,
    caption: null,
    path: null,
    filename: null,
    folder: null,
    exif: null
  },
  extractExifFromJPEG: function() {
    var fullPath = 'sets/' + this.get('folder') + '/' + this.get('filename');
    var meta = execSync.stdout('exiftool ' + fullPath);
    return this.convertExifMetaToJson(meta);
  },
  saveExifToFile: function(json) {
    var file = this.get('exifFilePath');
    // We save meta data as a JSON file to prevent parsing the Exif data
    // each time that page is requested.
    fd = fs.openSync(file, 'w');
    fs.writeFileSync(file, JSON.stringify(json));
    fs.close(fd);
  },
  loadExif: function() {
    var self = this;
    var exists = fs.existsSync(self.get('exifFilePath'));
    if (exists) {
      // console.log('Exif cache file exists: ' + self.get('exifFilePath'));
      var json = JSON.parse(fs.readFileSync(self.get('exifFilePath'), 'utf8'));
      return json;
    }
    // Cache doesn't exist, parse Exif data and store them
    // in a cached file
    else {
      // console.log('Will generate Exif cache file: ' + self.get('exifFilePath'));
      var exif = self.extractExifFromJPEG();
      self.saveExifToFile(exif);
      return exif;
    }
  },
  publicPath: function() {
    return ['public', 'set', this.get('folder'), this.get('filename')].join('/');
  },
  convertExifMetaToJson: function (data) {
    var lines = _s.lines(data)
      , meta  = {};

    _.each(lines, function(line) {
      line      = _s.trim(line);
      var key   = _s.trim(line.split(/:/)[0]);
      var value = _s.trim(line.split(/:[ \t]/)[1]);
      if (!_s.isBlank(key)) {
        meta[key] = value;
      }
    });
    return meta;
  },
  getExifValue: function(key) {
    if (!_.isUndefined(this.get('exif')[key]) && !_.isNull(this.get('exif')[key])) {
      return this.get('exif')[key];
    }
    return null;
  },
  getExifValueOutput: function(key) {
    var value = this.getExifValue(key);
    if (null !== value) {
      return value;
    }
    return '';
  },
  printMetasSeparatedByCommas: function(array) {
    return _.compact(array).join(', ');
  }
});

exports.Photo = Photo;

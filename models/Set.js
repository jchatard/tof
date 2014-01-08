var Backbone  = require('backbone')
  , yamlFront = require('yaml-front-matter')
  , fs        = require('fs')
  , ghm       = require('github-flavored-markdown')
  , mkdirp    = require('mkdirp')
  , path      = require('path')
  , Photo     = require('./Photo.js').Photo;

var Set = Backbone.Model.extend({
  initialize: function() {
    // console.log('Loading Set at path: ' + this.get('path'));
    this.loadYamlConfiguration();
    this.parseDescription();
    this.set('folder', path.basename(this.get('path')));
  },
  defaults: {
    folder: null,
    path: null,
    config: null,
    title: null,
    description: null,
    location: null,
    year: null,
    photos: [],
  },
  loadYamlConfiguration: function() {
    var configFile = [this.get('path'), 'config.yaml'].join('/');
    if (fs.existsSync(configFile)) {
      // console.log('Loading configuration file at path %s', configFile);
      var data = fs.readFileSync(configFile);
      this.set('config', yamlFront.loadFront(data));
      this.set('title', this.get('config').title);
      this.set('tag_line', this.get('config').tag_line);
    }
    else {
      console.error('No configuration file at path %s', configFile);
    }
  },
  parseDescription: function() {
    this.set('description', ghm.parse(this.get('config').__content))
  },
  isPublished: function() {
    return this.get('config').published;
  },
  publicFolder: function() {
    return process.cwd() + '/public/set/' + this.get('folder');
  },
  publicFolderExists: function() {
    return fs.existsSync(process.cwd() + '/public/set/' + this.get('folder'));
  },
  createPublicFolder: function() {
    mkdirp(process.cwd() + '/public/set/' + this.get('folder'));
  },
  loadPhotos: function() {
    var photos = [];
    var basePath = this.get('path');
    this.get('config').photos.forEach(function(filename) {
      photos.push(new Photo({path: basePath + '/' + filename}));
    });
    this.set('photos', photos);
  },
  getMeta: function(key) {
    var value = this.get(key);
    if (value) {
      return value;
    }
    return '';
  }
});

exports.Set = Set;

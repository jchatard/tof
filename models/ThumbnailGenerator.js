var EventEmitter = process.EventEmitter;
var colors = require('colors');

function ThumbnailGenerator (srcPath) {
  this.src = srcPath;
}

ThumbnailGenerator.prototype.__proto__ = EventEmitter.prototype;

ThumbnailGenerator.prototype.generateThumbnail = function (dstPath, width, height, backgroundColor) {
  // Declare events
  this.on('srcExists', function () {
    // console.log('Will scale: ' + this.src);
    this.scale(dstPath, width, height);
  });

  this.on('didScale', function () {
    // console.log('Will extend: ' + this.src);
    this.extendCanvas(dstPath, width, height, backgroundColor);
  });

  this.on('didExtendCanvas', function () {
    console.log('Thumbnail was generated at path: '.blue + dstPath);
    this.emit('thumbnailGenerated');
  });

  // Start thumbnail generation
  this.srcExists(this.src);
}

ThumbnailGenerator.prototype.srcExists = function (path) {
  var fs = require('fs')
    , self = this;
  return fs.exists(path, function (exists) {
    if (exists) {
      self.emit('srcExists');
    }
    else {
      console.log(path + ' does not exist');
    }
  });
}

ThumbnailGenerator.prototype.scale = function (dstPath, width, height) {
  var im = require('imagemagick')
    , self = this;

  im.resize({
    srcPath: this.src,
    dstPath: dstPath,
    quality: 1,
    width: width,
    height: height,
    progressive: true
  }, function (err, stdout, stderr) {
    if (err) throw err
    self.src = dstPath;
    self.emit('didScale');
  });
}

ThumbnailGenerator.prototype.extendCanvas = function (dstPath, width, height, backgroundColor) {
  var im = require('imagemagick')
    , self = this
    , dimensions = width + 'x' + height + '!'
    , args = [self.src, '-background', backgroundColor, '-gravity', 'center', '-extent', dimensions, dstPath];

  im.convert(args, function (err, metadata) {
    if (err) throw err
    self.emit('didExtendCanvas');
  });
}

exports.ThumbnailGenerator = ThumbnailGenerator;

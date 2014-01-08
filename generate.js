var argv = require('optimist')
    .usage('Usage: $0 [folder]')
    .demand(['folder'])
    .argv;

var fs = require('fs')
  , path = require('path')
  , colors = require('colors')
  , Set = require('./models/Set.js').Set
  , ThumbnailGenerator = require('./models/ThumbnailGenerator.js').ThumbnailGenerator;

var fullPath = path.resolve(process.cwd(), argv.folder);

console.log('=============================================='.green);
console.log('==          Tof generator script            =='.green);
console.log('==============================================\n'.green);
console.log('Publishing set at path: '.green + argv.folder);

var set = new Set({path: fullPath});
// Create folder in public/set/[folder]
if (!set.publicFolderExists()) {
  console.log('Creating public folder.');
  set.createPublicFolder();
}

// Copy config.yaml in public/set/[folder]/config.yaml
console.log('Copying config.yaml at public folder...'.green);
fs.createReadStream(fullPath + '/config.yaml')
  .pipe(fs.createWriteStream(set.publicFolder() + '/config.yaml'));

console.log('Loading photos...'.green);
set.loadPhotos();

// Generate thumbnail
console.log('Start thumbnails generation...'.green);
set.get('photos').forEach(function (photo) {
  var src = fullPath + '/' + photo.get('filename');
  var dst = set.publicFolder() + '/' + photo.get('filename');
  var thumb = new ThumbnailGenerator(src);
  thumb.generateThumbnail(dst, 959, 640, '#f9f8f8');
});

var colors = require('colors')
  , path   = require('path')
  , _s     = require('underscore.string');

console.log('=============================================='.green);
console.log('==          Tof publish script              =='.green);
console.log('==============================================\n'.green);

var fullPath = path.resolve('public/set/');

console.info('Updating sets folders, please wait...\n'.yellow);

var spawn = require('child_process').spawn;

var setsRsync = spawn('rsync', ['-azv', '--exclude=\'.DS_Store\'', '--delete-excluded', '--delete', fullPath, 'ssd2:/home/jchatard/tof/public/']);

setsRsync.stdout.on('data', function (data) {
  console.log('  Rsync says: '.blue + _s.trim(data));
});

setsRsync.stderr.on('data', function (data) {
  console.log('  Rsync error: '.red + _s.trim(data));
});

setsRsync.on('exit', function (code) {
  console.log('  Rsync exited with code: '.green + _s.trim(code).yellow);
  rsyncSetsConfigFile();
});

function rsyncSetsConfigFile() {
  console.info('\nUpdating sets config, please wait...\n'.yellow);
  var fullPath = path.resolve(process.cwd(), './sets/config.yaml');

  var configRsync = spawn('rsync', ['-azv', '--exclude=\'.DS_Store\'', '--delete-excluded', '--delete', fullPath, 'ssd2:/home/jchatard/tof/sets/']);

  configRsync.stdout.on('data', function (data) {
    console.log('  Rsync says: '.blue + _s.trim(data));
  });

  configRsync.stderr.on('data', function (data) {
    console.log('  Rsync error: '.red + _s.trim(data));
  });

  configRsync.on('exit', function (code) {
    console.log('  Rsync exited with code: '.blue + _s.trim(code).yellow);
    console.log('\nAll done!'.green);
  });
}

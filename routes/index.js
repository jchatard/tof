
/*
 * GET photos home page.
 */
exports.index = function (req, res) {
  var fs      = require('fs')
  , path      = require('path')
  , _         = require('underscore')
  , yaml      = require('js-yaml')
  , Set       = require('../models/Set.js').Set;

  var config = fs.readFileSync(process.cwd() + '/sets/config.yaml');

  config = yaml.load(config.toString());

  var sets = [];
  _.each(config.sets, function(entry) {
    var fullPath = process.cwd() + '/public/set/' + entry;
    if (fs.existsSync(fullPath)) {
      var info = fs.statSync(fullPath);
      if (info.isDirectory()) {
        var set = new Set({path: fullPath});
        if (set.isPublished()) {
          sets.push(set);
        }
      }
    }
    else {
      console.warn('Set does not exist at path: ' + fullPath);
    }
  });

  res.render('index', { layout: 'index', title: 'Photos', sets: sets, blog_url: req.app.set('blog_url') });
};

/*
 * GET set page
 */
exports.set = function(req, res){
  var fs        = require('fs')
    , Set       = require('../models/Set.js').Set
    , folder    = req.params.folder;

  var fullPath = process.cwd() + '/public/set/' + folder;
  if (!fs.existsSync(fullPath)) {
    console.error('Set folder %s does not exists', fullPath);
    res.send(404, { error: 'Sorry! There is no set here.' });
    return;
  };

  var set = new Set({path: fullPath});

  // In case the set is not published return a 403
  if (!set.isPublished()) {
    console.error('Set %s is not published', set.get('title'));
    res.send(403, { error: 'Sorry! you can\'t see that.' });
    return;
  }

  console.log('Set %s is published', set.get('title'));

  if (!set.publicFolderExists()) {
    set.createPublicFolder();
  }

  set.loadPhotos();
  res.render('set', {
    title: set.get('title'),
    images: set.get('photos'),
    description: set.get('description'),
    folder: folder,
    blog_url: req.app.set('blog_url'),
  });
};

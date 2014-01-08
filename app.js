/**
 * Module dependencies.
 */

var express  = require('express')
  , routes   = require('./routes')
  , app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/set'));
app.use(app.router);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.configure('development', function(){
  app.set('blog_url', 'http://localhost:4000');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.locals.pretty = true;
});

app.configure('production', function(){
  app.set('blog_url', 'http://jchatard.com');
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/set/:folder', routes.set);

app.listen(3000);
console.log('Express server listening at port 3000 in %s mode', app.settings.env);
console.log('Blog URL: ' + app.set('blog_url'));

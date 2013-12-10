
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todoapp');

var todoItemSchema = mongoose.Schema({
    text: String,
    completed: Boolean
});

var todoItem = mongoose.model('TODOItem', todoItemSchema);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/list', function(req, res){
  todoItem.find({completed: false}, function(err, todoitems) {
    if (err) {
      res.json([]);
    } else {
      var items = [];
      for (var i = 0; i < todoitems.length; i++) {
        var todoitem = todoitems[i];
        items.push({
          id: todoitem._id,
          text: todoitem.text
        });
      };
      res.json(items);      
    }
  });
});

app.post('/add', function(req, res){
  var text = req.body.text;
  console.log("adding " + text);
  var newItem = new todoItem();
  newItem.text = text;
  newItem.completed = false;
  newItem.save(function (e) {
    console.log("added " + text);
    res.end();
  });
});

app.post('/complete', function(req, res){
  var id = req.body.id;
  console.log("calling complete " + id);
  todoItem.findOne({_id: id}, function (err, item) {
    if (err) {
      console.log("found element with id " + id);      
      res.end();
    } else {
      item.completed = true;
      item.save(function (err, item) {
        if (err) {
          console.log("error saving element with id " + id);      
        } else {
          console.log("saved element with id " + id);      
        }
        res.end();
      })
    }
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

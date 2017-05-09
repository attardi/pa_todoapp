
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , errorHandler = require('errorhandler')
    , logger = require('morgan')
    , path = require('path')
    , routes = require('./routes');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todoapp');

var todoItemSchema = mongoose.Schema({
    text: String,
    completed: Boolean
});

var todoItem = mongoose.model('TODOItem', todoItemSchema);

var app = express();
//var server = http.createServer(app);

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var users = require('./routes/users');

if (app.get('env') === 'development')
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
else
  app.use(errorHandler());

// Routes
app.get('/', routes.index);

app.get('/list', function(req, res) {
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

app.post('/add', function(req, res) {
  var text = req.body.text;
  console.log("adding " + text);
  var newItem = new todoItem({text: text, completed: false});
  newItem.save(function (e) {
    console.log("added " + text);
    res.end();
  });
});

app.post('/complete', function(req, res) {
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

app.listen(8080, function () {
    console.log('ToDo app listening on port 8080!')
});
//module.exports = app;


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

// mongoose setup
var mongoose = require('mongoose');

var todoItemSchema = mongoose.Schema({
    text: String,
    completed: Boolean
});

var ToDoItem = mongoose.model('ToDoItem', todoItemSchema);
mongoose.connect('mongodb://localhost/todoapp');

var app = express();

// Configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// possibly used to distinguish between users
app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');

// development only
if (app.get('env') === 'development')
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
else
  app.use(errorHandler);

// Request handlers

app.get('/', routes.index);

app.get('/list', function(req, res) {
    // console.log('Listing items.');
    ToDoItem.find({completed: false}, function(err, todoitems) {
	if (err) {
	    res.json([]);
	} else {
	    var items = [];
	    for (todoitem of todoitems) {
		items.push({
		    id: todoitem._id,
		    text: todoitem.text
		});
	    }
	    res.json(items);      
	}
    });
});

app.post('/add', function(req, res) {
    var text = req.body.text;
    // console.log("adding " + text);
    var newItem = new ToDoItem({text: text, completed: false});
    newItem.save(function(err, item, ok) {
	// it has ._id
	res.json(item);
    });
});

app.post('/complete', function(req, res) {
  var id = req.body.id;
  // console.log("calling complete " + id);
  ToDoItem.findOne({_id: id}, function (err, item) {
    if (err) {
      console.log("not found element with id " + id);      
      res.end();
    } else {
      item.completed = true;
      item.save(function (err, item) {
        if (err) {
          console.log("error saving element with id " + id);      
        } else {
          console.log("saved element with id: " + id);      
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

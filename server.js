//CALL THE PACKAGES
var express    = require('express'); // call express
var app        = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan     = require('morgan'); // used to see requests
var mongoose   = require('mongoose'); // for working w/ our database
var _          = require('lodash'); // use js utility library
var User       = require('./models/user');
var Event      = require('./models/event');
var jwt = require('jsonwebtoken');
// create a variable, use a string as the secret
var superSecret = 'ilovescotchscotchyscotchscotch';
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// APP CONFIGURATION
var port       = process.env.PORT || 8080; // set the port for our app
// connect to our database (hosted on modulus.io)
var mongourl = '';
if (process.env.NODE_ENV != 'production') {
  console.log('not prod');
  mongourl = 'mongodb://localhost:27017/test';
} else {
  console.log('prod');
  mongourl = process.env.MONGOLAB_URL;
}
mongoose.connect(mongourl);
// use body parser os we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

//ROUTES FOR OUR API
//basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
});

//get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next) {
  // do logging
  console.log('Somebody just came to our app!');
  // we'll add more to the middleware in Chapter 10
  // this is where we will authenticate users
  next(); // make sure we go to the next routes and don't stop here
})
// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here

apiRouter.route('/users')
  // create a user (access at POST http://localhost: 8080/api/users)
  .post(function(req, res) {
    // create a new instance of the User model
    var user = new User();
    // set the users information (comes from the request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    console.log(user);

    // save the user and check for errors
    user.save(function(err) {
      if(err) {
        // dulplicate entry
        if (err.code == 11000)
          return res.json({ success: false, message: 'A user with that username already exists.'});
        else
          return res.send(err);
      }
      res.json({ message: 'User created!'});
    });
  })

  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
      if (err) res.send(err);
      // return the users
      res.json(users);
    });
  });

// on routes that end in /user/:user_id
apiRouter.route('/users/:user_id')
  //get the user with that id
  // (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err);
      // return that user
      res.json(user);
    });
  })

  //update the user with this id
  // (accessed at PUT http://localhost:8080/api/users:user_id)
  .put(function(req, res) {
    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      //update the users info only if it's new
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;

      // save the user
      user.save(function(err) {
        if (err) res.send(err);

        //return a message
        res.json({ message: 'User updated!'});
      });
    });
  })

  //delete the user with this id
  // (accessed at DELETE http://localhost:8000/api/users/:user_id)
  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if (err) return res.send(err);

      res.json({ message: 'Successfully deleted'});
        });
  });

apiRouter.route('/events')
  // create a event (access at POST http://localhost: 8080/api/events)
  .post(function(req, res) {

    //create a new instance of the Event model
    var evt = new Event();
    //set the events information (comes from the request)
    evt.title = req.body.title;
    evt.organizer = req.body.organizer;
    evt.desc = req.body.desc;
    evt.s_date = req.body.s_date;
    evt.e_date = req.body.e_date;
    evt.c_date = Date.now();
    evt.lct = req.body.lct;
    evt.categories = req.body.categories;
    evt.img_url = req.body.img_url;
    evt.creator = req.body.id;
    // save the event and check for errors
    evt.save(function (err, ssss) {
      if (err) {
        console.error(err);
      }
      res.json({ message: 'Event created!'});
    });
  })

  // get event information for the card
  .get(function(req, res) {
    Event.find(function(err, events) {
      if (err) res.send(err);

      // return the events
      res.json(events);
    });
  });

apiRouter.route('/events/:event_id')
  //get that end in /events/:event_id
  // (access at GET http://localhost:8080/api/events/:event_id)
  .get(function(req, res) {
    Event.findById(req.params.event_id, function(err, evt) {
      if (err) res.send(err);

      res.json(evt);
    });
  })

  //update the event with this id
  //(access at PUT http://localhost:8080/api/events/:event_id)
  .put(function(req, res) {

    // use our event model to find the event we want
    Event.findById(req.params.event_id, function(err, evt) {
      if(err) res.send(err);

      //update the users info only if its new
      if (req.body.title) evt.title = req.body.title;
      if (req.body.organizer) evt.organizer = req.body.organizer;
      if (req.body.desc) evt.desc = req.body.desc;
      if (req.body.s_date) evt.s_date = req.body.s_date;
      if (req.body.e_date) evt.e_date = req.body.e_date;
      if (req.body.c_date) evt.c_date = Date.now();
      if (req.body.lct) evt.lct = req.body.lct;
      if (req.body.categories) evt.categories = req.body.categories;
      if (req.body.img_url) evt.img_url = req.body.img_url;

      //save the event
      evt.save(function(err) {
        if (err) res.send(err);

        // return a message
        res.json({ message: 'Event updated!'});
      });
    });
  })

  // delte the event with this id
  // (accessed at DELETE http://local:8080/api/events/:event_id)
  .delete(function(req, res) {
    Event.remove({
      _id: req.params.event_id
    }, function(err, evt) {
      if (err) return res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  })

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

//START THE SERVER

app.listen(port);
console.log('Magic happens on port ' + port);
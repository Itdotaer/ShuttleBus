var express = require('express');
var router = express.Router();
var User = require('../models/user');

function routes(app){
  //Allow cross domain
  app.use(function(req, res, next) {
    res.setHeader('content-type','applicatioin/json; charset=UTF-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
  });
  
  //Test index page.
  app.get('/', function(req, res){
    res.render('index', {
      title: "Harry's test index page"
    });
  });
  
  //Routes for our api
  /* User Login Api */
  router.route('/users/login')
  .post(function(req, res){
    var user = req.body;
    if(user){
      User.getUser(user.userName, user.password, function(err, user){
        if(err){
          res.json(err);
        }
        
        res.json(user);
      });
    }else{
      res.json({title : 'err', message:'No login user.'});
    }
  });
  /* User Api */
  //On routes that end in /users
  router.route('/users')
  //Create a user
  .post(function(req, res){
    var user = req.body;
    if(user){
      User.addUser(user, function(err, cbUser){
        if(err){
          res.json(err);
        }

        res.json(cbUser);
      });
    }else{
      res.json({title: 'error', msg: 'nothing input.'});
    }
  })
  //Get all users
  .get(function(req, res){
    User.list(function(err, users){
      if(err){
        res.json(err);
      }

      res.json(users);
    })
  });
  
  //One routes that end in /users/:userId
  router.route('/users/:userId')
  //Get user by id
  .get(function(req, res){
    User.getUserById(req.params.userId, function(err, user){
      if(err){
        res.json(err);
      }

      res.json(user);
    });
  })
  .put(function(req, res){
    var user = req.body;
    User.update(req.params.userId, user, function(err, user){
      if(err){
        res.json(err);
      }

      res.json(user);
    });
  })
  .delete(function(req, res){
    User.delete(req.params.userId, function(err){
      if(err){
        res.json(err);
      }
      res.json({title: 'success', msg: 'deleted.'});
    });
  });
  
  //Api
  app.use('/api', router);

  // error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.json(err);
      });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json(err);
  });
}

module.exports = routes;

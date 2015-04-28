var express = require('express');
var router = express.Router();
var User = require('../models/user');
var BusRoute = require('../models/busRoute');
var Bus = require('../models/bus');
var BusSchedule = require('../models/busSchedule');

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
          res.status(err.status || 500).json(err);
        }else{
          res.json(user);
        }
      });
    }else{
      res.status(err.status || 500).json({title : 'err', message:'No login user.'});
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
          res.status(err.status || 500).json(err);
        }else{
          res.json(cbUser);
        }
      });
    }else{
      res.json({title: 'error', msg: 'nothing input.'});
    }
  })
  //Get all users
  .get(function(req, res){
    User.list(function(err, users){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(users);
      }
    })
  });
  
  //One routes that end in /users/:userId
  router.route('/users/:userId')
  //Get user by id
  .get(function(req, res){
    User.getUserById(req.params.userId, function(err, user){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(user);
      } 
    });
  })
  .put(function(req, res){
    var user = req.body;
    User.update(req.params.userId, user, function(err, user){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(user);
      }
    });
  })
  .delete(function(req, res){
    User.delete(req.params.userId, function(err){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json({title: 'success', msg: 'Deleted.'});
      }
    });
  });
  
  //One routes that end in /busRoutes
  router.route('/busRoutes')
  .post(function(req, res){
    var busRoute = req.body;
    console.log(busRoute);
    BusRoute.add(busRoute, function(err, cbBusRoute){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(cbBusRoute);
      }
    });
  })
  .get(function(req, res){
    var pageSize = req.query.pageSize;
    var pageIndex = req.query.pageIndex;
    if(pageSize && pageIndex){         
      BusRoute.totalNum(pageSize, function(err, count){
        if(err){
          res.status(err.status || 500).json(err);
        }else{
          BusRoute.list(pageSize, pageIndex, function(err, cbBusRoutes){
            if(err){
                res.status(err.status || 500).json(err);
              }else{
                res.json({routes: cbBusRoutes, count: count});
              }
            });
          }
        });
    }else{
      res.json("PageSize or PageIndex is null.");
    }
  });
  
  //One routes that end in /busRoutes/:routeId
  router.route('/busRoutes/:routeId')
  //Get bus route by id
  .get(function(req, res){
    BusRoute.getRouteById(req.params.routeId, function(err, cbBusRoute){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(cbBusRoute);
      }
    });
  })
  .put(function(req, res){
    var busRoute = req.body;
    BusRoute.update(req.params.routeId, busRoute, function(err, cbBusRoute){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(cbBusRoute);
      }
    });
  })
  .delete(function(req, res){
    BusRoute.delete(req.params.routeId, function(err){
      if(err){
        res.json(err);
      }else{
        res.json({title: 'success', msg: 'deleted.'});
      }
    });
  });
  
  //One routes that end in /buses
  router.route('/buses')
  .post(function(req, res){
    var bus = req.body;
    Bus.add(bus, function(err, cbBus){
      if(err){
        res.status(err.status || 500).json(err);
      }else{
        res.json(cbBus);
      }
    });
  })
  .get(function(req, res){
    var isGetUseful = req.query.getUsefulBuses;
    if(isGetUseful === 'true'){
      Bus.getUseful(function(err, cbBuses){
        if(err){
          res.status(err.status || 500).json(err);
        }else{
          res.json(cbBuses);
        }
      });
    }else{
      var pageSize = req.query.pageSize;
      var pageIndex = req.query.pageIndex;
      if(pageSize && pageIndex){         
        Bus.totalNum(pageSize, function(err, count){
          if(err){
            res.status(err.status || 500).json(err);
          }else{
            Bus.list(pageSize, pageIndex, function(err, cbBuses){
              if(err){
                  res.status(err.status || 500).json(err);
                }else{
                  res.json({buses: cbBuses, count: count});
                }
              });
            }
          });
      }else{
        res.status(500).json("PageSize or PageIndex is null.");
      }
    }
  });
  
  //One routes that end in /buses/:busId
  router.route('/buses/:busId')
  //Get bus route by id
  .get(function(req, res){
    Bus.getRouteById(req.params.busId, function(err, cbBus){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json(cbBus);
      }
    });
  })
  .put(function(req, res){
    var bus = req.body;
    Bus.update(req.params.busId, bus, function(err, cbBus){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json(cbBus);
      }
    });
  })
  .delete(function(req, res){
    Bus.delete(req.params.busId, function(err){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json({title: 'success', msg: 'Deleted.'});
      }
    });
  });
  
  //One routes that end in /busSchedules
  router.route('/busSchedules')
  .post(function(req, res){
    var busSchedule = req.body;
    BusSchedule.add(busSchedule, function(err, cbBusSchedule){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json(cbBusSchedule);
      }
    });
  })
  .get(function(req, res){
    var pageSize = req.query.pageSize;
    var pageIndex = req.query.pageIndex;
    if(pageSize && pageIndex){         
      BusSchedule.totalNum(pageSize, function(err, count){
        if(err){
          res.status(err.status || 500);
          res.json(err);
        }else{
          BusSchedule.list(pageSize, pageIndex, function(err, cbBusSchedules){
            if(err){
                res.json(err);
              }else{
                res.json({schedules: cbBusSchedules, count: count});
              }
            });
          }
        });
    }else{
      res.json("PageSize or PageIndex is null.");
    }
  });
  
  //One routes that end in /busSchedules/:scheduleId
  router.route('/busSchedules/:scheduleId')
  //Get bus route by id
  .get(function(req, res){
    BusSchedule.getScheduleById(req.params.scheduleId, function(err, cbBusSchedule){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json(cbBusSchedule);
      }
    });
  })
  .put(function(req, res){
    var busSchedule = req.body;
    BusSchedule.update(req.params.scheduleId, busSchedule, function(err, cbBusSchedule){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      }else{
        res.json(cbBusSchedule);
      }
    });
  })
  .delete(function(req, res){
    BusSchedule.delete(req.params.scheduleId, function(err, cbBusSchedule){
      if(err){
        res.json(err);
      }else{
        res.json({title: 'success', msg: 'Deleted.'});
      }
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

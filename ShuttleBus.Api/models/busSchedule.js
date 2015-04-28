var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BusSchedule = module.exports;

var Bus = require('./bus');

var BusScheduleSchema = new Schema({
  scheduleName: {type: String, required: true},
  scheduleDes: {type: String, required: true},
  scheduleTime: {type: String, required: true},
  bus: {type: Schema.ObjectId, required: true, ref: 'Buses'},
  createdBy: {type:Schema.ObjectId, required: true, ref: 'Users'},
  createdDate: {type: Date, default: new Date()},
  lastUpdatedBy: {type: Schema.ObjectId, required: true, ref: 'Users'},
  lastUpdatedDate: {type: Date}
});

mongoose.model('Schedules', BusScheduleSchema);

var BusScheduleModel = mongoose.model('Schedules');

BusSchedule.add = function(busSchedule, callback){
  console.log('add', busSchedule);
  var busId = busSchedule.bus;
  if(busId){
    busSchedule.lastUpdatedDate = new Date();
      new BusScheduleModel(busSchedule).save(function(err, cbBusSchedule){
        if(err){
          return callback(err);
        }

        Bus.updateScheduleId(busId, cbBusSchedule._id, busSchedule.lastUpdatedBy, function(err, cbBus){
          if(err){
            console.log('err', err);
            return callback(err);
          }

          callback(null, cbBusSchedule);
        });
      });
  }else{
    callback('No selected bus.');
  }
}

BusSchedule.totalNum = function(pageSize, callback){
  BusScheduleModel.count(callback);
}

BusSchedule.list = function(pageSize, pageIndex, callback){
  BusScheduleModel.find().limit(pageSize).skip((pageIndex - 1) * pageSize).sort({'lastUpdatedDate':-1, 'createdDate': -1}).populate('bus').populate('createdBy').populate('lastUpdatedBy').exec(callback);
}

BusSchedule.getScheduleById = function(scheduleId, callback){
  BusScheduleModel.findOne({_id: scheduleId}).populate('bus').populate('createdBy').populate('lastUpdatedBy').exec(callback);
};

BusSchedule.update = function(scheduleId, busSchedule, callback){
  busSchedule.lastUpdatedDate = new Date();
  
  var update = {
    scheduleName: busSchedule.scheduleName,
    scheduleDes: busSchedule.scheduleDes,
    scheduleTime: busSchedule.scheduleTime,
    bus: busSchedule.bus,
    
    updatedDate: busSchedule.lastUpdatedDate, 
    lastUpdatedBy: busSchedule.lastUpdatedBy
  };
  
  BusSchedule.getScheduleById(scheduleId, function(err, found){
    console.log('found', found);
    if(err){
      return callback(err);
    }
    
    if(found.bus._id != update.bus){
      //Clear older bus schedule id.
      Bus.updateScheduleId(found.bus._id, null, null, function(err, cbBus){
        console.log('cbBus', cbBus);
        if(err){
          return callback(err);
        }
        
        if(cbBus){
          BusScheduleModel.findOneAndUpdate({_id: scheduleId}, update, function(err, cbBusSchedule){
            if(err){
              return callback(err);
            }
            
            console.log('cbBusSchedule', cbBusSchedule);
            
            Bus.updateScheduleId(update.bus, cbBusSchedule._id, busSchedule.lastUpdatedBy, function(err, cbBusOther){
              if(err){
                return callback(err);
              }

              callback(null, cbBusSchedule);
            });
          });
        }else{
          callback('Nothing update.');
        } 
      });
    }
  });
}

BusSchedule.delete = function(scheduleId, callback){
   BusScheduleModel.find({_id: scheduleId}, function(err, foundSchedule){
    if(err){
      return callback(err);
    }
    if(foundSchedule.length == 1){
      //Clear bus table's schedule id.
      Bus.updateScheduleId(foundSchedule[0].bus, null, null, function(err, cbBus){
        if(err){
          return callback(err);
        }
        
        BusScheduleModel.findByIdAndRemove(scheduleId, callback);
      });
    }else{
      return callback('not find bus schedule by id:' + scheduleId);
    }
  });
};
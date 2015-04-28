var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Bus = module.exports;

var BusSchema = new Schema({
  busName: {type: String, required: true},
  busDes: {type: String, required: true},
  busNumber: {type: String, required: true},
  busOwner: {type: String, required: true},
  busOwnerNumber: {type: String, required: true},
  busStatus: {type: String, required: true},
  scheduleId: {type: Schema.ObjectId, default: null, ref: 'schedules', null: true},
  createdBy: {type:Schema.ObjectId, required: true, ref: 'Users'},
  createdDate: {type: Date, default: new Date()},
  lastUpdatedBy: {type: Schema.ObjectId, required: true, ref: 'Users'},
  lastUpdatedDate: {type: Date}
});

mongoose.model('Buses', BusSchema);

var BusModel = mongoose.model('Buses');

Bus.add = function(bus, callback){
  bus.lastUpdatedDate = new Date();
  new BusModel(bus).save(callback);
}

Bus.totalNum = function(pageSize, callback){
  BusModel.count(callback);
}

Bus.getUseful = function(callback){
  BusModel.find({scheduleId: null}).sort({'lastUpdatedDate':-1, 'createdDate': -1}).populate('createdBy').populate('lastUpdatedBy').exec(callback);
}

Bus.list = function(pageSize, pageIndex, callback){
  BusModel.find().limit(pageSize).skip((pageIndex - 1) * pageSize).sort({'lastUpdatedDate':-1, 'createdDate': -1}).populate('createdBy').populate('lastUpdatedBy').exec(callback);
}

Bus.getRouteById = function(busId, callback){
  BusModel.findOne({_id: busId}).populate('createdBy').populate('lastUpdatedBy').exec(callback);
};

Bus.update = function(busId, bus, callback){
  bus.lastUpdatedDate = new Date();
  
  var update = {
    busName: bus.busName,
    busDes: bus.busDes,
    busNumber: bus.busNumber,
    busOwner: bus.busOwner,
    busOwnerNumber: bus.busOwnerNumber,
    busStatus: bus.busStatus,
    
    updatedDate: bus.lastUpdatedDate, 
    lastUpdatedBy: bus.lastUpdatedBy
  };
  
  BusModel.findOneAndUpdate({_id: busId}, update, callback);
}

Bus.updateScheduleId = function(busId, scheduleId, operUserId, callback){
  if(!busId){
    return callback('No bus id.');
  }
  
  lastUpdatedDate = new Date();
  
  var update = {
    scheduleId: scheduleId,
    updatedDate: lastUpdatedDate
  };
  
  if(operUserId){
    update['lastUpdatedBy'] = operUserId;
  }
  
  BusModel.findOneAndUpdate({_id: busId}, update, callback);
}

Bus.delete = function(busId, callback){
   BusModel.find({_id: busId}, function(err, foundBus){
    if(err){
      return callback(err);
    }
    if(foundBus.length == 1){
      BusModel.findByIdAndRemove(busId, function(err){
        if(err){
          return callback(err);
        }
        callback(null);
      });
    }else{
      return callback('not find bus by id:' + busId);
    }
  });
};
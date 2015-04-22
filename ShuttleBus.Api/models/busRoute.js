var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    BusRoute = module.exports;

var BusRouteSchema = new Schema({
  routeName: {type: String, required: true},
  routeDes: {type: String, required: true},
  routeFrom: {type: String, required: true},
  routeTo: {type: String, required: true},
  createdDate: {type: Date, default: new Date()},
  createdBy: {type:Schema.ObjectId, required: true, ref: 'Users'},
  lastUpdatedBy: {type: Schema.ObjectId, required: true, ref: 'Users'},
  lastUpdatedDate: {type: Date}
});

mongoose.model('BusRoutes', BusRouteSchema);

var BusRouteModel = mongoose.model('BusRoutes');

BusRoute.add = function(busRoute, callback){
  busRoute.lastUpdatedDate = new Date();
  new BusRouteModel(busRoute).save(callback);
}

BusRoute.totalNum = function(pageSize, callback){
  BusRouteModel.count(callback);
}

BusRoute.list = function(pageSize, pageIndex, callback){
  BusRouteModel.find().limit(pageSize).skip((pageIndex - 1) * pageSize).sort({'lastUpdatedDate':-1, 'createdDate': -1}).populate('createdBy').populate('lastUpdatedBy').exec(callback);
}

BusRoute.getRouteById = function(routeId, callback){
  BusRouteModel.findOne({_id: routeId}).populate('createdBy').populate('lastUpdatedBy').exec(callback);
};

BusRoute.update = function(routeId, busRoute, callback){
  busRoute.lastUpdatedDate = new Date();
  
  var update = {
    routeName: busRoute.routeName, 
    routeDes: busRoute.routeDes, 
    routeFrom: busRoute.routeFrom, 
    routeTo: busRoute.routeTo, 
    updatedBy: busRoute.updatedBy, 
    lastUpdatedBy: busRoute.lastUpdatedBy
  };
  
  BusRouteModel.findOneAndUpdate({_id: routeId}, update, callback);
}

BusRoute.delete = function(routeId, callback){
   BusRouteModel.find({_id: routeId}, function(err, foundRoute){
    if(err){
      return callback(err);
    }
    if(foundRoute.length == 1){
      BusRouteModel.findByIdAndRemove(routeId, function(err){
        if(err){
          return callback(err);
        }
        callback(null);
      });
    }else{
      return callback('not find bus route by id:' + routeId);
    }
  });
};
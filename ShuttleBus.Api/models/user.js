var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = module.exports;

var UsersSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, default: '' },
  createdDate: { type: Date, default: new Date()}
});

mongoose.model('Users', UsersSchema);

var UsersModel = mongoose.model('Users');

/*
 * Required to support password grant type
 */
User.getUser = function (username, password, callback) {
  UsersModel.findOne({ userName: username, password: password }, function(err, user) {
    if(err) return callback(err);
    
    callback(null, user);
  });
};

User.checkPermission = function(user, callback){
  User.getUser(user.userName, user.password, callback);
}

User.addUser = function(user, callback){
  new UsersModel(user).save(function(err, cbUser){
    if(err){
      return callback(err);
    }
    
    callback(null, cbUser);
  });
};

User.list = function(callback){
  UsersModel.find(function(err, users){
    if(err){
      return callback(err);
    }
    callback(null, users);
  });
};

User.getUserById = function(userId, callback){
  UsersModel.findOne({_id: userId}, function(err, user){
    if(err){
      return callback(err);
    }
    
    callback(null, user);
  });
};

User.update = function(userId, user, callback){
  console.log('before', user);
  UsersModel.findOneAndUpdate({_id: userId}, {firstName: user.firstName, lastName: user.lastName, email: user.email}, function(err, cbUser){
    if(err){
      return callback(err);
    }
    
    console.log('after', cbUser);
    
    callback(null, cbUser);
  })
};

User.delete = function(userId, callback){
  UsersModel.find({_id: userId}, function(err, foundUser){
    if(err){
      return callback(err);
    }
    if(foundUser.length == 1){
      UsersModel.findByIdAndRemove(userId, function(err){
        if(err){
          return callback(err);
        }
        callback(null);
      });
    }else{
      return callback('not find user by id:' + userId);
    }
  });
};
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = module.exports;

var OAuthUsersSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, default: 'hujiangtao1235@gmail.com' },
  createdDate: { type: Date, default: new Date()}
});

mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthUsersModel = mongoose.model('OAuthUsers');

/*
 * Required to support password grant type
 */
User.getUser = function (username, password, callback) {
  console.log('in getUser (username: ' + username + ', password: ' + password + ')');

  OAuthUsersModel.findOne({ userName: username, password: password }, function(err, user) {
    console.log(user);
    if(err) return callback(err);
    callback(null, user._id);
  });
};

User.addUser = function(user, callback){
  new OAuthUsersModel(user).save(function(err, cbUser){
    if(err){
      return callback(err);
    }
    
    callback(null, cbUser);
  });
};

User.list = function(callback){
  OAuthUsersModel.find(function(err, users){
    if(err){
      return callback(err);
    }
    callback(null, users);
  });
};

User.getUserById = function(userId, callback){
  OAuthUsersModel.findOne({_id: userId}, function(err, user){
    if(err){
      return callback(err);
    }
    
    callback(null, user);
  });
};

User.update = function(user, callback){
  OAuthUsersModel.find({_id: user._id}, function(err, foundUser){
    if(err){
      return callback(err);
    }
    if(foundUser.length == 1){
      foundUser.userName = user.userName;
      foundUser.save(function(err, savedUser){
        if(err){
          return callback(err);
        }
        
        callback(null, savedUser);
      });
    }else{
      return callback('not find user by id:' + user._id);
    }
  });
};
User.delete = function(userId, callback){
  OAuthUsersModel.find({_id: userId}, function(err, foundUser){
    if(err){
      return callback(err);
    }
    if(foundUser.length == 1){
      OAuthUsersModel.findByIdAndRemove(userId, function(err){
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
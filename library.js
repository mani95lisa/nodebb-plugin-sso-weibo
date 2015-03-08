(function(module) {
  "use strict";

  var user = module.parent.require('./user'),
      db = module.parent.require('../src/database'),
      meta = module.parent.require('./meta'),
      passport = module.parent.require('passport'),
      passportWeibo = require('passport-weibo').Strategy,
      nconf = module.parent.require('nconf'),
      winston = module.parent.require('winston');

  var constants = Object.freeze({
    'name': "Weibo",
    'admin': {
      'icon': 'fa-weibo',
      'route': '/plugins/sso-weibo'
    }
  });

  var Weibo = {};

  Weibo.init = function(params, callback) {
    function render(req, res) {
      res.render('admin/plugins/sso-weibo', {});
    }

    params.router.get('/admin/plugins/sso-weibo', params.middleware.admin.buildHeader, render);
    params.router.get('/api/admin/plugins/sso-weibo', render);

    callback();
  };

  Weibo.getStrategy = function(strategies, callback) {
    if (meta.config['social:weibo:app_id'] && meta.config['social:weibo:secret']) {
      passport.use(new passportWeibo(
        {
          clientID: meta.config['social:weibo:app_id'],
          clientSecret: meta.config['social:weibo:secret'],
          callbackURL: nconf.get('url') + '/auth/weibo/callback'
        },

        function(accessToken, refreshtoken, profile, done) {
          var avatar = profile._json_avatar_large;
          Weibo.login(profile.id, profile.displayName, avatar, function(err, user) {
            if (err) {
              return done(err);
            }
            done(null, user);
          });
        }
      ));

      strategies.push({
        name: 'weibo',
        url: '/auth/weibo',
        callbackURL: '/auth/weibo/callback',
        icon: constants.admin.icon,
        scope: ''
      });
    }
        
    callback(null, strategies);
  };

  Weibo.login = function(weiboid, displayName, avatar, callback) {
    Weibo.getUidByWeiboId(weiboid, function(err, uid) {
      if (err) {
        return callback(err);
      }

      if (uid !== null) {
        // Existing User
        callback(null, {
          uid: uid
        });
      } else {
        // New User
        user.create({username: displayName}, function(err, uid) {
          if (err) {
            return callback(err);
          }

          // Save weibo-specific information to the user
          user.setUserField(uid, 'weiboid', weiboid);
          db.setObjectField('weiboid', weiboid, uid);

          // Save their avatar, if present
          if (avatar) {
            user.setUserField(uid, 'uploadedpicture', avatar);
            user.setUserField(uid, 'picture', avatar);
          }

          callback(null, {
            uid: uid
          });
        });
      }
    });
  };

  Weibo.getUidByWeiboId = function(weiboid, callback) {
    db.getObjectField('weiboid:uid', weiboid, function(err, uid) {
      if (err) {
        return callback(err);
      }
      callback(null, uid);
    });
  };

  Weibo.addMenuItem = function(custom_header, callback) {
    custom_header.authentication.push({
      "route": constants.admin.route,
      "icon": constants.admin.icon,
      "name": constants.name
    });

    callback(null, custom_header);
  };

  module.exports = Weibo;
}(module));

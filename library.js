(function(module) {
    "use strict";

    var User = module.parent.require('./user'),
        db = module.parent.require('../src/database'),
        meta = module.parent.require('./meta'),
        passport = module.parent.require('passport'),
        passportWeibo = require('passport-weibo').Strategy,
        fs = module.parent.require('fs'),
        path = module.parent.require('path');

    var constants = Object.freeze({
        'name': "Weibo",
        'admin': {
            'icon': 'fa-weibo',
            'route': '/weibo'
        }
    });

    var Weibo = {};

    Weibo.getStrategy = function(strategies, callback) {
        if (meta.config['social:weibo:id'] && meta.config['social:weibo:secret']) {
            passport.use(new passportWeibo({
                clientID: meta.config['social:weibo:id'],
                clientSecret: meta.config['social:weibo:secret'],
                callbackURL: module.parent.require('nconf').get('url') + '/auth/weibo/callback'
            }, function(token, tokenSecret, profile, done) {
                Weibo.login(profile.id, profile.username, profile.emails[0].value, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    done(null, user);
                });
            }));

            strategies.push({
                name: 'weibo',
                url: '/auth/weibo',
                callbackURL: '/auth/weibo/callback',
                icon: 'weibo',
                scope: 'user:email'
            });
        }
        
        callback(null, strategies);
    };

    Weibo.login = function(weiboID, username, email, callback) {
        if (!email) {
            email = username + '@users.noreply.weibo.com';
        }
        
        Weibo.getUidByWeiboID(weiboID, function(err, uid) {
            if (err) {
                return callback(err);
            }

            if (uid) {
                // Existing User
                callback(null, {
                    uid: uid
                });
            } else {
                // New User
                var success = function(uid) {
                    User.setUserField(uid, 'weiboid', weiboID);
                    db.setObjectField('weiboid:uid', weiboID, uid);
                    callback(null, {
                        uid: uid
                    });
                };

                User.getUidByEmail(email, function(err, uid) {
                    if (!uid) {
                        User.create({username: username, email: email}, function(err, uid) {
                            if (err !== null) {
                                callback(err);
                            } else {
                                success(uid);
                            }
                        });
                    } else {
                        success(uid); // Existing account -- merge
                    }
                });
            }
        });
    };

    Weibo.getUidByWeiboID = function(weiboID, callback) {
        db.getObjectField('weiboid:uid', weiboID, function(err, uid) {
            if (err) {
                callback(err);
            } else {
                callback(null, uid);
            }
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

    function renderAdmin(req, res, callback) {
        res.render('sso/weibo/admin', {});
    }

    Weibo.init = function(app, middleware, controllers) {
        app.get('/admin/weibo', middleware.admin.buildHeader, renderAdmin);
        app.get('/api/admin/weibo', renderAdmin);
    };

    module.exports = Weibo;
}(module));

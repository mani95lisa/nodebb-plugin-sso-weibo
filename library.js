(function(module) {
    "use strict";

	var User = module.parent.require('./user'),
		db = module.parent.require('./database'),
		meta = module.parent.require('./meta'),
		passport = module.parent.require('passport'),
		nconf = module.parent.require('nconf'),
        WeiboStrategy = require('passport-weibo').Strategy;

    var constants = Object.freeze({
        'name': "Weibo",
        'admin': {
            'icon': 'fa-weibo',
            'route': '/plugins/sso-weibo'
        }
    });

    var Weibo = {};

    Weibo.getStrategy = function(strategies, callback) {
		meta.settings.get('sso-weibo', function (err, settings) {
			if (!err && settings.id && settings.secret) {
				passport.use(new WeiboStrategy({
					clientID: settings.id,
					clientSecret: settings.secret,
					callbackURL: nconf.get('url') + '/auth/weibo/callback'
				}, function (token, tokenSecret, profile, done) {
					console.log(profile);
					var email = '';
					if (profile.emails && profile.emails.length) {
						email = profile.emails[0].value
					}
					var picture = profile.avatarUrl;
					if (profile._json.avatar_large) {
						picture = profile._json.avatar_large;
					}
					Weibo.login(profile.id, profile.username, email, picture, function (err, user) {
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
					icon: constants.admin.icon,
					scope: 'user:email'
				});
			}

			callback(null, strategies);
		});
    };

    Weibo.login = function(weiboID, username, email, picture, callback) {
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
                    User.setUserField(uid, 'picture', picture);
                    User.setUserField(uid, 'gravatarpicture', picture);
                    User.setUserField(uid, 'uploadedpicture', picture);
                    db.setObjectField('weiboid:uid', weiboID, uid);
                    callback(null, {
                        uid: uid
                    });
                };

                User.getUidByEmail(email, function(err, uid) {
                    if (!uid) {
                        User.create({username: username, email: email, picture:picture, uploadedpicture:picture}, function(err, uid) {
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

    Weibo.init = function(params, callback) {
		function renderAdmin(req, res) {
			res.render('admin/plugins/sso-weibo', {});
		}

		params.router.get('/admin/plugins/sso-weibo', params.middleware.admin.buildHeader, renderAdmin);
		params.router.get('/api/admin/plugins/sso-weibo', renderAdmin);

		callback();
    };

    module.exports = Weibo;
}(module));

'use strict';

var path = process.cwd();

var User = require("../models/users");
var Image = require("../models/images");

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	app.route('/')
		.get(function (req, res) {
			Image.find({}).exec((err, images) => {
				if(err) throw err;
				
				res.render("index", {
					isLoggedIn: req.isAuthenticated(),
					images: images
				});
			});
		});
		
	app.route('/my-wall')
		.get(isLoggedIn, function (req, res) {
			Image.find({ userId: req.user.id }).exec((err, images) => {
				if(err) throw err;
				
				res.render("user-wall", {
					isLoggedIn: req.isAuthenticated(),
					images: images
				});
			});
		});	

	app.route('/add')
		.get(isLoggedIn, function (req, res) {
			res.render("add", {
				isLoggedIn: req.isAuthenticated()
			});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/api/add')
		.post(isLoggedIn, function (req, res) {
			if(req.body.url) {
				let image = new Image();
				
				image.url = req.body.url;
				image.description = req.body.description || "";
				image.userId = req.user.id;
				
				image.save((err) => {
					if(err) throw err;
					
					res.redirect("/my-wall");
				});
			}else {
				res.redirect("/add");
			}
		});
		
	app.route("/api/delete/:id")
		.get(isLoggedIn, function(req, res) {
			Image.findOne({ userId: req.user.id, _id: req.params.id}).remove().exec((err) => {
				if(err) throw err;
				
				res.redirect("/my-wall");
			});
		});

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
};

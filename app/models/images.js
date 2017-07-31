'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Image = new Schema({
	url: String,
	description: String,
	userId: Schema.Types.ObjectId
});

module.exports = mongoose.model('Image', Image);

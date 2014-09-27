/**
 * Module dependencies
 */

var nunjucks = require('nunjucks');
var express = require('express');

/**
 * Configure the given the `app`
 */

module.exports = function(app){

	// Previewer parameters
	var sections = [
		{
			name : 'Mon Panier de Campagne',
			link : 'http://www.mon-panier-de-campagne.fr/'
		}
	];
	app.set('sections',sections);

	// Middlewares
	app.use(express.static(__dirname + '/../public'));

	// Use the templating system
	var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/views'));
	env.express(app);
}
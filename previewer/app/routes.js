/**
 * Module dependencies
 */

var products = require('./../../products.json');

/**
 * Define routes
 */

module.exports = function(app){

	app.get('/products.json', function(req, res){
		res.json(products);
	});

	app.get('/', function(req, res){
		res.render('products.html', { products : products, title : 'Panier', sections : app.get('sections'), section : 'panier' } );
	});

};
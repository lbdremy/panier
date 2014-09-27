/**
 * Module dependencies
 */

var scrapinode = require('scrapinode');
var utils = require('./utils');
var step = require('step');

/**
 * Scrap products at mon-panier-de-campagne.fr
 */

configure();

var categories = null;
var subCategories = [];
var products = [];

step(
  function createScraperForCategories(){
    var options = {
      url : 'http://www.mon-panier-de-campagne.fr/produits',
      engine : 'cheerio'
    };
    scrapinode.createScraper(options, this);
  },
  function getAllCategories(err, scraper){
    if(err) throw err;
    categories = scraper.get('categories');
    return categories;
  },
  function createScapersForSubCategories(err, categories){
    if(err) throw err;
    var group = this.group();
    categories.forEach(function(category){
      var options = {
        url : category.url,
        engine : 'cheerio'
      };
      scrapinode.createScraper(options, group());
    });
  },
  function getAllSubCategories(err, scrapers){
    if(err) throw err;
    scrapers.forEach(function(scraper){
      subCategories = subCategories.concat(scraper.get('categories'));
    });
    return subCategories;
  },
  function createScapersForProducts(err, subCategories){
    if(err) throw err;
    var group = this.group();
    subCategories.forEach(function(subCategory){
      var options = {
        url : subCategory.url,
        engine : 'cheerio'
      };
      scrapinode.createScraper(options, group());
    });
  },
  function getAllProducts(err, scrapers){
    if(err) throw err;
    scrapers.forEach(function(scraper){
      products = products.concat(scraper.get('products'));
    });
    return products;
  },
  function finish(err, products){
    if(err) return console.error(err, err.stack);
    console.log(JSON.stringify(products));
  }
);

/**
 * Configure things to scrap at mon-panier-de-campagne.fr
 */

function configure(){
  var site = 'mon-panier-de-campagne.fr';

  scrapinode.use(site, 'products', function(window){
    var $ = window.$;
    var products = [];
    $('.product-wrap').each(function(index, element){
      $element = $(element);
      products.push({
        id : $element.parent('div').attr('data-id'),
        name : $element.find('.product-name').first().text().replace(/\n/g,'').trim(),
        description : $element.find('.product-desc').text().replace(/\n/g,'').trim(),
        supplier : $element.find('.product-supplier').first().text().replace(/\n/g,'').trim(),
        imageUrl : utils.toURL($element.find('.product-image').attr('src'), window.location.href),
        price : $element.find('.product-price span').attr('data-price'),
        priceDetails : $element.find('.product-price small').text()
      });
    });
    return products;
  });

  scrapinode.use(site, 'categories', function(window){
    var $ = window.$;
    var categories = [];
    $('.category').each(function(index, element){
      var $element = $(element);
      categories.push({
        name : $element.find('.plaque').text().replace(/\n/g,'').trim(),
        imageUrl : utils.toURL($element.find('img').attr('src'), window.location.href),
        url : utils.toURL($element.find('a').first().attr('href'), window.location.href)
      });
    });
    return categories;
  });

};



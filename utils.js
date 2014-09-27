/**
 * Module dependencies
 */

var url = require('url');


/**
 * Convert a relative/absolute path into an URL
 *
 * @param {String} path - relative/absolute path to a resource
 * @param {String} uri - url
 *
 * @return {String}
 * @api private
 */

exports.toURL = function toURL(path,uri){
  var absolutePath = path;
  if(!exports.isURL(path)){
    var explodeURL = url.parse(uri);
    // 2 cases: absolute path and relative path to the current pathname
    if( path.charAt(0) === '/'){
      absolutePath = explodeURL.protocol + '//' + explodeURL.host + path;
    }else{
      var explodePathname = explodeURL.pathname.split('/');
      var pathname = explodePathname.slice(0,explodePathname.length - 1).join('/');
      absolutePath = explodeURL.protocol + '//' + (explodeURL.host + '/' +pathname + '/' + path)
        .replace('\/\/','/','g');
    }
  }
  return absolutePath;
};

/**
 * Check if the given `path` is an URL
 *
 * @param {String} path -
 *
 * @return {Boolean}
 * @api private
 */

exports.isURL = function isURL(path) {
  var regex = /(https?:)?\/\/([\-\w\.]+)+/i;
  return regex.test(path);
};
'use strict';
var imageTo = require('./pictures');
/**
 * @param {Object} data
 * @param {Node} container
 * @constructor
 */
var Photo = function(data, container) {
  this.data = data;
  this.element = imageTo.getPictureElement(this.data, container);
  this.container = container;
  this.container.appendChild(this.element);
};
Photo.prototype.remove = function() {
  this.container.removeChild(this.element);
};
module.exports = Photo;


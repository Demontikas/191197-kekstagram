'use strict';
var imageTo = require('./pictures');
/**
 * @param {Object} data
 * @param {Node} container
 * @constructor
 */
var Photo = function(data, container) {
  var self = this;
  this.data = data;
  this.element = imageTo.getPictureElement(this.data, container);
  this.remove = function() {
    container.removeChild(self.element);
  };
  this.element.addEventListener('click', this.onPictureClick);
  container.appendChild(this.element);
};
module.exports = Photo;


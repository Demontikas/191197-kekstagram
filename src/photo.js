'use strict';
var Gallery = require('./gallery');
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
  this.onPictureClick = function(evt) {
    evt.preventDefault();
    Gallery.showGallery(imageTo.filteredPictures.indexOf(self.data));
  };
  this.remove = function() {
    self.element.removeEventListener('click', self.onPictureClick);
    container.removeChild(self.element);
  };
  this.element.addEventListener('click', this.onPictureClick);
  container.appendChild(this.element);
};
module.exports = Photo;


'use strict';
var gallery = require('./gallery');
var imageTo = require('./pictures');
console.log(imageTo);
/**
 * @param {Object} data
 * @param {NodeElement} container
 * @constructor
 */
var Photo = function(data, container) {
  var self = this;
  this.data = data;
  this.element = imageTo.getPictureElement(this.data, container);
  this.onPictureClick = function(evt) {
    evt.preventDefault();
    gallery.showGallery(imageTo.filteredPictures.indexOf(self.data));
  };
  this.remove = function() {
    self.element.removeEventListener('click', self.onPictureClick);
    container.removeChild(self.element);
  };
  this.element.addEventListener('click', this.onPictureClick);
  container.appendChild(this.element);
};
module.exports = {
  Photo: Photo
};


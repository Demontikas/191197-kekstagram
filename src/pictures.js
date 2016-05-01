'use strict';
var formFilters = document.querySelector('.filters');
formFilters.classList.remove('hidden');
var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

var utilities = require('./utilities');
var Gallery = require('./gallery');
var Photo = require('./photo');

/** @type {Array.<Object>} */
var filteredPictures = [];

if ('content' in templateElement) {
  elementToClone = templateElement.content.firstElementChild;
} else {
  elementToClone = templateElement.querySelector('.picture');
}
var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  var img = element.querySelector('img');
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  container.appendChild(element);

  var backgroundImage = new Image();
  var backgroundLoadTimeout;

  backgroundImage.onload = function() {
    clearTimeout(backgroundLoadTimeout);
    element.replaceChild(backgroundImage, img);
  };
  backgroundImage.src = data.url;
  backgroundImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };
  backgroundLoadTimeout = setTimeout(function() {
    backgroundImage.src = '';
    element.classList.add('picture-load-failure');
  }, 10000);
  return element;
};

var getPictures = function(callback) {

  picturesContainer.classList.add('pictures-loading');
  var xhr = new XMLHttpRequest();
  xhr.timeout = 10000;
  xhr.onreadystatechange = function(evt) {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200 && xhr.status !== 304) {
        picturesContainer.classList.remove('pictures-loading');
        picturesContainer.classList.add('pictures-failure');
      } else {
        try {
          var loadedData = JSON.parse(evt.target.response);
        } catch(e) {
          picturesContainer.classList.remove('pictures-loading');
          picturesContainer.classList.add('pictures-failure');
        }
        loadedData.forEach(function(pic, i) {
          var date = new Date(pic.date);
          loadedData[i].date = date.valueOf();
        });
        callback(loadedData);
        picturesContainer.classList.remove('pictures-loading');
      }
    }
  };

  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};
var pictures;
getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFiltersEnabled();
  var filter = DEFAULT_FILTER;
  if(utilities.storageAvailable('localStorage')) {
    filter = localStorage.getItem('filter') || DEFAULT_FILTER;
    document.getElementById(DEFAULT_FILTER).removeAttribute('checked');
    document.getElementById(filter).setAttribute('checked', '');
  }
  setFilterEnabled(filter);
  setScrollEnabled();
});

var DEFAULT_FILTER = utilities.Filter.POPULAR;
var setFiltersEnabled = function() {
  formFilters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      if(utilities.storageAvailable('localStorage')) {
        localStorage.setItem('filter', evt.target.id);
      }
      setFilterEnabled(evt.target.id);
    }
  });
};
var setFilterEnabled = function(filter) {
  filteredPictures = utilities.getFilteredPictures(pictures, filter);
  Gallery.setPictureGallery(filteredPictures);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  while(utilities.isBottomReached() && utilities.isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};

/** @constant {number} */
var PAGE_SIZE = 12;

/** @type {number} */
var pageNumber = 0;

/** @type {Array.<Object>} */
var photos = [];
/**
 * @param {Array.<Object>} pictures
 * @param {number} page
 * @param {boolean} replace
*/
var renderPictures = function(images, page, replace) {

  if (replace) {
    photos.forEach(function(img) {
      img.remove();
    });
    photos = [];
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  images.slice(from, to).forEach(function(picture) {
    photos.push(new Photo(picture, picturesContainer));
  });
};

var setScrollEnabled = function() {

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (utilities.isBottomReached() &&
          utilities.isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};
module.exports.getPictureElement = getPictureElement;


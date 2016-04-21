'use strict';

var formFilters = document.querySelector('.filters');
formFilters.classList.remove('hidden');
var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

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
  setFilterEnabled(DEFAULT_FILTER);
  setScrollEnabled();
});

var Filter = {
  'POPULAR': 'filter-popular',
  'NEW': 'filter-new',
  'DISCUSSED': 'filter-discussed'
};
var DEFAULT_FILTER = Filter.POPULAR;
var setFiltersEnabled = function() {
  formFilters.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      setFilterEnabled(evt.target.id);
    }
  });
};
var setFilterEnabled = function(filter) {
  filteredPictures = getFilteredPictures(pictures, filter);
  pageNumber = 0;
  renderPictures(filteredPictures, pageNumber, true);
  while(isBottomReached() && isNextPageAvailable(filteredPictures, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderPictures(filteredPictures, pageNumber);
  }
};
var getFilteredPictures = function(image, filter) {
  var picturesToFilter = image.slice(0);
  switch (filter) {
    case Filter.DISCUSSED:
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case Filter.NEW:
      picturesToFilter.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
    case Filter.POPULAR:
      picturesToFilter.sort(function(a, b) {
        return b.likes - a.likes;
      });
      break;
    default:
      break;
  }
  return picturesToFilter;
};

/** @constant {number} */
var PAGE_SIZE = 12;

/** @type {number} */
var pageNumber = 0;

/** @type {Array.<Object>} */
var filteredPictures = [];

/**
 * @param {Array.<Object>} pictures
 * @param {number} page
 * @param {boolean} replace
*/
var renderPictures = function(images, page, replace) {

  if (replace) {
    picturesContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  images.slice(from, to).forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

var setScrollEnabled = function() {

  var scrollTimeout;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isBottomReached() &&
          isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
        pageNumber++;
        renderPictures(filteredPictures, pageNumber);
      }
    }, 100);
  });
};

/** @return {boolean} */
var isBottomReached = function() {
  var bodyElement = document.querySelector('body');
  var bodyPosition = bodyElement.getBoundingClientRect();
  return bodyPosition.bottom - window.innerHeight - 100 <= 0;
};

/**
 * @param {Array} pictures
 * @param {number} page
 * @param {number} pageSize
 * @return {boolean}
 */
var isNextPageAvailable = function(pic, page, pageSize) {
  return page < Math.floor(pic.length / pageSize);
};


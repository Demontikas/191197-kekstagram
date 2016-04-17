'use strict';

var formFilters = document.querySelector('.filters');
formFilters.classList.remove('hidden');
var filters = formFilters.querySelectorAll('input');
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

var renderPictures = function(pictures) {
  picturesContainer.innerHTML = '';
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};
var getPictures = function(callback) {

  var xhr = new XMLHttpRequest();
  xhr.onerror = function() {
    picturesContainer.classList.add('pictures-failure');
  };
  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    picturesContainer.classList.add('pictures-failure');
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      picturesContainer.classList.remove('pictures-loading');
      if (xhr.status !== 200) {
        picturesContainer.classList.add('pictures-failure');
      }
    } else {
      picturesContainer.classList.add('pictures-loading');
    }
  };
  xhr.onload = function(evt) {
    try {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    } catch(e) {
      picturesContainer.classList.add('pictures-failure');
    }
  };

  xhr.open('GET', '//o0.github.io/assets/json/pictures.json');
  xhr.send();
};
var pictures;
getPictures(function(loadedPictures) {
  pictures = loadedPictures;
  setFiltersEnabled(true);
  setFilterEnabled(DEFAULT_FILTER);
});

var Filter = {
  'POPULAR': 'filter-popular',
  'NEW': 'filter-new',
  'DISCUSSED': 'filter-discussed'
};
var DEFAULT_FILTER = Filter.POPULAR;
var setFiltersEnabled = function(enabled) {
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = enabled ? function() {
      setFilterEnabled(this.id);
    } : null;
  }
};
var setFilterEnabled = function(filter) {
  var filteredPictures = getFilteredPictures(pictures, filter);
  renderPictures(filteredPictures);
};
var getFilteredPictures = function(hotels, filter) {
  var picturesToFilter = pictures.slice(0);

  switch (filter) {
    case Filter.DISCUSSED:
      picturesToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    case Filter.NEW:
      picturesToFilter.sort(function(a, b) {
        var dateOne = new Date(a.date);
        var dateTwo = new Date(b.date);
        return dateTwo - dateOne;
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


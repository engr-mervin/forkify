import View from './View.js';
import previewView from './previewView.js';

import icons from '../../img/icons.svg'; //PARCEL 1

class BookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet! Find a nice recipe and bookmark it ;).';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // console.log(this._data);
    return this._data.reduce((acc, cur) => {
      return acc + this._generateMarkupPreview(cur);
    }, '');
  }
}

export default new BookmarksView();

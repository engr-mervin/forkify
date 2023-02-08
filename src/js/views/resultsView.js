import View from './View.js';
import icons from '../../img/icons.svg';
import previewView from './previewView.js';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found! Please try again.';
  _message = '';
}

export default new ResultsView();

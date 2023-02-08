import View from './View.js';
import icons from '../../img/icons.svg'; //PARCEL 1

export default class PreviewView extends View {
  _generateMarkup() {
    // console.log(this._data);
    return this._data.reduce((acc, cur) => {
      return acc + this._generateMarkupPreview(cur);
    }, '');
  }

  _generateMarkupPreview(cur) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
        <a class="preview__link ${
          cur.id === id ? 'preview__link--active' : ''
        }" href=#${cur.id}>
        <figure class="preview__fig">
        <img src=${cur.image} alt=${cur.title} />
        </figure>
        <div class="preview__data">
        <h4 class="preview__title">${cur.title}</h4>
        <p class="preview__publisher">${cur.publisher}</p>
          <div class="preview__user-generated ${cur.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>

        

        </a>
    </li>`;
  }
}

import icons from '../../img/icons.svg'; //PARCEL 1
import fracty from 'fracty';
import View from './View.js';

class RecipeView extends View {
  _errorMessage = 'Something went wrong. Please try again.';
  _message = '';
  _parentElement = document.querySelector('.recipe');

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;

      handler();
    });
  }
  _generateMarkupIng(cur) {
    return `
    <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">${
      cur.quantity ? fracty(cur.quantity) : ''
    }</div>
    <div class="recipe__description">
      <span class="recipe__unit">${cur.unit}</span>
      ${cur.description}
    </div>
  </li>`;
  }
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button data-update-to="${
            +this._data.servings - 1
          }" class="btn--tiny btn--update-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button data-update-to="${
            +this._data.servings + 1
          }" class="btn--tiny btn--update-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
        
      </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>

      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}${
      this._data.bookmarked ? '#icon-bookmark-fill' : '#icon-bookmark'
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.reduce((acc, cur) => {
        return acc + this._generateMarkupIng(cur);
      }, '')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //GET CLOSEST BUTTON
      const btn = e.target.closest('.btn--update-servings');

      //IF NO BUTTON RETURN
      if (!btn) return;

      //GET BUTTON ATTRIBUTE
      const updateTo = +btn.dataset.updateTo;

      //USE BUTTON ATTRIBUTE TO CALL UPDATE SERVINGS ON CONTROLLER
      if (updateTo > 0) handler(updateTo);
    });
  }
}

export default new RecipeView();

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import * as config from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// import icons from 'url:../img/icons.svg'; //PARCEL 2
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //
    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);
    //1 LOADING RECIPEEEE
    await model.loadRecipe(id);

    //2 RENDERING RECIPEEEE
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError(err.message);
  }
};

const controlSearchResults = async function (e) {
  try {
    resultsView.renderSpinner();
    //GET SEARCH QUERY
    const query = searchView.getQuery();

    if (!query) return;

    //LOAD SEARCH RESULTS
    await model.loadSearchResults(query);

    //RENDER SEARCH RESULTS
    resultsView.render(model.getSearchResultsPage(1));

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (page) {
  console.log(page);

  //RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(page));

  //RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //NEW SERVINGS IS FROM BUTTON ATTRIBUTE

  //UPDATE THE RECIPE SERVINGS (IN STATE)
  model.updateServings(newServings);

  //TAKE THE RECIPE VIEW UPDATED FROM LAST METHOD
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //ADD OR REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  //RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();
    //render bookmarks
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.revertWindow();
    }, config.MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
    setTimeout(function () {
      addRecipeView.revertWindow();
    }, config.MODAL_CLOSE_SEC * 1000);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  searchView.addHandlerSearch(controlSearchResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome to the Forkify Application! -Mervin');
  newFeature();
};

init();

const newFeature = function () {
  console.log('Welcome to the application!');
};

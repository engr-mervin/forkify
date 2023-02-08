import { async } from 'regenerator-runtime';
import * as config from './config.js';
import * as helpers from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: config.RES_PER_PAGE,
  },

  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await helpers.getJSON(
      `${config.API_URL}/${id}?key=${config.KEY}`
    );
    console.log(data);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmarked => bookmarked.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err} 🔴🔴🔴🔴`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await helpers.getJSON(
      `${config.API_URL}?search=${query}&key=${config.KEY}`
    );

    // console.log(data);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search);
  } catch (error) {
    console.error(`${err} 🔴🔴🔴🔴`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  return state.search.results.slice(
    state.search.resultsPerPage * (page - 1),
    state.search.resultsPerPage * page
  );
};

export const updateServings = function (newServings) {
  //CHANGE THE DATA IN RECIPE VIEW
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  //CHANGE THE SERVINGS IN RECIPE VIEW
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  recipe.bookmarked = true;
  // console.log(recipe);
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //remove bookmark from array
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //mark current recipe as bookmark
  state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(val => val[0].startsWith('ingredient') && val[1] !== '')
      .map(val => {
        const ingArr = val[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        let [quantity, unit, description] = ingArr;

        quantity = +quantity;

        if (typeof quantity !== 'number' || quantity === 0) quantity = null;
        return { quantity, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    console.log(recipe);

    const data = await helpers.sendJSON(
      `${config.API_URL}?key=${config.KEY}`,
      recipe
    );

    console.log(data);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

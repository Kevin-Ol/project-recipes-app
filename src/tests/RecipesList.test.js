import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const fetchMock = require('./mocks/fetch');
const mealsMock = require('./mocks/meals');
const beefMealsMock = require('./mocks/beefMeals');
const breakfastMealsMock = require('./mocks/breakfastMeals');
const chickenMealsMock = require('./mocks/chickenMeals');
const dessertMealsMock = require('./mocks/dessertMeals');
const goatMealsMock = require('./mocks/goatMeals');
const mealCategoriesMock = require('./mocks/mealCategories');
const drinksMock = require('./mocks/drinks');
const ordinaryDrinksMock = require('./mocks/ordinaryDrinks');
const cocktailDrinksMock = require('./mocks/cocktailDrinks');
const milkDrinksMock = require('./mocks/milkDrinks');
const otherDrinksMock = require('./mocks/otherDrinks');
const cocoaDrinksMock = require('./mocks/cocoaDrinks');
const drinkCategoriesMock = require('./mocks/drinkCategories');

const foodPage = '/comidas';
const drinkPage = '/bebidas';
const loading = 'Loading...';

const checkFirstTwelveRecipes = (recipes, type) => {
  const maxCards = 12;

  recipes.slice(0, maxCards).forEach((recipe, index) => {
    expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();

    expect(screen.getByTestId(`${index}-card-img`))
      .toHaveProperty('src', recipe[`str${type}Thumb`]);

    expect(screen.getByTestId(`${index}-card-name`))
      .toHaveTextContent(recipe[`str${type}`]);
  });

  expect(screen.queryByTestId(`${maxCards}-recipe-card`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
};

describe('25 - Verifica se os elementos da tela de receitas foram criados', () => {
  it('Verifica quantidade de cards na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    const maxCards = 12;
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId(`${maxCards}-recipe-card`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
  });

  it('Verifica quantidade de cards na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    const maxCards = 12;
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId(`${maxCards}-recipe-card`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
  });
});

describe('26 - Verifica o conteúdo dos elementos da tela de receitas', () => {
  it('Verifica conteúdo na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveRecipes(mealsMock.meals, 'Meal');
  });

  it('Verifica conteúdo na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveRecipes(drinksMock.drinks, 'Drink');
  });
});

describe('27 - Verifica existencia de filtros na tela de receitas', () => {
  it('Verifica se existem 5 filtros na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    const maxFilters = 5;
    mealCategoriesMock.meals.slice(0, maxFilters).forEach(({ strCategory: category }) => {
      expect(screen.getByTestId(`${category}-category-filter`)).toBeInTheDocument();
    });

    mealCategoriesMock.meals.slice(maxFilters).forEach(({ strCategory: category }) => {
      expect(screen.queryByTestId(`${category}-category-filter`)).not.toBeInTheDocument();
    });
  });

  it('Verifica se existem 5 filtros na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    const maxFilters = 5;
    drinkCategoriesMock.drinks.slice(0, maxFilters).forEach((
      { strCategory: category },
    ) => {
      expect(screen.getByTestId(`${category}-category-filter`)).toBeInTheDocument();
    });

    drinkCategoriesMock.drinks.slice(maxFilters).forEach(({ strCategory: category }) => {
      expect(screen.queryByTestId(`${category}-category-filter`)).not.toBeInTheDocument();
    });
  });
});

describe('28 - Verifica funcionalidade dos botões de filtro', () => {
  it('Verifica filtro Beef na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Beef-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(beefMealsMock.meals, 'Meal');
  });

  it('Verifica filtro Breakfast na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Breakfast-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(breakfastMealsMock.meals, 'Meal');
  });

  it('Verifica filtro Chicken na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Chicken-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(chickenMealsMock.meals, 'Meal');
  });

  it('Verifica filtro Dessert na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Dessert-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(dessertMealsMock.meals, 'Meal');
  });

  it('Verifica filtro Goat na tela de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Goat-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(goatMealsMock.meals, 'Meal');
  });

  it('Verifica filtro Ordinary Drink na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Ordinary Drink-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(ordinaryDrinksMock.drinks, 'Drink');
  });

  it('Verifica filtro Cocktail na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Cocktail-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(cocktailDrinksMock.drinks, 'Drink');
  });

  it('Verifica filtro Milk / Float / Shake na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Milk / Float / Shake-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(milkDrinksMock.drinks, 'Drink');
  });

  it('Verifica filtro Other/Unknown na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Other/Unknown-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(otherDrinksMock.drinks, 'Drink');
  });

  it('Verifica filtro Cocoa na tela de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('Cocoa-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(cocoaDrinksMock.drinks, 'Drink');
  });
});

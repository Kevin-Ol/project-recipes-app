import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const fetchMock = require('./mocks/fetch');
const mealIngredientsMock = require('./mocks/mealIngredients');
const mealsByIngredientMock = require('./mocks/mealsByIngredient');
const drinkIngredientsMock = require('./mocks/drinkIngredients');
const drinksByIngredientMock = require('./mocks/drinksByIngredient');

const mealPage = '/explorar/comidas/ingredientes';
const drinkPage = '/explorar/bebidas/ingredientes';
const loading = 'Loading...';
const maxCards = 12;

const checkFirstTwelveIngredients = (recipes, type) => {
  recipes.slice(0, maxCards).forEach((recipe, index) => {
    expect(screen.getByTestId(`${index}-ingredient-card`)).toBeInTheDocument();

    if (type === 'Meal') {
      expect(screen.getByTestId(`${index}-card-img`))
        .toHaveProperty('src', `https://www.themealdb.com/images/ingredients/${recipe.strIngredient.replace(/ /g, '%20')}-Small.png`);

      expect(screen.getByTestId(`${index}-card-name`))
        .toHaveTextContent(recipe.strIngredient);
    }

    if (type === 'Drink') {
      expect(screen.getByTestId(`${index}-card-img`))
        .toHaveProperty('src', `https://www.thecocktaildb.com/images/ingredients/${recipe.strIngredient1.replace(/ /g, '%20')}-Small.png`);

      expect(screen.getByTestId(`${index}-card-name`))
        .toHaveTextContent(recipe.strIngredient1);
    }
  });

  expect(screen.queryByTestId(`${maxCards}-ingredient-card`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
};

const checkFirstTwelveRecipes = (recipes, type) => {
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

describe('75 - Verifica existência dos elementos da tela explorar ingrediente', () => {
  it('Verifica elementos de card de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-ingredient-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId(`${maxCards}-ingredient-card`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
  });

  it('Verifica elementos de card de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-ingredient-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId(`${maxCards}-ingredient-card`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();
  });
});

describe('76 - Verifica conteúdo dos elementos da tela explorar ingrediente', () => {
  it('Verifica conteúdo de card de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveIngredients(mealIngredientsMock.meals, 'Meal');
  });

  it('Verifica conteúdo de card de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveIngredients(drinkIngredientsMock.drinks, 'Drink');
  });
});

describe('77 - Clicar em um ingrediente redireciona o usuario', () => {
  it('Redireciona usuário para página de comida', async () => {
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('0-ingredient-card'));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveRecipes(mealsByIngredientMock.meals, 'Meal');

    const { pathname } = history.location;
    expect(pathname).toBe('/comidas');
  });

  it('Verifica conteúdo de card de bebida', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [drinkPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('0-ingredient-card'));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    checkFirstTwelveRecipes(drinksByIngredientMock.drinks, 'Drink');

    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas');
  });
});

import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const fetchMock = require('./mocks/fetch');
const mealsMock = require('./mocks/meals');
const beefMealsMock = require('./mocks/beefMeals');
const breakfastMealsMock = require('./mocks/breakfastMeals');
const drinksMock = require('./mocks/drinks');
const ordinaryDrinksMock = require('./mocks/ordinaryDrinks');
const cocktailDrinksMock = require('./mocks/cocktailDrinks');

const beefFilter = 'Beef-category-filter';
const beefItem = 'Beef and Mustard Pie';
const ordinaryDrinkFilter = 'Ordinary Drink-category-filter';
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

describe('29 - Verifica se os filtros sao removidos ao clicar novamente', () => {
  it('Clicar novamente em "Beef" retorna às receitas iniciais', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(beefFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    userEvent.click(screen.getByTestId(beefFilter));

    await waitForElementToBeRemoved(() => screen.queryByText(beefItem));
    checkFirstTwelveRecipes(mealsMock.meals, 'Meal');
  });

  it('Clicar novamente em "Ordinary Drink" retorna às receitas iniciais', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(ordinaryDrinkFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    userEvent.click(screen.getByTestId(ordinaryDrinkFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('410 Gone'));
    checkFirstTwelveRecipes(drinksMock.drinks, 'Drink');
  });
});

describe('30 - Verifica se apenas um filtro é selecionado por vez', () => {
  it('Verifica filtros na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(beefFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(beefMealsMock.meals, 'Meal');

    userEvent.click(screen.getByTestId('Breakfast-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText(beefItem));
    checkFirstTwelveRecipes(breakfastMealsMock.meals, 'Meal');
  });

  it('Verifica filtros na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(ordinaryDrinkFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(ordinaryDrinksMock.drinks, 'Drink');

    userEvent.click(screen.getByTestId('Cocktail-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('410 Gone'));
    checkFirstTwelveRecipes(cocktailDrinksMock.drinks, 'Drink');
  });
});

describe('31 - Verifica funcionalidade botão de todas categorias', () => {
  it('Verifica filtro "All" na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(beefFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    checkFirstTwelveRecipes(beefMealsMock.meals, 'Meal');

    userEvent.click(screen.getByTestId('All-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText(beefItem));
    checkFirstTwelveRecipes(mealsMock.meals, 'Meal');
  });

  it('Verifica filtro "All" na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId(ordinaryDrinkFilter));

    await waitForElementToBeRemoved(() => screen.queryByText('GG'));
    checkFirstTwelveRecipes(ordinaryDrinksMock.drinks, 'Drink');

    userEvent.click(screen.getByTestId('All-category-filter'));

    await waitForElementToBeRemoved(() => screen.queryByText('410 Gone'));
    checkFirstTwelveRecipes(drinksMock.drinks, 'Drink');
  });
});

describe('32 - Verifica redirecionamento ao clicar em um card', () => {
  it('Verifica redirecionamento ao clicar em um card de comida', async () => {
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries: [foodPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('0-recipe-card'));

    expect(await screen.findByText('Instructions')).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52977');
  });

  it('Verifica redirecionamento ao clicar em um card de bebida', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [drinkPage] });
    global.fetch = jest.fn().mockImplementation(fetchMock);

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    userEvent.click(screen.getByTestId('0-recipe-card'));

    expect(await screen.findByText('Instructions')).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas/15997');
  });
});

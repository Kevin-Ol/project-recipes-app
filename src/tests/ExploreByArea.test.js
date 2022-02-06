import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const fetchMock = require('./mocks/fetch');
const mealCategoriesMock = require('./mocks/mealCategories');
const areasMock = require('./mocks/areas');
const mealsMock = require('./mocks/meals');
const japaneseMealsMock = require('./mocks/japaneseMeals');
const italianMealsMock = require('./mocks/italianMeals');

const firstCard = '0-recipe-card';
const dropdown = 'explore-by-area-dropdown';
const exploreByAreaPage = '/explorar/comidas/area';
const maxCards = 12;

const checkFirstTwelveRecipes = (recipes, limit = maxCards) => {
  recipes.slice(0, limit).forEach((recipe, index) => {
    expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();

    expect(screen.getByTestId(`${index}-card-img`))
      .toHaveProperty('src', recipe.strMealThumb);

    expect(screen.getByTestId(`${index}-card-name`))
      .toHaveTextContent(recipe.strMeal);
  });

  expect(screen.queryByTestId(`${limit}-recipe-card`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${limit}-card-img`)).not.toBeInTheDocument();
  expect(screen.queryByTestId(`${limit}-card-name`)).not.toBeInTheDocument();
};

describe('78 - Verifica se os elementos da tela explorar origem foram criados', () => {
  it('Verifica quantidade de cards e existencia de dropdown', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreByAreaPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    expect(await screen.findByTestId(firstCard)).toBeInTheDocument();

    expect(screen.queryByTestId('All-category-filter')).not.toBeInTheDocument();
    mealCategoriesMock.meals.forEach(({ strCategory: category }) => {
      expect(screen.queryByTestId(`${category}-category-filter"`))
        .not.toBeInTheDocument();
    });

    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId(`${maxCards}-recipe-card`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-img`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${maxCards}-card-name`)).not.toBeInTheDocument();

    expect(screen.getByTestId(dropdown)).toBeInTheDocument();
    areasMock.meals.forEach(({ strArea: area }) => {
      expect(screen.getByTestId(`${area}-option`)).toBeInTheDocument();
    });
  });
});

describe('79 - Verifica funcionalidade do dropdown', () => {
  it('A página inicia com 12 cards de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreByAreaPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    expect(await screen.findByTestId(firstCard)).toBeInTheDocument();

    checkFirstTwelveRecipes(mealsMock.meals);
  });

  it('Ao selecionar um filtro, as receitas mudam para o local de origem', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreByAreaPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    expect(await screen.findByTestId(firstCard)).toBeInTheDocument();

    userEvent.selectOptions(screen.getByTestId(dropdown), 'Japanese');
    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    const japaneseMeals = 5;
    checkFirstTwelveRecipes(japaneseMealsMock.meals, japaneseMeals);

    userEvent.selectOptions(screen.getByTestId(dropdown), 'Italian');
    await waitForElementToBeRemoved(() => screen.queryByText('Chicken Karaage'));
    checkFirstTwelveRecipes(italianMealsMock.meals);
  });

  it('Verifica redirecionamento no card de comida', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreByAreaPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    expect(await screen.findByTestId(firstCard)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(firstCard));

    expect(await screen.findByText('Instructions')).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52977');
  });
});

describe('80 - O dropdown deve ter uma opção All que retorna receitas sem filtro', () => {
  it('Verifica funcionalidade opção All', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreByAreaPage] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    expect(await screen.findByTestId(firstCard)).toBeInTheDocument();
    checkFirstTwelveRecipes(mealsMock.meals);

    userEvent.selectOptions(screen.getByTestId(dropdown), 'Japanese');
    await waitForElementToBeRemoved(() => screen.queryByText('Corba'));
    const japaneseMeals = 5;
    checkFirstTwelveRecipes(japaneseMealsMock.meals, japaneseMeals);

    userEvent.selectOptions(screen.getByTestId(dropdown), 'All');
    await waitForElementToBeRemoved(() => screen.queryByText('Chicken Karaage'));
    checkFirstTwelveRecipes(mealsMock.meals);
  });
});

describe('81 - A opção de área deve servir apenas para receitas de comida`', () => {
  it('Ao acessar a rota /explorar/bebidas/area ela retorna "Not Found"', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/explorar/bebidas/area'] });

    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});

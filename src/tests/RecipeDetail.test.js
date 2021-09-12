import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';
import fetchMock from '../../cypress/mocks/fetch';

const recipePhoto = 'recipe-photo';
const recipeTitle = 'recipe-title';
const shareButton = 'share-btn';
const favoriteButton = 'favorite-btn';
const recipeCategory = 'recipe-category';
const instructions = 'instructions';
const video = 'video';
const startButton = 'start-recipe-btn';
const firstIngredient = '0-ingredient-name-and-measure';
const firstRecomendation = '0-recomendation-card';

const mealPage = '/comidas/52771';
const drinkPage = '/bebidas/178319';
const MEAL_ID_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771';
const DRINK_ID_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=178319';
const MEAL_RECOMENDATION_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const DRINK_RECOMENDATION_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

describe('33 - Verifica se os elementos foram criados', () => {
  it('Verifica existencia dos elementos na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(recipeTitle)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
    expect(screen.getByTestId(recipeCategory)).toBeInTheDocument();
    expect(screen.getByTestId(instructions)).toBeInTheDocument();
    expect(screen.getByTestId(video)).toBeInTheDocument();
    expect(screen.getByTestId(startButton)).toBeInTheDocument();
    expect(screen.getByTestId(firstIngredient)).toBeInTheDocument();
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();
  });

  it('Verifica existencia dos elementos na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(recipeTitle)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
    expect(screen.getByTestId(recipeCategory)).toBeInTheDocument();
    expect(screen.getByTestId(instructions)).toBeInTheDocument();
    expect(screen.getByTestId(startButton)).toBeInTheDocument();
    expect(screen.getByTestId(firstIngredient)).toBeInTheDocument();
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();
  });
});

describe('34 - Realiza requisição com o id da receita', () => {
  global.fetch = jest.fn().mockImplementation(fetchMock);
  afterEach(() => jest.clearAllMocks());

  it('Página de comidas faz requisição corretamente', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(MEAL_ID_URL);
  });

  it('Página de bebidas faz requisição corretamente', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(DRINK_ID_URL);
  });
});

describe('35 - Verifica conteúdo da página', () => {
  it('Verifica conteúdo da página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(recipePhoto)).toHaveProperty('src', 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg');
    expect(screen.getByTestId(recipeTitle)).toHaveTextContent('Spicy Arrabiata Penne');
    expect(screen.getByTestId(recipeCategory)).toHaveTextContent('Vegetarian');
    expect(screen.getByTestId(firstIngredient))
      .toHaveTextContent('penne rigate');
    expect(screen.getByTestId(firstIngredient))
      .toHaveTextContent('1 pound');
    expect(screen.getByTestId('7-ingredient-name-and-measure'))
      .toHaveTextContent('Parmigiano-Reggiano');
    expect(screen.getByTestId('7-ingredient-name-and-measure'))
      .toHaveTextContent('spinkling');
    expect(screen.getByTestId(instructions))
      .toHaveTextContent('Bring a large pot of water to a boil.');
    expect(screen.getByTestId(instructions))
      .toHaveTextContent('Parmigiano-Reggiano flakes and more basil and serve warm.');
    expect(screen.getByTestId(video)).toBeInTheDocument();
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();
  });

  it('Verifica conteúdo da página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(recipePhoto)).toHaveProperty('src', 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg');
    expect(screen.getByTestId(recipeTitle)).toHaveTextContent('Aquamarine');
    expect(screen.getByTestId(recipeCategory)).toHaveTextContent('Alcoholic');
    expect(screen.getByTestId(firstIngredient))
      .toHaveTextContent('Hpnotiq');
    expect(screen.getByTestId(firstIngredient))
      .toHaveTextContent('2 oz');
    expect(screen.getByTestId('2-ingredient-name-and-measure'))
      .toHaveTextContent('Banana Liqueur');
    expect(screen.getByTestId('2-ingredient-name-and-measure'))
      .toHaveTextContent('1 oz');
    expect(screen.getByTestId(instructions))
      .toHaveTextContent('Shake well in a shaker with ice. Strain in a martini glass.');
    expect(screen.queryByTestId(video)).not.toBeInTheDocument();
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();
  });
});

describe('36 - Realiza requisição de recomendações corretamente', () => {
  afterEach(() => jest.clearAllMocks());

  it('Página de comidas faz requisição de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(DRINK_RECOMENDATION_URL);
  });

  it('Página de bebidas faz requisição corretamente', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(MEAL_RECOMENDATION_URL);
  });
});

describe('37 - Verifica cards de recomendação', () => {
  it('Página de comidas possui todos os cards', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();

    const titles = ['GG', 'A1', 'ABC', 'Kir', '747', '252'];
    const maxCards = 6;
    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recomendation-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-recomendation-title`))
        .toHaveTextContent(titles[index]);
    }
  });

  it('Página de bebidas possui todos os cards', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(firstRecomendation)).toBeInTheDocument();

    const titles = ['Corba', 'Kumpir', 'Dal fry', 'Poutine', 'Lasagne', 'Timbits'];
    const maxCards = 6;
    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recomendation-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-recomendation-title`))
        .toHaveTextContent(titles[index]);
    }
  });
});

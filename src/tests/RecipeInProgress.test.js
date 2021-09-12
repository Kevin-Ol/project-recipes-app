import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import copy from 'clipboard-copy';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';
import blackHeart from '../images/blackHeartIcon.svg';
import whiteHeart from '../images/whiteHeartIcon.svg';

jest.mock('clipboard-copy', () => jest.fn());

const recipePhoto = 'recipe-photo';
const recipeTitle = 'recipe-title';
const shareButton = 'share-btn';
const favoriteButton = 'favorite-btn';
const recipeCategory = 'recipe-category';
const instructions = 'instructions';
const video = 'video';
const finishButton = 'finish-recipe-btn';
const firstIngredientStep = '0-ingredient-step';

const mealPage = '/comidas/52771/in-progress';
const drinkPage = '/bebidas/178319/in-progress';

describe('47 - Verifica se os elementos foram criados', () => {
  it('Verifica existencia dos elementos na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(recipeTitle)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
    expect(screen.getByTestId(recipeCategory)).toBeInTheDocument();
    expect(screen.getByTestId(instructions)).toBeInTheDocument();
    expect(screen.getByTestId(video)).toBeInTheDocument();
    expect(screen.getByTestId(finishButton)).toBeInTheDocument();
    expect(screen.getByTestId(firstIngredientStep)).toBeInTheDocument();
  });

  it('Verifica existencia dos elementos na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(recipeTitle)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
    expect(screen.getByTestId(recipeCategory)).toBeInTheDocument();
    expect(screen.getByTestId(instructions)).toBeInTheDocument();
    expect(screen.getByTestId(finishButton)).toBeInTheDocument();
    expect(screen.getByTestId(firstIngredientStep)).toBeInTheDocument();
  });
});

describe('48 - Cria checkbox para cada item dos ingredientes', () => {
  it('Verifica checkbox na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      expect(screen.getByTestId(`${index}-ingredient-step`).firstChild).toEqual(item);
    });
  });

  it('Verifica checkbox na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      expect(screen.getByTestId(`${index}-ingredient-step`).firstChild).toEqual(item);
    });
  });
});

describe('50 - Salva progresso de receita em andamento', () => {
  it('Verifica progresso na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    const checkbox = screen.getByTestId(firstIngredientStep).firstChild;
    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);

    const { location } = window;
    delete window.location;
    window.location = { reload: jest.fn() };

    expect(window.location.reload).not.toHaveBeenCalled();
    window.location.reload();
    expect(window.location.reload).toHaveBeenCalled();
    window.location = location;

    expect(checkbox).toBeChecked();
  });

  it('Verifica progresso na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    const checkbox = screen.getByTestId(firstIngredientStep).firstChild;
    expect(checkbox).not.toBeChecked();
    userEvent.click(checkbox);

    const { location } = window;
    delete window.location;
    window.location = { reload: jest.fn() };

    expect(window.location.reload).not.toHaveBeenCalled();
    window.location.reload();
    expect(window.location.reload).toHaveBeenCalled();
    window.location = location;

    expect(checkbox).toBeChecked();
  });
});

describe('51 - Verifica funcionalidade botões compartilhar e favoritos', () => {
  beforeEach(() => localStorage.clear());

  it('Verifica existencia de botões na página de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
  });

  it('Verifica existencia de botões na página de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(shareButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton)).toBeInTheDocument();
  });

  it('Verifica funcionalidade do botão compartilhar na página de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    copy.mockImplementation(() => mealPage);
    global.getSelection = jest.fn();
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(shareButton));
    expect(await screen.findByText('Link copiado!')).toBeInTheDocument();
  });

  it('Verifica funcionalidade do botão compartilhar na página de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    copy.mockImplementation(() => drinkPage);
    global.getSelection = jest.fn();
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(shareButton));
    expect(await screen.findByText('Link copiado!')).toBeInTheDocument();
  });

  it('Verifica mudança do ícone favorito na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });

  it('Verifica mudança do ícone favorito na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });

  it('Verifica local storage na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const expectedFavoriteRecipes = [
      {
        id: '52771',
        type: 'comida',
        area: 'Italian',
        category: 'Vegetarian',
        alcoholicOrNot: '',
        name: 'Spicy Arrabiata Penne',
        image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      },
    ];
    expect(favoriteRecipes).toEqual(expectedFavoriteRecipes);
  });

  it('Verifica local storage na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const expectedFavoriteRecipes = [
      {
        id: '178319',
        type: 'bebida',
        area: '',
        category: 'Cocktail',
        alcoholicOrNot: 'Alcoholic',
        name: 'Aquamarine',
        image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      },
    ];
    expect(favoriteRecipes).toEqual(expectedFavoriteRecipes);
  });
});

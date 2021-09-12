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
const shareButton = 'share-btn';
const favoriteButton = 'favorite-btn';
const startButton = 'start-recipe-btn';

const mealPage = '/comidas/52771';
const drinkPage = '/bebidas/178319';

describe('39 - Caso a receita já tenha sido feita o botão de iniciar deve sumir', () => {
  beforeEach(() => localStorage.clear());

  it('Verifica se botão existe na página de comidas', async () => {
    const doneRecipes = [{
      id: '52771',
      type: 'comida',
      area: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: '',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      doneDate: '22/6/2020',
      tags: ['Pasta', 'Curry'],
    }];
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.queryByTestId(startButton)).not.toBeInTheDocument();
  });

  it('Verifica se botão existe na página de bebidas', async () => {
    const doneRecipes = [{
      id: '178319',
      type: 'bebida',
      area: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      doneDate: '23/6/2020',
      tags: [],
    }];
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.queryByTestId(startButton)).not.toBeInTheDocument();
  });
});

describe('40 - Caso a receita já tenha sido iniciada o texto do botão muda', () => {
  beforeEach(() => localStorage.clear());

  it('Verifica texto do botão na página de comidas', async () => {
    const inProgressRecipes = {
      meals: {
        52771: [],
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(startButton)).toHaveTextContent('Continuar Receita');
  });

  it('Verifica texto do botão na página de bebidas', async () => {
    const inProgressRecipes = {
      cocktails: {
        178319: [],
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(startButton)).toHaveTextContent('Continuar Receita');
  });
});

describe('41 - Verifica funcionalidade botão Iniciar Receita', () => {
  beforeEach(() => localStorage.clear());

  it('Redireciona para página de receita de comida em progresso', async () => {
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(startButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52771/in-progress');
  });

  it('Redireciona para página de receita de bebidas em progresso', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(startButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas/178319/in-progress');
  });
});

describe('42 - Cria botões de compartilhar e favoritar receita', () => {
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
});

describe('43 - Verifica funcionalidade botão de compartilhar', () => {
  it('Verifica funcionalidade do botão na página de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    copy.mockImplementation(() => mealPage);
    global.getSelection = jest.fn();
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(shareButton));
    expect(await screen.findByText('Link copiado!')).toBeInTheDocument();
  });

  it('Verifica funcionalidade do botão na página de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    copy.mockImplementation(() => drinkPage);
    global.getSelection = jest.fn();
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(shareButton));
    expect(await screen.findByText('Link copiado!')).toBeInTheDocument();
  });
});

describe('44 - Verifica ícone botão de favorito', () => {
  beforeEach(() => localStorage.clear());

  it('Verifica ícone vazio na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });

  it('Verifica ícone vazio na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });
});

describe('45 - Verifica funcionalidade botão de favorito', () => {
  beforeEach(() => localStorage.clear());

  it('Verifica mudança do ícone na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });

  it('Verifica mudança do ícone na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });
    expect(await screen.findByTestId(recipePhoto)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
    userEvent.click(screen.getByTestId(favoriteButton));
    expect(screen.getByTestId(favoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${whiteHeart}`);
  });
});

describe('46 - Ao clicar no botão de favorito, a receita é salva no local storage',
  () => {
    beforeEach(() => localStorage.clear());

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

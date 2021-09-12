import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import copy from 'clipboard-copy';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';
import shareButton from '../images/shareIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';

jest.mock('clipboard-copy', () => jest.fn());

const filterAll = 'filter-by-all-btn';
const filterFood = 'filter-by-food-btn';
const filterDrink = 'filter-by-drink-btn';
const firstCardImage = '0-horizontal-image';
const firstCardText = '0-horizontal-top-text';
const firstCardName = '0-horizontal-name';
const firstCardShareButton = '0-horizontal-share-btn';
const firstCardFavoriteButton = '0-horizontal-favorite-btn';
const secondCardImage = '1-horizontal-image';
const secondCardText = '1-horizontal-top-text';
const secondCardName = '1-horizontal-name';
const secondCardShareButton = '1-horizontal-share-btn';
const secondCardFavoriteButton = '1-horizontal-favorite-btn';

const favoriteRecipesPage = '/receitas-favoritas';

const favoriteRecipes = [
  {
    id: '52771',
    type: 'comida',
    area: 'Italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Spicy Arrabiata Penne',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  },
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

describe('60 - Verifica se os elementos da tela de favoritas foram criados', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Verifica elementos de card de comida e bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });
    expect(screen.getByTestId(filterAll)).toBeInTheDocument();
    expect(screen.getByTestId(filterFood)).toBeInTheDocument();
    expect(screen.getByTestId(filterDrink)).toBeInTheDocument();

    expect(await screen.findByTestId(firstCardImage)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardText)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardName)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardShareButton)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardFavoriteButton)).toBeInTheDocument();

    expect(screen.getByTestId(secondCardImage)).toBeInTheDocument();
    expect(screen.getByTestId(secondCardText)).toBeInTheDocument();
    expect(screen.getByTestId(secondCardName)).toBeInTheDocument();
    expect(screen.getByTestId(secondCardShareButton)).toBeInTheDocument();
    expect(screen.getByTestId(secondCardFavoriteButton)).toBeInTheDocument();
  });
});

describe('61 - Verifica contéudo card de comida', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Verifica elementos de card de comida', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });

    expect(screen.getByTestId(firstCardImage))
      .toHaveProperty('src', favoriteRecipes[0].image);
    expect(screen.getByTestId(firstCardText))
      .toHaveTextContent(`${favoriteRecipes[0].area} - ${favoriteRecipes[0].category}`);
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[0].name);
    expect(screen.getByTestId(firstCardShareButton).firstChild)
      .toHaveProperty('src', `http://localhost/${shareButton}`);
    expect(screen.getByTestId(firstCardFavoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
  });
});

describe('62 - Verifica contéudo card de bebida', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Verifica elementos de card de bebida', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });

    expect(screen.getByTestId(secondCardImage))
      .toHaveProperty('src', favoriteRecipes[1].image);
    expect(screen.getByTestId(secondCardText))
      .toHaveTextContent(favoriteRecipes[1].alcoholicOrNot);
    expect(screen.getByTestId(secondCardName)).toHaveTextContent(favoriteRecipes[1].name);
    expect(screen.getByTestId(secondCardShareButton).firstChild)
      .toHaveProperty('src', `http://localhost/${shareButton}`);
    expect(screen.getByTestId(secondCardFavoriteButton).firstChild)
      .toHaveProperty('src', `http://localhost/${blackHeart}`);
  });
});

describe('63 - Verifica funcionalidade botão de compartilhar', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Verifica funcionalidade do botão no card de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });
    copy.mockImplementation(() => favoriteRecipesPage);
    global.getSelection = jest.fn();
    userEvent.click(screen.getByTestId(firstCardShareButton));
    expect(await screen.findByText('Link copiado!')).toBeInTheDocument();
  });
});

describe('64 - Verifica funcionalidade botão de desfavoritar receita', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Desfavoritar um item o remove da tela e do local storage', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });

    expect(JSON.parse(localStorage.getItem('favoriteRecipes'))).toEqual(favoriteRecipes);
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[0].name);
    expect(screen.getByTestId(secondCardName)).toHaveTextContent(favoriteRecipes[1].name);

    userEvent.click(screen.getByTestId(secondCardFavoriteButton));
    await waitForElementToBeRemoved(() => screen.getByTestId(secondCardName));
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[0].name);
    expect(screen.queryByTestId(secondCardName)).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('favoriteRecipes')))
      .toEqual([favoriteRecipes[0]]);

    userEvent.click(screen.getByTestId(firstCardFavoriteButton));
    await waitForElementToBeRemoved(() => screen.getByTestId(firstCardName));
    expect(screen.queryByTestId(firstCardName)).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('favoriteRecipes')))
      .toEqual([]);
  });
});

describe('65 - Verifica funcionalidade dos botões de filtro', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Botão de filtro por comida funciona corretamente', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });
    userEvent.click(screen.getByTestId(filterFood));
    expect(screen.getByTestId(firstCardName)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[0].name);
    expect(screen.queryByTestId(secondCardName)).not.toBeInTheDocument();
  });

  it('Botão de filtro por bebida funciona corretamente', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });
    userEvent.click(screen.getByTestId(filterDrink));
    expect(screen.getByTestId(firstCardName)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[1].name);
    expect(screen.queryByTestId(secondCardName)).not.toBeInTheDocument();
  });

  it('Botão de filtro all reseta os filtros', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [favoriteRecipesPage] });
    userEvent.click(screen.getByTestId(filterFood));
    expect(screen.getByTestId(firstCardName)).toBeInTheDocument();
    expect(screen.getByTestId(firstCardName)).toHaveTextContent(favoriteRecipes[0].name);
    expect(screen.queryByTestId(secondCardName)).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId(filterAll));
    expect(screen.getByTestId(firstCardName)).toBeInTheDocument();
    expect(screen.getByTestId(secondCardName)).toBeInTheDocument();
  });
});

describe('66 - Faz redirecionamento ao clicar num card de receita favorita', () => {
  beforeEach(() => localStorage.setItem('favoriteRecipes',
    JSON.stringify(favoriteRecipes)));
  afterEach(() => localStorage.clear());

  it('Verifica redirecionamento no card de comida', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [favoriteRecipesPage] });
    userEvent.click(screen.getByTestId(firstCardImage));
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52771');
  });

  it('Verifica redirecionamento no card de bebida', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [favoriteRecipesPage] });
    userEvent.click(screen.getByTestId(secondCardImage));
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas/178319');
  });
});

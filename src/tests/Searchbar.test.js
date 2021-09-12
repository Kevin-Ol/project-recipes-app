import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';
import fetchMock from '../../cypress/mocks/fetch';

const searchButton = 'search-top-btn';
const searchInput = 'search-input';
const ingredientRadio = 'ingredient-search-radio';
const nameRadio = 'name-search-radio';
const firstLetterRadio = 'first-letter-search-radio';
const searchBarButton = 'exec-search-btn';
const loading = 'Loading...';

const FOOD_INGREDIENTS_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken';
const FOOD_NAME_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=soup';
const FOOD_FIRST_LETTER_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a';
const DRINK_INGREDIENTS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=lemon';
const DRINK_NAME_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=gin';
const DRINK_FIRST_LETTER_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a';
const ALERT_MESSAGE = 'Sua busca deve conter somente 1 (um) caracter';
const RECIPES_ALERT = 'Sinto muito, não encontramos nenhuma receita para esses filtros.';

describe('13 - Verifica se Searchbar contém todos elementos', () => {
  it('Verifica existencia do input, radio buttons e botão de pesquisa', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    expect(screen.getByTestId(searchInput)).toBeInTheDocument();
    expect(screen.getByTestId(ingredientRadio)).toBeInTheDocument();
    expect(screen.getByTestId(nameRadio)).toBeInTheDocument();
    expect(screen.getByTestId(firstLetterRadio)).toBeInTheDocument();
    expect(screen.getByTestId(searchBarButton)).toBeInTheDocument();
  });
});

describe('14 - Verifica se os radio buttons fazem as requisições corretamente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    userEvent.click(screen.getByTestId(searchButton));
  });

  global.fetch = jest.fn().mockImplementation(fetchMock);
  global.alert = jest.fn();

  it('Busca por ingrediente ao selecionar input ingrediente', () => {
    userEvent.click(screen.getByTestId(ingredientRadio));
    userEvent.type(screen.getByTestId(searchInput), 'chicken');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(FOOD_INGREDIENTS_URL);
  });

  it('Busca por nome ao selecionar input nome', () => {
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'soup');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(FOOD_NAME_URL);
  });

  it('Busca pela primeira letra ao selecionar input primeira letra', () => {
    userEvent.click(screen.getByTestId(firstLetterRadio));
    userEvent.type(screen.getByTestId(searchInput), 'a');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(FOOD_FIRST_LETTER_URL);
  });

  it('Caso a busca por letra tenha mais de 1 letra, deve exibir um alerta', () => {
    userEvent.click(screen.getByTestId(firstLetterRadio));
    userEvent.type(screen.getByTestId(searchInput), 'aa');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.alert).toHaveBeenCalledWith(ALERT_MESSAGE);
  });
});

describe('15 - Verifica as requisições para comidas e bebidas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouterAndRedux(<App />, { initialEntries: ['/bebidas'] });
    userEvent.click(screen.getByTestId(searchButton));
  });

  global.fetch = jest.fn().mockImplementation(fetchMock);
  global.alert = jest.fn();

  it('Busca por ingrediente ao selecionar input ingrediente', () => {
    userEvent.click(screen.getByTestId(ingredientRadio));
    userEvent.type(screen.getByTestId(searchInput), 'lemon');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(DRINK_INGREDIENTS_URL);
  });

  it('Busca por nome ao selecionar input nome', () => {
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'gin');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(DRINK_NAME_URL);
  });

  it('Busca pela primeira letra ao selecionar input primeira letra', () => {
    userEvent.click(screen.getByTestId(firstLetterRadio));
    userEvent.type(screen.getByTestId(searchInput), 'a');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.fetch).toHaveBeenCalledWith(DRINK_FIRST_LETTER_URL);
  });

  it('Caso a busca por letra tenha mais de 1 letra, deve exibir um alerta', () => {
    userEvent.click(screen.getByTestId(firstLetterRadio));
    userEvent.type(screen.getByTestId(searchInput), 'aaa');
    userEvent.click(screen.getByTestId(searchBarButton));
    expect(global.alert).toHaveBeenCalledWith(ALERT_MESSAGE);
  });
});

describe('16 - Redireciona para tela de detalhes caso encontre 1 receita', () => {
  it('Veridica se tela de comidas faz redirecionamento', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/comidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'Arrabiata');
    userEvent.click(screen.getByTestId(searchBarButton));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52771');
  });

  it('Veridica se tela de bebidas faz redirecionamento', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/bebidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'Aquamarine');
    userEvent.click(screen.getByTestId(searchBarButton));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas/178319');
  });
});

describe('17 - Mostre até 12 receitas caso sejam encontradas', () => {
  it('Verifica se tela de comidas mostra quantidade correta', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'soup');
    userEvent.click(screen.getByTestId(searchBarButton));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    const maxCards = 10;
    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId('10-recipe-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('10-card-img')).not.toBeInTheDocument();
    expect(screen.queryByTestId('10-card-name')).not.toBeInTheDocument();
  });

  it('Verifica se tela de bebidas mostra quantidade correta', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/bebidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'gin');
    userEvent.click(screen.getByTestId(searchBarButton));

    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    const maxCards = 12;
    for (let index = 0; index < maxCards; index += 1) {
      expect(screen.getByTestId(`${index}-recipe-card`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-img`)).toBeInTheDocument();
      expect(screen.getByTestId(`${index}-card-name`)).toBeInTheDocument();
    }

    expect(screen.queryByTestId('12-recipe-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('12-card-img')).not.toBeInTheDocument();
    expect(screen.queryByTestId('12-card-name')).not.toBeInTheDocument();
  });
});

describe('18 - Exibe alerta caso não encontre receita', () => {
  beforeEach(() => jest.clearAllMocks());

  it('Exibe alerta na página de comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'xablau');
    userEvent.click(screen.getByTestId(searchBarButton));

    const oneSecond = 1000;
    await new Promise((r) => setTimeout(r, oneSecond));
    expect(global.alert).toHaveBeenCalledWith(RECIPES_ALERT);
  });

  it('Exibe alerta na página de bebidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/bebidas'] });
    userEvent.click(screen.getByTestId(searchButton));
    userEvent.click(screen.getByTestId(nameRadio));
    userEvent.type(screen.getByTestId(searchInput), 'xablau');
    userEvent.click(screen.getByTestId(searchBarButton));

    const oneSecond = 1000;
    await new Promise((r) => setTimeout(r, oneSecond));
    expect(global.alert).toHaveBeenCalledWith(RECIPES_ALERT);
  });
});

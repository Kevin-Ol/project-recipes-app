import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const fetchMock = require('./mocks/fetch');

const exploreByIngredient = 'explore-by-ingredient';
const exploreByArea = 'explore-by-area';
const exploreSurprise = 'explore-surprise';
const exploreFood = '/explorar/comidas';
const exploreDrink = '/explorar/bebidas';

describe('70 - Verifica existencia dos elementos das telas de explorar', () => {
  it('Verifica existencia dos elementos na tela de explorar comidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreFood] });

    expect(screen.getByTestId(exploreByIngredient)).toBeInTheDocument();
    expect(screen.getByTestId(exploreByArea)).toBeInTheDocument();
    expect(screen.getByTestId(exploreSurprise)).toBeInTheDocument();
  });

  it('Verifica existencia dos elementos na tela de explorar bebidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreDrink] });

    expect(screen.getByTestId(exploreByIngredient)).toBeInTheDocument();
    expect(screen.queryByTestId(exploreByArea)).not.toBeInTheDocument();
    expect(screen.getByTestId(exploreSurprise)).toBeInTheDocument();
  });
});

describe('71 - Verifica conteúdo dos elementos das telas de explorar', () => {
  it('Verifica conteúdo dos elementos na tela de explorar comidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreFood] });

    expect(screen.getByTestId(exploreByIngredient)).toHaveTextContent('Por Ingredientes');
    expect(screen.getByTestId(exploreByArea)).toHaveTextContent('Por Local de Origem');
    expect(screen.getByTestId(exploreSurprise)).toHaveTextContent('Me Surpreenda!');
  });

  it('Verifica conteúdo dos elementos na tela de explorar bebidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [exploreDrink] });

    expect(screen.getByTestId(exploreByIngredient)).toHaveTextContent('Por Ingredientes');
    expect(screen.queryByTestId(exploreByArea)).not.toBeInTheDocument();
    expect(screen.getByTestId(exploreSurprise)).toHaveTextContent('Me Surpreenda!');
  });
});

describe('72 - Verifica funcionalidade do botão "Por Ingredientes"', () => {
  it('Verifica redirecionamento do botão na tela de explorar comidas', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreFood] });

    userEvent.click(screen.getByTestId(exploreByIngredient));

    const { pathname } = history.location;
    expect(pathname).toBe('/explorar/comidas/ingredientes');
  });

  it('Verifica redirecionamento do botão na tela de explorar bebidas', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreDrink] });

    userEvent.click(screen.getByTestId(exploreByIngredient));

    const { pathname } = history.location;
    expect(pathname).toBe('/explorar/bebidas/ingredientes');
  });
});

describe('73 - Verifica funcionalidade do botão "Por Local de Origem"', () => {
  it('Verifica redirecionamento do botão na tela de explorar comidas', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreFood] });

    userEvent.click(screen.getByTestId(exploreByArea));

    const { pathname } = history.location;
    expect(pathname).toBe('/explorar/comidas/area');
  });
});

describe('74 - Verifica funcionalidade do botão "Me Surpreenda!"', () => {
  it('Verifica redirecionamento para receita de comida', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreFood] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    userEvent.click(screen.getByTestId(exploreSurprise));

    expect(await screen.findByText('Instructions')).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas/52771');
  });

  it('Verifica redirecionamento para receita de comida bebida', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [exploreDrink] });

    global.fetch = jest.fn().mockImplementation(fetchMock);

    userEvent.click(screen.getByTestId(exploreSurprise));

    expect(await screen.findByText('Instructions')).toBeInTheDocument();
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas/178319');
  });
});

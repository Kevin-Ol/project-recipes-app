import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const explore = '/explorar';
const exploreFood = 'explore-food';
const exploreDrink = 'explore-drinks';

describe('67 - Verifica existencia dos elementos da tela de explorar', () => {
  it('Existem 2 botões na página', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [explore] });

    expect(screen.getByTestId(exploreFood)).toBeInTheDocument();
    expect(screen.getByTestId(exploreDrink)).toBeInTheDocument();
  });
});

describe('68 - Verifica conteúdo dos elementos da tela de explorar', () => {
  it('Existem botões explorar comidas e explorar bebidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [explore] });

    expect(screen.getByTestId(exploreFood)).toHaveTextContent('Explorar Comidas');
    expect(screen.getByTestId(exploreDrink)).toBeInTheDocument('Explorar Comidas');
  });
});

describe('69 - Clicar nos botões faz redirecionamento do usuário', () => {
  it('Verifica redirecionamento do botão de comida', () => {
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries: [explore] });

    userEvent.click(screen.getByTestId(exploreFood));

    const { pathname } = history.location;
    expect(pathname).toBe('/explorar/comidas');
  });

  it('Verifica redirecionamento do botão de bebida', () => {
    const { history } = renderWithRouterAndRedux(<App />, { initialEntries: [explore] });

    userEvent.click(screen.getByTestId(exploreDrink));

    const { pathname } = history.location;
    expect(pathname).toBe('/explorar/bebidas');
  });
});

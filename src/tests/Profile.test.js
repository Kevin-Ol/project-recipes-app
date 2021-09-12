import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const email = 'teste@teste.com';
const emailOnScreen = 'profile-email';
const doneRecipesButton = 'profile-done-btn';
const favoriteRecipesButton = 'profile-favorite-btn';
const logoutButton = 'profile-logout-btn';

describe('82 - Verifica se os elementos da tela perfil foram criados', () => {
  it('Verifica existencia dos elementos', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/perfil'] });

    expect(screen.getByTestId(emailOnScreen)).toBeInTheDocument();
    expect(screen.getByTestId(doneRecipesButton)).toBeInTheDocument();
    expect(screen.getByTestId(favoriteRecipesButton)).toBeInTheDocument();
    expect(screen.getByTestId(logoutButton)).toBeInTheDocument();
  });
});

describe('83 - Verifica se email aparece na página', () => {
  beforeEach(() => localStorage.setItem('user', JSON.stringify({ email })));
  afterEach(() => localStorage.clear());

  it('Verifica existencia do email correto', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/perfil'] });

    expect(screen.getByTestId(emailOnScreen)).toHaveTextContent(email);
  });
});

describe('84 - Verifica contéudo dos botões na página de perfil', () => {
  it('Verifica texto dos botões', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/perfil'] });

    expect(screen.getByTestId(doneRecipesButton)).toHaveTextContent('Receitas Feitas');
    expect(screen.getByTestId(favoriteRecipesButton))
      .toHaveTextContent('Receitas Favoritas');
    expect(screen.getByTestId(logoutButton)).toHaveTextContent('Sair');
  });
});

describe('85 - Verifica funcionalidade do botão Receitas Feitas', () => {
  it('Verifica redirecionamento para página /receitas-feitas', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/perfil'] });

    userEvent.click(screen.getByTestId(doneRecipesButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/receitas-feitas');
  });
});

describe('86 - Verifica funcionalidade do botão Receitas Favoritas', () => {
  it('Verifica redirecionamento para página /receitas-favoritas', () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/perfil'] });

    userEvent.click(screen.getByTestId(favoriteRecipesButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/receitas-favoritas');
  });
});

describe('87 - Verifica funcionalidade do botão Sair', () => {
  it('Verifica redirecionamento para página inicial e limpa local storage', () => {
    localStorage.setItem('user', JSON.stringify({ email }));
    localStorage.setItem('mealsToken', '1');
    localStorage.setItem('cocktailsToken', '1');
    localStorage.setItem('doneRecipes', JSON.stringify([]));
    localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    localStorage.setItem('inProgressRecipes', JSON.stringify([]));

    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/perfil'] });

    userEvent.click(screen.getByTestId(logoutButton));

    expect(localStorage.getItem('user')).toBe(null);
    expect(localStorage.getItem('mealsToken')).toBe(null);
    expect(localStorage.getItem('cocktailsToken')).toBe(null);
    expect(localStorage.getItem('doneRecipes')).toBe(null);
    expect(localStorage.getItem('favoriteRecipes')).toBe(null);
    expect(localStorage.getItem('inProgressRecipes')).toBe(null);

    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });
});

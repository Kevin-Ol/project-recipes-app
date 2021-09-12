import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';
import drinksIcon from '../images/drinkIcon.svg';
import exploreIcon from '../images/exploreIcon.svg';
import mealIcon from '../images/mealIcon.svg';

const drinksButton = 'drinks-bottom-btn';
const exploreButton = 'explore-bottom-btn';
const foodButton = 'food-bottom-btn';
const loading = 'Loading...';

describe('19 - Verifica elementos do Footer', () => {
  it('Verifica existencia dos botões bebidas, explorar e comidas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    expect(screen.getByTestId(drinksButton)).toBeInTheDocument();
    expect(screen.getByTestId(exploreButton)).toBeInTheDocument();
    expect(screen.getByTestId(foodButton)).toBeInTheDocument();
  });
});

describe('20 - Verifica ícones footer', () => {
  it('Footer se footer renderiza ícones corretos', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    await waitForElementToBeRemoved(() => screen.queryByText(loading));

    expect(screen.getByTestId(drinksButton).firstChild)
      .toHaveProperty('src', `http://localhost/${drinksIcon}`);
    expect(screen.getByTestId(exploreButton).firstChild)
      .toHaveProperty('src', `http://localhost/${exploreIcon}`);
    expect(screen.getByTestId(foodButton).firstChild)
      .toHaveProperty('src', `http://localhost/${mealIcon}`);
  });
});

describe('21 - Verifica existencia do Footer de acordo com protótipo', () => {
  const hasFooter = () => {
    expect(screen.getByTestId(drinksButton)).toBeInTheDocument();
    expect(screen.getByTestId(exploreButton)).toBeInTheDocument();
    expect(screen.getByTestId(foodButton)).toBeInTheDocument();
  };

  const hasNoFooter = () => {
    expect(screen.queryByTestId(drinksButton)).not.toBeInTheDocument();
    expect(screen.queryByTestId(exploreButton)).not.toBeInTheDocument();
    expect(screen.queryByTestId(foodButton)).not.toBeInTheDocument();
  };

  it('Não há Footer na tela de login', () => {
    renderWithRouterAndRedux(<App />);
    hasNoFooter();
  });

  it('Footer com ícones corretos na tela principal de receitas de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas'] });
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    hasFooter();
  });

  it('Footer com ícones corretos na tela principal de receitas de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/bebidas'] });
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    hasFooter();
  });

  it('Não há Footer na tela de detalhes de receita de comida em progresso', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas/52771/in-progress'] });
    hasNoFooter();
  });

  it('Não há Footer na tela de detalhes de receita de bebida em progresso', () => {
    renderWithRouterAndRedux(<App />,
      { initialEntries: ['/bebidas/178319/in-progress'] });
    hasNoFooter();
  });

  it('Não há Footer na tela de detalhes de receita de comida', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/comidas/52771'] });
    hasNoFooter();
  });

  it('Não há Footer na tela de detalhes de receita de bebida', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/bebidas/178319'] });
    hasNoFooter();
  });

  it('Footer com ícones corretos na tela de explorar', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/explorar'] });
    hasFooter();
  });

  it('Footer com ícones corretos na tela de explorar comidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/explorar/comidas'] });
    hasFooter();
  });

  it('Footer com ícones corretos na tela de explorar bebidas', () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/explorar/bebidas'] });
    hasFooter();
  });

  it('Footer com ícones corretos na tela de explorar comidas por ingrediente',
    async () => {
      renderWithRouterAndRedux(<App />,
        { initialEntries: ['/explorar/comidas/ingredientes'] });
      await waitForElementToBeRemoved(() => screen.queryByText(loading));
      hasFooter();
    });

  it('Footer com ícones corretos na tela de explorar bebidas por ingrediente',
    async () => {
      renderWithRouterAndRedux(<App />,
        { initialEntries: ['/explorar/bebidas/ingredientes'] });
      await waitForElementToBeRemoved(() => screen.queryByText(loading));
      hasFooter();
    });

  it('Footer com ícones corretos na tela de explorar por local de origem', async () => {
    renderWithRouterAndRedux(<App />,
      { initialEntries: ['/explorar/comidas/area'] });
    await waitForElementToBeRemoved(() => screen.queryByText(loading));
    hasFooter();
  });

  it('Footer com ícones corretos na tela de perfil', () => {
    renderWithRouterAndRedux(<App />,
      { initialEntries: ['/perfil'] });
    hasFooter();
  });

  it('Footer com ícones corretos na tela de receitas favoritas', () => {
    renderWithRouterAndRedux(<App />,
      { initialEntries: ['/receitas-favoritas'] });
    hasNoFooter();
  });

  it('Footer com ícones corretos na tela de receitas feitas', () => {
    renderWithRouterAndRedux(<App />,
      { initialEntries: ['/receitas-feitas'] });
    hasNoFooter();
  });
});

describe('22 - Redireciona ao clicar no ícone de bebidas', () => {
  it('Redireciona para a rota de bebidas', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/comidas'] });
    userEvent.click(await screen.findByTestId(drinksButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/bebidas');
  });
});

describe('23 - Redireciona ao clicar no ícone de explorar', () => {
  it('Redireciona para a rota de explorar', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/comidas'] });
    userEvent.click(await screen.findByTestId(exploreButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/explorar');
  });
});

describe('24 - Redireciona ao clicar no ícone de comidas', () => {
  it('Redireciona para a rota de comidas', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: ['/bebidas'] });
    userEvent.click(await screen.findByTestId(foodButton));
    const { pathname } = history.location;
    expect(pathname).toBe('/comidas');
  });
});

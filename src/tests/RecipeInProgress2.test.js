import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import App from '../App';

const finishButton = 'finish-recipe-btn';
const firstIngredientStep = '0-ingredient-step';

const mealPage = '/comidas/52771/in-progress';
const drinkPage = '/bebidas/178319/in-progress';

describe('52 - Verifica funcionalidade botão finalizar receita', () => {
  beforeEach(() => localStorage.clear());

  it('Botão inicia desabilitado na página de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkbox = screen.getByTestId(firstIngredientStep).firstChild;
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeDisabled();
  });

  it('Botão inicia desabilitado na página de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkbox = screen.getByTestId(firstIngredientStep).firstChild;
    userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeDisabled();
  });

  it('Botão é habilitado após clicar em todos os checkbox de comida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [mealPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      const checkbox = screen.getByTestId(`${index}-ingredient-step`).firstChild;
      userEvent.click(checkbox);
    });
    expect(screen.getByTestId(firstIngredientStep).firstChild).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeEnabled();
  });

  it('Botão é habilitado após clicar em todos os checkbox de bebida', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      const checkbox = screen.getByTestId(`${index}-ingredient-step`).firstChild;
      userEvent.click(checkbox);
    });
    expect(screen.getByTestId(firstIngredientStep).firstChild).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeEnabled();
  });
});

describe('53 - Clicar em finalizar receita redireciona para receitas feitas', () => {
  beforeEach(() => localStorage.clear());

  it('Redireciona corretamente na página de comidas', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [mealPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      const checkbox = screen.getByTestId(`${index}-ingredient-step`).firstChild;
      userEvent.click(checkbox);
    });
    expect(screen.getByTestId(firstIngredientStep).firstChild).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeEnabled();
    userEvent.click(screen.getByTestId(finishButton));

    const { pathname } = history.location;
    expect(pathname).toBe('/receitas-feitas');
  });

  it('Redireciona corretamente na página de bebidas', async () => {
    const { history } = renderWithRouterAndRedux(<App />,
      { initialEntries: [drinkPage] });

    expect(await screen.findByTestId(finishButton)).toBeDisabled();
    const checkboxItems = screen.getAllByRole('checkbox');
    checkboxItems.forEach((item, index) => {
      const checkbox = screen.getByTestId(`${index}-ingredient-step`).firstChild;
      userEvent.click(checkbox);
    });
    expect(screen.getByTestId(firstIngredientStep).firstChild).toBeChecked();
    expect(screen.getByTestId(finishButton)).toBeEnabled();
    userEvent.click(screen.getByTestId(finishButton));

    const { pathname } = history.location;
    expect(pathname).toBe('/receitas-feitas');
  });
});

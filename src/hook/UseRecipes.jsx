import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { requestDefault } from '../redux/actions/fetchActions';

const UseRecipes = () => {
  const recipes = useSelector((state) => state.meals.recipes);
  const maxItensIndexOnScreen = 12;
  const dispatch = useDispatch();

  const fetchDefault = useCallback((path) => dispatch(requestDefault(path)), [dispatch]);

  const chooser = useCallback((path) => {
    if (recipes.meals === null || recipes.drinks === null) {
      global.alert('Sinto muito, não encontramos nenhuma receita para esses filtros.');
      fetchDefault(path);
    }
  }, [fetchDefault, recipes.drinks, recipes.meals]);

  const setDefault = useCallback(() => {
    if (recipes.meals) {
      return recipes.meals.slice(0, maxItensIndexOnScreen).map((e, index) => (
        <Link key={ e.idMeal } to={ `/comidas/${e.idMeal}` }>
          <RecipeCard index={ index } recipe={ e } />
        </Link>));
    } if (recipes.drinks) {
      return recipes.drinks.slice(0, maxItensIndexOnScreen).map((e, index) => (
        <Link key={ e.idDrink } to={ `/bebidas/${e.idDrink}` }>
          <RecipeCard index={ index } recipe={ e } />
        </Link>));
    }
  }, [recipes.drinks, recipes.meals]);
  return { chooser, setDefault };
};

export default UseRecipes;

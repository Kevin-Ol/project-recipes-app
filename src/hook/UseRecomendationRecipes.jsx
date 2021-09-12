import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecomendationCard } from '../components';

const UseRecomendationRecipes = (type) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAPI = async () => {
      let result = [];
      if (type === 'meals') {
        result = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        result = await result.json();
      }
      if (type === 'drinks') {
        result = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        result = await result.json();
      }
      if (isMounted) setRecipes(result);
    };
    fetchAPI();
    return () => { isMounted = false; };
  }, [type]);

  const maxItensIndexOnScreen = 6;
  if (recipes.meals) {
    return recipes.meals.slice(0, maxItensIndexOnScreen).map((e, index) => (
      <Link key={ e.idMeal } to={ `/comidas/${e.idMeal}` }>
        <RecomendationCard index={ index } recipe={ e } />
      </Link>));
  } if (recipes.drinks) {
    return recipes.drinks.slice(0, maxItensIndexOnScreen).map((e, index) => (
      <Link key={ e.idDrink } to={ `/bebidas/${e.idDrink}` }>
        <RecomendationCard index={ index } recipe={ e } />
      </Link>));
  }

  return recipes;
};

export default UseRecomendationRecipes;

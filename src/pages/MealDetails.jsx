import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import { RecipeDetails } from '../components';
import UseRecomendationRecipes from '../hook/UseRecomendationRecipes';
import { DatailsMain } from '../UI globalStyles';

function MealDetails({ match: { params: { id } } }) {
  const dispatch = useDispatch();
  const [recipe, setRecipe] = useState(undefined);
  const recomendation = UseRecomendationRecipes('drinks');

  useEffect(() => {
    let isMounted = true;
    const fetchRecipe = async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const result = await response.json();
      const details = result.meals || result.drinks;
      if (isMounted) setRecipe(details[0]);
    };
    dispatch({ type: 'CLEAR' });
    fetchRecipe();
    return () => { isMounted = false; };
  }, [id, dispatch]);

  return (
    <DatailsMain>
      { recipe && <RecipeDetails key={ recipe.idMeal } recipe={ recipe } type="Meal" />}
      <section className="horizontal-slider">
        {recomendation}
      </section>
    </DatailsMain>
  );
}

MealDetails.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }),
  }).isRequired,
};

export default MealDetails;

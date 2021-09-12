import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';
import { RecipeDetails } from '../components';
import { DatailsMain } from '../UI globalStyles';
import UseRecomendationRecipes from '../hook/UseRecomendationRecipes';

function DrinkDetails({ match: { params: { id } } }) {
  const dispatch = useDispatch();
  const [recipe, setRecipe] = useState(undefined);
  const recomendation = UseRecomendationRecipes('meals');

  useEffect(() => {
    let isMounted = true;
    const fetchRecipe = async () => {
      const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
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
      { recipe && <RecipeDetails key={ recipe.idDrink } recipe={ recipe } type="Drink" />}
      <section className="horizontal-slider">
        {recomendation}
      </section>
    </DatailsMain>
  );
}

DrinkDetails.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }),
  }).isRequired,
};

export default DrinkDetails;

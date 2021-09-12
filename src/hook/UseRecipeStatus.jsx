import { useSelector } from 'react-redux';

function UseRecipeStatus(recipe, type) {
  const progressRecipes = useSelector((state) => state.inProgressRecipes);
  const doneRecipes = useSelector((state) => state.doneRecipes);
  const progressKey = (type === 'Meal') ? 'meals' : 'cocktails';
  const doneKey = (type === 'Meal') ? 'comida' : 'bebida';
  const allProgressIds = Object.keys(progressRecipes[progressKey]);
  const recipeInProgress = allProgressIds
    .some((recipeId) => recipe[`id${type}`] === recipeId);
  const recipeIsDone = doneRecipes.some((done) => (
    done.type === doneKey && recipe[`id${type}`] === done.id));
  return { recipeInProgress, recipeIsDone };
}

export default UseRecipeStatus;

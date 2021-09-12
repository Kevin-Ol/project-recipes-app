import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { changeFilterType } from '../../../redux/actions/filterAction';
import { requestByCategory, requestDefault } from '../../../redux/actions/fetchActions';
import { CategoryButtons } from '../styles';

function CategoryButton({ category, path, selected, select }) {
  const dispatch = useDispatch();

  function handleClick(categoryName) {
    if (selected === categoryName) {
      dispatch(changeFilterType(''));
      dispatch(requestDefault(path));
      select('');
    } else {
      dispatch(changeFilterType(''));
      dispatch(requestByCategory(categoryName, path));
      select(categoryName);
    }
  }
  return (
    <CategoryButtons
      Selected={ selected === category }
      type="button"
      value={ category }
      data-testid={ `${category}-category-filter` }
      onClick={ () => handleClick(category) }
    >
      { `${category}` }
    </CategoryButtons>);
}

CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  selected: PropTypes.string,
  select: PropTypes.func.isRequired,
};

CategoryButton.defaultProps = {
  selected: 'none',
};

export default CategoryButton;

import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';

import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    console.log("Rendering ingrediends")
  })

  const addIngredientHandler = (ingredient) => {
    fetch("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    }).then(response => {
      return response.json()
    }).then(responseData => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        {
          id: responseData.name,
          ...ingredient
        }
      ]);
    })
  }

  const filteredIngrediendsLoadedHandler = useCallback((loadedIngredients) => {
    setIngredients(loadedIngredients);
  }, [setIngredients])

  const removeIngredientHandler = (id) => {
    setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
  }

  return (
    <div className="App">
      <IngredientForm onIngredientAdded={addIngredientHandler} />
      <section>
        <Search onLoadedIngredients={filteredIngrediendsLoadedHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;

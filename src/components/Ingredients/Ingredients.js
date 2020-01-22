import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from "../UI/ErrorModal"

import Search from './Search';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Rendering ingrediends")
  })

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    }).then(response => {
      setIsLoading(false);
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
    setIsLoading(true);
    fetch(`https://react-hooks-project-dd726.firebaseio.com/ingrediends/${id}.jsson`, {
      method: "DELETE"
    }).then(response =>{
      setIsLoading(false);
      setIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
    }).catch(error =>{
      setError(error);
    })
  }

  const clearError = () =>{
    setIsLoading(false);
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error.message}</ErrorModal>}
      <IngredientForm onIngredientAdded={addIngredientHandler} isLoading={isLoading}/>
      <section>
        <Search onLoadedIngredients={filteredIngrediendsLoadedHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;

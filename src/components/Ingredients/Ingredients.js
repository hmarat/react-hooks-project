import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from "../UI/ErrorModal"
import Search from './Search';
import useHttp from "../../hooks/http"

const ingredientsReducer = (ingredients, action) => {
  switch (action.type) {
    case "SET": return action.ingrediends
    case "ADD": return [...ingredients, action.ingrediend]
    case "DELETE": return ingredients.filter(ing => ing.id !== action.id)
    default: throw new Error()
  }
}

function Ingredients() {
  const [ingredients, dispatchIngredients] = useReducer(ingredientsReducer, []);
  const { loading, error, data, sendRequest, extra, identifier, clear } = useHttp();

  useEffect(() => {
    if (identifier === "ADD_INGREDIENT" && !loading && !error) {
      dispatchIngredients({ type: "ADD", ingrediend: { id: data.name, ...extra } });
    } else if (identifier === "REMOVE_INGREDIENT" && !loading && !error) {
      dispatchIngredients({ type: "DELETE", id: extra })
    }
  }, [loading, data, extra, error, identifier])

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json", "POST", JSON.stringify(ingredient),
      ingredient, "ADD_INGREDIENT");
  }, [sendRequest])

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://react-hooks-project-dd726.firebaseio.com/ingrediends/${id}.json`, "DELETE", null, id, "REMOVE_INGREDIENT")
  }, [sendRequest])

  const filteredIngrediendsLoadedHandler = useCallback((loadedIngredients) => {
    dispatchIngredients({ type: "SET", ingrediends: loadedIngredients })
  }, [dispatchIngredients])

  const ingredientsComponent = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onIngredientAdded={addIngredientHandler} isLoading={loading} />
      <section>
        <Search onLoadedIngredients={filteredIngrediendsLoadedHandler} />
        {ingredientsComponent}
      </section>
    </div>
  );
}

export default Ingredients;

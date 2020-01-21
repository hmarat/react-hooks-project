import React, { useEffect, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filteredText, setFilteredText] = useState("");
  const { onLoadedIngredients } = props;

  useEffect(() => {
    const query = filteredText.length !== 0
      ? `?orderBy="title"&equalTo="${filteredText}"`
      : "";
    fetch("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json" + query)
      .then(response => response.json())
      .then(ingredients => {
        const loadedIngredients = [];
        for (let key in ingredients) {
          loadedIngredients.push({ id: key, title: ingredients[key].title, amount: ingredients[key].amount })
        }
        onLoadedIngredients(loadedIngredients);
      })
  }, [filteredText, onLoadedIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={filteredText} onChange={(evt) => { setFilteredText(evt.target.value) }} />
        </div>
      </Card>
    </section>
  );
});

export default Search;

import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filteredText, setFilteredText] = useState("");
  const inputRef = useRef();
  const { onLoadedIngredients } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(filteredText === inputRef.current.value){
        fetch("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json" + query)
          .then(response => response.json())
          .then(ingredients => {
        const loadedIngredients = [];
        for (let key in ingredients) {
          loadedIngredients.push({ id: key, title: ingredients[key].title, amount: ingredients[key].amount })
        }
        onLoadedIngredients(loadedIngredients);
      })
      }
    }, 500);
    const query = filteredText.length !== 0
      ? `?orderBy="title"&equalTo="${filteredText}"`
      : "";
      return () => clearTimeout(timer);
  }, [filteredText, onLoadedIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={filteredText} onChange={(evt) => { setFilteredText(evt.target.value) }} ref={inputRef}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
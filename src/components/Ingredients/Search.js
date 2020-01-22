import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from "../../hooks/http"
import ErrorModal from "../UI/ErrorModal"

const Search = React.memo(props => {
  const [filteredText, setFilteredText] = useState("");
  const inputRef = useRef();
  const { onLoadedIngredients } = props;
  const { loading, error, data, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = filteredText.length !== 0
        ? `?orderBy="title"&equalTo="${filteredText}"`
        : "";
      if (filteredText === inputRef.current.value) {
        sendRequest("https://react-hooks-project-dd726.firebaseio.com/ingrediends.json" + query, "GET");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filteredText, sendRequest, inputRef])

  useEffect(() => {
    if (!loading && !error && data) {
      const loadedIngredients = [];
      for (let key in data) {
        loadedIngredients.push({ id: key, title: data[key].title, amount: data[key].amount })
      }
      onLoadedIngredients(loadedIngredients);
    }
  }, [data, error, loading, onLoadedIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <p>Loading...</p>}
          <input type="text" value={filteredText} onChange={(evt) => { setFilteredText(evt.target.value) }} ref={inputRef} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
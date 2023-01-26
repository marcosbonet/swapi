import "./App.css";

import { useState, useEffect, useRef } from "react";
import { getCharacter, getPeople, searchCharacter } from "./api/people";

function App() {
  const inputSearch = useRef(null);
  const [people, setPeople] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [detail, setDetail] = useState({});
  const [textSearch, setTextSearch] = useState("");
  const [errorState, setErrorState] = useState({ hasError: false });
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPeople(page).then(setPeople).catch(handleError);
  }, [page]);

  useEffect(() => {
    getCharacter(currentCharacter).then(setDetail).catch(handleError);
  }, [currentCharacter]);

  const handleError = (err) => {
    setErrorState({ hasError: true, message: err.message });
  };

  const showDetail = (character) => {
    const id = Number(character.url.split("/").slice(-2)[0]);
    setCurrentCharacter(id);
  };

  const onChangeTextSearch = (event) => {
    event.preventDefault();
    const text = inputSearch.current.value;
    setTextSearch(text);
  };

  const onSearchSubmit = (event) => {
    if (event.key !== "Enter") return;
    inputSearch.current.value = "";
    setDetail({});
    searchCharacter(textSearch).then(setPeople).catch(handleError);
  };

  const onChangePage = (next) => {
    if (!people.previus && page + next <= 0) return;
    if (!people.next && page + next >= 9) return;
    setPage(page + next);
  };

  return (
    <div>
      <input
        ref={inputSearch}
        onChange={onChangeTextSearch}
        onKeyDown={onSearchSubmit}
        type="text"
        placeholder="Search a character"
      ></input>
      <ul>
        {errorState.hasError && <div>{errorState.message}</div>}
        {people?.results?.map((character) => (
          <li key={character.name} onClick={() => showDetail(character)}>
            {character.name}
          </li>
        ))}
      </ul>
      <section>
        <button onClick={() => onChangePage(-1)}>Prev</button>| {page} |
        <button onClick={() => onChangePage(+1)}>Next</button>
      </section>
      {detail && (
        <aside>
          <h1>{detail.name}</h1>
          <ul>
            <li>height: {detail.height}</li>
            <li>mass: {detail.mass}</li>
            <li>Year of birth: {detail.birth_year}</li>
          </ul>
        </aside>
      )}
    </div>
  );
}

export default App;

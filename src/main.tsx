import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { NavigationBar } from './modules/NavigationBar';
import { modal } from './modules/modal';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import './css/search.css';

function App() {
  // NavigationBar
  const [homeButtonColor, setHomeButtonColor] = useState('#dc3545');
  const [libraryButtonColor, setLibraryButtonColor] = useState('transparent');

  // Content
  const [content, setContent] = useState("HOMEPAGE");

  // Movie
  const [movie, setMovie] = useState(undefined); // Will contain all the movie details

  // Modal
  const [modalShow, setModalShow] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(1); // Current season
  const [seasonName, setSeasonName] = useState(""); // Current season

  let GLOBALS = {
    GETTERS: {
      homeButtonColor,
      libraryButtonColor,
      content,
      movie,
      modalShow,
      seasonNumber,
      seasonName
    },
    SETTERS: {
      setHomeButtonColor,
      setLibraryButtonColor,
      setContent,
      setMovie,
      setModalShow,
      setSeasonNumber,
      setSeasonName
    }
  };

  // Return 
  return (
    <>
      {NavigationBar(GLOBALS)}
      {content}
      {modal(GLOBALS)}
      <div id='endFooter'></div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

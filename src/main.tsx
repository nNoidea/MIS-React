import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { NavigationBar } from "./modules/NavigationBar";
import { MyModal } from "./modules/modal";
import { red } from "./modules/colorPallete";
import "./css/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "./css/search.css";
import { Homepage } from "./modules/homepage";

function App() {
    // NavigationBar
    const [homeButtonColor, setHomeButtonColor] = useState(red);
    const [libraryButtonColor, setLibraryButtonColor] = useState("transparent");

    // Content
    const [content, setContent] = useState(Homepage());

    // Movie
    const [movie, setMovie] = useState(undefined); // Will contain all the movie details

    // Modal
    const [modalShow, setModalShow] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState(1); // Current season
    const [seasonName, setSeasonName] = useState(""); // Current season
    const [addLibraryButtonColor, setAddLibraryButtonColor] = useState(red); // Current season

    let GLOBALS = {
        GETTERS: {
            homeButtonColor,
            libraryButtonColor,
            content,
            movie,
            modalShow,
            seasonNumber,
            seasonName,
            addLibraryButtonColor,
        },
        SETTERS: {
            setHomeButtonColor,
            setLibraryButtonColor,
            setContent,
            setMovie,
            setModalShow,
            setSeasonNumber,
            setSeasonName,
            setAddLibraryButtonColor,
        },
    };

    // Return
    return (
        <>
            {NavigationBar(GLOBALS)}
            {content}
            {MyModal(GLOBALS)}
            <div id="endFooter"></div>
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

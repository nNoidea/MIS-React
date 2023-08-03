import "./css/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "./css/search.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { NavigationBar } from "./modules/NavigationBar";
import { MyModal } from "./modules/MyModal";
import { red } from "./modules/colorPallete";
import { preload as preload } from "./modules/preload";
import { Globals } from "./interfaces/interfaces";
import { LoadingScreen } from "./modules/LoadingScreen";

function App() {
    // NavigationBar
    const [homeButtonColor, setHomeButtonColor] = useState(red);
    const [libraryButtonColor, setLibraryButtonColor] = useState("transparent");

    // Content
    const [content, setContent] = useState(<></>);
    // Movie
    const [media, setMedia] = useState(undefined); // Will contain all the movie details

    // Modal
    const [modalShow, setModalShow] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState(1);
    const [seasonName, setSeasonName] = useState("");
    const [addLibraryButtonColor, setAddLibraryButtonColor] = useState(red);
    const [addWatchedButtonColor, setAddWatchedButtonColor] = useState(red);
    const [preloaded, setPreloaded] = useState(false);
    const [homepageContent, setHomepageContent] = useState(<></>);

    let GLOBALS: Globals = {
        GETTERS: {
            homeButtonColor,
            libraryButtonColor,
            content,
            media,
            modalShow,
            seasonNumber,
            seasonName,
            addLibraryButtonColor,
            addWatchedButtonColor,
            preloaded,
            homepageContent,
        },
        SETTERS: {
            setHomeButtonColor,
            setLibraryButtonColor,
            setContent,
            setMedia,
            setModalShow,
            setSeasonNumber,
            setSeasonName,
            setAddLibraryButtonColor,
            setAddWatchedButtonColor,
            setPreloaded,
            setHomepageContent,
        },
    };

    // Preload
    useEffect(() => {
        preload(GLOBALS);
    }, []);

    // When everything is preloaded, set the content to the homepage
    useEffect(() => {
        setContent(homepageContent);
    }, [homepageContent]);

    if (preloaded) {
        return (
            <>
                {NavigationBar(GLOBALS)}
                {content}
                {MyModal(GLOBALS)}
                <div id="endFooter"></div>
            </>
        );
    } else {
        // Load Screen
        return LoadingScreen();
    }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

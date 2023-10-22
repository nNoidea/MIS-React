import "bootstrap/dist/css/bootstrap.css";
import "./css/General.css";
import "./css/search.css";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { NavigationBar } from "./modules/NavigationBar";
import { MyModal } from "./modules/MediaModal";
import { red } from "./modules/colorPallete";
import { Globals } from "./interfaces/interfaces";
import { LoadingScreen } from "./modules/LoadingScreen";
import { LoginModal } from "./modules/LoginModal";
import { preload } from "./modules/preload";

function App() {
    // NavigationBar
    const [homeButtonColor, setHomeButtonColor] = useState(red);
    const [libraryButtonColor, setLibraryButtonColor] = useState("transparent");

    // Content
    const [content, setContent] = useState(<></>);
    // Movie
    const [media, setMedia] = useState(undefined); // Will contain all the movie details

    // Modal
    const [mediaModalShow, setMediaModalShow] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState(1);
    const [seasonName, setSeasonName] = useState("");
    const [addLibraryButtonColor, setAddLibraryButtonColor] = useState(red);
    const [addWatchedButtonColor, setAddWatchedButtonColor] = useState(red);
    const [preloaded, setPreloaded] = useState(false);
    const [homepageContent, setHomepageContent] = useState(<></>);

    // Login
    const [loginModalShow, setLoginModalShow] = useState(false);

    // Create a ref object to store the buttonColor state
    const buttonColorRef = useRef(libraryButtonColor);

    // Update the ref object whenever the buttonColor state changes
    useEffect(() => {
        buttonColorRef.current = libraryButtonColor;
    }, [libraryButtonColor]);

    let GLOBALS: Globals = {
        GETTERS: {
            homeButtonColor,
            libraryButtonColor,
            content,
            media,
            mediaModalShow,
            seasonNumber,
            seasonName,
            addLibraryButtonColor,
            addWatchedButtonColor,
            preloaded,
            homepageContent,
            loginModalShow,
            buttonColorRef,
        },
        SETTERS: {
            setHomeButtonColor,
            setLibraryButtonColor,
            setContent,
            setMedia,
            setMediaModalShow,
            setSeasonNumber,
            setSeasonName,
            setAddLibraryButtonColor,
            setAddWatchedButtonColor,
            setPreloaded,
            setHomepageContent,
            setLoginModalShow,
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
        // Preload is in the GLOBALS
        return (
            <>
                {NavigationBar(GLOBALS)}
                {content}
                {MyModal(GLOBALS)}
                {LoginModal(GLOBALS)}
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

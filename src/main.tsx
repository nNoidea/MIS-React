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

    // When we pass a useState to a function, it will be passed by value, not by reference.
    // This means that once a function gets this useState as a parameter, it won't update when the useState updates until the function is called again with the updated useState (which is what React does for us). However what if we pass a useState to a function that takes a long time finish, but we update the useState in the meantime? The function will still use the old useState while it's running.
    // To fix this we can use a ref object. A ref object is like a pointer to a memory adress. So when we change the value in that memory adress, the ref object will still point to that memory adress and will thus have the updated value.
    // However, this update won't cause a rerender on it's own (useStates cuase rerenders). But that's okay because we can still force that manually ourselves.
    // We first create a ref object with the value of the useState.
    const buttonColorRef = useRef(libraryButtonColor);

    // Then we update the ref object when the useState updates. We are not pointing at the useState, the ref object has it's own unique adress in memory that it points to, but we change the value in that adress.
    // That's why we need to update the ref object when the useState updates.
    // This main.tsx file gets much faster updated with the new useState than the functions that take long to execute. So in this file we will always have the updated useState, that's why we update the ref object here.
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

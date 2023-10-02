import { setupSearchResults } from "./searchResults";
import Button from "react-bootstrap/Button";
import { red } from "./colorPallete";
import { setupLibraryPage } from "./librarypage";
import { Globals } from "../interfaces/interfaces";
import "../css/NavigationBar.css";

export function NavigationBar(GLOBALS: Globals) {
    const { homeButtonColor, libraryButtonColor, homepageContent } = GLOBALS.GETTERS;
    const { setHomeButtonColor, setLibraryButtonColor, setContent, setLoginModalShow } = GLOBALS.SETTERS;

    // Home Button
    function HomeButton() {
        return (
            <Button
                className="button"
                style={{ backgroundColor: homeButtonColor }}
                onClick={() => {
                    setHomeButtonColor(red);
                    setLibraryButtonColor("transparent");

                    setContent(homepageContent);
                }}
            >
                🏠Home
            </Button>
        );
    }

    // Library Button
    function LibraryButton() {
        return (
            <Button
                className="button"
                style={{ backgroundColor: libraryButtonColor }}
                onClick={() => {
                    setHomeButtonColor("transparent");
                    setLibraryButtonColor(red);
                    setupLibraryPage(GLOBALS);
                }}
            >
                📁Library
            </Button>
        );
    }

    // SearchBar
    function SearchBar() {
        return (
            <input
                type="text"
                placeholder="🔍Search"
                onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                        setLibraryButtonColor("transparent");
                        setHomeButtonColor("transparent");

                        let searchQuery = e.currentTarget.value;
                        let gridItems = <></>;
                        let currentPage = 1;

                        // Generate html elements based on the movielist.
                        await setupSearchResults(GLOBALS, gridItems, searchQuery, currentPage);
                    }
                }}
            />
        );
    }

    function LoginButton() {
        return (
            <Button
                id="loginButton"
                className="button"
                style={{ backgroundColor: "transparent"}}
                onClick={() => {
                    setHomeButtonColor("transparent");
                    setLibraryButtonColor("transparent");
                    setLoginModalShow(true);
                }}
            >
                🔒
            </Button>
        );
    }

    return (
        <div className="NavigationBar">
            <HomeButton />
            <LibraryButton />
            <LoginButton />
            <SearchBar />
        </div>
    );
}

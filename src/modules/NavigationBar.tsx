import { setupSearchResults } from "./searchResults";
import Button from "react-bootstrap/Button";
import { red } from "./colorPallete";
import { setupLibraryPage } from "./librarypage";
import { Homepage } from "./homepage";

export function NavigationBar(GLOBALS: any) {
    const { homeButtonColor, libraryButtonColor } = GLOBALS.GETTERS;
    const { setHomeButtonColor, setLibraryButtonColor, setContent } = GLOBALS.SETTERS;

    // Home Button
    function HomeButton() {
        return (
            <Button
                className="button"
                style={{ backgroundColor: homeButtonColor }}
                onClick={() => {
                    setHomeButtonColor(red);
                    setLibraryButtonColor("transparent");
                    setContent(Homepage(GLOBALS));
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

    return (
        <div className="NavigationBar">
            <HomeButton />
            <LibraryButton />
            <SearchBar />
        </div>
    );
}

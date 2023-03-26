import { createResultPage } from "./searchResults";
import Button from "react-bootstrap/Button";
import { loadLibrary } from "./library";
import { red } from "./colorPallete";

export function NavigationBar(GLOBALS: any) {
    const { homeButtonColor, libraryButtonColor } = GLOBALS.GETTERS;
    const { setHomeButtonColor, setLibraryButtonColor, setContent } = GLOBALS.SETTERS;

    // Home Button
    function HomeButton() {
        function handleHomeClick() {
            setHomeButtonColor(red);
            setLibraryButtonColor("transparent");
        }

        return (
            <Button
                className="button"
                style={{ backgroundColor: homeButtonColor }}
                onClick={() => {
                    handleHomeClick();
                    setContent("HOMEPAGE");
                }}
            >
                🏠Home
            </Button>
        );
    }

    // Library Button

    function LibraryButton() {
        function handleLibraryClick() {
            setHomeButtonColor("transparent");
            setLibraryButtonColor(red);
        }

        return (
            <Button
                className="button"
                style={{ backgroundColor: libraryButtonColor }}
                onClick={() => {
                    handleLibraryClick();
                    loadLibrary(GLOBALS);
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
                        await createResultPage(GLOBALS, gridItems, searchQuery, currentPage);
                    }
                }}
            />
        );
    }

    return (
        <div className="topnav">
            <HomeButton />
            <LibraryButton />
            <SearchBar />
        </div>
    );
}

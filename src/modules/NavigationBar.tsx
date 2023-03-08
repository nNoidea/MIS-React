import { createResultPage } from './searchResults';
import Button from 'react-bootstrap/Button';

export function NavigationBar(GLOBALS: any) {
  // Home Button
  function HomeButton() {
    function handleHomeClick() {
      GLOBALS.SETTERS.setHomeButtonColor('#dc3545');
      GLOBALS.SETTERS.setLibraryButtonColor('transparent');
    }

    return (
      <Button
        className="button"
        style={{ backgroundColor: GLOBALS.GETTERS.homeButtonColor }}
        onClick={() => {
          handleHomeClick();
          GLOBALS.SETTERS.setContent("HOMEPAGE");
        }}
      >
        🏠Home
      </Button>
    );
  }

  // Library Button

  function LibraryButton() {
    function handleLibraryClick() {
      GLOBALS.SETTERS.setHomeButtonColor('transparent');
      GLOBALS.SETTERS.setLibraryButtonColor('#dc3545');
    }

    return (
      <Button
        className="button"
        style={{ backgroundColor: GLOBALS.GETTERS.libraryButtonColor }}
        onClick={() => {
          handleLibraryClick();
          GLOBALS.SETTERS.setContent("library");
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
        onKeyDown={(e) => onEnter(e)}
      />
    );
  }

  async function onEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      GLOBALS.SETTERS.setLibraryButtonColor("transparent");
      GLOBALS.SETTERS.setHomeButtonColor("transparent");

      let searchQuery = e.currentTarget.value;
      let gridItems = <></>;
      let currentPage = 1;

      // Generate html elements based on the movielist.
      await createResultPage(GLOBALS, gridItems, searchQuery, currentPage);
    }
  }

  return (
    <div className="topnav">
      <HomeButton />
      <LibraryButton />
      <SearchBar />
    </div>
  );
};
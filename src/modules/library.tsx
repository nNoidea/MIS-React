import { libraryGetAll } from "./indexedDB";
import { singlePageResults } from "./searchResults";

export async function setupLibraryPage(GLOBALS: any) {
    const { setContent } = GLOBALS.SETTERS;
    const movieArray = await libraryGetAll();

    await setContent(
        <>
            <div
                className="grid-container"
                id="searchResults"
            >
                {singlePageResults(GLOBALS, movieArray)}
            </div>
        </>
    );
}

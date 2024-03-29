import { Movie, TV } from "../classes/Media";
import { Globals } from "../interfaces/interfaces";
import { DBGetAll, objectStoreNameLibrary } from "./indexedDB";
import { GridItems } from "./searchResults";

export async function setupLibraryPage(GLOBALS: Globals) {
    const { setContent } = GLOBALS.SETTERS;
    const mediaArray = (await DBGetAll(objectStoreNameLibrary)).filter((media) => media.inLibrary);
    const movieArray = mediaArray.filter((media): media is Movie => media instanceof Movie);
    const movieArrayWatched = movieArray.filter((media) => media.watched).sort((a, b) => Number(b.releaseDate.substring(0, 4)) - Number(a.releaseDate.substring(0, 4)));
    const movieArrayUnwatched = movieArray.filter((media) => !media.watched).sort((a, b) => Number(b.releaseDate.substring(0, 4)) - Number(a.releaseDate.substring(0, 4)));
    const tvArray = mediaArray.filter((media) => media instanceof TV).sort((a, b) => Number(b.releaseDate.substring(0, 4)) - Number(a.releaseDate.substring(0, 4)));

    setContent(
        <>
            <h1 style={{ paddingLeft: "100px", paddingTop: "50px", color: "white" }}>Movies</h1>
            <div
                className="grid-container"
                id="searchResults"
            >
                {GridItems(GLOBALS, movieArrayUnwatched.concat(movieArrayWatched))}
            </div>
            <h1 style={{ paddingLeft: "100px", paddingTop: "50px", color: "white" }}>TV Shows</h1>
            <div
                className="grid-container"
                id="searchResults"
            >
                {GridItems(GLOBALS, tvArray)}
            </div>
        </>
    );
}

import { Movie } from "../classes/Movie";
import { steamHover, steamHoverLeave } from "./steamHover";
import { getSearchResults } from "../APIs/theMovieDatabase";
import Button from "react-bootstrap/Button";
import { libraryCheck, libraryGet } from "./indexedDB";
import { green, red } from "./colorPallete";
import { ReactNode } from "react";
import { Globals } from "../interfaces/interfaces";

export function GridItems(GLOBALS: Globals, movieArray: Movie[]) {
    let gridItems = <></>;

    for (let i = 0; i < movieArray.length; i++) {
        let movie = movieArray[i];
        let element = <></>;

        if (movie.poster != "NO-IMAGE") {
            element = (
                <div
                    data-bs-toggle="modal"
                    data-bs-target="#movieModal"
                    className="steamHover"
                    onMouseMove={steamHover}
                    onMouseOut={steamHoverLeave}
                    onClick={async () => {
                        await setModalInformation(GLOBALS, movie);
                    }}
                >
                    <img
                        src={movie.poster}
                        className="grid-item"
                    />
                </div>
            );
        }

        gridItems = (
            <>
                {gridItems}
                {element}
            </>
        );
    }

    return gridItems;

    async function setModalInformation(GLOBALS: Globals, movie: Movie) {
        const { setMovie, setSeasonNumber, setSeasonName, setAddLibraryButtonColor, setModalShow } = GLOBALS.SETTERS;

        if (await libraryCheck(movie.uniqueID)) {
            const libraryMovie = libraryGet(movie.uniqueID);
            if (libraryMovie != null) {
                movie = await libraryMovie;
            }
        }

        // Request the extra detail about the movie
        await movie.requestMovieDetails();
        await movie.requestSeasonDetails(1);

        if (movie.mediaType == "tv") {
            setSeasonNumber(1);
            setSeasonName(movie.seasons[1].name);
        }

        setMovie(movie);
        setModalShow(true);

        setAddLibraryButtonColor((await libraryCheck(movie.uniqueID)) ? green : red);
    }
}

export async function setupSearchResults(GLOBALS: Globals, oldItems: ReactNode, searchQuery: string, currentPage: number) {
    const { setContent } = GLOBALS.SETTERS;

    let movieList = await getSearchResults(searchQuery, currentPage);
    let gridItems = (
        <>
            {await oldItems}
            {GridItems(GLOBALS, movieList.movieArr)}
        </>
    );

    async function nextResults() {
        currentPage++;
        await setupSearchResults(GLOBALS, gridItems, searchQuery, currentPage);
    }

    let loadMoreButton = <></>;
    if (movieList.pages > currentPage) {
        loadMoreButton = (
            <div className="center">
                <Button
                    className="button loadMoreButton"
                    onClick={async () => await nextResults()}
                >
                    Load More Results
                </Button>
            </div>
        );
    }

    setContent(
        <>
            <div
                className="grid-container"
                id="searchResults"
            >
                {gridItems}
            </div>
            {loadMoreButton}
        </>
    );
}

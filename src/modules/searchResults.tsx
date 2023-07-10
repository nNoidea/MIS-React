import { steamHover, steamHoverLeave } from "./steamHover";
import { getSearchResults } from "../APIs/theMovieDatabase";
import { DBCheck, DBGet, objectStoreNameLibrary } from "./indexedDB";
import { green, lightBlue, red } from "./colorPallete";
import { ReactNode } from "react";
import { Globals } from "../interfaces/interfaces";
import { Movie, TV } from "../classes/Media";

export function GridItems(GLOBALS: Globals, mediaArray: (Movie | TV)[]) {
    let gridItems = <></>;

    for (let i = 0; i < mediaArray.length; i++) {
        let media = mediaArray[i];
        let element = <></>;

        if (media.poster != "NO-IMAGE") {
            element = (
                <div
                    data-bs-toggle="modal"
                    data-bs-target="#movieModal"
                    className="steamHover"
                    onMouseMove={steamHover}
                    onMouseOut={steamHoverLeave}
                    onClick={async () => {
                        await setModalInformation(GLOBALS, media);
                    }}
                >
                    <img
                        className="grid-item"
                        src={media.poster}
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

    async function setModalInformation(GLOBALS: Globals, media: Movie | TV) {
        const { setMedia, setSeasonNumber, setSeasonName, setAddLibraryButtonColor, setAddWatchedButtonColor, setModalShow } = GLOBALS.SETTERS;

        if (await DBCheck(objectStoreNameLibrary, media.uniqueID)) {
            const libraryMovie = DBGet(objectStoreNameLibrary, media.uniqueID);
            if (libraryMovie != null) {
                media = await libraryMovie;
            }
        }

        // Request the extra detail about the movie
        await media.requestDetails();

        if (media instanceof TV) {
            await media.requestSeasonDetails(1);
            setSeasonNumber(1);
            setSeasonName(media.seasons[1].name);
        } else {
            setAddWatchedButtonColor(media.watched ? green : red);
        }

        setMedia(media);
        setModalShow(true);

        setAddLibraryButtonColor(media.inLibrary ? green : red);
    }
}

export async function setupSearchResults(GLOBALS: Globals, oldItems: ReactNode, searchQuery: string, currentPage: number) {
    const { setContent } = GLOBALS.SETTERS;

    let movieList = await getSearchResults(searchQuery, currentPage);
    let gridItems = (
        <>
            {await oldItems}
            {GridItems(GLOBALS, movieList.mediaArray)}
        </>
    );

    async function nextResults() {
        currentPage++;
        await setupSearchResults(GLOBALS, gridItems, searchQuery, currentPage);
    }

    let loadMoreButton = <></>;
    if (movieList.pages > currentPage) {
        loadMoreButton = (
            <div
                data-bs-toggle="modal"
                data-bs-target="#movieModal"
                className="steamHover"
                onMouseMove={steamHover}
                onMouseOut={steamHoverLeave}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100% 100%"
                    width="100%"
                    height="100%"
                    className="grid-item"
                    onClick={async () => await nextResults()}
                >
                    <rect
                        width="100%"
                        height="100%"
                        fill={lightBlue}
                    />
                    <line
                        x1="30%"
                        y1="50%"
                        x2="70%"
                        y2="50%"
                        stroke="white"
                        strokeWidth="5"
                    />
                    <line
                        x1="50%"
                        y1="36.6%"
                        x2="50%"
                        y2="63.4%"
                        stroke="white"
                        strokeWidth="5"
                    />
                </svg>
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
                {loadMoreButton}
            </div>
        </>
    );
}

import { steamHover, steamHoverLeave } from "./steamHover";
import { getSearchResults } from "../APIs/theMovieDatabase";
import Button from "react-bootstrap/Button";
import { libraryCheck, libraryGet } from "./indexedDB";
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
        const { setMedia, setSeasonNumber, setSeasonName, setAddLibraryButtonColor, setModalShow } = GLOBALS.SETTERS;

        if (await libraryCheck(media.uniqueID)) {
            const libraryMovie = libraryGet(media.uniqueID);
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
        }

        setMedia(media);
        setModalShow(true);

        setAddLibraryButtonColor((await libraryCheck(media.uniqueID)) ? green : red);
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
                style={{ backgroundColor: lightBlue, borderRadius: "25px" }}
            >
                <img
                    className="grid-item"
                    onClick={async () => await nextResults()}
                    src="https://raw.githubusercontent.com/nNoidea/MIS-React/main/images/next.png"
                />
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

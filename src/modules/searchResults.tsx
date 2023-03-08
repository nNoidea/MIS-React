import { Movie, MovieList } from "../classes/Movie";
import { steamHover, steamHoverLeave } from "./steamHover";
import { getSearchResults } from "../Databases/theMovieDatabase";
import Button from 'react-bootstrap/Button';

export function singlePageResults(GLOBALS: any, movieList: MovieList,) {
    let gridItems = <></>;

    for (let i = 0; i < movieList.movieArr.length; i++) {
        let movie = movieList.movieArr[i];
        let element = <></>;
        if (movie.poster != "NO-IMAGE") {
            element = (
                <div data-bs-toggle="modal" data-bs-target="#movieModal" className="steamHover"
                    onMouseMove={steamHover} onMouseOut={steamHoverLeave}
                    onClick={async () => { await setModalInformation(GLOBALS, movie); }}
                ><img src={movie.poster} className="grid-item" /></div>
            );
        }
        gridItems = <>{gridItems}{element}</>;
    }

    return (gridItems);
};

async function setModalInformation(GLOBALS: any, movie: Movie) {
    // Request the extra detail about the movie
    await movie.requestMovieDetails();
    await movie.requestSeasonDetails(1);

    GLOBALS.SETTERS.setMovie(movie);

    if (movie.mediaType == "tv") {
        GLOBALS.SETTERS.setSeasonNumber(1);
        GLOBALS.SETTERS.setSeasonName(movie.seasons[1].name);
    }

    GLOBALS.SETTERS.setModalShow(true);
}

export async function createResultPage(GLOBALS: any, oldItems: any, searchQuery: string, currentPage: number) {
    let movieList = await getSearchResults(searchQuery, currentPage);
    let gridItems = <>{await oldItems}{singlePageResults(GLOBALS, movieList)}</>;

    async function nextResults() {
        currentPage++;
        await createResultPage(GLOBALS, gridItems, searchQuery, currentPage);
    }

    let loadMoreButton = <></>;
    if (movieList.pages > currentPage) {
        loadMoreButton = <div className="center"><Button className="button loadMoreButton" onClick={async () => await nextResults()} >Load More Results</Button></div>;
    }

    await GLOBALS.SETTERS.setContent(
        <>
            <div className="grid-container" id="searchResults">
                {gridItems}
            </div>
            {loadMoreButton}
        </>
    );
}


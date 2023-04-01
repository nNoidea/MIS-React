import { Badge } from "react-bootstrap";
import { trendingMedia, upcomingMovies } from "./preload";
import { GridItems } from "./searchResults";
import { red } from "./colorPallete";

export function Homepage(GLOBALS: any) {
    let upcomingMoviesGrid = GridItems(GLOBALS, upcomingMovies);
    let trendingMediaGrid = GridItems(GLOBALS, trendingMedia);

    let upcoming = (
        <>
            <h1 className="homepageTitle">
                <Badge
                    bg=""
                    style={{ backgroundColor: red }}
                >
                    📅New & Upcoming Movies
                </Badge>
            </h1>
            <div
                className="grid-container"
                id="searchResults"
            >
                {upcomingMoviesGrid}
            </div>
        </>
    );

    let popular = (
        <>
            <h1 className="homepageTitle">
                <Badge
                    bg=""
                    style={{ backgroundColor: red }}
                >
                    ✨Popular Movies & Series
                </Badge>
            </h1>
            <div
                className="grid-container"
                id="searchResults"
            >
                {trendingMediaGrid}
            </div>
        </>
    );

    return (
        <>
            {upcoming}
            {popular}
        </>
    );
}

import { Badge } from "react-bootstrap";
import { GridItems, LoadMoreButton } from "./searchResults";
import { red } from "./colorPallete";
import { ReactNode } from "react";
import { Globals } from "../interfaces/interfaces";
import { Movie, TV } from "../classes/Media";
import { getUpcomingMovies, upcomingMoviesTotalPages } from "./preload";
import "../css/Homepage.css";

let currentPage = 1;

export function Homepage(GLOBALS: Globals, upcomingMovies: Movie[], trendingMedia: (Movie | TV)[]) {
    let upcomingMoviesGrid = GridItems(GLOBALS, upcomingMovies);
    let trendingMediaGrid = GridItems(GLOBALS, trendingMedia);

    function generateHomepageSection(sectionTitle: string, gridItems: ReactNode, loadMoreButton: ReactNode | null) {
        return (
            <>
                <h1 id="homepageTitle">
                    <Badge
                        bg=""
                        style={{ backgroundColor: red }}
                    >
                        {sectionTitle}
                    </Badge>
                </h1>
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

    async function loadMoreFunctionUpcoming() {
        const { setHomepageContent } = GLOBALS.SETTERS;

        currentPage++;

        setHomepageContent(Homepage(GLOBALS, upcomingMovies.concat(await getUpcomingMovies(currentPage)), trendingMedia));
    }

    return (
        <>
            {generateHomepageSection("📅New & Upcoming Movies IS IT WORKING!?", upcomingMoviesGrid, LoadMoreButton(currentPage, upcomingMoviesTotalPages, loadMoreFunctionUpcoming))}
            {generateHomepageSection("✨Popular Movies & Series", trendingMediaGrid, null)}
        </>
    );
}

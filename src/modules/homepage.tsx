import { Badge } from "react-bootstrap";
import { trendingMedia, upcomingMovies } from "./preload";
import { GridItems } from "./searchResults";
import { red } from "./colorPallete";
import { ReactNode } from "react";
import { Globals } from "../interfaces/interfaces";

export function Homepage(GLOBALS: Globals) {
    if (upcomingMovies == null || trendingMedia == null) {
        return <></>;
    }

    let upcomingMoviesGrid = GridItems(GLOBALS, upcomingMovies);
    let trendingMediaGrid = GridItems(GLOBALS, trendingMedia);

    function generateHomepageSection(sectionTitle: string, gridItems: ReactNode) {
        return (
            <>
                <h1 className="homepageTitle">
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
                </div>
            </>
        );
    }

    return (
        <>
            {generateHomepageSection("📅New & Upcoming Movies", upcomingMoviesGrid)}
            {generateHomepageSection("✨Popular Movies & Series", trendingMediaGrid)}
        </>
    );
}

import { misSessionLogin } from "../APIs/mis-login";
import { cloudflare, createMediaObject } from "../APIs/theMovieDatabase";
import { Movie, TV } from "../classes/Media";
import { Globals, Trending, TrendingResult } from "../interfaces/interfaces";
import { CloudDBHandler } from "./CloudDBHandler";
import { Homepage } from "./homepage";

// We generate these variables on the global scope, since this scope gets executed only once.
export let tvGenreList: object | null = null;
export let movieGenreList: object | null = null;

export let upcomingMoviesTotalPages: number = 0;

export async function preload(GLOBALS: Globals) {
    const { setPreloaded, setHomepageContent } = GLOBALS.SETTERS;

    // Get the movie genre list
    tvGenreList = await getGenres("tv");
    movieGenreList = await getGenres("movie");

    async function getGenres(type: string) {
        let json = await cloudflare(["Genre", type]);
        return json;
    }

    let upcomingMoviesFirstPage = await getUpcomingMovies(1);
    let trendingMediaFirstPage = await getTrendingMedia();

    // Set the homepage content, so that it can be loaded later.
    setHomepageContent(Homepage(GLOBALS, upcomingMoviesFirstPage, trendingMediaFirstPage));

    let cloud = await misSessionLogin();
    if (cloud != false) {
        CloudDBHandler(cloud);
    }
    // Everything is loaded
    setPreloaded(true);
}

export async function getUpcomingMovies(page: number) {
    let json = await cloudflare(["Get Upcoming Movies", String(page)]);
    upcomingMoviesTotalPages = json.total_pages;

    return convertToMovieArray(await json);

    function convertToMovieArray(json: any) {
        let movieArray: Movie[] = [];

        json.results.forEach((element: any) => {
            element["media_type"] = "movie";
            let correctMedia = createMediaObject(element);

            if (correctMedia != false && correctMedia instanceof Movie) {
                movieArray.push(correctMedia);
            }
        });

        return movieArray;
    }
}

export async function getTrendingMedia() {
    let trendingResults: Trending = await cloudflare(["Get Trending"]);

    return convertToMediaArray(trendingResults.results);

    function convertToMediaArray(array: TrendingResult[]) {
        let mediaArray: (Movie | TV)[] = [];

        array.forEach((element: TrendingResult) => {
            let correctMedia = createMediaObject(element);

            if (correctMedia != false) {
                mediaArray.push(correctMedia);
            }
        });

        return mediaArray;
    }
}

import { cloudflare, createMediaObject } from "../APIs/theMovieDatabase";
import { Movie, TV } from "../classes/Media";
import { Globals, Trending, TrendingResult } from "../interfaces/interfaces";
import { Homepage } from "./homepage";

// We generate these variables on the global scope, since this scope gets executed only once.
export let tvGenreList: object | null = null;
export let movieGenreList: object | null = null;

// Homepage
export let upcomingMovies: Movie[] | null = null;
export let trendingMedia: (Movie | TV)[] | null = null;

export async function preload(GLOBALS: Globals) {
    const { setContent, setPreloaded } = GLOBALS.SETTERS;

    // Get the movie genre list
    tvGenreList = await getGenres("tv");
    movieGenreList = await getGenres("movie");

    async function getGenres(type: string) {
        let json = await cloudflare(["Genre", type]);
        return json;
    }

    // Load the homepage components.
    upcomingMovies = await getUpcomingMovies();

    async function getUpcomingMovies() {
        let json = await cloudflare(["Get Upcoming Movies", String(1)]);
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

    trendingMedia = await getTrendingMedia();
    async function getTrendingMedia() {
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

    // Everything is loaded
    setContent(Homepage(GLOBALS));
    setPreloaded(true);
}
import { cloudflare, generateMedia } from "../APIs/theMovieDatabase";
import { Movie } from "../classes/Movie";
import { Globals, Trending, TrendingResult } from "../interfaces/interfaces";
import { Homepage } from "./homepage";

// We generate these variables on the global scope, since this scope gets executed only once.
export let tvGenreList: object | null = null;
export let movieGenreList: object | null = null;

// Homepage
export let upcomingMovies: Movie[] | null = null;
export let trendingMedia: Movie[] | null = null;

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
                let correctMedia = generateMedia(element);

                if (correctMedia != false) {
                    movieArray.push(correctMedia);
                }
            });

            return movieArray;
        }
    }

    trendingMedia = await getTrendingMedia();
    async function getTrendingMedia() {
        let trendingResults: Trending = await cloudflare(["Get Trending"]);

        return convertToMovieArray(trendingResults.results);

        function convertToMovieArray(array: TrendingResult[]) {
            let movieArray: Movie[] = [];

            array.forEach((element: TrendingResult) => {
                let correctMedia = generateMedia(element);

                if (correctMedia != false) {
                    movieArray.push(correctMedia);
                }
            });

            return movieArray;
        }
    }

    // Everything is loaded
    setContent(Homepage(GLOBALS));
    setPreloaded(true);
}

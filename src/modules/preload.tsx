import { cloudflare, generateMedia } from "../APIs/theMovieDatabase";
import { Movie } from "../classes/Movie";
import { Homepage } from "./homepage";

// We generate these variables on the global scope, since this scope gets executed only once.
export let tvGenreList: any = null;
export let movieGenreList: any = null;

// Homepage
export let upcomingMovies: any = null;
export let trendingMedia: any = null;

export async function preload(GLOBALS: any) {
    const { setContent, setPreloaded } = GLOBALS.SETTERS;

    // Get the movie genre list
    tvGenreList = await getGenres("tv");
    movieGenreList = await getGenres("movie");

    async function getGenres(type: string) {
        let json = await cloudflare(["genre", type]);
        return json;
    }

    // Load the homepage components.
    upcomingMovies = await getUpcomingMovies();

    async function getUpcomingMovies() {
        let json = await cloudflare(["upcomingMovies", 1]);
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
        let json = await cloudflare(["trendingAll"]);

        return convertToMovieArray(await json);

        function convertToMovieArray(json: any) {
            let movieArray: Movie[] = [];

            json.results.forEach((element: any) => {
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

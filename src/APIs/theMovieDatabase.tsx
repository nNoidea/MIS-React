import { Movie, MovieList } from "../classes/Movie";
import { movieGenreList, tvGenreList } from "../modules/preload";

export async function cloudflare(array: string[]) {
    const options: RequestInit = {
        method: "GET",
        redirect: "follow",
    };

    const json = btoa(JSON.stringify({ array: array.slice(1) }));

    return await (await fetch(`https://mis-get.zugo.workers.dev/?mode=${array[0]}&jsonArray=${json}`, options)).json();
}

export async function getSearchResults(searchQuery: string, pageNumber: number) {
    let json = await cloudflare(["Multi Search", searchQuery, String(pageNumber)]);

    return normalize(json);

    function normalize(json: any) {
        let pages = json.total_pages;
        let results = json.results;
        let movieArr: Movie[] = [];

        results.forEach((media: any) => {
            let correctMedia = generateMedia(media);
            if (correctMedia != false) {
                movieArr.push(correctMedia);
            }
        });

        let movieList = new MovieList(pages, movieArr);

        return movieList;
    }
}

export function generateMedia(media: any) {
    // Media Type
    if (media.media_type != "tv" && media.media_type != "movie") {
        return false;
    }

    let title = "";
    let releaseDate = "";

    if (media.media_type == "movie") {
        title = media.title;
        releaseDate = media.release_date;
    } else if (media.media_type == "tv") {
        title = media.name;
        releaseDate = media.first_air_date;
    }

    // Poster
    let poster = "";
    if (media.poster_path == null) {
        poster = "NO-IMAGE";
    } else {
        poster = "https://image.tmdb.org/t/p/w154" + media.poster_path;
    }

    // Genre ids
    let genreIDS = media.genre_ids;
    let genres: string[] = [];
    let genreList: any;
    if (media.media_type == "movie") {
        genreList = movieGenreList;
    } else {
        genreList = tvGenreList;
    }

    genreIDS.forEach((id: number) => {
        genreList.genres.forEach((genre: any) => {
            if (genre.id == id) {
                genres.push(genre.name);
            }
        });
    });
    return new Movie(title, media.id, poster, media.media_type, media.overview, releaseDate, genres);
}

export async function TMDBRequestExtraDetails(movie: Movie) {
    let json;
    if (movie.mediaType == "movie") {
        json = await cloudflare(["Get Details", "movie", String(movie.id)]);
    } else if (movie.mediaType == "tv") {
        json = await cloudflare(["Get Details", "tv", String(movie.id)]);

        if (json.seasons[0].season_number == 1) {
            json.seasons.unshift(null);
        }

        movie.seasons = json.seasons;
    }

    let minutes = json.runtime;
    movie.runtime = convertRuntime(minutes);

    movie.TMDBScore = json.vote_average;

    movie.movieDetailsExist = true;
}

export async function TMDBRequestSeasonDetails(movie: Movie, seasonNumber: number) {
    if (movie.mediaType == "tv") {
        let json;
        json = await cloudflare(["Season Details", String(movie.id), String(seasonNumber)]);

        movie.seasons[seasonNumber].episodes = json.episodes;
        for (let i = 0; i < movie.seasons[seasonNumber].episodes.length; i++) {
            // Convert runtime from mintues to [hours, mintues]
            movie.seasons[seasonNumber].episodes[i].runtime = convertRuntime(movie.seasons[seasonNumber].episodes[i].runtime);
        }
    }
}

function convertRuntime(minutes: number) {
    if (minutes == null) {
        return null;
    } else {
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        return [hours, minutes];
    }
}

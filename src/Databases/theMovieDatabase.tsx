import { Movie, MovieList } from "../classes/Movie";

async function cloudflare(array: any[]) {
    const options: RequestInit = {
        method: "GET",
        redirect: "follow",
    };

    const json = btoa(JSON.stringify({ array: array.slice(1) }));

    return await (await fetch(`https://mis-get.zugo.workers.dev/?mode=${array[0]}&jsonArray=${json}`, options)).json();
}

// We generate these variables on the global scope, since this scope gets executed only once.
let tvGenreList: any = null;
let movieGenreList: any = null;

export async function getSearchResults(searchQuery: string, pageNumber: number) {
    // We will request this only once and reuse the data we get.
    if (tvGenreList == null) {
        tvGenreList = await getGenres("tv");
        movieGenreList = await getGenres("movie");
    }

    async function getGenres(type: string) {
        let json = await cloudflare(["genre", type]);
        return json;
    }

    let json = await cloudflare(["search", searchQuery, pageNumber]);

    return normalize(json);

    async function normalize(json: any) {
        let pages = json.total_pages;
        let results = json.results;
        let movieArr: any[] = [];

        results.forEach((element: any) => {
            // Media Type
            if (element.media_type != "tv" && element.media_type != "movie") {
                return;
            }

            // Poser
            let poster = "";
            if (element.poster_path == null) {
                poster = "NO-IMAGE";
            } else {
                poster = "https://image.tmdb.org/t/p/w154" + element.poster_path;
            }

            // Title
            let title = element.title;
            if (title == undefined) {
                title = element.name;
            }

            // Release date
            let releaseDate = element.release_date;
            if (releaseDate == undefined) {
                releaseDate = element.first_air_date;
            }

            // Genre ids
            let genreIDS = element.genre_ids;
            let genres: string[] = [];
            let genreList: any;
            if (element.media_type == "movie") {
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

            let movie = new Movie(title, element.id, poster, element.media_type, element.overview, releaseDate, genres);
            movieArr.push(movie);
        });

        let movieList = new MovieList(pages, movieArr);

        return movieList;
    }
}

export async function TMDBRequestExtraDetails(movie: Movie) {
    let json;
    if (movie.mediaType == "movie") {
        json = await cloudflare(["movieDetails", movie.id]);
    } else if (movie.mediaType == "tv") {
        json = await cloudflare(["tvDetails", movie.id]);

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
        json = await cloudflare(["seasonDetails", movie.id, seasonNumber]);

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

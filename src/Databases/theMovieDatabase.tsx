import { Movie, MovieList } from "../classes/Movie";


function cloudflare(array: any[]) {
    const baseDomain = "https://mis.zugo.workers.dev/";
    let parameters = "";
    for (let i = 0; i < array.length; i++) {
        let argument = String(array[i]);

        if (i != array.length - 1) {
            parameters += argument + "?";
        }
        else {
            parameters += argument;
        }
    }
    return baseDomain + parameters;
}

export async function getSearchResults(searchQuery: string, pageNumber: number) {
    let json = await (await fetch(cloudflare(["search", searchQuery, pageNumber]))).json();

    return normalize(await json);

    async function normalize(json: any) {
        let tvGenreList = await getGenres("tv");
        let movieGenreList = await getGenres("movie");

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
            }
            else {
                poster = "https://image.tmdb.org/t/p/w500" + element.poster_path;
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
            }
            else {
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

    async function getGenres(type: string) {
        let json = await (await fetch(cloudflare(["genre", type]))).json();
        return (await json);
    }
}


export async function TMDBRequestExtraDetails(movie: Movie) {
    let json;
    if (movie.mediaType == "movie") {
        json = await (await fetch(cloudflare(["movieDetails", movie.id]))).json();
    }
    else if (movie.mediaType == "tv") {
        json = await (await fetch(cloudflare(["tvDetails", movie.id]))).json();

        if (json.seasons[0].season_number == 1) {
            json.seasons.unshift(null);
        }

        movie.seasons = json.seasons;
    }

    let minutes = json.runtime;
    movie.runtime = runtime(minutes);

    movie.TMDBScore = json.vote_average;
}

export async function TMDBRequestSeasonDetails(movie: Movie, seasonNumber: number) {
    if (movie.mediaType == "tv") {

        let json;
        json = await (await fetch(cloudflare(["seasonDetails", movie.id, seasonNumber]))).json();

        movie.seasons[seasonNumber].episodes = json.episodes;
        for (let i = 0; i < movie.seasons[seasonNumber].episodes.length; i++) {
            movie.seasons[seasonNumber].episodes[i].runtime = runtime(movie.seasons[seasonNumber].episodes[i].runtime);
        }
    }
}

function runtime(minutes: number) {
    if (minutes == null) {
        return null;
    } else {
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        return [hours, minutes];
    }
}
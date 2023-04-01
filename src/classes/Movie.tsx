import { TMDBRequestExtraDetails, TMDBRequestSeasonDetails } from "../APIs/theMovieDatabase";

export class MovieList {
    pages: number;
    movieArr: Array<Movie>;

    constructor(pages: number, movieArr: Array<Movie>) {
        this.pages = pages;
        this.movieArr = movieArr;
    }
}

export class Movie {
    uniqueID: string;
    title: string;
    id: number;
    poster: string;
    mediaType: string;
    description: string;
    releaseDate: string;
    genres: string[];

    // Set setMovieDetails
    movieDetailsExist: boolean = false;
    runtime: number[] | null = null;
    TMDBScore: number = 0;

    seasons: any[] = [];

    constructor(name: string, id: number, poster: string, mediaType: string, description: string, releaseDate: string, genres: string[]) {
        this.uniqueID = generateUniqueID(id, mediaType);
        this.title = name;
        this.id = id;
        this.poster = poster;
        this.mediaType = mediaType;
        this.description = description;
        this.releaseDate = releaseDate;
        this.genres = genres;
    }

    async requestMovieDetails() {
        if (this.movieDetailsExist == false) {
            await TMDBRequestExtraDetails(this);
        }
    }

    async requestSeasonDetails(seasonNumber: number) {
        if (this.mediaType == "tv" && this.seasons[seasonNumber].episodes == undefined) {
            await TMDBRequestSeasonDetails(this, seasonNumber);
        }
    }
}

export function copyMovie(movie: Movie) {
    const { title, id, poster, mediaType, description, releaseDate, genres, ...rest } = movie;

    const newMovie = new Movie(title, id, poster, mediaType, description, releaseDate, genres);

    Object.assign(newMovie, rest);

    return newMovie;
}

function generateUniqueID(movieID: number, mediaType: string) {
    if (mediaType == "movie") {
        return "0" + String(movieID);
    } else {
        return "1" + String(movieID);
    }
}

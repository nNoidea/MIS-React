import { TMDBRequestExtraDetails, TMDBRequestSeasonDetails } from "../Databases/theMovieDatabase";

export class MovieList {
    pages: number;
    movieArr: Array<Movie>;

    constructor(pages: number, movieArr: Array<Movie>) {
        this.pages = pages;
        this.movieArr = movieArr;
    }
}

export class Movie {
    title: string;
    id: number;
    poster: string;
    mediaType: string;
    description: string;
    releaseDate: string;
    genres: string[];

    // Set setMovieDetails
    runtime: number[] | null = null;
    TMDBScore: number = 0;

    //
    seasons: any[] = [];

    constructor(name: string, id: number, poster: string, mediaType: string, description: string, releaseDate: string, genres: string[]) {
        this.title = name;
        this.id = id;
        this.poster = poster;
        this.mediaType = mediaType;
        this.description = description;
        this.releaseDate = releaseDate;
        this.genres = genres;
    }

    async requestMovieDetails() {
        await TMDBRequestExtraDetails(this);
    }

    async requestSeasonDetails(seasonNumber: number) {
        await TMDBRequestSeasonDetails(this, seasonNumber);
    }
}
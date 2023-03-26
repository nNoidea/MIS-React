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
    
    // set seasonDetails
    seasonDetailsExist: boolean = false;
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
        if (this.seasonDetailsExist == false) {
            await TMDBRequestSeasonDetails(this, seasonNumber);
        }
    }
}

function generateUniqueID(movieID: number, mediaType: string) {
    if (mediaType == "movie") {
        return "0" + String(movieID);
    } else {
        return "1" + String(movieID);
    }
}
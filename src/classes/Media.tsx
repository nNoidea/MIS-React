import { TMDBRequestDetails, TMDBRequestSeasonDetails } from "../APIs/theMovieDatabase";

// This will be a superclass of Movie and TV
export class Media {
    uniqueID: string;
    name: string;
    poster: string;
    description: string;
    releaseDate: string;
    genres: string[];

    TMDBScore: number = 0;
    IMDBScore: number = 0;
    TomatoScore: number = 0;

    constructor(uniqueID: string, name: string, poster: string, description: string, releaseDate: string, genres: string[]) {
        this.uniqueID = uniqueID;
        this.name = name;
        this.poster = poster;
        this.description = description;
        this.releaseDate = releaseDate;
        this.genres = genres;
    }

    detailsExist: boolean = false;
    async requestDetails() {
        if (this.detailsExist == false && (this instanceof Movie || this instanceof TV)) {
            await TMDBRequestDetails(this);
        }
    }
}

export function copyMedia(media: Movie | TV) {
    const { name, id, poster, description, releaseDate, genres, ...rest } = media;

    let newMedia;
    if (rest.uniqueID[0] == "M") {
        newMedia = new Movie(id, name, poster, description, releaseDate, genres);
    } else {
        newMedia = new TV(id, name, poster, description, releaseDate, genres);
    }

    Object.assign(newMedia, rest);

    return newMedia;
}

export class Movie extends Media {
    id: number;
    runtime: number[] | null = null;

    constructor(id: number, name: string, poster: string, description: string, releaseDate: string, genres: string[]) {
        let uniqueID = "M" + String(id);

        super(uniqueID, name, poster, description, releaseDate, genres);

        this.id = id;
    }
}

export class TV extends Media {
    id: number;
    seasons: any[] = [];

    constructor(id: number, name: string, poster: string, description: string, releaseDate: string, genres: string[]) {
        let uniqueID = "T" + String(id);

        super(uniqueID, name, poster, description, releaseDate, genres);

        this.id = id;
    }

    async requestSeasonDetails(seasonNumber: number) {
        if (this.seasons[seasonNumber].episodes == undefined) {
            await TMDBRequestSeasonDetails(this, seasonNumber);
        }
    }
}

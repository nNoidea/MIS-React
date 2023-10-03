// This file is meant to get the JSON file that has all the movies, series and episodes the user has saved and load them to the indexedDB.

import { cloudflare } from "../APIs/theMovieDatabase";
import { Movie, TV } from "../classes/Media";
import { DBAdd, objectStoreNameLibrary } from "./indexedDB";

export async function CloudDBHandler(JSON: any) {
    let movies = JSON.movie;
    let series = JSON.tv;

    for (let movie of movies) {
        let details = await cloudflare(["Get Details", "movie", movie.id]);

        const movieObject = new Movie(movie.id, details.title, details.poster_path, details.overview, details.release_date, details.genres);
        movieObject.inLibrary = movie.library;
        movieObject.watched = movie.watched;

        DBAdd(objectStoreNameLibrary, movieObject);
    }

    for (let serie of series) {
        let json = await cloudflare(["Get Details", "tv", serie.id]);

        const tvObject = new TV(serie.id, json.name, json.poster_path, json.overview, json.first_air_date, json.genres);
        tvObject.inLibrary = serie.library;

        await tvObject.requestDetails();

        for (let episode of serie.episodes) {
            await tvObject.requestSeasonDetails(episode.seasonNumber);

            tvObject.seasons[episode.seasonNumber].episodes[episode.episodeNumber - 1].watched = true;
        }

        DBAdd(objectStoreNameLibrary, tvObject);
    }
}

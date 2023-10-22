// This file is meant to get the JSON file that has all the movies, series and episodes the user has saved and load them to the indexedDB.

import { misGet } from "../APIs/mis-get";
import { Movie, TV } from "../classes/Media";
import { Globals } from "../interfaces/interfaces";
import { DBAdd, objectStoreNameLibrary } from "./indexedDB";
import { setupLibraryPage } from "./librarypage";

export async function CloudDBHandler(JSON: any, GLOBALS: Globals) {
    let movies = JSON.movie;
    let series = JSON.tv;

    for (let movie of movies) {
        if (movie.cacheDate != null && olderThanADay(new Date(movie.cacheDate))) {
            // update only if the data is old
        }
        let details = await misGet(["Get Details", "movie", movie.id]);

        const movieObject = new Movie(movie.id, details.title, details.poster_path, details.overview, details.release_date, details.genres);
        movieObject.inLibrary = movie.library;
        movieObject.watched = movie.watched;

        DBAdd(objectStoreNameLibrary, movieObject);
    }

    for (let serie of series) {
        if (serie.cacheDate != null && olderThanADay(new Date(serie.cacheDate))) {
            // update only if the data is old.
        }
        let json = await misGet(["Get Details", "tv", serie.id]);

        const tvObject = new TV(serie.id, json.name, json.poster_path, json.overview, json.first_air_date, json.genres);
        tvObject.inLibrary = serie.library;

        await tvObject.requestDetails();

        for (let episode of serie.episodes) {
            await tvObject.requestSeasonDetails(episode.seasonNumber);

            tvObject.seasons[episode.seasonNumber].episodes[episode.episodeNumber - 1].watched = true;
        }

        DBAdd(objectStoreNameLibrary, tvObject);
    }

    setupLibraryPage(GLOBALS);

    function olderThanADay(date: Date) {
        let yesterday = new Date(); // Today
        yesterday.setDate(yesterday.getDate() - 1);

        return date < yesterday;
    }
}

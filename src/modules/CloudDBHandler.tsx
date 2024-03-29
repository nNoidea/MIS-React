// This file is meant to get the JSON file that has all the movies, series and episodes the user has saved and load them to the indexedDB.

import { misGet } from "../APIs/mis-get";
import { Movie, TV } from "../classes/Media";
import { Globals } from "../interfaces/interfaces";
import { red } from "./colorPallete";
import { DBAdd, DBCheck, DBGet, objectStoreNameLibrary } from "./indexedDB";
import { setupLibraryPage } from "./librarypage";

export async function CloudDBHandler(JSON: any, GLOBALS: Globals) {
    let movies = JSON.movie;
    let series = JSON.tv;

    for (let movie of movies) {
        let movieObject: Movie;

        // Check if the movie exists in the database
        if (await DBCheck(objectStoreNameLibrary, "M" + movie.id)) {
            // If it exists, then check if it's in the library
            movieObject = (await DBGet(objectStoreNameLibrary, "M" + movie.id)) as Movie;
            movieObject.inLibrary = movie.library;
            movieObject.watched = movie.watched;
        } else {
            let details = await misGet(["Get Details", "movie", movie.id]);

            let genres: string[] = [];

            for (const genre of details.genres) {
                genres.push(genre.name);
            }

            movieObject = new Movie(movie.id, details.title, details.poster_path, details.overview, details.release_date, genres);
            movieObject.inLibrary = movie.library;
            movieObject.watched = movie.watched;
        }

        DBAdd(objectStoreNameLibrary, movieObject);
        if (GLOBALS.GETTERS.buttonColorRef.current === red) {
            setupLibraryPage(GLOBALS); // Update the library page
        }
    }

    for (let serie of series) {
        let tvObject: TV;
        if (await DBCheck(objectStoreNameLibrary, "T" + serie.id)) {
            tvObject = (await DBGet(objectStoreNameLibrary, "T" + serie.id)) as TV;
            tvObject.inLibrary = serie.library;
        } else {
            let json = await misGet(["Get Details", "tv", serie.id]);

            let genres: string[] = [];
            for (const genre of json.genres) {
                genres.push(genre.name);
            }

            tvObject = new TV(serie.id, json.name, json.poster_path, json.overview, json.first_air_date, genres);
            tvObject.inLibrary = serie.library;

            await tvObject.requestDetails();
        }

        for (let episode of serie.episodes) {
            await tvObject.requestSeasonDetails(episode.seasonNumber);

            tvObject.seasons[episode.seasonNumber].episodes[episode.episodeNumber - 1].watched = true;
        }

        DBAdd(objectStoreNameLibrary, tvObject);
        if (GLOBALS.GETTERS.buttonColorRef.current === red) {
            setupLibraryPage(GLOBALS); // Update the library page
        }
    }
}

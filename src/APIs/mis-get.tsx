import { Movie, TV } from "../classes/Media";
import { movieGenreList, tvGenreList } from "../modules/preload";

export let gridImageResolution = "w342";

export async function misGet(array: string[]) {
    const options: RequestInit = {
        method: "GET",
        redirect: "follow",
    };

    const json = btoa(JSON.stringify({ array: array.slice(1) }));

    return await (await fetch(`https://mis-get.zugo.workers.dev/?mode=${array[0]}&jsonArray=${json}`, options)).json();
}

export async function getSearchResults(searchQuery: string, pageNumber: number) {
    let json = await misGet(["Multi Search", searchQuery, String(pageNumber)]);

    return normalize(json);

    function normalize(json: any) {
        let pages = json.total_pages;
        let results = json.results;

        let mediaArray: (Movie | TV)[] = [];

        results.forEach((rawMedia: any) => {
            let correctMedia = createMediaObject(rawMedia);
            if (correctMedia != false) {
                mediaArray.push(correctMedia);
            }
        });

        return { pages, mediaArray };
    }
}

export function createMediaObject(rawMedia: any) {
    let name = "";
    let releaseDate = "";

    // Media Type
    if (rawMedia.media_type != "tv" && rawMedia.media_type != "movie") {
        return false;
    }

    // Poster
    let poster = rawMedia.poster_path;

    // Genre ids
    let genreIDS = rawMedia.genre_ids;
    let genres: string[] = [];
    let genreList: any;
    if (rawMedia.media_type == "movie") {
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

    if (rawMedia.media_type == "movie") {
        name = rawMedia.title;
        releaseDate = rawMedia.release_date;

        return new Movie(rawMedia.id, name, poster, rawMedia.overview, releaseDate, genres);
    } else if (rawMedia.media_type == "tv") {
        name = rawMedia.name;
        releaseDate = rawMedia.first_air_date;

        return new TV(rawMedia.id, name, poster, rawMedia.overview, releaseDate, genres);
    }
    return false;
}

export async function TMDBRequestDetails(media: Movie | TV) {
    let json;

    if (media instanceof Movie) {
        json = await misGet(["Get Details", "movie", String(media.id)]);
        let minutes = json.runtime;
        media.runtime = convertRuntime(minutes);
    } else if (media instanceof TV) {
        json = await misGet(["Get Details", "tv", String(media.id)]);

        if (json.seasons[0].season_number == 1) {
            json.seasons.unshift(null);
        }

        media.seasons = json.seasons;
    }

    media.TMDBScore = json.vote_average;

    media.detailsExist = true;
}

export async function TMDBRequestSeasonDetails(tv: TV, seasonNumber: number) {
    let json;
    json = await misGet(["Season Details", String(tv.id), String(seasonNumber)]);

    tv.seasons[seasonNumber].episodes = json.episodes;
    for (let i = 0; i < tv.seasons[seasonNumber].episodes.length; i++) {
        // Convert runtime from mintues to [hours, mintues]
        tv.seasons[seasonNumber].episodes[i].runtime = convertRuntime(tv.seasons[seasonNumber].episodes[i].runtime);
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

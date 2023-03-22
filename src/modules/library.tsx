import { Movie } from "../classes/Movie";

function saveToLibrary(movie: Movie) {
    let json = {
        movieID: 0,
        mediaType: "", // movie / tv
        // if movie
        watched: false,
        // if tv
        watchedEpisodes: [[1, 1], [1, 2]]
    };

    json.movieID = movie.id;
    json.mediaType = movie.mediaType;
    json.watched = true; // TODO
    json.watchedEpisodes = [[1, 2], [1, 2], [1, 2]];

    JSON.stringify(json);
}

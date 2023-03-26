import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import { Movie } from "../classes/Movie";
import { addToLibrary, loadLibrary, removeFromLibrary } from "./library";

export function modal(GLOBALS: any) {

    const { movie, seasonNumber, seasonName, modalShow, addLibraryButtonColor, libraryButtonColor } = GLOBALS.GETTERS;
    const { setSeasonNumber, setMovie, setSeasonName, setModalShow, setAddLibraryButtonColor } = GLOBALS.SETTERS;

    if (movie == undefined) {
        return <></>;
    }


    return (
        <Modal
            show={modalShow}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => { setModalShow(false); }}
            id="modal">
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img id="modal-img" src={getBetterPoster(movie.poster)} alt="" />
                        </div>
                        <div className="col movie-data">
                            <div>
                                <h1 id="movie-title">{movie.title}</h1>
                                {movieDetailsSection(movie.releaseDate, movie.genres, movie.mediaType, movie.runtime)}
                                {scoresSection(movie.TMDBScore)}
                                {descriptionSection(movie.description)}
                            </div>
                            <div>
                                <>
                                    <Button className='button' style={{ backgroundColor: addLibraryButtonColor }}
                                        onClick={() => {
                                            if (addLibraryButtonColor == "crimson") {
                                                addToLibrary(movie);
                                                setAddLibraryButtonColor("#54B435");
                                            } else {
                                                removeFromLibrary(movie.uniqueID);
                                                setAddLibraryButtonColor("crimson");
                                            }

                                            if (libraryButtonColor != "transparent") {
                                                loadLibrary(GLOBALS);
                                            }
                                        }}>
                                        📁Library
                                    </Button>
                                    <Button className='button' onClick={() => { window.open(youtubeSearchLinkGenerator(movie.title), '_blank'); }}>
                                        <img src="https://raw.githubusercontent.com/nNoidea/MIS-React/main/images/youtube.png" height={16} />YouTube
                                    </Button>
                                    {(() => {
                                        if (movie.mediaType == "movie") {
                                            return <Button className='button'>👀Watched</Button>;
                                        }
                                    })()}
                                </>
                            </div>
                        </div>
                        <>
                            {episodesSection(movie, setMovie, movie.mediaType, movie.seasons, seasonNumber, setSeasonNumber, seasonName, setSeasonName)}
                        </>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function getBetterPoster(poster: string) {
    return poster.replace("w154", "w500");
}

function youtubeSearchLinkGenerator(string: string) {
    return `https://www.youtube.com/results?search_query=${ string.replaceAll(" ", "+") }`;
}

function episodesSection(movie: Movie, setMovie: any, mediaType: string, seasons: any[], seasonNumber: number, setSeasonNumber: any, seasonName: string, setSeasonName: any) {
    if (mediaType == "tv") {
        return (
            <div className="col">
                <div className="text-center" id='movie-content'>
                    {seasonButtonSection(seasons)}
                </div>
                <div id="episodes" className="episodes">
                    <ul className="list-group">
                        {seasonEpisodesSection(seasons[seasonNumber])}
                    </ul>
                </div>
            </div>
        );
    }

    function seasonButtonSection(seasons: any[]) {
        let buttons = <></>;
        for (let i = 1; i <= seasons.length; i++) {
            let index = i;

            if (i == seasons.length && seasons[0] == null) {
                break;
            }
            else if (i == seasons.length && seasons[0] != null) {
                index = 0;
            }

            buttons = <>{buttons}<Button onClick={
                async () => {
                    await movie.requestSeasonDetails(index);
                    setSeasonNumber(index);
                    setMovie(movie);
                    setSeasonName(seasons[index].name);
                }
            }>{index}</Button></>;
        }
        buttons = <>{buttons}<div>{seasonName}</div></>;
        return buttons;
    }

    function seasonEpisodesSection(season: any) {
        let episodeCount = season.episode_count;
        let episodes = <></>;

        for (let i = 0; i < episodeCount; i++) {
            episodes = <>
                {episodes}
                <ListGroup.Item id="single-episode" onClick={() => {  }}>
                    <span>
                        <strong>{i + 1}. </strong>
                        {movie.seasons[seasonNumber].episodes[i].name}{epsiodeRuntime(setupRuntime(movie.seasons[seasonNumber].episodes[i].runtime, mediaType, true))}
                        {episodeReleaseDate(movie.seasons[seasonNumber].episodes[i].air_date)}
                    </span>
                </ListGroup.Item>
            </>;
        }

        return episodes;

        function epsiodeRuntime(runtime: any) {
            if (runtime != null) {
                return <><br />{runtime}</>;
            }
        }

        function episodeReleaseDate(releaseDate: string) {
            if (releaseDate != null) {
                return <><br />📅{releaseDate}</>;
            }
        }
    }
}

function scoresSection(TMDBScore: number) {
    let backgroundColor = "#54B435";

    if (TMDBScore != 0) {
        TMDBScore = Math.round(TMDBScore * 10) / 10;
        let score = <Badge bg="" style={{ backgroundColor: determineScoreColor(TMDBScore) }} className="content-score" >🇹 {TMDBScore} / 10</Badge >;

        return (<>
            <hr className="hr" />
            <div>
                <h3>
                    {score}
                </h3>
            </div>
        </>);
    }

    function determineScoreColor(score: number) {
        if (score >= 8) {
            backgroundColor = "#BF40BF";
        }
        else if (score >= 7) {
            backgroundColor = "#54B435";
        }
        else if (score >= 5) {
            backgroundColor = "orange";
        }
        else {
            backgroundColor = "crimson";
        }

        return backgroundColor;
    }

    // <Badge bg="" className="content-score">🟨 9.9 / 10</Badge>
    // <Badge bg="" className="content-score">🍅 9.9 / 10</Badge>
    // <Badge bg="" className="content-score">Ⓜ️ 9.9 / 10</Badge>
}

function movieDetailsSection(releaseDate: string, genres: string[], mediaType: string, runtime: number[] | null) {
    let movie_releaseDate = releaseDateSection(releaseDate);
    let movie_genres = genresSection(genres);
    let movie_runtime = setupRuntime(runtime, mediaType, false);

    if (movie_releaseDate != undefined || movie_genres != undefined || movie_runtime != undefined) {
        return (
            <>
                <hr className="hr" />
                <p id="date"> {movie_releaseDate} {movie_genres} {movie_runtime}</p>
            </>);
    }

    function releaseDateSection(releaseDate: string) {
        if (releaseDate != "") {
            return `📅${ releaseDate?.split('-')[0] }`;
        }
    }

    function genresSection(genres: string[]) {
        if (genres == undefined) {
            return;
        }

        let string = "";
        for (let i = 0; i < genres.length; i++) {
            if (i == genres.length - 1) {
                string += genres[i];
            }
            else {
                string += genres[i] + ", ";
            }
        }

        if (string != "") {
            return `🧩 ${ string }`;
        }
    }
}

function setupRuntime(runtime: number[] | null, mediaType: string, episodeBoolean: boolean) {
    if (mediaType == "movie" || episodeBoolean) {
        if (runtime != null) {
            if (runtime[0] != 0 && runtime[1] != 0) {
                return `⏳${ runtime[0] }h ${ runtime[1] }m`;
            }
            else if (runtime[0] != 0) {
                return `⏳${ runtime[0] }h`;
            }
            else if (runtime[1] != 0) {
                return `⏳${ runtime[1] }m`;
            }
        }
        else {
            return null;
        }
    }
}

function descriptionSection(modalDescription: string) {
    if (modalDescription != "") {
        return (
            <>
                <hr className="hr" />
                <p className="description">
                    {modalDescription}
                </p>
            </>);
    }
}
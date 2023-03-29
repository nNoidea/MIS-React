import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import { copyMovie, Movie } from "../classes/Movie";
import { green, orange, purpble, red } from "./colorPallete";
import { libraryAdd, libraryRemove } from "./indexedDB";
import { setupLibraryPage } from "./librarypage";

const date = new Date();
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
            onHide={() => {
                setModalShow(false);
            }}
            id="modal"
        >
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img
                                id="modal-img"
                                src={getBetterPoster(movie.poster)}
                                alt=""
                            />
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
                                    <Button
                                        className="button"
                                        style={{ backgroundColor: addLibraryButtonColor }}
                                        onClick={() => {
                                            if (addLibraryButtonColor == red) {
                                                libraryAdd(movie);
                                                setAddLibraryButtonColor(green);
                                            } else {
                                                libraryRemove(movie.uniqueID);
                                                setAddLibraryButtonColor(red);
                                            }

                                            if (libraryButtonColor != "transparent") {
                                                setupLibraryPage(GLOBALS);
                                            }
                                        }}
                                    >
                                        📁Library
                                    </Button>
                                    <Button
                                        className="button"
                                        onClick={() => {
                                            window.open(youtubeSearchLinkGenerator(movie.title), "_blank");
                                        }}
                                    >
                                        <img
                                            src="https://raw.githubusercontent.com/nNoidea/MIS-React/main/images/youtube.png"
                                            height={16}
                                        />
                                        YouTube
                                    </Button>
                                    {(() => {
                                        if (movie.mediaType == "movie") {
                                            return <Button className="button">👀Watched</Button>;
                                        }
                                    })()}
                                </>
                            </div>
                        </div>
                        <>{episodesSection(GLOBALS, movie, setMovie, seasonNumber, setSeasonNumber, seasonName, setSeasonName, setAddLibraryButtonColor, libraryButtonColor)}</>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

    function descriptionSection(modalDescription: string) {
        if (modalDescription != "") {
            return (
                <>
                    <hr className="hr" />
                    <p className="description">{modalDescription}</p>
                </>
            );
        }
    }
}

function getBetterPoster(poster: string) {
    return poster.replace("w154", "w500");
}

function youtubeSearchLinkGenerator(string: string) {
    return `https://www.youtube.com/results?search_query=${string.replaceAll(" ", "+")}`;
}

function episodesSection(
    GLOBALS: any,
    movie: Movie,
    setMovie: any,
    seasonNumber: number,
    setSeasonNumber: any,
    seasonName: string,
    setSeasonName: any,
    setAddLibraryButtonColor: any,
    libraryButtonColor: any
) {
    const { mediaType, seasons } = movie;

    if (mediaType == "tv") {
        return (
            <div className="col">
                <div
                    className="text-center"
                    id="movie-content"
                >
                    {seasonButtonSection(seasons)}
                </div>
                <div
                    id="episodes"
                    className="episodes"
                >
                    <ul className="list-group">{seasonEpisodesSection(seasons[seasonNumber])}</ul>
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
            } else if (i == seasons.length && seasons[0] != null) {
                index = 0;
            }

            buttons = (
                <>
                    {buttons}
                    <Button
                        onClick={async () => {
                            await movie.requestSeasonDetails(index);
                            setSeasonNumber(index);
                            setMovie(movie);
                            setSeasonName(seasons[index].name);
                        }}
                    >
                        {index}
                    </Button>
                </>
            );
        }
        buttons = (
            <>
                {buttons}
                <div>{seasonName}</div>
            </>
        );
        return buttons;
    }

    function seasonEpisodesSection(season: any) {
        let episodeCount = season.episode_count;
        let episodes = <></>;

        for (let i = 0; i < episodeCount; i++) {
            const episodeDate = movie.seasons[seasonNumber].episodes[i].air_date;
            const currentDateSum = getNormalizedDate();
            let episodesDateSplittedSum: number;

            if (episodeDate != null) {
                episodesDateSplittedSum = normalizeDate(episodeDate);
            } else {
                episodesDateSplittedSum = currentDateSum - 1;
            }

            episodes = (
                <>
                    {episodes}
                    <ListGroup.Item
                        id="single-episode"
                        style={{
                            backgroundColor: (() => {
                                if (episodesDateSplittedSum > currentDateSum) {
                                    return "gray";
                                }

                                if (movie.seasons[seasonNumber].episodes[i]["watched"]) {
                                    return green;
                                } else {
                                    return red;
                                }
                            })(),
                            cursor: (() => {
                                if (episodesDateSplittedSum > currentDateSum) {
                                    return "not-allowed";
                                } else {
                                    return "pointer";
                                }
                            })(),
                        }}
                        onClick={() => {
                            if (episodesDateSplittedSum <= currentDateSum) {
                                const newMovie = copyMovie(movie);

                                if (newMovie.seasons[seasonNumber].episodes[i]["watched"] == true) {
                                    newMovie.seasons[seasonNumber].episodes[i]["watched"] = false;
                                } else {
                                    newMovie.seasons[seasonNumber].episodes[i]["watched"] = true;
                                    setAddLibraryButtonColor(green);
                                    libraryAdd(newMovie);

                                    if (libraryButtonColor != "transparent") {
                                        setupLibraryPage(GLOBALS);
                                    }
                                }
                                setMovie(newMovie);
                            }
                        }}
                    >
                        <span>
                            <strong>{i + 1}. </strong>
                            {movie.seasons[seasonNumber].episodes[i].name}
                            {epsiodeRuntime(setupRuntime(movie.seasons[seasonNumber].episodes[i].runtime, mediaType, true))}
                            {episodeReleaseDate(episodeDate)}
                        </span>
                    </ListGroup.Item>
                </>
            );
        }

        return episodes;

        function epsiodeRuntime(runtime: any) {
            if (runtime != null) {
                return (
                    <>
                        <br />
                        {runtime}
                    </>
                );
            }
        }

        function episodeReleaseDate(releaseDate: string) {
            if (releaseDate != null) {
                return (
                    <>
                        <br />
                        📅{releaseDate}
                    </>
                );
            }
        }
    }
}

export function getNormalizedDate() {
    return date.getDate() + (date.getMonth() + 1) * 31 + date.getFullYear() * 365;
}
// date has to be in the form of: DD-MM-YYYY
export function normalizeDate(date: string) {
    const dateSplitted = date.split("-").map((element: string) => {
        return Number(element);
    });

    return dateSplitted[2] + dateSplitted[1] * 31 + dateSplitted[0] * 365;
}

function scoresSection(TMDBScore: number) {
    if (TMDBScore != 0) {
        TMDBScore = Math.round(TMDBScore * 10) / 10;
        let score = (
            <Badge
                bg=""
                style={{ backgroundColor: determineScoreColor(TMDBScore) }}
                className="content-score"
            >
                🇹 {TMDBScore} / 10
            </Badge>
        );

        return (
            <>
                <hr className="hr" />
                <div>
                    <h3>{score}</h3>
                </div>
            </>
        );
    }

    function determineScoreColor(score: number) {
        let backgroundColor;
        if (score >= 8) {
            backgroundColor = purpble;
        } else if (score >= 7) {
            backgroundColor = green;
        } else if (score >= 5) {
            backgroundColor = orange;
        } else {
            backgroundColor = red;
        }

        return backgroundColor;
    }
}

function movieDetailsSection(releaseDate: string, genres: string[], mediaType: string, runtime: number[] | null) {
    let movie_releaseDate = releaseDateSection(releaseDate);
    let movie_genres = genresSection(genres);
    let movie_runtime = setupRuntime(runtime, mediaType, false);

    if (movie_releaseDate != undefined || movie_genres != undefined || movie_runtime != undefined) {
        return (
            <>
                <hr className="hr" />
                <p id="date">
                    {" "}
                    {movie_releaseDate} {movie_genres} {movie_runtime}
                </p>
            </>
        );
    }

    function releaseDateSection(releaseDate: string) {
        if (releaseDate != "") {
            return `📅${releaseDate?.split("-")[0]}`;
        }
    }

    function genresSection(genres: string[]) {
        if (genres == undefined) {
            return;
        }

        let string = genres.join(", ");

        if (string != "") {
            return `🧩 ${string}`;
        }
    }
}

function setupRuntime(runtime: number[] | null, mediaType: string, episodeBoolean: boolean) {
    if (mediaType == "movie" || episodeBoolean) {
        if (runtime != null) {
            if (runtime[0] != 0 && runtime[1] != 0) {
                return `⏳${runtime[0]}h ${runtime[1]}m`;
            } else if (runtime[0] != 0) {
                return `⏳${runtime[0]}h`;
            } else if (runtime[1] != 0) {
                return `⏳${runtime[1]}m`;
            }
        } else {
            return null;
        }
    }
}

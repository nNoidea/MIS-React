import { Badge, Button, ListGroup, Modal } from "react-bootstrap";
import { green, orange, purple, red } from "./colorPallete";
import { DBAdd, objectStoreNameLibrary } from "./indexedDB";
import { setupLibraryPage } from "./librarypage";
import { Globals } from "../interfaces/interfaces";
import { gridImageResolution } from "../APIs/theMovieDatabase";
import { Movie, TV, copyMedia } from "../classes/Media";
import "../css/MediaModal.css";
import { misPostMovie, misPostTV } from "../APIs/mis-post";

const date = new Date();
export function MyModal(GLOBALS: Globals) {
    const { media, mediaModalShow, addLibraryButtonColor, addWatchedButtonColor, libraryButtonColor } = GLOBALS.GETTERS;
    const { setMediaModalShow, setAddLibraryButtonColor, setAddWatchedButtonColor } = GLOBALS.SETTERS;

    if (media == undefined) {
        return <></>;
    }

    return (
        <Modal
            show={mediaModalShow}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => {
                setMediaModalShow(false);
            }}
            id="modal"
        >
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img
                                id="modal-img"
                                src={getBetterPoster(media.poster)}
                            />
                        </div>
                        <div className="col movie-data">
                            <div>
                                <h1 id="movie-title">{media.name}</h1>
                                {movieDetailsSection(media.releaseDate, media.genres, media.mediaType, media.runtime)}
                                {scoresSection(media.TMDBScore)}
                                {descriptionSection(media.description)}
                            </div>
                            <div>
                                <>
                                    {libraryButton()}
                                    {youtubeButton()}
                                    {watchedButton()}
                                </>
                            </div>
                        </div>
                        <>{episodesSection(GLOBALS)}</>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

    function libraryButton() {
        return (
            <Button
                className="button"
                style={{ backgroundColor: addLibraryButtonColor }}
                onClick={() => {
                    if (changeButtonColor(media.inLibrary, addLibraryButtonColor, setAddLibraryButtonColor)) {
                        media.inLibrary = true;
                    } else {
                        media.inLibrary = false;
                    }
                    DBAdd(objectStoreNameLibrary, media); // update the movie

                    if (media instanceof Movie) {
                        misPostMovie(String(media.id), media.name, String(localStorage.getItem("session_id")), media.inLibrary, media.watched);
                    } else if (media instanceof TV) {
                        misPostTV(String(media.id), media.name, String(localStorage.getItem("session_id")), media.inLibrary);
                    }

                    // Update the visible movies in the library
                    if (libraryButtonColor != "transparent") {
                        setupLibraryPage(GLOBALS);
                    }
                }}
            >
                📁Library
            </Button>
        );
    }

    function watchedButton() {
        if (media instanceof Movie) {
            return (
                <Button
                    className="button"
                    style={{ backgroundColor: addWatchedButtonColor }}
                    onClick={() => {
                        if (changeButtonColor(media.watched, addWatchedButtonColor, setAddWatchedButtonColor)) {
                            media.inLibrary = true;
                            changeButtonColor(false, addLibraryButtonColor, setAddLibraryButtonColor); // also change the library button color

                            media.watched = true;
                        } else {
                            media.watched = false;
                        }

                        DBAdd(objectStoreNameLibrary, media);

                        misPostMovie(String(media.id), media.name, String(localStorage.getItem("session_id")), media.inLibrary, media.watched);
                    }}
                >
                    👀Watched
                </Button>
            );
        }
    }

    function youtubeButton() {
        return (
            <Button
                className="button"
                href={youtubeSearchLinkGenerator(media.name)}
                target="_blank" // Forces the link to be opened on a new tab.
            >
                <img
                    src="https://raw.githubusercontent.com/nNoidea/MIS-React/main/images/youtube.png"
                    height={16}
                />
                YouTube
            </Button>
        );
    }

    function changeButtonColor(mediaColorBoolean: boolean, buttonColorGetter: any, buttonColorSetter: any) {
        if (mediaColorBoolean == false) {
            buttonColorSetter(green);
            return true;
        } else {
            buttonColorSetter(red);
            return false;
        }
    }

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
    return poster.replace(gridImageResolution, "w780");
}

function youtubeSearchLinkGenerator(string: string) {
    return `https://m.youtube.com/results?search_query=${string.replaceAll(" ", "+")}`;
}

function episodesSection(GLOBALS: Globals) {
    const { setMedia, setSeasonNumber, setSeasonName, setAddLibraryButtonColor } = GLOBALS.SETTERS;
    const { media, seasonNumber, seasonName, libraryButtonColor } = GLOBALS.GETTERS;
    const { seasons } = media;

    if (media instanceof TV) {
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
                            await media.requestSeasonDetails(index);
                            setSeasonNumber(index);
                            setMedia(media);
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
            const episodeDate = media.seasons[seasonNumber].episodes[i].air_date;
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

                                if (media.seasons[seasonNumber].episodes[i]["watched"]) {
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
                                const newTV = copyMedia(media);
                                if (!(newTV instanceof TV)) {
                                    return;
                                }

                                if (newTV.seasons[seasonNumber].episodes[i]["watched"] == true) {
                                    newTV.seasons[seasonNumber].episodes[i]["watched"] = false;
                                    DBAdd(objectStoreNameLibrary, newTV);
                                } else {
                                    newTV.seasons[seasonNumber].episodes[i]["watched"] = true;
                                    setAddLibraryButtonColor(green);
                                    newTV.inLibrary = true;
                                    DBAdd(objectStoreNameLibrary, newTV);

                                    if (libraryButtonColor != "transparent") {
                                        setupLibraryPage(GLOBALS);
                                    }
                                }

                                misPostTV(String(newTV.id), newTV.name, String(localStorage.getItem("session_id")), undefined, [
                                    [seasonNumber, i + 1, newTV.seasons[seasonNumber].episodes[i]["watched"]],
                                ]);

                                setMedia(newTV);
                            }
                        }}
                    >
                        <span>
                            <strong>{i + 1}. </strong>
                            {media.seasons[seasonNumber].episodes[i].name}
                            {epsiodeRuntime(setupRuntime(media.seasons[seasonNumber].episodes[i].runtime, true))}
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
            backgroundColor = purple;
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
    let movie_runtime = setupRuntime(runtime, false);

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

function setupRuntime(runtime: number[] | null, episodeBoolean: boolean) {
    if (episodeBoolean) {
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

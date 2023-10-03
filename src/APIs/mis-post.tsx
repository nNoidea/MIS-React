export function misPostMovie(id: string, title: string, session_id: string, libraryBoolean?: boolean, watchedBoolean?: boolean) {
    let userRequestString = generateUserRequestForMovie();
    misPost("movie", session_id, userRequestString);

    function generateUserRequestForMovie() {
        let userRequest = {
            title: title,
            id: id,
            library: libraryBoolean,
            watched: watchedBoolean,
        };

        // turn the object into a string
        let userRequestString = JSON.stringify(userRequest);
        return userRequestString;
    }
}

export function misPostTV(TVID: string, tvName: string, session_id: string, libraryBoolean?: boolean, episodeArray?: any[]) {
    let jsonArray: any[] = [];

    if (episodeArray != undefined) {
        for (let i = 0; i < episodeArray.length; i++) {
            jsonArray.push(generateEpisode(episodeArray[i][0], episodeArray[i][1], episodeArray[i][2]));
        }
    }

    let userRequestString = generateUserRequestForTV();
    misPost("tv", session_id, userRequestString);

    function generateUserRequestForTV() {
        let userRequest = {
            title: tvName,
            id: TVID,
            library: libraryBoolean,
            episodes: jsonArray,
        };

        // turn the object into a string
        let userRequestString = JSON.stringify(userRequest);
        return userRequestString;
    }

    function generateEpisode(seasonNumber: number, episodeNumber: number, watched: boolean) {
        let episode = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            watched: watched,
        };

        return episode;
    }
}

function misPost(mode: string, session_id: string, userRequest: string) {
    let formdata = new FormData();
    formdata.append("session_id", session_id);
    formdata.append("userRequest", userRequest);

    let requestOptions: RequestInit = {
        method: "POST",
        body: formdata,
        redirect: "follow",
    };

    fetch(`https://mis-post.zugo.workers.dev?mode=${mode}`, requestOptions)
        .catch((error) => console.log("error", error));
}

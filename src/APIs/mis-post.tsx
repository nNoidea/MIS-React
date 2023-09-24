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
    let userRequestString = generateUserRequestForTV();
    misPost("tv", session_id, userRequestString);

    function generateUserRequestForTV() {
        let userRequest = {
            title: tvName,
            id: TVID,
            library: libraryBoolean,
            episodes: episodeArray,
        };

        // turn the object into a string
        let userRequestString = JSON.stringify(userRequest);
        return userRequestString;
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
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
}

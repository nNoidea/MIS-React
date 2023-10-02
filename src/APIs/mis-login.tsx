export async function misLoginOrRegister(email: string, password: string, session_id: string, mode: string) {
    let formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("session_id", session_id);

    let requestOptions: RequestInit = {
        method: "POST",
        body: formdata,
        redirect: "follow" as RequestRedirect,
    };

    if (mode == "login" || mode == "register") {
        fetch(`https://mis-login.zugo.workers.dev/?mode=${mode}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log("result", result);

                // check if results contains anything but numbers
                if (result.match(/\D/g) != null) {
                    console.log("Error returned session id is not valid", result);
                    return false;
                } else {
                    // save the session id
                    localStorage.setItem("session_id", result);
                    localStorage.setItem("email", email);
                    return true;
                }
            })
            .catch((error) => {
                console.log("error", error);
                return false;
            });
    } else if (mode == "session_id") {
        let answer = await (await fetch(`https://mis-login.zugo.workers.dev/?mode=${mode}`, requestOptions)).text();

        console.log(answer);

        // if the answer is string
        if (String(answer) == "session id not found") {
            return false;
        } else {
            return JSON.parse(answer);
        }
    }
}

export async function misSessionLogin() {
    // Will return the user's cloud DB or false
    let session_id = localStorage.getItem("session_id");
    if (session_id === null) {
        console.log("No session id found");
        return false;
    }

    return JSON.parse(await misLoginOrRegister("", "", session_id, "session_id"));
}

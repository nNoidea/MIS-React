export function misLogin(email: string, password: string, session_id: string, mode: string) {
    let formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("session_id", session_id);

    let requestOptions: RequestInit = {
        method: "POST",
        body: formdata,
        redirect: "follow" as RequestRedirect,
    };

    fetch(`https://mis-login.zugo.workers.dev/?mode=${mode}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log("result", result);
            // save the session id
            localStorage.setItem("session_id", result);
            return true;
        })
        .catch((error) => {
            console.log("error", error);
            return false;
        });
}

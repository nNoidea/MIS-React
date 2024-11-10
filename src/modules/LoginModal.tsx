import { Button, Col, Form, Modal, ModalBody } from "react-bootstrap";
import { Globals } from "../interfaces/interfaces";
import { lightBlue } from "./colorPallete";
import "../css/LoginModal.css";
import { misLoginOrRegister } from "../APIs/mis-login";

export function LoginModal(GLOBALS: Globals) {
    const { loginModalShow } = GLOBALS.GETTERS;
    const { setLoginModalShow } = GLOBALS.SETTERS;

    let emailLogin = "";
    let passwordLogin = "";

    let emailRegister = "";
    let passwordRegister1 = "";
    let passwordRegister2 = "";

    function handleInputFields(emailLogin: string, passwordLogin: string, emailRegister: string, passwordRegister1: string, passwordRegister2: string) {
        function checkEmail(email: string) {
            if (email.length > 320) {
                console.log("email length");
                return false;
            }

            // email has to be in the form of "example@example.suffix"
            let emailRegex = new RegExp("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}");
            if (emailRegex.test(email)) {
                return true;
            } else {
                console.log("email regex");
                return false;
            }
        }

        function checkPassword(password: string) {
            // Password has to be between 8 and 64 characters
            if (password.length < 8 || password.length > 64) {
                console.log("password length");
                return false;
            }
            // Password has to contain at least one uppercase letter and one lowercase letter
            let uppercaseRegex = new RegExp("[A-Z]");
            let lowercaseRegex = new RegExp("[a-z]");
            if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password)) {
                console.log("no uppercase or lowercase");

                return false;
            }
            // Password has to contain at least one number
            let numberRegex = new RegExp("[0-9]");
            if (!numberRegex.test(password)) {
                console.log("no number");

                return false;
            }
            // Password has to contain at least one special character
            let specialCharacterRegex = new RegExp("[^A-Za-z0-9]");
            if (!specialCharacterRegex.test(password)) {
                console.log("no special character");
                return false;
            }

            return true;
        }

        function LoginUser(email: string, password: string) {
            misLoginOrRegister(email, password, "", "login");
        }
        function RegisterUser(email: string, password: string) {
            misLoginOrRegister(email, password, "", "register");
        }

        // Check which input field is filled
        // If login is filled, check if it's valid
        if (emailLogin != "" && passwordLogin != "") {
            if (checkEmail(emailLogin) && checkPassword(passwordLogin)) {
                LoginUser(emailLogin, passwordLogin);
                return true;
            }
            // If Login is filled, but not valid, continue to check if register is filled
        }
        // If register is filled, check if it's valid
        if (emailRegister != "" && passwordRegister1 != "" && passwordRegister2 != "") {
            if (checkEmail(emailRegister) && checkPassword(passwordRegister1)) {
                if (passwordRegister1 == passwordRegister2) {
                    RegisterUser(emailRegister, passwordRegister1);
                    return true;
                } else {
                    console.log("passwords don't match");
                }
            }
        }
        return false;
    }

    return (
        <Modal
            show={loginModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => {
                setLoginModalShow(false);
            }}
            id="loginModal"
        >
            <ModalBody id="LoginWrapper">{loginFields()}</ModalBody>
        </Modal>
    );
    function loginFields() {
        // if session id exists show email and logout button
        // else show login fields

        if (localStorage.getItem("session_id") != undefined && localStorage.getItem("session_id") != "") {
            return (
                <>
                    <h1>{localStorage.getItem("email")}</h1>
                    <Button
                        id="ContinueButton"
                        className="button"
                        style={{ backgroundColor: lightBlue }}
                        onClick={() => {
                            // set session id to ""
                            localStorage.setItem("session_id", "");
                            localStorage.setItem("email", "");
                            window.location.reload();
                        }}
                    >
                        Logout
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Form id="Login">
                        <h1>Login one more testasdas sdasdagaiaasdasdn</h1>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                onChange={(e) => {
                                    emailLogin = e.target.value;
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Col>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                        passwordLogin = e.target.value;
                                    }}
                                />
                            </Col>
                        </Form.Group>
                    </Form>

                    <Form id="Register">
                        <h1>Register</h1>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                onChange={(e) => {
                                    emailRegister = e.target.value;
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Col>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                        passwordRegister1 = e.target.value;
                                    }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Repeat Password</Form.Label>
                            <Col>
                                <Form.Control
                                    type="password"
                                    placeholder="Repeat Password"
                                    onChange={(e) => {
                                        passwordRegister2 = e.target.value;
                                    }}
                                />
                            </Col>
                        </Form.Group>
                    </Form>

                    <Button
                        id="ContinueButton"
                        className="button"
                        style={{ backgroundColor: lightBlue }}
                        onClick={() => {
                            handleInputFields(emailLogin, passwordLogin, emailRegister, passwordRegister1, passwordRegister2);
                        }}
                    >
                        Continue
                    </Button>
                </>
            );
        }
    }
}

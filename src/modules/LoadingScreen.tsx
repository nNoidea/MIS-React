import { Spinner } from "react-bootstrap";
import { red } from "./colorPallete";

export function LoadingScreen() {
    return (
        <div style={{ color: red, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <div className="text-center">
                <Spinner animation="border" />
            </div>
        </div>
    );
}

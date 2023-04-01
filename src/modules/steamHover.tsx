export function steamHover(ev: React.MouseEvent<HTMLImageElement>) {
    const rotationMultiplier = 40;

    let img = ev.currentTarget.children[0];
    let imgRect = (img as HTMLImageElement).getBoundingClientRect();

    let width = imgRect.width;
    let height = imgRect.height;

    let mouseX = ev.nativeEvent.offsetX;
    let mouseY = ev.nativeEvent.offsetY;

    let rotateX = xRotation(mouseY, height);
    let rotateY = yRotation(mouseX, width);
    let brightness = brightnessLevel(mouseY, height);

    if (img == null) {
        return;
    }

    if (img instanceof HTMLElement) {
        // use type guard to check if e.target is an HTMLElement
        img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`; // use style property to apply transform
        img.style.filter = `brightness(${brightness})`;
    }

    function xRotation(mouseY: number, height: number) {
        let poz = (mouseY / height) * 2 - 1; // mouse will be in -1 to 1
        return poz * -rotationMultiplier; // Up is negative, down is positive
    }

    function yRotation(mouseX: number, width: number) {
        let poz = (mouseX / width) * 2 - 1; // mouse will be in -1 to 1
        return poz * rotationMultiplier;
    }

    function brightnessLevel(mouseY: number, height: number) {
        let poz = (mouseY / height) * 2 - 1; // mouse will be in -1 to 1
        return 1 - poz * 0.8;
    }
}

export function steamHoverLeave(ev: React.MouseEvent<HTMLImageElement>) {
    let img = ev.currentTarget.children[0];

    if (img == null) {
        return;
    }

    if (img instanceof HTMLElement) {
        // use type guard to check if e.target is an HTMLElement
        img.style.transform = `rotateX(${0}deg) rotateY(${0}deg)`; // use style property to apply transform
        img.style.filter = `brightness(${1})`;
    }
}

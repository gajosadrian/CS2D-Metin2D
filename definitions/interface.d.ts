interface IVector {
    x: number;
    y: number;
}

interface IPosition {
    getX(): number;
    getY(): number;
    setPosition(x: number, y: number, ...args: any[]): void;
}

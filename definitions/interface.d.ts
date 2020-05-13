interface IPosition {
    getX(): number;
    getY(): number;
    setPosition(x: number, y: number, ...args: any[]): void;
}

interface IUpdateable {
    update(): void;
}

interface IDrawable {
    draw(): void;
}

interface IMob extends IPosition, IUpdateable, IDrawable {
    spawn(x: number, y: number): void;
    setPosition(x: number, y: number, rot: number, time?: number): void;
    setRotation(rot: number, time?: number): void;
    move(): void;
    moveTo(x: number, y: number, rot: number): void;
    attack(): void;
    updateTarget(): void;
    setTarget(id: number, isNPC?: boolean): void;
    setTargetPos(x: number, y: number): void;
    removeTarget(pos: boolean): void;
    removeTargetPos(): void;

    findPlayer(): number | undefined;
    isFreeline(tileX: number, tileY: number): boolean;
    isStepFree(): boolean;
    isInRange(x: number, y: number, range: number): boolean;
    isInObjectRange(id: number, range: number, isNPC?: boolean): boolean;
    seeTarget(): boolean;
    /** @tupleReturn */
    getNextStep(): [number, number, number];
    isTargetPos(): boolean;
    canAttack(): boolean;
    exists(): boolean;
    hasLegs(): boolean;
    getRotation(): number;
    getDir(x: number, y: number): number;
    getTileX(): number;
    getTileY(): number;

}

interface IMobTarget {

}

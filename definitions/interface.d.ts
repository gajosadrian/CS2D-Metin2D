interface IVector {
    x: number;
    y: number;
}

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
    setPosition(x: number, y: number, rotation: number, time?: number): void;
    setRotation(rotation: number, time?: number): void;
    move(): void;
    moveTo(x: number, y: number, rotation: number): void;
    attack(): void;
    updateTarget(): void;
    setTarget(id: number, isNPC?: boolean): void;
    setTargetPosition(x: number, y: number): void;
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

interface IImage extends IPosition {
    // Extra
    // useStrictPosition(set?: boolean): void;
    //

    pushTowards(time: number, dir: number, power: number, instantPosition?: boolean): void;

    setAlpha(alpha: number): void;
    getAlpha(): number;
    /**
     * Changes the blendmode of an image:
     *
     * >0 for normal (pixels are alpha blended, default mode)
     *
     * >1 for light (pixels are added)
     *
     * >2 for shade (pixels are multiplied)
     *
     * >3 for solid (pixels are overwritten, alpha transparency is ignored)
     */
    setBlend(blend: BlendMode): void;
    getBlend(): number;
    setColor(red: number, green: number, blue: number): void;
    /** @tupleReturn */
    getColor(): [number, number, number];
    setPosition(x: number, y: number, rotation?: number): void;
    getX(): number;
    getY(): number;
    /** @tupleReturn */
    getPosition(): [number, number];
    setRotation(rotation: number): void;
    getRotation(): number;
    setScale(x: number, y: number): void;
    /** @tupleReturn */
    getScale(): [number, number];
    setShadow(shadow: 0 | 1): void;
    isShadow(): boolean;

    setFrame(frame: number): void;
    nextFrame(): void;
    prevFrame(): void;

    /**
     * >0 - Loop Forward (play from current frame to last frame and then continue at first frame)
     *
     * >1 - Loop Backward (play from current frame to first frame and then continue at last frame)
     *
     * >2 - Ping Pong Forward (play forward to last frame and then backward to first frame etc.)
     *
     * >3 - Ping Pong Backward (play backward to first frame and then forward to last frame etc.)
     *
     * >4 - Random (an entirely random frame is displayed every speed milliseconds)
     */
    animateFrameConstantly(speed: number, mode: 0 | 1 | 2 | 3 | 4): void;
    animateRotationConstantly(speed: number): void;

    animateAlpha(time: number, alpha: number): void;
    animateColor(time: number, r: number, g: number, b: number): void;
    animateFrame(time: number, frame: number): void;
    animatePosition(time: number, x: number, y: number, rotation?: number): void;
    animateRotation(time: number, rotation: number): void;
    animateScale(time: number, x: number, y: number): void;
    isAnimating(): boolean;

    show(): void;
    hide(): void;
    remove(): void;
}
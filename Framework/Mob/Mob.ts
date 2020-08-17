import Image, { ImageMode } from '../Image/Image'

enum ATTACK_DIR {
    NONE,
    LEFT,
    RIGHT
}

interface ITarget {
    id?: number;
    x?: number;
    y?: number;
    isNPC?: boolean;
}

const { floor, pow, rad, deg, sin, cos, atan2, abs, pi } = math

export class Mob implements IMob {
    private name: string = 'Unknown'
    private path: string;
    private legsPath: string;
    private img: number;
    private legsImg: string;
    private hd: boolean = false
    private hp: number = 0
    private attackDist: number = 0
    private attackDelay: number = 0
    private attackDmg: number = 0
    private attackDir: ATTACK_DIR = ATTACK_DIR.NONE
    private viewDist: number = 0
    private movementSpeed: number = 0
    private movementDelay: number = 0
    private hitzone: number = 0
    private frame: number = 1
    private target: ITarget = {
        isNPC: false
    };

    constructor() {}

    spawn(x: number, y: number): void {
        if (! this.path) {
            print_error('MOB ERROR: image path isn\'t set')
        }

        for(let i of forRange(1, 10))  {

        }
    }

    setPosition(x: number, y: number, rot: number, time?: number | undefined): void {
        throw new Error("Method not implemented.");
    }

    setRotation(rot: number, time?: number | undefined): void {
        throw new Error("Method not implemented.");
    }

    move(): void {
        throw new Error("Method not implemented.");
    }

    moveTo(x: number, y: number, rot: number): void {
        throw new Error("Method not implemented.");
    }

    attack(): void {
        throw new Error("Method not implemented.");
    }

    updateTarget(): void {
        throw new Error("Method not implemented.");
    }

    setTarget(id: number, isNPC?: boolean | undefined): void {
        throw new Error("Method not implemented.");
    }

    setTargetPosition(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }

    removeTarget(pos: boolean): void {
        throw new Error("Method not implemented.");
    }

    removeTargetPos(): void {
        throw new Error("Method not implemented.");
    }

    findPlayer(): number | undefined {
        throw new Error("Method not implemented.");
    }

    isFreeline(tileX: number, tileY: number): boolean {
        throw new Error("Method not implemented.");
    }

    isStepFree(): boolean {
        throw new Error("Method not implemented.");
    }

    isInRange(x: number, y: number, range: number): boolean {
        throw new Error("Method not implemented.");
    }

    isInObjectRange(id: number, range: number, isNPC?: boolean | undefined): boolean {
        throw new Error("Method not implemented.");
    }

    seeTarget(): boolean {
        throw new Error("Method not implemented.");
    }

    getNextStep(): [number, number, number] {
        throw new Error("Method not implemented.");
    }

    isTargetPos(): boolean {
        throw new Error("Method not implemented.");
    }

    canAttack(): boolean {
        throw new Error("Method not implemented.");
    }

    exists(): boolean {
        throw new Error("Method not implemented.");
    }

    hasLegs(): boolean {
        throw new Error("Method not implemented.");
    }

    getRotation(): number {
        throw new Error("Method not implemented.");
    }

    getDir(x: number, y: number): number {
        throw new Error("Method not implemented.");
    }

    getTileX(): number {
        throw new Error("Method not implemented.");
    }

    getTileY(): number {
        throw new Error("Method not implemented.");
    }

    getX(): number {
        throw new Error("Method not implemented.");
    }

    getY(): number {
        throw new Error("Method not implemented.");
    }

    update(): void {
        throw new Error("Method not implemented.");
    }

    draw(): void {
        throw new Error("Method not implemented.");
    }
}

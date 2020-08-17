interface IMob extends IPosition {
  draw(): void;
  update(): void;
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

interface IMobTarget {}

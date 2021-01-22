/**
 * Returns ID of the timer.
 * @noSelf
 * */
declare function timerEx(delayMs: number, func: Function, count: number, ...args: any[]): number
/** @noSelf */
declare function freetimerEx(timerExId: number): boolean

/** @noSelfInFile */

/**
 * Returns ID of the timer.
 */
declare function timerEx(delayMs: number, func: Function, count: number, ...args: any[]): number
declare function freetimerEx(timerExId: number): boolean

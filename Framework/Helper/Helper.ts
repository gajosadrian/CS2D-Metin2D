/** @noSelfInFile */

const { ceil, floor, sqrt } = math
const { remove } = table

export class Helper {
    static math_round(num: number, base?: number) {
        if (! base) {
            // Ternary gets transpiled into garbage, so use classic if else
            if (num < 0) {
                return ceil(num - 0.5)
            } else {
                return floor(num + 0.5)
            }
        }
        if (base > 0) {
            base = 10 ** base
            num = num * base
        }
        if (num < 0) {
            return ceil(num - 0.5) / base
        } else {
            return floor(num + 0.5) / base
        }
    }

    static table_slice(array: any[], first: number, last: number, step: number = 1) {
        let sliced = []
        for (let i of forRange(first || 0, last || array.length - 1, step)) {
            sliced[sliced.length] = array[i]
        }
        return sliced
    }

    static table_chunks(array: any[], chunkSize: number) {
        let temp = []
        let j = array.length - 1
        for (let i of forRange(0, j, chunkSize)) {
            temp[temp.length] = this.table_slice(array, i, i + chunkSize)
        }
        return temp
    }

    static table_removeValue(array: any[], value: any) {
        const index = array.indexOf(this)
        remove(array, index)
    }

    static getDistance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2
        const dy = y1 - y2
        return sqrt(dx*dx + dy*dy)
    }

    static isInRange(x1: number, y1: number, x2: number, y2: number, range: number): boolean {
        const dx = x1 - x2
        const dy = y1 - y2
        return (dx*dx + dy*dy) <= (range*range)
    }

    static pixelToTile(pixel: number): number {
        return this.math_round((pixel - 16) / 32)
    }

    static tileToPixel(tile: number): number {
        return (tile * 32) + 16
    }
}

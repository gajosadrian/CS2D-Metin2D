/** @noSelfInFile */

// Batched 'parse' command
// Because it's faster to send many 'parse' commands
// in single call.

const { format } = string
const { concat } = table
const MAX_BUFFER = 512

export default class BatchParse {
    private static _buffer: string[] = []

    public static add(command: string): BatchParse {
        this._buffer[this._buffer.length] = command
        return BatchParse
    }

    /** @vararg */
    public static addf(command: string, ...args: Vararg<any>): BatchParse {
        const cmd = format(command, ...args)
        this._buffer[this._buffer.length] = cmd
        return BatchParse
    }

    public static exec(): void {
        if (this._buffer.length == 0) return;

        if (this._buffer.length > MAX_BUFFER) {
            const buffer_chunks = this.table_chunks(this._buffer, MAX_BUFFER)
            for (const i of forRange(0, buffer_chunks.length - 1)) {
              const buffer = buffer_chunks[i]
              const final = concat(buffer, ';')
              parse(final, 0)
            }
        } else {
            const final = concat(this._buffer, ';')
            parse(final, 0)
        }

        this.clear()
    }

    public static clear(): void {
        this._buffer = []
    }

    public static getBufferArray(): any {
        return this._buffer
    }

    public static getBufferCount(): number {
        return this._buffer.length
    }

    private static table_slice(array: any[], first: number, last: number, step: number = 1) {
        const sliced = []
        for (const i of forRange(first ?? 0, last ?? array.length - 1, step)) {
            sliced[sliced.length] = array[i]
        }
        return sliced
    }

    private static table_chunks(array: any[], chunkSize: number) {
        const temp = []
        const j = array.length - 1
        for (const i of forRange(0, j, chunkSize)) {
            temp[temp.length] = this.table_slice(array, i, i + chunkSize)
        }
        return temp
    }
}

declare module 'lib/chunks/chunks' {
    export class Chunk {
        setData(key: string, data: any): void
        removeData(key: string): void
        addToCollection(channe: string, data: any): void
        removeFromCollection(channel: string, where?: object, neighbours?: boolean): void
        getFromCollection(channel: string, where?: object, neighbours?: boolean): any[]
        changeCollectionChunk(newChunk: Chunk, channel: string, where?: object): void
        getNeighbours(): Chunk[]
    }
    export class ChunksMap {
        static new(width?: number, height?: number): ChunksMap
        initEntity(channel: string, obj: object, x: number, y: number): void
        updateEntity(obj: object, x: number, y: number): void
        getChunkById(chunkId: number): Chunk | null
        getChunkIdAt(x: number, y: number): number | null
        getChunkAt(x: number, y: number): Chunk | null
        setData(chunkId: number, key: string, data: any): void
        removeData(chunkId: number, key: string): void
        addToCollection(chunkId: number, channe: string, data: any): void
        removeFromCollection(chunkId: number, channel: string, where?: object, neighbours?: boolean): void
        getFromCollection(chunkId: number, channel: string, where?: object, neighbours?: boolean): any[]
    }
}

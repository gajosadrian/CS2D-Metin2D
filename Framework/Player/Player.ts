/** @noSelfInFile */

const players: Player[] = []

class Player {
    constructor(public id: PlayerID) {
        this.init(id)
    }

    static add(id: PlayerID) {
        // TODO: try to remove old one if exists
        return new Player(id)
    }

    static getInstance(id: PlayerID): Player | undefined {
        return players[id] || undefined
    }

    init(id: PlayerID): void {
        this.id = id
        players[id] = this
    }

    remove(): void {
        delete players[this.id]
        this.id = 0
    }
}

export default Player

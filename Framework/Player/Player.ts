/** @noSelfInFile */

import { PlayerData } from './PlayerData'
import { Helper } from '../Helper/Helper'

const _player = player

const PLAYERS: Player[] = []
const PLAYERS_ID: Player[] = []

export class Player {
    private x: number = 0
    private y: number = 0

    public data: PlayerData

    constructor(public id: PlayerID) {
        this.init(id)

        // this.data = PlayerData.getInstance()
    }

    private init(id: PlayerID) {
        PLAYERS[PLAYERS.length] = this
        PLAYERS_ID[id] = this
    }

    remove() {
        delete PLAYERS_ID[this.id]
        Helper.table_removeValue(PLAYERS, this)
        this.id = 0
    }

    static add(id: PlayerID) {
        // Make sure that last player with this id is removed
        if (PLAYERS_ID[id]) PLAYERS_ID[id].remove()

        return new Player(id)
    }

    static getInstance(id: PlayerID): Player {
        return PLAYERS_ID[id]
    }

    static exists(id: PlayerID): boolean {
        return _player(id, 'exists')
    }

    getX(precise: boolean = false) {
        if (precise) this.x = _player(this.id, 'x')
        return this.x
    }

    getY(precise: boolean = false) {
        if (precise) this.y = _player(this.id, 'y')
        return this.y
    }

    getTileX(precise: boolean = false) {
        if (precise) return _player(this.id, 'tilex')
        return Helper.pixelToTile( this.getX() )
    }

    getTileY(precise: boolean = false) {
        if (precise) return _player(this.id, 'tiley')
        return Helper.pixelToTile( this.getY() )
    }

    /** @tupleReturn */
    getPosition(precise: boolean = false): [number, number] {
        return [this.getX(precise), this.getY(precise)]
    }

    /** @tupleReturn */
    getTilePosition(precise: boolean = false): [number, number] {
        return [this.getTileX(precise), this.getTileY(precise)]
    }

    updatePosition() {
        this.x = this.getX(true)
        this.y = this.getY(true)
    }

    static getPlayers(type: PlayerValueTable = 'table'): Player[] {
        if (type == 'table') return PLAYERS

        const table = _player(0, type)
        const players: Player[] = []
        for (const i of forRange(0, table.length - 1)) {
            players[players.length] = this.getInstance(table[i])
        }
        return players
    }

    static getPlayersAlive(): Player[] {
        return Player.getPlayers('tableliving')
    }
}

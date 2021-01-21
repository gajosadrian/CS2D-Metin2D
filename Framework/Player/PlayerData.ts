/** @noSelfInFile */

import { Player } from './Player'

const { floor, random } = math

const DATA: PlayerData[] = []

export class PlayerData {
    private key: string

    constructor(private player: Player) {
        this.generateKey(16)
    }

    generateKey(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const charactersLength = characters.length
        let result = ''
        for (const i of forRange(0, length - 1)) {
            result += characters.charAt( random(0, charactersLength - 1) )
        }
        this.key = result
    }

    getKey() {
        return this.key
    }
}

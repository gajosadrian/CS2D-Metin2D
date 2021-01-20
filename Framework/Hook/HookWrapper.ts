/** @noSelfInFile */

import { Hook } from './Hook'
import { Player } from '../Player/Player'

class HookWrapper {
    /** @noSelf **/
    public static onJoin(id: PlayerID) {
        const player = Player.add(id)

        Hook.call('join', player)
    }

    /** @noSelf **/
    public static onLeave(id: PlayerID, reason: string) {
        const player = Player.getInstance(id)

        Hook.call('remove', player, reason)
        Player.remove(id)
    }

    /** @noSelf **/
    public static onMs100() {
        const players = Player.getPlayers()

        for (const i of forRange(0, players.length - 1)) {
            const player = players[i]
            player.updatePosition()
        }

        Hook.call('ms100')
    }
}

declare var __CS2DHookWrapper__: any
__CS2DHookWrapper__ = HookWrapper

addhook('join', '__CS2DHookWrapper__.onJoin')
addhook('leave', '__CS2DHookWrapper__.onLeave')
addhook('ms100', '__CS2DHookWrapper__.onMs100')

/** @noSelfInFile */

import Hook from './Hook'
import Player from '../Player/Player'

class HookWrapper {
    /** @noSelf **/
    public static onJoin(id: PlayerID) {
        const player = Player.add(id)

        Hook.call('join', player)
    }
}

declare var __CS2DHookWrapper__: any
__CS2DHookWrapper__ = HookWrapper

addhook('join', '__CS2DHookWrapper__.onJoin')

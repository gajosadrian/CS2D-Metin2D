/** @noSelfInFile */

import { Hook } from './Hook'
import { Player } from '../Player/Player'
import { Item } from '../Item/Item'

class HookWrapper {
    /** @noSelf **/
    public static Startround() {
        Item.clearTables()
        const itemIds = item(0, 'table')
        for (const i of forRange(0, itemIds.length - 1)) {
            const itemId = itemIds[i]
            new Item(item(itemId, 'type'), item(itemId, 'x'), item(itemId, 'y'), undefined, undefined, itemId)
        }
    }

    /** @noSelf **/
    public static Join(id: PlayerID) {
        const player = Player.add(id)

        Hook.call('join', player)
    }

    /** @noSelf **/
    public static Leave(id: PlayerID, reason: string) {
        const player = Player.getInstance(id)

        Hook.call('remove', player, reason)
        player.remove()
    }

    /** @noSelf **/
    public static Ms100() {
        const players = Player.getPlayers()

        for (const i of forRange(0, players.length - 1)) {
            const player = players[i]
            player.updatePosition()
        }

        Hook.call('ms100')
    }

    /** @noSelf **/
    public static Second() {
        const items = Item.getItems()

        msg(`${items.length}/${item(0, 'table').length} items`)

        Hook.call('second')
    }

    /** @noSelf **/
    public static Collect(playerId: PlayerID, itemId: number, itemTypeId: WeaponItemType, ammoIn: number, ammo: number, mode: number) {
        // msg(`playerId[${playerId}] itemId[${itemId}] itemTypeId[${itemTypeId}] ammoIn[${ammoIn}] ammo[${ammo}] mode[${mode}]`)
    }
}

declare var __CS2DHookWrapper__: any
__CS2DHookWrapper__ = HookWrapper

addhook('startround', '__CS2DHookWrapper__.Startround'); __CS2DHookWrapper__.Startround()
addhook('join', '__CS2DHookWrapper__.Join')
addhook('leave', '__CS2DHookWrapper__.Leave')
addhook('ms100', '__CS2DHookWrapper__.Ms100')
addhook('second', '__CS2DHookWrapper__.Second')
addhook('collect', '__CS2DHookWrapper__.Collect')

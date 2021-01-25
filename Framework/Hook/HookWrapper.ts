/** @noSelfInFile */

import { Hook } from './Hook'
import { Parse } from '../Parse/Parse'
import { Player } from '../Player/Player'
import { Item } from '../Item/Item'

class HookWrapper {
    /** @noSelf **/
    public static Startround() {
        Item.clearTables()

        // const itemIds = item(0, 'table')
        // for (const i of forRange(0, itemIds.length - 1)) {
        //     const itemId = itemIds[i]
        //     new Item(item(itemId, 'type'), item(itemId, 'x'), item(itemId, 'y'), undefined, undefined, itemId)
        // }
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

        // DEBUG
        if (true) {
            const id = 1
            let x = 50, y = 200
            const white = String.fromCharCode(169)+`255255255`
            const items = Item.getItems()

            Parse.add(`hudtxt2 ${id} 199 "${white}${items.length}/${item(0, 'table').length} items" ${x} ${y}`)
            Parse.exec()
        }

        Hook.call('ms100')
    }

    /** @noSelf **/
    public static Second() {
        Hook.call('second')
    }

    /** @noSelf **/
    public static Collect(playerId: PlayerID, itemId: number, itemTypeId: WeaponItemType, ammoIn: number, ammo: number, mode: number) {
        const player = Player.getInstance(playerId)
        const item = Item.getInstance(itemId)

        msg(`COLLECT playerId[${playerId}] itemId[${itemId}] itemTypeId[${itemTypeId}] ammoIn[${ammoIn}] ammo[${ammo}] mode[${mode}]`)

        Hook.call('collect', player, item)
        item.remove(itemId)
    }

    /** @noSelf **/
    public static Drop(playerId: PlayerID, itemId: number, itemTypeId: WeaponItemType, ammoIn: number, ammo: number, mode: number, tileX: number, tileY: number) {
        const player = Player.getInstance(playerId)
        const item = new Item(itemTypeId, tileX, tileY, ammoIn, ammo, itemId)

        msg(`DROP playerId[${playerId}] itemId[${itemId}] itemTypeId[${itemTypeId}] ammoIn[${ammoIn}] ammo[${ammo}] mode[${mode}] x[${tileX}] y[${tileY}]`)

        Hook.call('drop', player, item)
    }

    /** @noSelf **/
    public static Itemfadeout(itemId: number, itemTypeId: WeaponItemType, tileX: number, tileY: number) {
        const item = Item.getInstance(itemId)

        msg(`ITEMFADEOUT itemId[${itemId}] itemTypeId[${itemTypeId}] x[${tileX}] y[${tileY}]`)

        Hook.call('itemfadeout', item)
        item.remove(itemId)
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
addhook('drop', '__CS2DHookWrapper__.Drop')
addhook('itemfadeout', '__CS2DHookWrapper__.Itemfadeout')

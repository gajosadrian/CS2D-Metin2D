/** @noSelfInFile */

import { ItemType } from './ItemType'
import { Parse } from '../Parse/Parse'

const _item = item

const ITEMS: Item[] = []
const ITEMS_ID: Item[] = []

export class Item {
    id: number
    type: ItemType
    private _x: number
    private _y: number
    private _ammoIn?: number
    private _ammo?: number
    private _mode?: string
    private _dropped?: boolean

    constructor(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number) {
        this.type = ItemType.getInstance(typeId)

        this._x = x
        this._y = y
        this._ammoIn = ammoIn
        this._ammo = ammo
    }

    private init() {}

    private remove() {}

    static add(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number) {}

    getX(): number {
        return this._x
    }

    getY(): number {
        return this._y
    }

    /** @tupleReturn */
    getPosition(): [number, number] {
        return [this._x, this._y]
    }

    setAmmo(ammoIn: number = 1000, ammo: number = 1000) {
        Parse.add(`setammo ${this.id} 0 ${ammoIn} ${ammo}`)
    }

    getAmmoIn(): number {
        if (! this._ammoIn) this._ammoIn = _item(this.id, 'ammoin')
        return this._ammoIn
    }

    getAmmo(): number {
        if (! this._ammo) this._ammo = _item(this.id, 'ammo')
        return this._ammo
    }

    getMode(): string {
        if (! this._mode) this._mode = _item(this.id, 'mode')
        return this._mode
    }

    getDropped(): boolean {
        if (! this._dropped) this._dropped = _item(this.id, 'dropped')
        return this._dropped
    }

    getDropTimer(): number {
        return _item(this.id, 'droptimer')
    }

    getLastId(): number {
        const itemIds = _item(0, 'table')
        return itemIds[itemIds.length - 1]
    }
}

/** @noSelfInFile */

import { ItemType } from './ItemType'
import { Parse } from '../Parse/Parse'
import { Helper } from 'Framework/Helper'

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
    private _mode?: number
    private _dropped?: boolean

    constructor(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number, __id?: number) {
        this.type = ItemType.getInstance(typeId)

        this._x = x
        this._y = y
        this._ammoIn = ammoIn
        this._ammo = ammo

        ITEMS[ITEMS.length] = this
        this.spawn(typeId, x, y, ammoIn, ammo, __id)
    }

    static add(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number) {
        return new Item(typeId, x, y, ammoIn, ammo)
    }

    private spawn(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number, __id?: number) {
        if (! __id) Parse.instant(`spawnitem ${typeId} ${x} ${y} ${ammoIn} ${ammo}`)
        this.id = __id || Item.getNewId()
        ITEMS_ID[this.id] = this
    }

    private respawn(typeId: WeaponItemType, x: number, y: number, ammoIn?: number, ammo?: number) {
        this.destroy()
        this.spawn(typeId, x, y, ammoIn, ammo)
    }

    destroy(__id?: number) {
        if (! __id) Parse.instant(`removeitem ${this.id}`)
        delete ITEMS_ID[this.id]
        this.id = -1
    }

    remove(__id?: number) {
        this.destroy(__id)
        Helper.table_removeValue(ITEMS, this)
    }

    static getInstance(id: number): Item {
        return ITEMS_ID[id]
    }

    exists(): boolean {
        return _item(this.id, 'exists')
    }

    getX(): number {
        return this._x
    }

    getY(): number {
        return this._y
    }

    setPosition(x: number, y: number) {
        this.respawn(this.type.id, x, y, this.getAmmoIn(), this.getAmmo())
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

    getMode(): number {
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

    commitParse() {
        Parse.exec()
    }

    static getLastId(): number {
        const itemIds = _item(0, 'table')
        return itemIds[itemIds.length - 1]
    }

    static getNewId(): number {
        let id = 1
        while (ITEMS_ID[id]) {
            id++
        }
        return id
    }

    static getItems(): Item[] {
        return ITEMS
    }

    static getItemsAt(tileX: number, tileY: number): Item[] {
        const items: Item[] = []
        for (const i of forRange(0, ITEMS.length - 1)) {
            const item = ITEMS[i]
            if (item.getX() == tileX && item.getY() == tileY) {
                items[items.length] = item
            }
        }
        return items
    }

    static getCloseItems(tileX: number, tileY: number, range: number): Item[] {
        const items: Item[] = []
        for (const i of forRange(0, ITEMS.length - 1)) {
            const item = ITEMS[i]
            if (Helper.isInRange(tileX, tileY, item.getX(), item.getY(), range)) {
                items[items.length] = item
            }
        }
        return items
    }

    static clearTables() {
        ITEMS.length = 0
    }
}

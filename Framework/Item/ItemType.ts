/** @noSelfInFile */

const _itemtype = itemtype

const ITEMTYPES_ID: ItemType[] = []

export class ItemType {
    constructor(public id: WeaponItemType) {
        this.init(id)
    }

    static add(id: WeaponItemType) {
        return new ItemType(id)
    }

    private init(id: WeaponItemType) {
        ITEMTYPES_ID[id] = this
    }

    static getInstance(id: WeaponItemType): ItemType {
        return ITEMTYPES_ID[id] || ItemType.add(id)
    }

    // TODO: Prop caching

    getNameAttribute(): string {
        return _itemtype(this.id, 'name')
    }

    getDmgAttribute(): number {
        return _itemtype(this.id, 'dmg')
    }

    getDmgZ1Attribute(): number {
        return _itemtype(this.id, 'dmg_z1')
    }

    getDmgZ2Attribute(): number {
        return _itemtype(this.id, 'dmg_z2')
    }

    getRateAttribute(): number {
        return _itemtype(this.id, 'rate')
    }

    getReloadAttribute(): number {
        return _itemtype(this.id, 'reload')
    }

    getAmmoAttribute(): number {
        return _itemtype(this.id, 'ammo')
    }

    getAmmoInAttribute(): number {
        return _itemtype(this.id, 'ammoin')
    }

    getPriceAttribute(): number {
        return _itemtype(this.id, 'price')
    }

    getRangeAttribute(): number {
        return _itemtype(this.id, 'range')
    }

    getDispersionAttribute(): number {
        return _itemtype(this.id, 'dispersion')
    }

    getSlotAttribute(): number {
        return _itemtype(this.id, 'slot')
    }

    getRecoilAttribute(): number {
        return _itemtype(this.id, 'recoil')
    }
}

const { clock } = os
const { rad, abs, floor, cos, sin, pi } = math

enum ImageState {
    UPDATED, // up-to-date
    UPDATING, // to be updated
    CONSTANTLY // never will be up-to-date
}

enum Mode {
    floor,
    top,
    supertop,
    hud,
    background
}

enum Type {
    tile,
    player,
    map,
    gui
}

enum Blend {
    NORMAL,
    light,
    shade,
    solid
}

enum Flag {
    black,
    magenta,
    alpha,
    nomasking,

    drawalways = 10,
    rotate,
    wiggle,
    recoil
}

interface IProp {
    [key: string]: any
}

class Image implements IImage {
    private _id: number
    private _removed: boolean = false
    private _playerId?: number

    private _imageMode: ImageMode
    private _shadow: 0 | 1
    private _isSpritesheet: boolean = false

    private _animationClock: number = 0
    private _props: IProp = {
        position: {
            x: 0,
            y: 0,
            state: ImageState.UPDATED,
            clock: 0
        },
        scale: {
            x: 1,
            y: 1,
            state: ImageState.UPDATED,
            clock: 0
        },
        rotation: {
            value: 0,
            state: ImageState.UPDATED,
            clock: 0
        },
        color: {
            r: 255,
            g: 255,
            b: 255,
            state: ImageState.UPDATED,
            clock: 0
        },
        alpha: {
            value: 1,
            state: ImageState.UPDATED,
            clock: 0
        },
        frame: {
            value: 1,
            count: 0,
            state: ImageState.UPDATED,
            clock: 0
        },
        blend: {
            value: Blend.NORMAL,
        },
        size: {
            width: 0,
            height: 0
        },
        shadow: {
            value: 0
        }
    }

    constructor(imagePath: string, x: number, y: number, mode: ImageMode, playerId?: PlayerID) {
        this._imageMode = mode
        this._playerId = playerId
        this.setPosition(x, y)
    }

    setAlpha(alpha: number): void {
        this.setProp('alpha', 'value', alpha, ImageState.UPDATED, 0)

        imagealpha(this._id, alpha)
    }

    getAlpha(): number {
        this.tryUpdateProp('alpha', 'value', 'alpha')
        return this.getProp('alpha').value
    }

    setBlend(blend: BlendMode): void {
        this.setProp('blend', 'value', blend, ImageState.UPDATED)

        imageblend(this._id, blend)
    }

    getBlend(): number {
        return this.getProp('blend').value
    }

    setColor(r: number, g: number, b: number): void {
        this.setProp('color', 'r', r)
        this.setProp('color', 'g', g)
        this.setProp('color', 'b', b, ImageState.UPDATED, 0)

        imagecolor(this._id, r, g, b)
    }

    getColor(): [number, number, number] {
        const color = this.getProp('color')
        return [color.r, color.g, color.b]
    }

    setPosition(x: number, y: number, rotation?: number): void {
        this.setProp('position', 'x', x)
        this.setProp('position', 'y', y, ImageState.UPDATED, 0)

        if (rotation) {
            this.setProp('rotation', 'value', rotation, ImageState.UPDATED, 0)
        }

        imagepos(this._id, x, y, this.getProp('rotation').value)
    }

    getPosition(): [number, number] {
        this.tryUpdatePosition()
        const position = this.getProp('position')
        return [position.x, position.y]
    }

    getX(): number {
        this.tryUpdatePosition()
        return this.getProp('position').x
    }

    getY(): number {
        this.tryUpdatePosition()
        return this.getProp('position').y
    }

    setRotation(rotation: number): void {
        this.setPosition(this.getX(), this.getY(), rotation)
    }

    getRotation(): number {
        this.tryUpdateProp('rotation', 'value', 'rot')
        return this._props.rotation.value
    }

    setScale(x: number, y: number): void {
        this.setProp('scale', 'x', x)
        this.setProp('scale', 'y', y, ImageState.UPDATED, 0)

        imagescale(this._id, x, y)
    }

    getScale(): [number, number] {
        return [this._props.scale.x, this._props.scale.y]
    }

    getScaleX(): number {
        return this.getProp('scale').x
    }

    getScaleY(): number {
        return this.getProp('scale').y
    }

    getSize(): [number, number] {
        const size = this.getProp('size')
        return [size.width, size.height]
    }

    getWidth(): number {
        this.tryUpdateProp('size', 'width', 'width')
        return this.getProp('size').width
    }

    getHeight(): number {
        this.tryUpdateProp('size', 'height', 'height')
        return this.getProp('size').height
    }

    setFrame(frame: number): void {
        this.setProp('frame', 'value', frame, ImageState.UPDATED, 0)

        imageframe(this._id, frame)
    }

    getFrame(): number {
        this.tryUpdateProp('frame', 'value', 'frame')
        return this.getProp('frame').value
    }

    getFrameCount(): number {
        this.tryUpdateProp('frame', 'count', 'framecount')
        return this.getProp('frame').count
    }

    nextFrame(): void {
        this.setFrame(this.getProp('frame').value + 1)
    }

    prevFrame(): void {
        this.setFrame(this.getProp('frame').value - 1)
    }

    setShadow(shadow: 0 | 1): void {
        this._shadow = shadow

        imageshadow(this._id, shadow)
    }

    isShadow(): boolean {
        return this._shadow == 1
    }

    animateFrameConstantly(speed: number, mode: 0 | 1 | 2 | 3 | 4): void {
        this.setPropState('frame', ImageState.CONSTANTLY, -1)

        tween_animate(this._id, speed, mode)
    }

    animateRotationConstantly(speed: number): void {
        this.setPropState('rotation', ImageState.CONSTANTLY, -1)

        tween_rotateconstantly(this._id, speed)
    }

    animateAlpha(time: number, alpha: number): void {
        this.setPropState('alpha', ImageState.UPDATING, time)

        tween_alpha(this._id, time, alpha)
    }

    animateColor(time: number, r: number, g: number, b: number): void {
        this.setPropState('color', ImageState.UPDATING, time)

        tween_color(this._id, time, r, g, b)
    }

    animateFrame(time: number, frame: number): void {
        this.setPropState('frame', ImageState.UPDATING, time)

        tween_frame(this._id, time, frame)
    }

    animatePosition(time: number, x: number, y: number, rotation?: number, instantPosition?: boolean): void {
        if (! instantPosition && time > 100) {
            this.setPropState('position', ImageState.UPDATING, time)
        } else {
            this.setProp('position', 'x', x)
            this.setProp('position', 'y', y, ImageState.UPDATED, 0)
        }

        this.setProp('rotation', 'value', rotation, ImageState.UPDATED, 0)

        tween_move(this._id, time, x, y, rotation)
    }

    animateRotation(time: number, rot: number): void {
        this.setPropState('rotation', ImageState.UPDATING, time)

        tween_rotate(this._id, time, rot)
    }

    animateScale(time: number, x: number, y: number): void {
        this.setPropState('scale', ImageState.UPDATING, time)

        tween_scale(this._id, time, x, y)
    }

    isAnimating(key?: string): boolean {
        const clockTime = clock()

        if (key) {
            const prop = this.getProp(key)
            return prop.clock == -1 || prop.clock >= clockTime
        }

        return this._animationClock == -1 || this._animationClock >= clockTime
    }

    private setAnimationClock(key: string, time: number): void {
        const newAnimationClock = clock() + (time * 0.001)
        const prop = this.getProp(key)

        if (prop.clock < newAnimationClock) {
            prop.clock = newAnimationClock
            this._animationClock = newAnimationClock
        }
    }

    show(): void {
        this.setAlpha(1)
    }

    hide(): void {
        this.setAlpha(0)
    }

    remove(): void {
        this._removed = true
        freeimage(this._id)
        delete this._id
    }

    private setProp(key: string, field: string, val: any, state?: ImageState, animationTime?: number): void {
        const prop = this.getProp(key)

        if (state) {
            prop.state = state
        }

        if (animationTime) {
            this.setAnimationClock(key, animationTime)
        }

        prop[field] = val
    }

    private setPropState(key: string, state: ImageState, animationTime?: number): void {
        const prop = this.getProp(key)

        prop.state = ImageState

        if (animationTime) {
            this.setAnimationClock(key, animationTime)
        }
    }

    private getProp(key: string): IProp {
        return this._props[key]
    }

    private tryUpdatePosition(): void {
        const position = this._props.position

        if (position.state != ImageState.UPDATED) {
            if (! this.isAnimating('position')) {
                position.state = ImageState.UPDATED
            }
            position.x = imageparam(this._id, 'x')
            position.y = imageparam(this._id, 'y')
        }
    }

    private tryUpdateProp(key: string, field: string, param: any): void {
        const prop = this.getProp(key)

        if (prop.state != ImageState.UPDATED) {
            if (! this.isAnimating(key)) {
                prop.state = ImageState.UPDATED
            }

            prop[field] = imageparam(this._id, <any>param)
        }
    }

    /**
     * STATIC
     */

    static PlayerImage(path: string, mode: Mode, playerId: PlayerID, flags: any, _playerId: PlayerID): any {}
    static MapImage(path: string, mode: Mode, x: number, y: number, flags: any, _playerId: PlayerID) {}
    static TileImage(tileId: number, mode: Mode, x: number, y: number, flags: any, _playerId: PlayerID) {}
    static GUIImage(path: string, x: number, y: number, flags: any, _playerId: PlayerID) {}
}

export {
    Image,
    Mode,
    Type,
    Blend,
    Flag
}
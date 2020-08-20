/** @noSelfInFile */

import Player from '../Player/Player'

const { clock } = os

enum ImageState {
    UPDATED, // up-to-date
    UPDATING, // to be updated
    CONSTANTLY // never will be up-to-date
}

enum ImageMode {
    FLOOR,
    TOP,
    HUD,
    SUPER_TOP,
    BACKGROUND
}

enum ImageType {
    TILE,
    PLAYER,
    MAP,
    GUI
}

enum ImageBlend {
    NORMAL,
    LIGHT,
    SHADE,
    SOLID
}

enum ImageFlag {
    BLACK,
    MAGENTA,
    ALPHA,
    NO_MASKING,
    DRAW_ALWAYS = 10,
    ROTATE,
    WIGGLE,
    RECOIL
}

interface IProp {
    [key: string]: any
}

export default class Image implements IImage {
    private _id: number
    public player: Player | undefined = undefined

    private _path: string
    private _mode: ImageMode
    private _shadow: 0 | 1

    private _animatingProps = ['position', 'scale', 'rotation', 'color', 'alpha', 'frame']
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
            value: ImageBlend.NORMAL,
        },
        size: {
            width: 0,
            height: 0
        },
        shadow: {
            value: 0
        }
    }

    constructor(path: string, x: number, y: number, mode: ImageMode, playerId?: PlayerID) {
        this._path = path
        this._mode = mode
        if (playerId) this.player = Player.getInstance(playerId)

        this.setProp('blend', 'value', ImageBlend.NORMAL, ImageState.UPDATED)
        this.setProp('position', 'x', x)
        this.setProp('position', 'y', y, ImageState.UPDATED)
        this.setProp('rotation', 'value', 0, ImageState.UPDATED)
    }

    isSpritesheet(): boolean {
        if (this._path.match('<spritesheet:')) {
            return true
        }
        return false
    }

    getMode(): ImageMode {
        return this._mode
    }

    setAlpha(alpha: number): void {
        this.setProp('alpha', 'value', alpha, ImageState.UPDATED)

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
        this.setProp('color', 'b', b, ImageState.UPDATED)

        imagecolor(this._id, r, g, b)
    }

    getColor(): [number, number, number] {
        const color = this.getProp('color')
        return [color.r, color.g, color.b]
    }

    setPosition(x: number, y: number, rotation?: number): void {
        this.setProp('position', 'x', x)
        this.setProp('position', 'y', y, ImageState.UPDATED)

        if (rotation) {
            this.setProp('rotation', 'value', rotation, ImageState.UPDATED)
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
        this.setProp('scale', 'y', y, ImageState.UPDATED)

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
        this.setProp('frame', 'value', frame, ImageState.UPDATED)

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
        this.setPropState('frame', ImageState.CONSTANTLY)

        tween_animate(this._id, speed, mode)
    }

    animateRotationConstantly(speed: number): void {
        this.setPropState('rotation', ImageState.CONSTANTLY)

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
            this.setProp('position', 'y', y, ImageState.UPDATED)
        }

        this.setProp('rotation', 'value', rotation, ImageState.UPDATED)

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

        // if "key"
        if (key) {
            const prop = this.getProp(key)
            return prop.clock == -1 || prop.clock >= clockTime
        }

        // else: check all props
        for (const i of forRange(0, this._animatingProps.length)) {
            const key = this._animatingProps[i]
            const prop = this.getProp(key)

            if (prop.clock == -1 || prop.clock >= clockTime) {
                return true
            }
        }

        return false
    }

    private setAnimationClock(key: string, time: number): void {
        const prop = this.getProp(key)

        if (time > 0) {
            prop.clock = clock() + (time * 0.001)
        } else {
            prop.clock = time
        }
    }

    show(): void {
        this.setAlpha(1)
    }

    hide(): void {
        this.setAlpha(0)
    }

    remove(): void {
        freeimage(this._id)
        delete this._id
    }

    private setProp(key: string, field: string, val: any, state?: ImageState, animationTime: number = 0): void {
        const prop = this.getProp(key)

        if (state) {
            prop.state = state
        }

        if (prop.state == ImageState.CONSTANTLY) {
            animationTime = -1
        }

        this.setAnimationClock(key, animationTime)
        prop[field] = val
    }

    private setPropState(key: string, state: ImageState, animationTime: number = 0): void {
        const prop = this.getProp(key)

        prop.state = state

        if (prop.state == ImageState.CONSTANTLY) {
            animationTime = -1
        }

        this.setAnimationClock(key, animationTime)
    }

    private getProp(key: string): IProp {
        return this._props[key]
    }

    private tryUpdatePosition(): void {
        const position = this._props.position

        if (position.state == ImageState.UPDATED) return;

        if (position.state == ImageState.UPDATING) {
            if (! this.isAnimating('position')) {
                position.state = ImageState.UPDATED
            }
        }

        position.x = imageparam(this._id, 'x')
        position.y = imageparam(this._id, 'y')
    }

    private tryUpdateProp(key: string, field: string, param: string): void {
        const prop = this.getProp(key)

        if (prop.state == ImageState.UPDATED) return;

        if (prop.state == ImageState.UPDATING) {
            if (! this.isAnimating(key)) {
                prop.state = ImageState.UPDATED
            }
        }

        prop[field] = imageparam(this._id, <any>param)
    }

    /**
     * STATIC
     */

    static PlayerImage(path: string, mode: ImageMode, playerId: PlayerID, flags: ImageFlag[], _playerId?: PlayerID): Image {
        if (mode == ImageMode.FLOOR) {
            mode = playerId + 100
        } else if (mode == ImageMode.TOP) {
            mode = playerId + 200
        } else if (mode == ImageMode.SUPER_TOP) {
            mode = playerId + 132
        }

        let x = 0
        let y = 0
        if (flags.includes(ImageFlag.DRAW_ALWAYS)) {
            y = 1
        }
        if (flags.includes(ImageFlag.ROTATE)) {
            x = 1
        } else if (flags.includes(ImageFlag.WIGGLE)) {
            x = 2
        } else if (flags.includes(ImageFlag.RECOIL)) {
            x = 3
        }

        if (flags.includes(ImageFlag.BLACK)) {
            //
        } else if (flags.includes(ImageFlag.MAGENTA)) {
            //
        } else if (flags.includes(ImageFlag.ALPHA)) {
            //
        } else {
            // no masking
        }

        return new Image(path, x, y, mode, _playerId)
    }
    static MapImage(path: string, mode: ImageMode, x: number, y: number, flags: ImageFlag[], _playerId?: PlayerID) {}
    static TileImage(tileId: number, mode: ImageMode, x: number, y: number, flags: ImageFlag[], _playerId?: PlayerID) {}
    static GUIImage(path: string, x: number, y: number, flags: ImageFlag[], _playerId?: PlayerID) {}
}

export {
    ImageMode,
    ImageType,
    ImageBlend,
    ImageFlag
}
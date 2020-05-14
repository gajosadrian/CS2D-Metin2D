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
    normal,
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

class Image implements IImage {
    private _animationClock: number = 0

    private _id: number
    private _removed: boolean = false
    private _playerId?: number

    private _imageMode: ImageMode
    private _shadow: 0 | 1

    private _property = {
        color: {
            r: 255,
            g: 255,
            b: 255,
            state: ImageState.UPDATED
        },
        alpha: {
            value: 1,
            state: ImageState.UPDATED
        },
        blend: {
            value: 0,
            state: ImageState.UPDATING
        },
        shadow: {
            value: 0
        },
        frame: {
            value: 1,
            state: ImageState.UPDATED
        }
    }

    private _transform = {
        position: {
            x: 0,
            y: 0,
            state: ImageState.UPDATED
        },
        scale: {
            x: 1,
            y: 1,
            state: ImageState.UPDATED
        },
        rotation: {
            value: 0,
            state: ImageState.UPDATED
        }
    }

    private _isSpritesheet: boolean = false

    constructor(imagePath: string, x: number, y: number, mode: ImageMode, playerId?: PlayerID) {
        this._imageMode = mode
        this._playerId = playerId
        this.setPosition(x, y)
    }

    setAlpha(alpha: number): void {
        if (this._removed) return
        imagealpha(this._id, alpha)
    }

    setBlend(blend: BlendMode): void {
        if (this._removed) return
        imageblend(this._id, blend)
    }

    setColor(r: number, g: number, b: number): void {
        if (this._removed) return
        imagecolor(this._id, r, g, b)
    }

    setPosition(x: number, y: number, rotation?: number): void {
        if (this._removed) return
        this._transform.position.x = x
        this._transform.position.y = y
        this._transform.position.state = ImageState.UPDATED

        if (rotation) {
            this._transform.rotation.value = rotation
            this._transform.rotation.state = ImageState.UPDATED
        }

        imagepos(this._id, x, y, this._transform.rotation.value)
    }

    setRotation(rotation: number): void {
        if (this._removed) return
        this.setPosition(this.getX(), this.getY(), rotation)
    }

    setScale(x: number, y: number): void {
        if (this._removed) return
        this._transform.scale.x = x
        this._transform.scale.y = y
        this._transform.scale.state = ImageState.UPDATED
        imagescale(this._id, x, y)
    }

    setShadow(shadow: 0 | 1): void {
        if (this._removed) return
        this._shadow = shadow
        imageshadow(this._id, shadow)
    }

    isShadow(): boolean {
        return this._shadow == 1
    }

    setFrame(frame: number): void {
        if (this._removed) return
        this._property.frame.value = frame
        this._property.frame.state = ImageState.UPDATED

        imageframe(this._id, frame)
    }

    nextFrame(): void {
        this.setFrame(this._property.frame.value + 1)
    }

    prevFrame(): void {
        this.setFrame(this._property.frame.value - 1)
    }

    animateFrameConstantly(speed: number, mode: 0 | 1 | 2 | 3 | 4): void {
        if (this._removed) return
        this._property.frame.state = ImageState.CONSTANTLY

        tween_animate(this._id, speed, mode)
    }

    animateRotationConstantly(speed: number): void {
        if (this._removed) return
        this._transform.rotation.state = ImageState.CONSTANTLY

        tween_rotateconstantly(this._id, speed)
    }

    animateAlpha(time: number, alpha: number): void {
        if (this._removed) return
        this._property.alpha.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_alpha(this._id, time, alpha)
    }

    animateColor(time: number, r: number, g: number, b: number): void {
        if (this._removed) return
        this._property.color.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_color(this._id, time, r, g, b)
    }

    animateFrame(time: number, frame: number): void {
        if (this._removed) return
        this._property.frame.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_frame(this._id, time, frame)
    }

    animatePosition(time: number, x: number, y: number, rot?: number): void {
        if (this._removed) return
        this._transform.position.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_move(this._id, time, x, y, rot)
    }

    animateRotation(time: number, rot: number): void {
        if (this._removed) return
        this._transform.rotation.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_rotate(this._id, time, rot)
    }

    animateScale(time: number, x: number, y: number): void {
        if (this._removed) return
        this._transform.scale.state = ImageState.UPDATING

        this.setAnimationClock(time)
        tween_scale(this._id, time, x, y)
    }

    pushTowards(time: number, dir: number, power: number, instantPosition: boolean = false): void {
        if (this._removed) return
        const [x, y] = this.positionTrigger(dir, power)

        if (instantPosition) {
            this._transform.position.x = x
            this._transform.position.y = y
            this._transform.position.state = ImageState.UPDATED
        } else {
            this._transform.position.state = ImageState.UPDATING
            this.setAnimationClock(time)
        }

        tween_move(this._id, time, x, y, dir)
    }

    isAnimating(): boolean {
        return this._animationClock >= clock()
    }

    setAnimationClock(time: number): void {
        time *= 0.001
        const newAnimationClock = clock() + time

        if (this._animationClock < newAnimationClock) {
            this._animationClock = newAnimationClock
        }
    }

    getX(): number {
        this.tryUpdatePosition()
        return this._transform.position.x
    }

    getY(): number {
        this.tryUpdatePosition()
        return this._transform.position.y
    }

    getRotation(): number {
        this.tryUpdateProp(this._transform.rotation, 'rot')
        return this._transform.rotation.value
    }

    getAlpha(): number {
        this.tryUpdateProp(this._property.alpha, 'alpha')
        return this._property.alpha.value
    }

    getBlend(): number {
        return this._property.blend.value
    }

    getColor(): [number, number, number] {
        this.tryUpdateProp(this._property.color)
        return [this._property.color.r, this._property.color.g, this._property.color.b]
    }

    getPosition(): [number, number] {
        this.tryUpdatePosition()
        return [this._transform.position.x, this._transform.position.y]
    }

    getScale(): [number, number] {
        this.tryUpdateProp(this._transform.scale)
        return [this._transform.scale.x, this._transform.scale.y]
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

    /**
     * PRIVATE
     */

    /** @tupleReturn */
    private positionTrigger(dir: number, power: number) {
        dir = (dir < -90) ? dir + 360 : dir

        let angle = rad(abs(dir + 90)) - pi
        let new_x = floor((this.getX() + cos(angle) * power))
        let new_y = floor((this.getY() + sin(angle) * power))

        return [new_x, new_y]
    }

    private tryUpdatePosition() {
        if (this._transform.position.state != ImageState.UPDATED) {
            if (! this.isAnimating()) {
                this._transform.position.state = ImageState.UPDATED
            }
            this._transform.position.x = object(this._id, 'x')
            this._transform.position.y = object(this._id, 'y')
        }
    }

    private tryUpdateProp(ref: any, objKey?: ObjectValues) {
        if (ref.state != ImageState.UPDATED) {
            if (! this.isAnimating()) {
                ref.state = ImageState.UPDATED
            }
            if (objKey) {
                ref.value = object(this._id, <any>objKey)
            }
        }
    }
}

export {
    Image,
    Mode,
    Type,
    Blend,
    Flag
}
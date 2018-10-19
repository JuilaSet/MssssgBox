class World{
    constructor($option={}){
        this.bodies = $option.bodies || [];
        this.bodiesLen = this.bodies.length;
        this.timeStep = $option.timeStep || 1/60;   // 时间片

        this.strict = $option.strict || new Zone({
            width : Infinity, 
            height : Infinity,
            position : new Vector2d(-Infinity, -Infinity)
        });

        this._ground = $option.ground || new Ground({   // +
            chain: [
                new GroundSegment({
                    origionPosition:new Vector2d(0, 300),
                    direction:new Vector2d(0, document.documentElement.clientWidth)
                })
            ]});
        this.gravity = $option.gravity || new Vector2d(0, 0);
    }

    set ground($grd){   // +
        this._ground = $grd;
    }

    addBody($body){
        $body.world = this;
        this.bodies.push($body);
        this.bodiesLen = this.bodies.length;
    }

    update(){
        for (let k = 0; k < this.bodiesLen; k++) {
            this.bodies[k].update(this.timeStep);
            this.bounce(this.bodies[k]);
        }
    }

    render($animation){
        this.bodies.forEach((d)=>{
            d.render($animation.context, $animation);
            // ground
            this.ground.render($animation.context);
        })
    }

    // 边界碰撞效果
    bounce($point){
        let width = this.strict.width, height = this.strict.height;
        let x = this.strict.position.x, y = this.strict.position.y;

        // 碰撞检测
        if ($point.position.y - $point.border < y) {
            $point.linearVelocity.y *= -0.95;
            $point.angularVelocity *= 0.9;
            $point.position.y = y + $point.border;
        }

        if ($point.position.y + $point.border > y + height ) {
            $point.linearVelocity.y *= -0.95;
            $point.angularVelocity *= 0.9;
            $point.position.y  = y + height - $point.border;
        }

        if ($point.position.x + $point.border > x + width) {
            $point.linearVelocity.x *= -0.95;
            $point.angularVelocity *= 0.9;
            $point.position.x = x + width - $point.border;
        }

        if ($point.position.x - $point.border < x) {
            $point.linearVelocity.x *= -0.95;
            $point.angularVelocity *= 0.9;
            $point.position.x = x + $point.border;
        }

        // 休眠处理
        if (Math.abs($point.linearVelocity.y) < 1){
            $point.linearVelocity.y = 0;
            $point.linearVelocity.x *= 0.95;
        }
        if (Math.abs($point.linearVelocity.x) < 1) {
            $point.linearVelocity.y *= 0.95;
            $point.linearVelocity.x = 0;
        }
    }
}
// 动态对象
World.DYNAMIC = 0x1;
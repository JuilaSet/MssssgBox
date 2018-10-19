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
            groundChain: [
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

    getGroundUndered($position){    // +
        let ox, dx;
        for(let g of this._ground.segments){
            ox = g.origionPosition.x;
            dx = g.direction.x;
            if($position.x >= ox && $position.x < ox + dx){
                return g;
            }
        }
    }

    update(){
        for (let k = 0; k < this.bodiesLen; k++) {
            this.bodies[k].update(this.timeStep);
            this.strictBounce(this.bodies[k]);
            this.groundBounce(this.bodies[k]);
            // 休眠处理
            this.bodies[k].sleepCheck();
        }
    }

    render($animation){
        this.bodies.forEach((d)=>{
            d.render($animation.context, $animation);
        })
        // ground
        this._ground.render($animation.context);
    }

    isUnderGround($ground, $position){
        let p = $position.clone().sub($ground.origionPosition);
        return $ground.direction.cross(p) > 0? true : false;
    }

    addBody($body){
        $body.world = this;
        this.bodies.push($body);
        this.bodiesLen = this.bodies.length;
    }

    // +
    onGroundHit($point, $ground){
        let v = $point.linearVelocity;
        let oy = $ground.origionPosition.y;
        let arg = $ground.argue * (oy < oy + $ground.direction.y?-1:1);
        console.log(arg * 180 / Math.PI);
        // 反弹
        let cos2 = Math.cos(arg) * Math.cos(arg), 
            sin2 = Math.sin(arg) * Math.sin(arg);
        v.x = v.x * cos2 - 2 * v.y * Math.sin(arg) * Math.cos(arg) - v.x * sin2;
        v.y = v.y * -0.95;
    }

    // 地表碰撞效果
    groundBounce($point){
        // 碰撞检测
        let p = $point.getNextFramePosition(1/60);
        let g = this.getGroundUndered(p);
        if(!g)return;
        
        if(this.isUnderGround(g, p)){
            this.onGroundHit($point, g);
        }
    }

    // 边界碰撞效果
    strictBounce($point){
        let width = this.strict.width, height = this.strict.height;
        let x = this.strict.position.x, y = this.strict.position.y;

        // 碰撞检测
        let p = $point.position;
        if (p.y - $point.border < y) {
            $point.linearVelocity.y *= -0.95;
            $point.angularVelocity *= 0.9;
            p.y = y + $point.border;
        }

        if (p.y + $point.border > y + height ) {
            $point.linearVelocity.y *= -0.95;
            $point.angularVelocity *= 0.9;
            p.y  = y + height - $point.border;
        }

        if (p.x + $point.border > x + width) {
            $point.linearVelocity.x *= -0.95;
            $point.angularVelocity *= 0.9;
            p.x = x + width - $point.border;
        }

        if (p.x - $point.border < x) {
            $point.linearVelocity.x *= -0.95;
            $point.angularVelocity *= 0.9;
            p.x = x + $point.border;
        }
    }
}
// 动态对象
World.DYNAMIC = 0x1;
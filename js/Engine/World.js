class World{
    constructor($option={}){
        this.bodies = $option.bodies || [];
        this._bodiesLen = this.bodies.length;
        this.timeStep = $option.timeStep || 1/60;   // 时间片

        this.strict = $option.strict || new Zone({
            width : Infinity, 
            height : Infinity,
            position : new Vector2d(-Infinity, -Infinity)
        });

        this._ground = $option.ground || new Ground({
            groundChain: [
                new GroundSegment({
                    origionPosition:new Vector2d(0, 300),
                    direction:new Vector2d(0, document.documentElement.clientWidth)
                })
            ]});

        this._statics = $option.statics || [];  // + 静态碰撞物体
    }

    set ground($grd){
        this._ground = $grd;
    }

    get ground(){
        return this._ground;
    }

    update(){
        for (let k = 0; k < this._bodiesLen; k++) {
            let p = this.bodies[k];
            if(p && p.living){
                p.update(this.timeStep);
                if(p.enableStrictBounce)this.strictBounce(p);
                if(p.enableGroundBounce)this.groundBounce(p);
                if(p.enableStaticBounce)this.staticBounce(p);
            }
        }
    }

    render($animation){
        // points
        for(let x = 0; x < this._bodiesLen; x++){
            let d = this.bodies[x];
            if(d){
                if(d.living){
                    d.render($animation.context, $animation)
                };
            }
        }
        // statics []][
        for(let x = 0; x < this._statics.length; x++){
            let s = this._statics[x];
            if(s){
                if(s.isLiving()){
                    s.render($animation.context);
                };
            }
        }
        // ground
        this._ground.render($animation.context);
        this.cleanBodies();
    }

    cleanBodies(){
        for(let x = 0; x < this._bodiesLen; x++){
            if(!this.bodies[x].living){
                this.bodies.splice(x, 1);
                this._bodiesLen = this.bodies.length;
            }
        }

        for(let x = 0; x < this._statics.length; x++){
            if(!this._statics[x].isLiving()){
                this._statics.splice(x, 1);
            }
        }
    }

    isUnderGround($groundSeg, $position){
        let p = $position.clone().sub($groundSeg.origionPosition);
        return $groundSeg.direction.cross(p) > 0? true : false;
    }

    addBody($body){
        if($body instanceof Array){
            for(let i = 0; i < $body.length; i++){
                $body[i].world = this;
                this.bodies.push($body[i]);
            }
            this._bodiesLen = this.bodies.length;
        }else if($body instanceof Point){
            $body.world = this;
            this.bodies.push($body);
            this._bodiesLen = this.bodies.length;
        }else if($body instanceof StaticSquares){
            $body.world = this;
            this._statics.push($body);
        }else if($body instanceof StaticSquare){
            this._statics.push($body);
        }
    }

    // 地表碰撞效果
    groundBounce($point){
        let p = $point.getNextFramePosition(this.timeStep);
        let g = this._ground.getGroundUndered(p);
        
        // 碰撞检测
        if(g){
            if(this.isUnderGround(g, p)){
                $point.onGroundHit(g);
            }else{
                $point.onGroundHover(g);
            }
        }
    }

    // 边界碰撞效果
    strictBounce($point){
        let width = this.strict.width, height = this.strict.height;
        let x = this.strict.position.x, y = this.strict.position.y;

        // 碰撞检测
        let p = $point.position;
        if (p.y - $point.border < y) {
            $point.onStrictHit(this.strict, "top");
        }

        if (p.y + $point.border > y + height ) {
            $point.onStrictHit(this.strict, "bottom");
        }

        if (p.x + $point.border > x + width) {
            $point.onStrictHit(this.strict, "right");
        }

        if (p.x - $point.border < x) {
            $point.onStrictHit(this.strict, "left");
        }
    }

    // 静态物体碰撞效果
    staticBounce($point){
        let p = $point.getNextFramePosition(this.timeStep);
        let sqs = this._statics;
        // 碰撞检测
        for(let x = 0; x < this._statics.length; x++){
            let sq = sqs[x].getSquareIn(p);
            if(sq){
                let pos = $point.position;
                let psq = sq.position;
                if(pos.y > psq.y && pos.y < psq.y + sq.zone.height){
                    $point.onStaticHit('left', sq);
                }else{
                    $point.onStaticHit('top', sq);
                }
            }
        }
    }
}
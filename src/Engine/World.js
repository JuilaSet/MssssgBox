class World{
    constructor($option={}){
        this.bodies = $option.bodies || [];
        this._bodiesLen = this.bodies.length;
        this.timeStep = $option.timeStep || 1/60;   // 时间片

        this.strict = $option.strict || Zone.INFINITY_ZONE;

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

    get statics(){
        return this._statics;
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
                if(s.living){
                    s.render($animation.context);
                    if(s instanceof StaticSquareGroup){
                        s.cleanSqures();
                    }
                };
            }
        }

        // ground
        this._ground.render($animation.context);

        // 最后清理死亡的物品
        this.cleanBodies();
        this.cleanStatics();
    }

    cleanBodies(){
        // points
        for(let x = 0; x < this._bodiesLen; x++){
            if(!this.bodies[x].living){
                this.bodies.splice(x, 1);
                this._bodiesLen = this.bodies.length;
            }
        }
    }

    cleanStatics(){
        // statics
        for(let x = 0; x < this._statics.length; x++){
            if(!this._statics[x].living){
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
        }else if($body instanceof StaticSquareGroup){
            $body.world = this;
            this._statics.push($body);
        }else if($body instanceof StaticSquare){
            this._statics.push($body);
        }
    }

    // 地表碰撞判断
    groundBounce($point){
        let p = $point.getNextFramePosition(this.timeStep);
        let g = this._ground.getGroundUndered(p);
        
        // 碰撞检测
        if(g){
            if(this.isUnderGround(g, p)){
                $point.onGroundHit(g);
                g.onHit($point);
            }else{
                $point.onGroundHover(g);
                g.onHover($point);
            }
        }
    }

    // 边界碰撞判断
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

    // 静态物体碰撞判断
    staticBounce($point){
        let p = $point.getNextFramePosition(this.timeStep);
        let sqs = this._statics;
        let pos = $point.position;
        // 找到point在哪些group和staticSquare的有效域中，并加入collidelist表
        let collideList = [];
        for(let x = 0; x < sqs.length; x++){
            let sq = this._statics[x];
            if(sq instanceof StaticSquare){
                if(sq.zone.check(p)){
                    collideList.push(sq);
                }
            }else if(sq instanceof StaticSquareGroup){
                if(sq.outLineZone.check(p)){
                    sq.onThrough($point);
                    collideList.push(sq);
                }
            }else{
                console.warn("illegal obj in statics list");
            }
        }
        
        // 碰撞检测
        for(let x = 0; x < collideList.length; x++){
            if(collideList[x] instanceof StaticSquareGroup){
                let sq = collideList[x].getSquareIn(p);
                if(sq){
                    let psq = sq.position;
                    if(pos.y > psq.y && pos.y < psq.y + sq.height){
                        if(pos.x <= psq.x){
                            $point.onStaticHit('left', sq);
                            collideList[x].onHit($point, 'left', sq);
                            sq.onHit($point, 'left', false);
                        }else if(pos.x >= psq.x + sq.width){
                            $point.onStaticHit('right', sq);
                            collideList[x].onHit($point, 'right', sq);
                            sq.onHit($point, 'right', false);
                        }else{
                            let centP = new Vector2d(psq.x + sq.width / 2, psq.y + sq.height / 2);
                            console.warn('point-position "left&right" on static judged inside');
                            if(pos.x < centP.x){
                                $point.onStaticHit('left', sq);
                                collideList[x].onHit($point, 'left', sq);
                                sq.onHit($point, 'left', true);
                            }else{
                                $point.onStaticHit('right', sq);
                                collideList[x].onHit($point, 'right', sq);
                                sq.onHit($point, 'right', true);
                            }
                        }
                    }else{
                        if(pos.y <= psq.y){
                            $point.onStaticHit('top', sq);
                            sq.onHit($point, 'top', false);
                            collideList[x].onHit($point, 'top', sq);
                        }else if(pos.y >= psq.y + sq.height){
                            $point.onStaticHit('bottom', sq);
                            collideList[x].onHit($point, 'bottom', sq);
                            sq.onHit($point, 'bottom', false);
                        }else{
                            let centP = new Vector2d(psq.x + sq.width / 2, psq.y + sq.height / 2);
                            console.warn('point-position "top&bottom" on static judged inside');
                            if(pos.y < centP.y){
                                $point.onStaticHit('top', sq);
                                collideList[x].onHit($point, 'top', sq);
                                sq.onHit($point, 'top', true);
                            }else{
                                $point.onStaticHit('bottom', sq);
                                collideList[x].onHit($point, 'bottom', sq);
                                sq.onHit($point, 'bottom', true);
                            }
                        }
                    }
                }
            }else if(collideList[x] instanceof StaticSquare){
                if(collideList[x].zone.check(p)){
                    let psq = collideList[x].position;
                    if(pos.y > psq.y && pos.y < psq.y + collideList[x].height){
                        if(pos.x <= psq.x){
                            $point.onStaticHit('left', collideList[x]);
                            collideList[x].onHit($point, 'left', false);
                        }else if(pos.x >= psq.x + collideList[x].width){
                            $point.onStaticHit('right', collideList[x]);
                            collideList[x].onHit($point, 'right', false);
                        }else{
                            console.warn('point-position "left&right" on static judged inside');
                            let centP = new Vector2d(psq.x + collideList[x].width / 2, psq.y + collideList[x].height / 2);
                            if(pos.x < centP.x){
                                $point.onStaticHit('left', collideList[x]);
                                collideList[x].onHit($point, 'left', true);
                            }else{
                                $point.onStaticHit('right', collideList[x]);
                                collideList[x].onHit($point, 'right', true);
                            }
                        }
                    }else{
                        if(pos.y <= psq.y){
                            $point.onStaticHit('top', collideList[x]);
                            collideList[x].onHit($point, 'top', false);
                        }else if(pos.y >= psq.y + collideList[x].height){
                            $point.onStaticHit('bottom', collideList[x]);
                            collideList[x].onHit($point, 'bottom', false);
                        }else{
                            console.warn('point-position "top&bottom" on static judged inside');
                            let centP = new Vector2d(psq.x + collideList[x].width / 2, psq.y + collideList[x].height / 2);
                            if(pos.y < centP.y){
                                $point.onStaticHit('top', collideList[x]);
                                collideList[x].onHit($point, 'top', true);
                            }else{
                                $point.onStaticHit('bottom', collideList[x]);
                                collideList[x].onHit($point, 'bottom', true);
                            }
                        }
                    }
                }
            }
        }
    }
}
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

        this._statics = $option.statics || [];  // 静态碰撞物体

        this._maxBodiesCleanSize = $option.maxBodiesCleanSize || 1200;
        this._maxStaticsCleanSize = $option.maxStaticsCleanSize || 60;
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
        let flag = false;
        for (let k = 0; k < this._bodiesLen; k++) {
            let p = this.bodies[k];
            if(p && p.living){
                p.update(this.timeStep);
                if(!p.isMoving(0.01))flag = true;
                if(p.enableStrictBounce)this.strictBounce(p);
                if(p.enableGroundBounce)this.groundBounce(p);
                if(p.enableStaticBounce)this.staticBounce(p);
            }
        }
        // statics
        for(let x = 0; x < this._statics.length; x++){
            let s = this._statics[x];
            if(s){
                if(s.living){
                    if(s instanceof StaticSquareGroup){
                        s.update();
                    }
                };
            }
        }
        

        // 最后清理死亡的物品
        if(flag){
            if(this.deadBodiesSize() > this._maxBodiesCleanSize){
                this.cleanBodies()
                console.info("WORLD:", "clean dead bodies");
            };
            if(this.deadStaticsSize() > this._maxStaticsCleanSize){
                this.cleanStatics()
                console.info("WORLD:", "clean dead static");
            };
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

        // statics
        for(let x = 0; x < this._statics.length; x++){
            let s = this._statics[x];
            if(s){
                if(s.living){
                    s.render($animation.context);
                };
            }
        }

        // ground
        this._ground.render($animation.context);
    }

    deadBodiesSize(){
        // points
        let res = 0;
        for(let x = 0; x < this._bodiesLen; x++){
            if(!this.bodies[x].living){
                res++;
            }
        }
        return res;
    }

    bodisSize(){
        // points
        let res = 0;
        this.bodies.forEach(element => {
            if(element.living){
                res++;
            }
        });
        return res;
    }

    deadStaticsSize(){
        // points
        let res = 0;
        for(let x = 0; x < this._statics.length; x++){
            if(!this._statics[x].living){
                res++;
            }
        }
        return res;
    }

    staticsSize(){
        // points
        let res = 0;
        this._statics.forEach(element => {
            if(element.living){
                res++;
            }
        });
        return res;
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
                if(sq.living && sq.zone.check(p)){
                    collideList.push(sq);
                }
            }else if(sq instanceof StaticSquareGroup){
                if(sq.living && sq.outLineZone.check(p)){
                    sq.onThrough($point);
                    collideList.push(sq);
                }
            }else{
                console.warn("illegal obj in statics list");
            }
        }
        function collide($$sqs, $$side, $$sq, $$ifin){
            $point.onStaticHit($$side, $$sq);
            $$sqs.onHit($point, $$side, $$sq);
            $$sq.onHit($point, $$side, $$ifin);
        }
        function collideSq($$side, $sq, $$ifin){
            $point.onStaticHit($$side, $sq);
            $sq.onHit($point, $$side, $$ifin);
        }
        // 碰撞检测
        for(let x = 0; x < collideList.length; x++){
            if(collideList[x] instanceof StaticSquareGroup){
                let sq = collideList[x].getSquareIn(p);
                if(sq && sq.living){
                    let psq = sq.position;
                    if(pos.y > psq.y && pos.y < psq.y + sq.height){
                        if(pos.x <= psq.x){
                            collide(collideList[x], 'left', sq, false);
                        }else if(pos.x >= psq.x + sq.width){
                            collide(collideList[x], 'right', sq, false);
                        }else{
                            let centP = new Vector2d(psq.x + sq.width / 2, psq.y + sq.height / 2);
                            console.warn('point-position "left&right" on static judged inside');
                            if(pos.x < centP.x){
                                collide(collideList[x], 'left', sq, true);
                            }else{
                                collide(collideList[x], 'right', sq, true); 
                            }
                        }
                    }else{
                        if(pos.y <= psq.y){
                            collide(collideList[x], 'top', sq, false);
                        }else if(pos.y >= psq.y + sq.height){
                            collide(collideList[x], 'bottom', sq, false);
                        }else{
                            let centP = new Vector2d(psq.x + sq.width / 2, psq.y + sq.height / 2);
                            console.warn('point-position "top&bottom" on static judged inside');
                            if(pos.y < centP.y){
                                collide(collideList[x], 'top', sq, true);
                            }else{
                                collide(collideList[x], 'bottom', sq, true);
                            }
                        }
                    }
                }
            }else if(collideList[x] instanceof StaticSquare){
                if(collideList[x].zone.check(p)){
                    let psq = collideList[x].position;
                    if(pos.y > psq.y && pos.y < psq.y + collideList[x].height){
                        if(pos.x <= psq.x){
                            collideSq('left', collideList[x], false);
                        }else if(pos.x >= psq.x + collideList[x].width){
                            collideSq('right', collideList[x], false);
                        }else{
                            console.warn('point-position "left&right" on static judged inside');
                            let centP = new Vector2d(psq.x + collideList[x].width / 2, psq.y + collideList[x].height / 2);
                            if(pos.x < centP.x){
                                collideSq('left', collideList[x], true);
                            }else{
                                collideSq('right', collideList[x], true);
                            }
                        }
                    }else{
                        if(pos.y <= psq.y){
                            collideSq('top', collideList[x], false);
                        }else if(pos.y >= psq.y + collideList[x].height){
                            collideSq('bottom', collideList[x], false);
                        }else{
                            console.warn('point-position "top&bottom" on static judged inside');
                            let centP = new Vector2d(psq.x + collideList[x].width / 2, psq.y + collideList[x].height / 2);
                            if(pos.y < centP.y){
                                collideSq('top', collideList[x], true);
                            }else{
                                collideSq('bottom', collideList[x], true);
                            }
                        }
                    }
                }
            }
        }
    }
}
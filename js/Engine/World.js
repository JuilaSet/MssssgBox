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
    //    this.gravity = $option.gravity || new Vector2d(0, 0);
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
            if(p.living){
                p.update(this.timeStep);
                if(p.enableStrictBounce)this.strictBounce(p);
                if(p.enableGroundBounce)this.groundBounce(p);
                p.sleepCheck();    // []][
            }
        }
    }

    render($animation){
        this.bodies.forEach((d)=>{
            if(d.living)d.render($animation.context, $animation);
        })
        // ground
        this._ground.render($animation.context);
    }

    isUnderGround($groundSeg, $position){
        let p = $position.clone().sub($groundSeg.origionPosition);
        return $groundSeg.direction.cross(p) > 0? true : false;
    }

    addBody($body){
        $body.world = this;
        this.bodies.push($body);
        this._bodiesLen = this.bodies.length;
    }

    // 地表碰撞效果
    groundBounce($point){
        let p = $point.getNextFramePosition(this.timeStep);
        let g = this._ground.getGroundUndered(p);
        
        // 碰撞检测
        if(g && this.isUnderGround(g, p)){
            $point.onGroundHit(g);
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
}
// 动态对象
World.DYNAMIC = 0x1;
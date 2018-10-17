class World{
    constructor($option={}){
        this.bodies = $option.bodies || [];
        this.bodiesLen = this.bodies.length;
        this.timeStep = $option.timeStep || 1/60;   // 时间片
    }

    addBody($body){
        this.bodies.push($body);
        this.bodiesLen = this.bodies.length;
    }

    update(){
        for (let k = 0; k < this.bodiesLen; k++) {
            this.bodies[k].update(this.timeStep);
        }
    }
}
World.DYNAMIC = 0x1;
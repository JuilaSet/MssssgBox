class Point{
    constructor($option={}){
        this.world = $option.world;
        
        this.position = $option.position || new Vector2d(0, 0);
        this.rotation = $option.rotation || 0; // 角度

        this._mass = $option.mass || 1;
        this.invMass = 1 / this._mass;

        this.force = $option.force || new Vector2d(0, 0);
        this.torque = $option.torque || 0;

        this.linearVelocity = $option.linearVelocity || new Vector2d(0, 0);
        this.angularVelocity = $option.angularVelocity || 0; // 角度

        this.border = $option.border || 1;
        this._check();
    }
    
    _check(){
        if(isNaN(this.angularVelocity))console.error("angularVelocity", this.angularVelocity);
        if(isNaN(this.linearVelocity.x))console.error("linearVelocity.x", this.linearVelocity.x);
        if(isNaN(this.linearVelocity.y))console.error("linearVelocity.y", this.linearVelocity.y);
    }

    // []][
    applyImpulse($impulse, $point) {

    }

    sleepCheck($minv=1){    // +
        if (Math.abs(this.linearVelocity.y) < $minv){
            this.linearVelocity.y = 0;
        }
        if (Math.abs(this.linearVelocity.x) < $minv) {
            this.linearVelocity.x = 0;
        }
    }

    isMove($minv=1){
        if (Math.abs(this.linearVelocity.y) < $minv && 
            Math.abs(this.linearVelocity.x) < $minv) {
                return false;
        }
        return true;
    }

    // dv = a * dt
    integrateVelocity(dt){
        this.linearVelocity.x += this.force.x * this.invMass * dt;
        this.linearVelocity.y += this.force.y * this.invMass * dt;
    }
    
    // ds = v * dt
    integratePosition(dt){
        this.position.x += this.linearVelocity.x * dt;
        this.position.y += this.linearVelocity.y * dt;
    }

    // drv =  ra * dt
    integrateAngularVelocity(dt){
        this.angularVelocity += this.torque * this.invMass * dt;
    }

    // dr = rv * dt
    integrateRotation(dt){
        if (this.rotation >= 360) this.rotation %= 360;
        this.rotation += this.angularVelocity * 180 * dt / Math.PI;
    }

    getNextFramePosition(dt){
    //  return this.position.clone.add(this.linearVelocity.multiply(dt));
        return new Vector2d(
            this.position.x + this.linearVelocity.x * dt,
            this.position.y + this.linearVelocity.y * dt
        );
    }

    init(){
        this.linearVelocity.x = 0;
        this.linearVelocity.y = 0;
        this.angularVelocity = 0;
        this.force.x = 0;
        this.force.y = 0;
        this.torque = 0;
    }

    set mass($mass){
        this._mass = $mass;
    }

    get mass(){
        return this._mass;
    }

    addLinearSpeed($direction, $strength=1){
        this.linearVelocity.add($direction.multiply($strength));
        return this;
    }

    addAngularSpeed($strength){
        this.angularVelocity += $strength;
        return this;
    }

    onmove(){
        
    }

    onCollide($position){

    }

    stop(){
        this.linearVelocity.x = 0;
        this.linearVelocity.y = 0;
        this.angularVelocity = 0;
    }

    // 测试用
    render($context, $animation){
        ((x, y, r, rotation)=>{
            $context.save();
            $context.beginPath();
            $context.strokeStyle = '#FFF';
            $context.arc(x, y, r, 0, 2 * Math.PI, false);
            $context.arc(x, y, 3, 0, 2 * Math.PI, false);
            $context.stroke();
            $context.beginPath();
            $context.moveTo(x, y);
            $context.lineTo(x + r * Math.cos(rotation * 180 / Math.PI), y + r * Math.sin(rotation * 180 / Math.PI));
            $context.stroke();
            $context.restore();
        })(this.position.x, this.position.y, this.border, this.rotation);
    }

    update($timeStep=1/60){
        if(this.linearVelocity.x != 0 || this.linearVelocity.y != 0){
            this.onmove();
        }

        this.integrateVelocity($timeStep);
        this.integratePosition($timeStep);
        this.integrateAngularVelocity($timeStep);
        this.integrateRotation($timeStep);
    }
}
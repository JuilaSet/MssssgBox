class Point{
    constructor($option={}){
        this.frictionX = $option.frictionX || 0.1;
        this.frictionY = $option.frictionY || 0.1;

        this.position = $option.position || new Vector2d(0, 0);
        this.rotation = $option.rotation || 0; // 角度

        this._mass = $option.mass || 1;
        this.invMass = 1 / this._mass;

        this.force = $option.force || new Vector2d(0, 0);
        this.torque = $option.angularForce || 0;

        this.linearVelocity = $option.linearVelocity || new Vector2d(0, 0);
        this.angularVelocity = $option.angularVelocity || 0; // 角度

        this._check();
    }
    
    _check(){
        if(isNaN(this.angularVelocity))console.error("angularVelocity", this.angularVelocity);
        if(isNaN(this.linearVelocity.x))console.error("linearVelocity.x", this.linearVelocity.x);
        if(isNaN(this.linearVelocity.y))console.error("linearVelocity.y", this.linearVelocity.y);
    }

    // v = a * t
    integrateVelocity(dt){
        this._check();
        this.linearVelocity.x += this.force.x * this.invMass * dt;
        this.linearVelocity.y += this.force.y * this.invMass * dt;
    }
    
    // s = m * v
    integratePosition(dt){
        this._check();
        this.position.x += this.linearVelocity.x * dt;
        this.position.y += this.linearVelocity.y * dt;
    }

    integrateAngularVelocity(dt){
        this._check();
        this.angularVelocity += this.torque * this.invMass * dt;
    }

    // r = m * v
    integrateRotation(dt){
        this._check();
        if (this.rotation >= 360) this.rotation %= 360;
        this.rotation += this.angularVelocity * 180 * dt / Math.PI;
    }

    init(){
        this.linearVelocity.x = 0;
        this.linearVelocity.y = 0;
        this.angularVelocity = 0;

        this._fX = this.frictionX;
        this._fY = this.frictionY;
    }

    set mass($mass){
        this._mass = $mass;
    }

    get mass(){
        return this._mass;
    }

    addLinearSpeed($direction, $strength=1){
        this.linearVelocity.x += $strength * $direction.x;
        this.linearVelocity.y += $strength * $direction.y;
        this._check();
    }

    addLinearSpeed($strength){
        this.angularVelocity += $strength;
        this._check();
    }

    onmove(){
        
    }

    stop(){
        this.linearVelocity.x = 0;
        this.linearVelocity.y = 0;
        this.angularVelocity = 0;
    }

    // 测试用
    drawCircle($context, $animation){
        ((x, y, r, rotation)=>{
            $context.save();
            $context.translate($animation.width/2, $animation.height/2);
            $context.beginPath();
            $context.arc(x, y, r, 0, 2 * Math.PI, false);
            $context.arc(x, y, 3, 0, 2 * Math.PI, false);
            $context.stroke();
            $context.beginPath();
            $context.moveTo(x, y);
            $context.lineTo(x + r * Math.cos(rotation * 180 / Math.PI), y + r * Math.sin(rotation * 180 / Math.PI));
            $context.stroke();
            $context.restore();
        })(this.position.x, this.position.y, 12, this.rotation);
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
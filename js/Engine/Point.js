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
        this._living = true; // 死亡时删除

        this._livingZone = $option.livingZone || Zone.INFINITY_ZONE;

        this.enableStrictBounce = ($option.enableStrictBounce != undefined)?$option.enableStrictBounce:true;
        this.enableGroundBounce = ($option.enableGroundBounce != undefined)?$option.enableGroundBounce:true;
        this.enableStaticBounce = ($option.enableStaticBounce != undefined)?$option.enableStaticBounce:true;
        
        this._check();
    }
    
    get livingZone(){
        return this._livingZone;
    }

    set livingZone($zone){
        this._livingZone = $zone;
    }

    _checkIfInLivingZone(){
        if(!this._livingZone.check(this.position)){
            this.kill();
        }
    }

    _check(){
        if(isNaN(this.angularVelocity))console.error("angularVelocity", this.angularVelocity);
        if(isNaN(this.linearVelocity.x))console.error("linearVelocity.x", this.linearVelocity.x);
        if(isNaN(this.linearVelocity.y))console.error("linearVelocity.y", this.linearVelocity.y);
    }

    kill(){
        this.init();
        this.border = 0;
        this._living = false;
        this.onKilled();
    }

    get living(){
        return this._living;
    }

    // []][
    applyImpulse($impulse, $point) {

    }

    sleepCheck($minv=1){
        if (Math.abs(this.linearVelocity.y) < $minv){
            this.linearVelocity.y = 0;
        }
        if (Math.abs(this.linearVelocity.x) < $minv) {
            this.linearVelocity.x = 0;
        }
    }

    isMoving($minv=1){
        if (Math.abs(this.linearVelocity.y) < $minv && 
            Math.abs(this.linearVelocity.x) < $minv) {
                return false;
        }else{
            return true;
        };
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

    setOnMove($callBackFunc){
        this.onmove = $callBackFunc;
        return this;
    }

    onmove(){

    }

    setOnStop($callBackFunc){
        this.onstop = $callBackFunc;
        return this;
    }

    onstop(){

    }

    setOnUpdate($callBackFunc){
        this.onupdate = $callBackFunc;
        return this;
    }

    onupdate(){

    }

    setOnStrictHit($callBackFunc){
        this.onStrictHit = $callBackFunc;
        return this;
    }

    onStrictHit($strict, $which){
        this.strictBounce($strict, $which);
    }

    setOnGroundHit($callBackFunc){
        this.onGroundHit = $callBackFunc;
        return this;
    }

    setOnGroundHover($callBackFunc){
        this.onGroundHover = $callBackFunc;
        return this;
    }

    onGroundHit($groundSeg){
        this.downBounce($groundSeg.angle);
        this.setPositionToGroundSegment($groundSeg.origionPosition, $groundSeg.angle);
    }

    onGroundHover($groundSeg){

    }

    setOnStaticHit($func){
        this.onStaticHit = $func;
    }

    onStaticHit($which, $static){
        this.staticBounce($which);
    }

    setOnKilled($func){
        this.onKilled = $func;
    }

    onKilled(){

    }

    // 设置位置到地面
    setPositionToGroundSegment($orgPosition, $angle){
        let p = this.position;
        if(!$orgPosition)return;
        if($orgPosition instanceof GroundSegment){
            let dx = p.x - $orgPosition.origionPosition.x;
            p.y = $orgPosition.origionPosition.y + Math.tan($orgPosition.angle) * dx;
        }else{
            let dx = p.x - $orgPosition.x;
            p.y = $orgPosition.y + Math.tan($angle) * dx;
        }
        return this;
    }

    downBounce($angle){
        let v = this.linearVelocity;
        let cos2 = Math.cos($angle) * Math.cos($angle), 
            sin2 = Math.sin($angle) * Math.sin($angle);
        v.x = (v.x * cos2 - 2 * v.y * Math.sin($angle) * Math.cos($angle) - v.x * sin2) * 0.95;
        v.y = v.y * -0.95;

        if(isNaN(v.x) || isNaN(v.y)){
            console.error("linearVelocity calc error");
        }
    }

    strictBounce($strict, $which){
        let width = $strict.width, height = $strict.height;
        let x = $strict.position.x, y = $strict.position.y;
        let p = this.position;

        switch($which){
            case "top":
                this.linearVelocity.y *= -0.95;
                this.angularVelocity *= 0.9;
                p.y = y + this.border;
                break;
            case "bottom":
                this.linearVelocity.y *= -0.95;
                this.angularVelocity *= 0.9;
                p.y  = y + height - this.border;
                break;
            case "right":
                this.linearVelocity.x *= -0.95;
                this.angularVelocity *= 0.9;
                p.x = x + width - this.border;
                break;
            case "left":
                this.linearVelocity.x *= -0.95;
                this.angularVelocity *= 0.9;
                p.x = x + this.border;
                break;
            default:
                console.warn("strict-judging problem");
        }
    }

    staticBounce($which){
        switch($which){
            case "top":
            case "bottom":
                this.linearVelocity.y *= -0.95;
                this.angularVelocity *= 0.9;
                break;
            case "right":
            case "left":
                this.linearVelocity.x *= -0.95;
                this.angularVelocity *= 0.9;
                break;
            default:
                console.warn("static-judging problem");
        }
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
        })(this.position.x, this.position.y, this.border>0?this.border:0, this.rotation);
    }

    update($timeStep=1/60){
        this._checkIfInLivingZone();
        this.sleepCheck();
        if(this.linearVelocity.x != 0 || this.linearVelocity.y != 0){
            this.onmove();
        }else{
            this.onstop();
        }
        this.integrateVelocity($timeStep);
        this.integratePosition($timeStep);
        this.integrateAngularVelocity($timeStep);
        this.integrateRotation($timeStep);
        this.onupdate();
    }
}
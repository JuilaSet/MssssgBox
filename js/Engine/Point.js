class Point{
    constructor($option={}){
        this.frictionX = $option.frictionX || 0.1;
        this.frictionY = $option.frictionY || 0.1;

        this.position = $option.position || new Vector2d(0, 0);
        // private
        this.init();
    }
    
    init(){
        this.speedX = 0;
        this.speedY = 0;

        this.aX = 0;
        this.aY = 0;

        this._fX = this.frictionX;
        this._fY = this.frictionY;
    }

    addSpeed($direction, $strength=1){
        this.speedX += $strength * $direction.x;
        this.speedY += $strength * $direction.y;
    }

    getNextFramePosition(){
        return new Vector2d( this.position.x + this.speedX, this.position.y + this.speedY );
    }

    onmove(){
        
    }

    update(){
        // x:摩擦力
        if(Math.abs(this.speedX) > this.frictionX){
            this._fX = this.frictionX * this.speedX / Math.abs(this.speedX);
        }else{
            this._fX = 0;
            this.speedX = 0;
        }

        // y:摩擦力
        if(Math.abs(this.speedY) > this.frictionY){
            this._fY = this.frictionY * this.speedY / Math.abs(this.speedY);
        }else{
            this._fY = 0;
            this.speedY = 0;
        }

        this.speedX += this.aX - this._fX;
        this.speedY += this.aY - this._fY;

        this.position.x += this.speedX;
        this.position.y += this.speedY;

        if(this.speedY != 0 || this.speedX != 0){
            this.onmove();
        }
    }
}
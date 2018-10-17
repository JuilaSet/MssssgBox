class MoveController{
    constructor($option){
        this._bindObj = $option.bindObj;

        this.maxSpeedX = $option.maxSpeedX || 2;
        this.maxSpeedY = $option.maxSpeedY || 2;
        this.frictionX = $option.frictionX || 0.1;
        this.frictionY = $option.frictionY || 0.1;
        // private
        this.init();
    }

    init(){
        this.speedX = 0;
        this.speedY = 0;

        this.aX1 = 0;
        this.aX2 = 0;

        this.aY1 = 0;
        this.aY2 = 0;

        this._fX = this.frictionX;
        this._fY = this.frictionY;
    }

    set bindObj($obj){
        this.init();
        this._bindObj = $obj;
    }

    get bindObj(){
        return this._bindObj;
    }

    accLeft($a){
        this.aX2 = -$a;
    }

    accRight($a){
        this.aX1 = $a;
    }

    accUp($a){
        this.aY1 = -$a;
    }

    accDown($a){
        this.aY2 = $a;
    }

    setFrictionX($friction){
        this.frictionX = $friction;
    }

    setFrictionY($friction){
        this.frictionY = $friction;
    }

    onmove(){
        
    }

    setOnMove($func){
        this.onmove = $func;
    }

    getNextFramePosition(){
        return new Vector2d( this._bindObj.position.x + this.speedX, this._bindObj.position.y + this.speedY );
    }

    update(){
        // x:摩擦力
        if(Math.abs(this.speedX) > this.frictionX){
            this._fX = this.frictionX * this.speedX / Math.abs(this.speedX);
        }else{
            this._fX = 0;
            this.speedX = 0;
        }

        // x:速度上限
        if(Math.abs(this.speedX) > this.maxSpeedX){
            this.speedX = this.maxSpeedX * this.speedX / Math.abs(this.speedX);
        }
        this.speedX += (this.aX1 + this.aX2) - this._fX;
        this._bindObj.position.x += this.speedX;
        
        // y:摩擦力
        if(Math.abs(this.speedY) > this.frictionY){
            this._fY = this.frictionY * this.speedY / Math.abs(this.speedY);
        }else{
            this._fY = 0;
            this.speedY = 0;
        }
        // y:速度上限
        if(Math.abs(this.speedY) > this.maxSpeedY){
            this.speedY = this.maxSpeedY * this.speedY / Math.abs(this.speedY);
        }
        this.speedY += (this.aY1 + this.aY2) - this._fY;
        this._bindObj.position.y += this.speedY;

        if(this.speedX + this.speedY != 0){
            this.onmove();
        }
    }
}
class MoveController{
    constructor($option){
        this.bindObj = $option.bindObj; 
        this.frictionX = $option.frictionX;
        this.frictionY = $option.frictionY;
        this.speedX = 0;
        this.speedY = 0;

        this.aX1 = 0;
        this.aX2 = 0;

        this.aY1 = 0;
        this.aY2 = 0;

        this._fX = $option.frictionX;
        this._fY = $option.frictionY;
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

    update(){
        // x:摩擦力
        if(Math.abs(this.speedX) > this.frictionX){
            this._fX = this.frictionX * this.speedX / Math.abs(this.speedX);
        }else{
            this._fX = 0;
            this.speedX = 0;
        }
        this.speedX += (this.aX1 + this.aX2) - this._fX;

        // x:速度上限
        if(Math.abs(this.speedX) > 2){
            this.speedX = 2 * this.speedX / Math.abs(this.speedX);
        }
        this.bindObj.position.x += this.speedX;
        
        // y:摩擦力
        if(Math.abs(this.speedY) > this.frictionY){
            this._fY = this.frictionY * this.speedY / Math.abs(this.speedY);
        }else{
            this._fY = 0;
            this.speedY = 0;
        }
        this.speedY += (this.aY1 + this.aY2) - this._fY;

        // y:速度上限
        if(Math.abs(this.speedY) > 2){
            this.speedY = 2 * this.speedY / Math.abs(this.speedY);
        }
        this.bindObj.position.y += this.speedY;
    }
}
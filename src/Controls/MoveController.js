class MoveController extends Controller {
    constructor($option={}){
        super($option);
        if($option.maxSpeedX < 0 || $option.maxSpeedY < 0){
            console.warn("'最大速度'将自动调整为正数");
        }
        this.maxSpeedX = Math.abs($option.maxSpeedX) || 2;
        this.maxSpeedY = Math.abs($option.maxSpeedY) || 2;

        this.frictionX = $option.frictionX || 0.1;
        this.frictionY = $option.frictionY || 0.1;
        this.init();
    }

    init(){
        this._speedX = 0;
        this._speedY = 0;

        this.aX1 = 0;
        this.aX2 = 0;

        this.aY1 = 0;
        this.aY2 = 0;

        this._fX = this.frictionX;
        this._fY = this.frictionY;
    }

    get position(){
        return this._bindObj.position;
    }

    get speed(){
        return new Vector2d(this._speedX, this._speedY);
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
        return new Vector2d( this._bindObj.position.x + this._speedX, this._bindObj.position.y + this._speedY );
    }

    update(){
        if(this._bindObj){
            // x:摩擦力
            if(Math.abs(this._speedX) > this.frictionX){
                this._fX = this.frictionX * (this._speedX>0?1:-1);
            }else{
                this._fX = 0;
                this._speedX = 0;
            }

            // x:速度上限
            if(Math.abs(this._speedX) > this.maxSpeedX){
                this._speedX = this.maxSpeedX * (this._speedX>0?1:-1);
            }
            this._speedX += (this.aX1 + this.aX2) - this._fX;
            this._bindObj.position.x += this._speedX;
            
            // y:摩擦力
            if(Math.abs(this._speedY) > this.frictionY){
                this._fY = this.frictionY * (this._speedY>0?1:-1);
            }else{
                this._fY = 0;
                this._speedY = 0;
            }
            // y:速度上限
            if(Math.abs(this._speedY) > this.maxSpeedY){
                this._speedY = this.maxSpeedY * (this._speedY>0?1:-1);
            }
            this._speedY += (this.aY1 + this.aY2) - this._fY;
            this._bindObj.position.y += this._speedY;

            if(this._speedX + this._speedY != 0){
                this.onmove();
            }
        }
    }
}
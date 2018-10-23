class CrawlController{
    constructor($option){
        this._bindObj = $option.bindObj;
        this.jumpTimes = $option.jumpTimes || 3; // 几段跳
        this.maxSpeed = $option.maxSpeed || 120;
        this._ground = $option.ground;
        this._gravityacc = $option.gravity || 0.9;
        this._friction = $option.friction || 7;

        // private
        this._jpt = 0;
        this._point = new Point({
            force: new Vector2d(0, 0),
            enableStrictBounce: false,
            enableStaticBounce: false
        });
        this._point.setOnGroundHit(()=>{
            this._point.setPositionToGround(this._ground);
            this._point.linearVelocity.y = 0;
            this._lock  = true;
            this._jpt = 0;
        });
        this._world = new World();

        this._absAcc1 = 0;
        this._absAcc2 = 0;
        this._lock = true;
        this._fX = 0;

        if(this._bindObj)this._bindObj.position = this._point.position;
        this._world.addBody(this._point);
        this._world.ground = this._ground;
    }

    init(){
        this._point.init();
        this._jpt = 0;
        this._absAcc1 = 0;
        this._absAcc2 = 0;
        this._lock = true;
        this._fX = 0;
    }

    set bindObj($obj){
        this._bindObj = $obj;
        this._bindObj.position = this._point.position;
    }

    get bindObj(){
        return this._bindObj;
    }

    get ground(){
        return this._ground;
    }

    set gravity($gacc){
        this._gravityacc = $gacc;
    }

    get gravity(){
        return this._gravityacc;
    }

    set ground($ground){
        if(!$ground instanceof Ground){
            console.error('CrawController', 'para must be ground');
        }
        if(this._ground && this._ground != $ground){
            console.warn('CrawController', 'ground changed incorrectly');
        }
        this._ground = $ground;
        this._world.ground = this._ground;
    }

    isJumping(){
        return this._lock;
    }

    accLeft($a){
        this._absAcc1 = -$a;
    }

    accRight($a){
        this._absAcc2 = $a;
    }

    jump($upVec=300){
        if(this._lock){
            this._lock = false;
        }
        if(this._jpt < this.jumpTimes){
            this._accy = -$upVec;
            this._point.linearVelocity.y = -$upVec;
            this._jpt++;
        }
    }

    update(){
        let _grdSeg = this._ground.getGroundUndered(this._point.position);
        let theta = 0;
        if(_grdSeg){
            theta = Math.abs(_grdSeg.angle);
        }else{
            console.warn('找不到所在地面，忽视地面限制');
        }
        let speed = this._point.linearVelocity;
        if(Math.abs(speed.x) > this._friction){
            this._fX = this._friction * speed.x>0?1:-1;
        }else{
            this._fX = 0;
            speed.x = 0;
        }
        let acx = this._absAcc1 + this._absAcc2;
        speed.x += (acx - this._fX);
        if(Math.abs(speed.x) > this.maxSpeed){
            speed.x = this.maxSpeed * (speed.x>0?1:-1);
        }
        speed.x = speed.x * Math.cos(theta);    // 实时校正
        console.log(speed.x, theta, acx - this._fX);
        if(this._lock){
            this._point.setPositionToGround(this._ground);
        }else{
            this._accy -= -this._gravityacc;
            if(this._accy < 0.1){
                this._accy = 0;
            }
            speed.y += this._accy;
        }
        this._world.update();
    }
}
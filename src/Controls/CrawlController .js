class CrawlController{
    constructor($option){
        this._bindObj = $option.bindObj;
        this.jumpTimes = $option.jumpTimes || 3; // 几段跳
        this.maxSpeed = $option.maxSpeed || 160;
        this._ground = $option.ground;
        this._gravityacc = $option.gravityAcc || 0.9;
        this._friction = $option.friction || new Vector2d(7, 0);

        // private
        this._jpt = 0;
        this._point = new Point({
            force: new Vector2d(0, 0)
        });
        this._point.setOnGroundHit(()=>{
            this._point.setPositionToGround(this._ground);
            this._point.linearVelocity.y = 0;
            this._lock  = true;
            this._jpt = 0;
        });
        this._world = new World();

        this._acc = new Vector2d(0, 0);
        this._lock = true;
        this._fX = 0;

        if(this._bindObj)this._bindObj.position = this._point.position;
        this._world.addBody(this._point);
        this._world.ground = this._ground;
    }

    set bindObj($obj){
        this._bindObj = $obj;
        this._bindObj.position = this._point.position;
    }

    get bindObj(){
        return this._bindObj;
    }

    get isJumping(){
        return this._isJumping;
    }

    get ground(){
        return this.ground;
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

    accLeft($a){
        this._acc.x = -$a;
    }

    accRight($a){
        this._acc.x = $a;
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
        let speed = this._point.linearVelocity;
        if(Math.abs(speed.x) > this._friction.x){
            this._fX = this._friction.x * speed.x>0?1:-1;
        }else{
            this._fX = 0;
            speed.x = 0;
        }
        speed.x += this._acc.x - this._fX;
        if(Math.abs(speed.x) > this.maxSpeed){
            speed.x = this.maxSpeed * (speed.x>0?1:-1);
            console.log(this.maxSpeed, speed.x);
        }
        if(this._lock)this._point.setPositionToGround(this._ground);
        else{
            this._accy -= -this._gravityacc;
            if(this._accy < 0.1){
                this._accy = 0;
            }
            speed.y += this._accy;
        }
        this._world.update();
    }
}
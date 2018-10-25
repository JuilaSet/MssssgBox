class CrawlController extends Controller {
    constructor($option={}){
        super($option);
        this.jumpTimes = $option.jumpTimes || 2; // 几段跳
        this.maxSpeed = $option.maxSpeed || 150;
        this._world = $option.world || console.error('没有指定world对象');
        this._gravityacc = $option.gravity || 0.9;
        this._friction = $option.friction || 5;
        this._offset = $option.offset || new Vector2d(0, 0);    // 偏离值
        this._maxMoveHeight = $option.maxMoveHeight!=undefined?$option.maxMoveHeight:30;

        this._gravityForce = $option.gravityForce || 170;

        // private
        this._enableRight = true;
        this._enableLeft = true; 
        this._jpt = 0;
        this._point = new Point({
            position: $option.position,
            force: new Vector2d(0, 0)
        });
        this._point.setOnStaticHit(($which, $static)=>{
            this.defaultOnStaticHit($which, $static);
        });
        this._point.setOnGroundHit(()=>{
            this.defaultOnGroundHit();
        });
        this._world.addBody(this._point);

        this._absAcc1 = 0;
        this._absAcc2 = 0;
        this._lock = true;
        this._fX = 0;
    }

    defaultOnStaticHit($which, $static){
        this._point.force.y = 0;
        if($static != this.bindObj){
            this._point.staticBounce($which, $static);
            this._point.setPointToStaticSquare($static);
        }
    }

    defaultOnGroundHit(){
        this._point.setPositionToGround(this._world.ground);
        this._point.linearVelocity.y = 0;
        this._lock  = true;
        this._jpt = 0;
    }

    init(){
        this._point.init();
        this._jpt = 0;
        this._absAcc1 = 0;
        this._absAcc2 = 0;
        this._lock = true;
        this._fX = 0;
    }

    set position($position){
        this._point.position = $position;
    }

    get position(){
        return this._point.position;
    }

    get handler(){
        return this._point;
    }

    set statics($s){
        this._world._statics = $s;
    }

    get statics(){
        return this._world.statics;
    }

    set offset($offset){
        this._offset = $offset;
    }

    get offset(){
        return this._offset;
    }

    set bindObj($obj){
        this._bindObj = $obj;
        this._point.position.set(this._bindObj.position.x, this._bindObj.position.y);
    }

    get bindObj(){
        return this._bindObj;
    }

    get ground(){
        return this._world.ground;
    }

    set gravity($gacc){
        this._gravityacc = $gacc;
    }

    get gravity(){
        return this._gravityacc;
    }

    get velocityX(){
        return this._point.linearVelocity.x;
    }

    get velocityY(){
        return this._point.linearVelocity.y;
    }

    set ground($ground){
        if(!$ground instanceof Ground){
            console.error('CrawController', 'para must be ground');
        }
        if(this._world.ground && this._world.ground != $ground){
            console.warn('CrawController', 'ground changed incorrectly');
        }
        this._world.ground = $ground;
    }

    isJumping(){
        return this._lock;
    }

    accLeft($a=12){
        this._absAcc1 = -$a;
    }

    accRight($a=12){
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

    _calcEnableMove(h){
        let speed = this._point.linearVelocity;
        if( h > 0 ){
            this._enableRight = true;
            if(Math.abs(h) > this._maxMoveHeight){
                this._enableLeft = false;
            }else{
                this._enableLeft = true;
            }
        }else{
            this._enableLeft = true;
            if(Math.abs(h) > this._maxMoveHeight){
                this._enableRight = false;
            }else{ 
                this._enableRight = true;
            }
        }
    }

    render($context){
        $context.save();
        $context.beginPath();
        $context.strokeStyle = '#FFF';
        let x = [-5, -5, 5, 5], y = [-5, 5, -5, 5];
        for(let i=0; i<4; i++){
            $context.moveTo(this._point.position.x, this._point.position.y);
            $context.lineTo(this._point.position.x + x[i], this._point.position.y + y[i]);
        }
        $context.stroke();
        $context.restore();
    }

    update(){
        if(this._bindObj){
            let speed = this._point.linearVelocity;
            let _grdSeg = this._world.ground.getGroundUndered(this._point.position);
            let theta = 0;
            if(_grdSeg){
                theta = Math.abs(_grdSeg.angle);
            }else{
                console.warn('找不到所在地面，忽视地面限制');
            }
            // 速度累加
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
            if(this._lock){
                // 实时校正
                if(_grdSeg){
                    // 是否能够移动
                    let beta = _grdSeg.angle;
                    let h = _grdSeg.length * Math.sin(beta);
                    this._calcEnableMove(h);
                    if(this._enableRight && speed.x >= 0 || this._enableLeft && speed.x <= 0){
                        speed.x = speed.x * Math.cos(theta);
                    }else{
                        speed.x = 0;
                    }
                    this._point.setPositionToGround(this._world.ground);
                }
                this._point.force.y = 0;
            }else{
                // 跳跃
                this._point.force.y = this._gravityForce;
            }
            this._bindObj.position.x = this._offset.x + this._point.position.x;
            this._bindObj.position.y = this._offset.y + this._point.position.y;
        }else{
            console.warn('未绑定对象');
        }
    }
}
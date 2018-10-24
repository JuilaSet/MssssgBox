class CrawlAI{
    constructor($option={}){
        this._enableJump = true;
        this._enableDL = true;
        this._crawlController = $option.crawlController || console.error('未指定控制器'); // crawlController对象
        this._aim = $option.aim;    // 含有position属性
        this._timer = $option.timer;
        this._speed = $option.speed || 30;

        this._distance = $option.distance || 20;
        this._jumpT = $option.jumpRate || 6;
        this._jump = $option.jump || 100;
    }

    setOnNear($func, $dis){
        if($dis){
            this._distance = $dis;
        }
        this.onNear = $func;
    }

    onNear(){
        this.defaultOnNear();
    }

    defaultOnNear(){
        this._crawlController.accLeft(0);
        this._crawlController.accRight(0);
    }

    setOnFar($func){
        this.onFar = $func;
    }

    onFar(){
        this.defaultOnFar();
    }

    defaultOnFar(){
        if(this._aim.position.x < this._crawlController.position.x){
            this._crawlController.accLeft(this._speed);
            this._crawlController.accRight(0);
        }else{
            this._crawlController.accLeft(0);
            this._crawlController.accRight(this._speed);
        }
        if(Math.abs(this._crawlController.velocityX) < 50){
            if(this._enableJump){
                this._crawlController.jump(this._jump);
                this._enableJump = false;
                this._timer.callLater(()=>{
                    this._enableJump = true;
                }, this._jumpT);
            }
        }
    }

    setAction($func){
        this.action = $func;
    }

    // 行动
    action(){
        if(this._aim.position.clone().sub(this._crawlController.position).length() < this._distance){
            this.onNear();
        }else{
            this. onFar();
        }
    }

    update(){
        this.action();
    }
}
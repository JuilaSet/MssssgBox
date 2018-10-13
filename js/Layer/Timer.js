class Timer{
    constructor(){
        this.init();
        this._timeScale = 1;
    }

    init(){
        this.tick = 0;
    }

    update(){
        this.tick += this._timeScale;
    }
    
    setTimeScale($size){
        this._timeScale = $size;
    }

    interval($func, $wait){
        if(this.tick % $wait*this._timeScale == 0){
            $func();
        }
    }
}
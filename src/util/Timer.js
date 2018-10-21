class Timer{
    constructor(){
        this.init();
        this._timeScale = 1;
        this._funcList = {}; // {time->[funcs...]}
    }

    init(){
        this._tick = 0;
    }

    get tick(){
        return this._tick;
    }

    get timeScale(){
        return this._timeScale;
    }

    update(){
        this._tick += this._timeScale;
        this.callStackFunc();
    }

    interval($func, $wait){
        if(this._tick % $wait*this._timeScale == 0){
            $func();
        }
    }

    callLater($func, $howLong){
        let callTime = this._tick + $howLong * this._timeScale;
        if(this._funcList[callTime]){
            this._funcList[callTime].push($func);
        }else{
            this._funcList[callTime] = [$func];
        }
    }

    callStackFunc(){
        if(this._funcList[this._tick]){
            for(let f of this._funcList[this._tick]){
                f();
            }
            delete this._funcList[this._tick];
        }
    }
}
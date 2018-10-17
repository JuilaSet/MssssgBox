class Ticker{
    constructor($option={}){
        this._lastTime = 0;
        this.ticks = [];
        this.times = [];
    }

    tick($callback){
        // 智能setTimeout
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - this._lastTime));
        this.ticks.push(0);
        var id = window.setInterval(()=>{
                if($callback)$callback(currTime + timeToCall);   // 回调函数
                this.ticks[this.ticks.length - 1]++;     // 计时次数
            }, timeToCall);
        this._lastTime = currTime + timeToCall;
        this.times.push(id);
    }

    init(){
        this.ticks = [];
        this.times.forEach((x)=>{
            clearInterval(x);
        });
        this.times = [];
    }
}
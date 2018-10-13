class Timer{
    constructor(){
        this.init();
    }

    init(){
        this.tick = 0;
    }

    update(){
        this.tick++;
    }

    interval($func, $wait){
        if(this.tick % $wait == 0){
            $func();
        }
    }
}
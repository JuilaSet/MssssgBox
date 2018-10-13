class IOTrigger extends Trigger {
    
    constructor(){
        super();
        this.keyUpEvents = {any:()=>{}};
        this.keyDownEvents = {any:()=>{}};
    }

    setKeyUpEvent($func, $code){
        if( arguments.length == 1 ){
            this.keyUpEvents["any"] = $func;
        }else{
            this.keyUpEvents[`${$code}`] = $func;
        }
    }

    setKeyDownEvent($func, $code){
        if( arguments.length == 1 ){
            this.keyDownEvents["any"] = $func;
        }else{
            this.keyDownEvents[`${$code}`] = $func;
        }
    }

    update(){
        // keyDown
        if(this.keyDown)this.keyDownEvents["any"]();
        for(let k in this.keyDownEvents){
            if(this.keyDown == k){
                this.keyDownEvents[`${k}`]();
            }
        };
        this.init("kd");

        // keyUp
        if(this.keyUp)this.keyUpEvents["any"]();
        for(let k in this.keyUpEvents){
            if(this.keyUp == k){
                this.keyUpEvents[`${k}`]();
            }
        };
        this.init("ku");
    }
}
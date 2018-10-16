class IOTrigger extends Trigger {
    
    constructor($option){
        super($option);
        this.keyUpEvents = {any:{func:()=>{}}};
        this.keyDownEvents = {any:{func:()=>{}, down:false}};
        this.keyPressEvents = {any:{func:()=>{}}};
        this.mouseDownEvents = {any:{func:()=>{}, comp:undefined}};
        this.mouseMoveEvents = {any:{func:()=>{}, comp:undefined}};
        this.mouseUpEvents = {any:{func:()=>{}, comp:undefined}};
        this.mouseStretchEvents = {any:{func:()=>{}, comp:undefined}};
        this.mouseDblClickEvents = {any:{func:()=>{}, comp:undefined}};
        this.startMonitMouse();
        this.startMonitKey();
    }

    setKeyUpEvent($func, $code){
        if( arguments.length == 1 ){
            this.keyUpEvents.any = {func:$func, down:false};
        }else{
            this.keyUpEvents[`${$code}`] = {func:$func, down:false};
        }
    }

    setKeyPressEvent($func, $code){
        if( arguments.length == 1 ){
            this.keyPressEvents.any = {func:$func, down:false};
        }else{
            this.keyPressEvents[`${$code}`] = {func:$func, down:false};
        }
    }

    setKeyDownEvent($func, $code){
        if( arguments.length == 1 ){
            this.keyDownEvents.any = {func:$func, down:false};
        }else{
            this.keyDownEvents[`${$code}`] = {func:$func, down:false};
        }
    }

    setDblClick($comp, $func){
        if(!$comp.layer)console.error('未指定层级的comp');
        this.mouseDblClickEvents[`${$comp.layer}`] = { func:$func, comp:$comp };
    }

    setMouseDown($comp, $func){
        if(!$comp.layer)console.error('未指定层级的comp');
        this.mouseDownEvents[`${$comp.layer}`] = { func:$func, comp:$comp };
    }

    setMouseMove($comp, $func){
        if(!$comp.layer)console.error('未指定层级的comp');
        this.mouseMoveEvents[`${$comp.layer}`] = { func:$func, comp:$comp };
    }

    setMouseStretch($comp, $func){
        if(!$comp.layer)console.error('未指定层级的comp');
        this.mouseStretchEvents[`${$comp.layer}`] = { func:$func, comp:$comp };
    }

    setMouseUp($comp, $func){
        if(!$comp.layer)console.error('未指定层级的comp');
        this.mouseUpEvents[`${$comp.layer}`] = { func:$func, comp:$comp };
    }

    startMonitMouse(){
        // down
        this.onmousedown = (event)=>{
            // 根据鼠标位置判断是否点击到组件
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseDownEvents.any.func(event);
            for(let x in this.mouseDownEvents){
                if( this.mouseDownEvents[x].comp && this.mouseDownEvents[x].comp.zone && this.mouseDownEvents[x].comp.zone.check(mmp)){
                    this.mouseDownEvents[x].func(event);
                }
            }
        };

        // move
        this.onmousemove = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseMoveEvents.any.func(event);
            for(let x in this.mouseMoveEvents){
                if( this.mouseMoveEvents[x].comp && this.mouseMoveEvents[x].comp.zone && this.mouseMoveEvents[x].comp.zone.check(mmp)){
                    this.mouseMoveEvents[x].func(event);    
                }
            }
        };

        // up
        this.onmouseup = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseUpEvents.any.func(event);
            for(let x in this.mouseUpEvents){
                if( this.mouseUpEvents[x].comp && this.mouseUpEvents[x].comp.zone && this.mouseUpEvents[x].comp.zone.check(mmp)){
                    this.mouseUpEvents[x].func(event);    
                }
            }
        };

        // stretch
        this.onmousestretch = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseStretchEvents.any.func(event);
            for(let x in this.mouseStretchEvents){
                if( this.mouseStretchEvents[x].comp && this.mouseStretchEvents[x].comp.zone && this.mouseStretchEvents[x].comp.zone.check(mmp)){
                    this.mouseStretchEvents[x].func(event);    
                }
            }
        }

        // dblclick
        this.ondblclick = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseDblClickEvents.any.func(event);
            for(let x in this.mouseDblClickEvents){
                if( this.mouseDblClickEvents[x].comp && this.mouseDblClickEvents[x].comp.zone && this.mouseDblClickEvents[x].comp.zone.check(mmp)){
                    this.mouseDblClickEvents[x].func(event);    
                }
            }
        }
    }

    startMonitKey(){
        this.onkeypress = (event)=>{
            this.keyPressEvents.any.func(event);
            if(this.keyPressEvents[`${event.keyCode}`]){
                this.keyPressEvents[`${event.keyCode}`].func(event);
            }
        }

        this.onkeydown = (event)=>{
            this.keyDownEvents.any.func(event);
            if(this.keyDownEvents[`${event.keyCode}`]){
                let ke = this.keyDownEvents[`${event.keyCode}`]; 
                if(!ke.down){
                    ke.func(event);
                }
                ke.down = true;
            }
        }

        this.onkeyup = (event)=>{
            this.keyUpEvents.any.func(event);
            if(this.keyUpEvents[`${event.keyCode}`]){
                this.keyUpEvents[`${event.keyCode}`].func(event);
                this.keyDownEvents[`${event.keyCode}`].down=false;
            }
        }
    }

    mouseMap($position, $obj){
        let cx = $position.x, cy = $position.y;
        var mouseX = cx - $obj.offsetLeft;
        var mouseY = cy - $obj.offsetTop;
      
        // scale mouse coordinates to canvas coordinates
        var eobjX = mouseX * $obj.width / $obj.clientWidth;
        var eobjY = mouseY * $obj.height / $obj.clientHeight;

        return new Vector2d(eobjX, eobjY);
    }
}
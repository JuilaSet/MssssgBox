class IOTrigger extends Trigger {
    
    constructor($option){
        super($option);
        this.keyUpEvents = {any:()=>{}};
        this.keyDownEvents = {any:()=>{}};
        this.mouseDownEvents = {any:{"func":()=>{}, "comp":undefined}};
        this.mouseMoveEvents = {any:{"func":()=>{}, "comp":undefined}};
        this.mouseUpEvents = {any:{"func":()=>{}, "comp":undefined}};
        this.mouseStretchEvents = {any:{"func":()=>{}, "comp":undefined}};
        this.mouseDblClickEvents = {any:{"func":()=>{}, "comp":undefined}};
        this.startMonitMouse();
        this.startMonitKey();
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

    setDblClick($comp, $func){
        this.mouseDblClickEvents[`${$comp.id}`] = { func:$func, comp:$comp };
    }

    setMouseDown($comp, $func){
        this.mouseDownEvents[`${$comp.id}`] = { func:$func, comp:$comp };
    }

    setMouseMove($comp, $func){
        this.mouseMoveEvents[`${$comp.id}`] = { func:$func, comp:$comp };
    }

    setMouseStretch($comp, $func){
        this.mouseStretchEvents[`${$comp.id}`] = { func:$func, comp:$comp };
    }

    setMouseUp($comp, $func){
        this.mouseUpEvents[`${$comp.id}`] = { func:$func, comp:$comp };
    }

    startMonitMouse(){
        // down
        this.onmousedown = (event)=>{
            // 根据鼠标位置判断是否点击到组件
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseDownEvents["any"].func(event);
            for(let x in this.mouseDownEvents){
                if( this.mouseDownEvents[x].comp && this.mouseDownEvents[x].comp.zone.check(mmp)){
                    this.mouseDownEvents[x].func(event);
                }
            }
        };
        // move
        this.onmousemove = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseMoveEvents["any"].func(event);
            for(let x in this.mouseMoveEvents){
                if( this.mouseMoveEvents[x].comp && this.mouseMoveEvents[x].comp.zone.check(mmp)){
                    this.mouseMoveEvents[x].func(event);    
                }
            }
        };

        // up
        this.onmouseup = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseUpEvents["any"].func(event);
            for(let x in this.mouseUpEvents){
                if( this.mouseUpEvents[x].comp && this.mouseUpEvents[x].comp.zone.check(mmp)){
                    this.mouseUpEvents[x].func(event);    
                }
            }
        };

        // stretch
        this.onmousestretch = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseStretchEvents["any"].func(event);
            for(let x in this.mouseStretchEvents){
                if( this.mouseStretchEvents[x].comp && this.mouseStretchEvents[x].comp.zone.check(mmp)){
                    this.mouseStretchEvents[x].func(event);    
                }
            }
        }

        // dblclick
        this.ondblclick = (event)=>{
            let mmp = this.mouseMap(new Vector2d(event.clientX, event.clientY), this.display.canvas);
            event.mmp = mmp;
            this.mouseDblClickEvents["any"].func(event);
            for(let x in this.mouseDblClickEvents){
                if( this.mouseDblClickEvents[x].comp && this.mouseDblClickEvents[x].comp.zone.check(mmp)){
                    this.mouseDblClickEvents[x].func(event);    
                }
            }
        }
    }

    startMonitKey(){
        this.onkeydown = (event)=>{
            this.keyDownEvents["any"](event);
            if(this.keyDownEvents[`${event.keyCode}`]){
                this.keyDownEvents[`${event.keyCode}`](event);
            }
        }

        this.onkeyup = (event)=>{
            this.keyUpEvents["any"](event);
            if(this.keyUpEvents[`${event.keyCode}`]){
                this.keyUpEvents[`${event.keyCode}`](event);
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
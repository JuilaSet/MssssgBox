class Trigger{
    constructor($option){
        this.init(true, true, true);
        this.start();
        this.stretch = false;
        this.mousedown = false;
        this.display = $option.display;
    }

    init($dn, $mv, $up){
        // 函数重载
        if( typeof arguments[0] == "string" ){
            switch(arguments[0]){
                case "dn":this.downPosition = new Vector2d(-1, -1);break;
                case "mv":this.movePosition = new Vector2d(-1, -1);break;
                case "up":this.upPosition = new Vector2d(-1, -1);break;
            }
        }else{
            if($dn)this.downPosition = new Vector2d(-1, -1);
            if($mv)this.movePosition = new Vector2d(-1, -1);
            if($up)this.upPosition = new Vector2d(-1, -1);
        }
    }

    start(){
        let _this = this;
        document.onmousedown = (event)=>{
            this.mousedown = true;
            this.downPosition = new Vector2d(event.clientX, event.clientY);
            _this.onmousedown(event);
        }

        document.onmousemove = (event)=>{
            this.movePosition = new Vector2d(event.clientX, event.clientY);
            if(this.mousedown){
                this.stretch = true;
                this.onmousestretch(event);
            }else{
                this.stretch = false;
            }
            _this.onmousemove(event);
        }

        document.onmouseup = (event)=>{
            this.mousedown = false;
            this.upPosition = new Vector2d(event.clientX, event.clientY);
            _this.onmouseup(event);
        }

        document.ondblclick = (event)=>{
            _this.ondblclick(event);
        }

        document.onkeydown = (event)=>{
            _this.onkeydown(event);
        }

        document.onkeyup = (event)=>{
            _this.onkeyup(event);
        }
    }

    end(){
        document.onmousedown = ()=>{}
        document.onmousemove = ()=>{}
        document.onmouseup = ()=>{}
        document.ondblclick = ()=>{}
        document.onkeydown = ()=>{}
        document.onkeyup = ()=>{}
    }

    onmousedown(event){

    }

    onmousemove(event){
        
    }

    onmouseup(event){

    }

    ondblclick(event){

    }

    onmousestretch(event){
        
    }
    

    //
    onkeydown(event){
        
    }

    onkeyup(event){
        
    }
}
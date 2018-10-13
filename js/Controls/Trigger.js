class Trigger{
    constructor(){
        this.init(true, true, true, true, true);
    }

    init($dn, $mv, $up, $kd, $ku){
        // 函数重载
        if( typeof arguments[0] == "string" ){
            switch(arguments[0]){
                case "dn":this.downPosition = [-1, -1];break;
                case "mv":this.movePosition = [-1, -1];break;
                case "up":this.upPosition = [-1, -1];break;
                case "kd":this.keyDown = undefined;break;
                case "ku":this.keyUp = undefined;break;
            }
        }else{
            if($dn)this.downPosition = [-1, -1];
            if($mv)this.movePosition = [-1, -1];
            if($up)this.upPosition = [-1, -1];
            if($kd)this.keyDown = undefined;
            if($ku)this.keyUp = undefined;
        }
    }

    startMonitDom(){
        let _this = this;
        document.onmousedown = (event)=>{
            _this.onmousedown(event);
        }
        document.onmousemove = (event)=>{
            _this.onmousemove(event);
        }
        document.onmouseup = (event)=>{
            _this.onmouseup(event);
        }
        document.onkeydown = (event)=>{
            _this.onkeydown(event);
        }
        document.onkeyup = (event)=>{
            _this.onkeyup(event);
        }
    }

    endMonitDom(){
        document.onmousedown = ()=>{}
        document.onmousemove = ()=>{}
        document.onmouseup = ()=>{}
        document.onkeydown = ()=>{}
        document.onkeyup = ()=>{}
    }

    onmousedown(event){
        this.downPosition = [event.clientX, event.clientY];
    }

    onmousemove(event){
        this.movePosition = [event.clientX, event.clientY];
    }

    onmouseup(event){
        this.upPosition = [event.clientX, event.clientY];
    }

    onkeydown(event){
        this.keyDown = event.keyCode;
    }

    onkeyup(event){
        this.keyUp = event.keyCode;
    }
}
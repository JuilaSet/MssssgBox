class Trigger{
    constructor(){
        this.init(true, true, true, true, true);
    }

    init($dn, $mv, $up, $kd, $ku){
        if($dn)this.downPosition = [-1, -1];
        if($mv)this.movePosition = [-1, -1];
        if($up)this.upPosition = [-1, -1];
        if($kd)this.keyDown = undefined;
        if($ku)this.keyUp = undefined;
    }

    monitDom(){
        let _this = this;
        document.body.onmousedown = (event)=>{
            _this.onmousedown(event);
        }
        document.body.onmousemove = (event)=>{
            _this.onmousemove(event);
        }
        document.body.onmouseup = (event)=>{
            _this.onmouseup(event);
        }
        document.body.onkeydown = (event)=>{
            _this.onkeydown(event);
        }
        document.body.onkeyup = (event)=>{
            _this.onkeyup(event);
        }
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
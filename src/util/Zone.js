class Zone{
    constructor($option={}){
        this.position = $option.position || new Vector2d(0, 0);
        this.width = $option.width || 0;
        this.height = $option.height || 0;
    }

    getRandomPosition(){
        return new Vector2d( Math.random() * this.width + this.position.x,
                             Math.random() * this.height + this.position.y );
    }

    // +
    render($ctx){
        this.drawFilledRect($ctx);
    }

    // +
    drawFilledRect($ctx, $color){
        $ctx.fillStyle = $color || '#CCC';
        $ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    check($position){
        let p = this.position;
        if(isNaN(this.width + p.x) || isNaN(this.height + p.y)){
            console.warn("zone calc error w-"+this.width+" x-"+p.x+" h-"+this.height+" y-"+p.y);
            return false;
        }else if(   $position.x > p.x && 
                    $position.y > p.y && 
                    $position.x < this.width + p.x && 
                    $position.y < this.height + p.y ){
            return true;
        }
        else{
            return false;
        }
    }

    getClosetSide($position){
        let tp = this.position;
        let dxRight = Math.abs(tp.x + this.width - $position.x),
            dxLeft = Math.abs($position.x - tp.x),
            dyTop = Math.abs($position.y - tp.y),
            dyBottom = Math.abs(tp.y + this.height - $position.y),
            x, y;
        switch(Math.min(dxRight, dxLeft, dyBottom, dyTop)){
            case dxRight:
                return Zone.RIGHT;
            case dxLeft:
                return Zone.LEFT;
            case dyTop:
                return Zone.TOP;
            case dyBottom:
                return Zone.BOTTOM;
            default:
                console.error("Zone", "close side judging error");
        }
    }
}
Zone.INFINITY_ZONE = new (function(){
    let obj = {
        position: { x: -Infinity, y: -Infinity },
        width: Infinity,
        height: Infinity
    }
    obj.check = ()=>{
        return true;
    }
    return obj;
})();
Zone.TOP = 'top';
Zone.BOTTOM = 'bottom';
Zone.LEFT = 'left';
Zone.RIGHT = 'right';
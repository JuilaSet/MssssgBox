class StaticSquares{
    constructor($option={}){
        this.position = $option.position || new Vector2d(0, 0);  // 加入物体时决定
        this._sqrts = [];
        if($option.sqrts){
            for(let s of $option.sqrts){ //chain @Array
                this.addStaticSquare(s);
            }
        }
        this.living = true;
    }

    get sqrts(){
        return this._sqrts;
    }

    get size(){
        return this._size;
    }

    addStaticSquare($staticSqr){
        $staticSqr.group = this;
        this._sqrts.push($staticSqr);
        this._size = this._sqrts.length;
        this.clacCenter();
    }

    clacCenter(){
        if(this._sqrts.length > 0){
            let fep = this._sqrts[0].position;
            let minx = fep.x, maxx = fep.x, 
                miny = fep.y, maxy = fep.y;
            this._sqrts.forEach(item => {
                minx = item.position.x < minx ? item.position.x:minx;
                maxx = item.position.x > maxx ? item.position.x:maxx;
                miny = item.position.y < miny ? item.position.y:miny;
                maxy = item.position.y > maxy ? item.position.y:maxy;
            })
            this.position.set(minx + (maxx - minx)/2, miny + (maxy - miny)/2);
        }
    }

    isLiving(){
        return this.living;
    }

    kill(){
        this.living = false;
    }

    getSquareIn($position){
        let res;
        this._sqrts.forEach(sq => {
            if(sq.zone.check($position)){
                if(sq.isLiving()){
                    res = sq;
                }
            }
        });
        return res;
    }

    cleanSqures(){
        for(let x = 0; x < this._sqrts.length; x++){
            if(!this._sqrts[x].isLiving()){
                this._sqrts.splice(x, 1);
            }
        }
        this._size = this._sqrts.length;
    }

    render($ctx){
        if(this.position){
            this.drawCenter($ctx);
        }
        this._sqrts.forEach(sq => {
            if(sq.isLiving()){
                sq.render($ctx);
            }
        });
    }

    // 测试用
    drawCenter($context){
        ((x, y, r)=>{
            $context.save();
            $context.beginPath();
            $context.strokeStyle = '#FFF';
            $context.arc(x, y, r, 0, 2 * Math.PI, false);
            $context.arc(x, y, 3, 0, 2 * Math.PI, false);
            $context.stroke();
            $context.restore();
        })(this.position.x, this.position.y, 2);
    }
}

class StaticSquare{
    constructor($option={}){
        this.group = $option.group;
        this.position = $option.position || new Vector2d(0, 0);
        this.zone = $option.zone || new Zone({
            position: this.position,
            width: 45,
            height: 45
        });
        this.living = true;
    }

    isLiving(){
        return this.living;
    }

    kill(){
        this.living = false;
    }

    render($context){
        $context.save();
        $context.strokeStyle = '#FFF';
        $context.lineWidth = 1;
        $context.strokeRect(this.position.x, 
                            this.position.y,
                            this.zone.width, this.zone.height);
        $context.restore();
    }
}
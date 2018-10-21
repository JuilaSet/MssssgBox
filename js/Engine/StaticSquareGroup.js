class StaticSquareGroup{
    constructor($option={}){
        this._position = $option.position || new Vector2d(0, 0);  // 加入物体时决定
        this._sqrts = [];
        if($option.sqrts){
            for(let s of $option.sqrts){ //chain @Array
                this.addStaticSquare(s);
            }
        }
        this._living = true;

        // 外边框区域
        this._outLineZone = new Zone();
    }
    
    get position(){
        return this._position;
    }

    get sqrts(){
        return this._sqrts;
    }

    get size(){
        return this._size;
    }

    get living(){
        return this._living;
    }

    get outLineZone(){
        return this._outLineZone;
    }

    addStaticSquare($staticSqr){
        $staticSqr.group = this;
        this._sqrts.push($staticSqr);
        this._size = this._sqrts.length;
        this.calcCenter();
        this.calcOutlineZone();
    }

    calcOutlineZone(){
        if(this._sqrts.length > 0){
            let fep = this._sqrts[0].position;
            let minx = fep.x, maxx = fep.x, 
                miny = fep.y, maxy = fep.y,
                maxSWidth = this._sqrts[0].width, maxSHeight = this._sqrts[0].height,
                mSPx = fep.x + maxSWidth, mSPy = fep.y + maxSHeight,
                maxSx = fep.x, maxSy = fep.y;
            this._sqrts.forEach(item => {
                let ip = item.position;
                minx = ip.x < minx ? ip.x:minx;
                maxx = ip.x > maxx ? ip.x:maxx;
                miny = ip.y < miny ? ip.y:miny;
                maxy = ip.y > maxy ? ip.y:maxy;

                // 找到最外点
                if(mSPx < ip.x + item.width){
                    mSPx = ip.x + item.width;
                    maxSx = ip.x;
                    maxSWidth = item.width;
                }
                if(mSPy < ip.y + item.height){
                    mSPy = ip.y + item.height;
                    maxSy = ip.y;
                    maxSHeight = item.height;
                }
                
            })
            this._outLineZone.position.set(minx, miny);
            this._outLineZone.width = maxSx + maxSWidth - minx;
            this._outLineZone.height = maxSy + maxSHeight - miny;
        }
    }

    calcCenter(){
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
            this._position.set(minx + (maxx - minx)/2, miny + (maxy - miny)/2);
        }
    }

    kill(){
        this._living = false;
        this._sqrts.forEach(item => {
            item.kill();
        })
    }

    getSquareIn($position){
        for(let x = 0; x < this._sqrts.length; x++){
            let sq = this._sqrts[x];
            if(sq.zone.check($position)){
                if(sq.living){
                    return sq;
                }
            }
        }
    }

    cleanSqures(){
        for(let x = 0; x < this._sqrts.length; x++){
            if(!this._sqrts[x].living){
                this._sqrts.splice(x, 1);
            }
        }
        this._size = this._sqrts.length;
        this.calcCenter();
        this.calcOutlineZone();
    }

    // 测试用
    render($ctx){
        if(this._position){
            this.drawCenter($ctx);
            this.drawOutLine($ctx);
        }
        this._sqrts.forEach(sq => {
            if(sq.living){
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
        })(this._position.x, this._position.y, 2);
    }

    // 测试用
    drawOutLine($context){
        let z = this._outLineZone;
        $context.save();
        $context.strokeStyle = '#FFF';
        $context.lineWidth = 1;
        $context.strokeRect(z.position.x, 
                            z.position.y,
                            z.width, z.height);
        $context.strokeRect(z.position.x + 1, 
                            z.position.y + 1,
                            z.width - 2, z.height - 2);
        $context.restore();
    }
}

class StaticSquare{
    constructor($option={}){
        this._group = $option.group;
        // 碰撞区域
        this.zone = $option.zone || new Zone({
            position: $option.position,
            width: $option.width,
            height: $option.height
        });
        this._living = true;
    }

    get group(){
        return this._group;
    }

    set group($g){
        if(this._group && this._group != $g){
            console.warn("group changed incorrectly");
        }
        this._group = $g;
    }

    get living(){
        return this._living;
    }

    set position($position){
        this.zone.position = $position;
    }

    get position(){
        return this.zone.position;
    }

    set width($w){
        this.zone.width = $w;
    }

    get width(){
        return this.zone.width;
    }

    set height($h){
        this.zone.height = $h;
    }

    get height(){
        return this.zone.height;
    }

    kill(){
        this._living = false;
    }

    render($context){
        let z = this.zone;
        $context.save();
        $context.strokeStyle = '#FFF';
        $context.lineWidth = 1;
        $context.strokeRect(z.position.x, 
                            z.position.y,
                            z.width, z.height);
        $context.restore();
    }
}
class Ground {
    constructor($option){
        this._segments = []; // 地面片段
        this._size = 0;

        for(let s of $option.groundChain){ //chain @Array
            this.addSegments(s);
        }
    }
    
    get segments(){
        return this._segments;
    }

    get size(){
        return this._size;
    }

    render($ctx){
        this._segments.forEach(element => {
            element.render($ctx);
        });
    }

    getGroundUndered($position){
        let ox, dx;
        let gs = this.segments;
        let i1 = 0, i2 = this._size - 1, mid;    // 二分查找
        for(let x in this._segments){
            mid = Math.floor((i2 - i1) / 2 + i1);
            ox = gs[mid].origionPosition.x;
            dx = gs[mid].direction.x;
            if($position.x >= ox && $position.x < ox + dx){
                return gs[mid];
            }else{
                if($position.x < ox){
                    // left
                    i2 = mid;
                }else{
                    // right
                    i1 = mid;
                }
            }
        }
        return;
    }

    addSegments($seg){
        if(this._size != 0){
            this._segments[this._size - 1].setNextSegment($seg);
        }
        this._segments.push($seg);
        this._size = this._segments.length;
    }
}

class GroundSegment{
    constructor($option){
        this._origionPosition = $option.origionPosition || new Vector2d(0, 0);  // 起点
        this._direction = $option.direction || new Vector2d(1, 0);   // 方向

        // 无option的属性
        this._length = this._direction.length();
        let oy = this._origionPosition.y;
        this._argue = Math.acos(this._length / this._direction.x) * (oy < oy + this._direction.y?-1:1);;

        this.next = $option.next || {}; // 下一个片段
    }

    render($context, $color){
        $context.save();
        $context.strokeStyle = $color || "#FFF";
        $context.beginPath();
        let p = this._origionPosition;
        let d = this._direction;
        $context.moveTo(p.x, p.y);
        $context.lineTo(p.x + d.x, p.y + d.y);
        $context.stroke();
        $context.restore();
    }

    setNextSegment($seg){
        if(this._origionPosition.x > $seg._origionPosition.x)console.error("必须将片段从左向右连接");
        else{
            let dx = $seg.origionPosition.x - this._origionPosition.x;
            let dy = $seg.origionPosition.y - this._origionPosition.y;
            let length = Math.sqrt(dx * dx + dy * dy);
            let theta = Math.acos(dx / length);
            this._direction.set(dx, dy);
            this._length = length;
            let oy = this._origionPosition.y;
            this._argue = theta * (oy < oy + this._direction.y?-1:1);
            this.next = $seg
            return $seg; // 链式调用
        }
    }

    set origionPosition($position){
        this._origionPosition = $position;
    }

    get origionPosition(){
        return this._origionPosition;
    }

    set direction($vec){
        this._direction = $vec;
        this._length = this._direction.length();
        let oy = this._origionPosition.y;
        this._argue = Math.atan(this._direction.x, this._direction.y) * (oy < oy + this._direction.y?-1:1);
    }

    get direction(){
        return this._direction;
    }

    set argue($argue){
        let oy = this._origionPosition.y;
        this._argue = $argue;
        this._direction.x = this._length * Math.cos(this._argue);
        this._direction.y = this._length * Math.sin(this._argue);
    }

    get argue(){
        return this._argue;
    }
}
GroundSegment.NULL_SEGMENT = 0x462ce08;
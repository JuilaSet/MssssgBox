class Ground {
    constructor($option){
        this._segments = []; // 地面片段
        this._size = 0;

        if($option.groundChain){
            for(let s of $option.groundChain){ //chain @Array
                this.addSegments(s);
            }
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
        $seg.ground = this;
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
        this._ground = $option.ground;    // 所属地面
        // 无option的属性
        this.next = $option.next || {}; // 下一个片段
    }

    set ground($g){
        if(this._ground && this.ground != $g){
            console.warn("ground changed incorrectly");
        }
        this._ground = $g;
    }

    get ground(){
        return this._ground;
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

    setOnHit($func){
        this.onHit = $func;
    }

    //小球撞击到地表及以下时调用，每有一个point就调用一次
    onHit($point){

    }

    setOnHover($func){
        this.onHover = $func;
    }

    // 小球在地表以上时调用，每有一个point就调用一次
    onHover($point){

    }

    setNextSegment($seg){
        if(this._origionPosition.x > $seg._origionPosition.x)console.error("必须将片段从左向右连接");
        else{
            this.calcDirectionBasedOnNextSeg($seg);
            this.next = $seg
            return $seg; // 链式调用
        }
    }

    calcDirectionBasedOnNextSeg($seg){
        let dx = $seg.origionPosition.x - this._origionPosition.x;
        let dy = $seg.origionPosition.y - this._origionPosition.y;
        this._direction.set(dx, dy);
    }

    set origionPosition($position){
        this._origionPosition = $position;
    }

    get origionPosition(){
        return this._origionPosition;
    }

    set direction($vec){
        this._direction = $vec;
    }

    get direction(){
        return this._direction;
    }

    set angle($angle){
        let length = this._direction.length();
        let dx = length * Math.cos($angle), dy = length * Math.sin($angle - Math.PI *2);
        this._direction.x = dx;
        this._direction.y = dy;
    }

    get angle(){
        let length = this._direction.length(), dy = this._direction.y;
        return Math.asin(dy / length);
    }

    get length(){
        return this._direction.length();
    }
}
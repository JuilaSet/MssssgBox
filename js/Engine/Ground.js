class Ground {
    constructor($option){
        this.segments = []; // 地面片段
        this.size = 0;

        for(let s of $option.chain){ //chain @Array
            this.addSegments(s);
        }
    }

    render($ctx){
        this.segments.forEach(element => {
            element.render($ctx);
        });
    }

    addSegments($seg){
        if(this.size != 0){
            this.segments[this.size - 1].setNextSegment($seg);
        }
        this.segments.push($seg);
        this.size = this.segments.length;
    }
}

class GroundSegment{
    constructor($option){
        this._origionPosition = $option.origionPosition || new Vector2d(0, 0);  // 起点
        this._direction = $option.direction || new Vector2d(1, 0);   // 方向

        // 无option的属性
        this._argue = Math.atan(this._direction.x, this._direction.y);
        this._length = this._direction.length();

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
            this._argue = theta;
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
        this._argue = Math.atan(this._direction.x, this._direction.y);
    }

    get direction(){
        return this.direction;
    }

    set argue($argue){
        this._argue = $argue;
        this._direction.x = this._length * Math.cos(this._argue);
        this._direction.y = this._length * Math.sin(this._argue);
    }

    get argue(){
        return this._argue;
    }
}
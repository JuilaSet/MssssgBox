/*
 * 
 * 所有的可绘制动画
 * 
 * */
class Cube extends RenderObject{
    constructor($option={}){
        super($option);
        $option.width = $option.width || $option.size || 8;
        $option.height = $option.height || $option.size || 8;
        this._zone = new Zone({
            position: new Vector2d( this._disZone.width / 2 - $option.width,
                                    this._disZone.height / 2 - $option.height),
            width: $option.width,
            height: $option.height
        });
        // 颜色
        this.color = $option.color || "#FFF";
        this.shiningRate = $option.shiningRate!=undefined?$option.shiningRate : 20;
    }

    // @Override
    defaultRender($ctx, $tick, $zone){
        this.drawRect();
        this.timer.update();
    }

    drawRect(){
        this.context.strokeStyle = this.color;
        let p = this._zone.position;
        let w = this._zone.width, h = this._zone.height;
        let dx = w * 2/5, dy = h * 2/5;
        if(this.timer.tick % this.shiningRate < this.shiningRate / 2){
            this.context.strokeRect(p.x + h/2 - dx, p.y + w/2 - dy, w + dx * 2, h + dy * 2);
        }else{
            this.context.strokeRect(p.x + h/2, p.y + w/2, w, h);
        }
    }

}

class Ring extends RenderObject{
    constructor($option={}){
        super($option);
        
        this.r = $option.r || 10;

        // 颜色
        this.color = $option.color || "#FFF";

        // private
        this._p = new Vector2d(this._disZone.width / 2, this._disZone.height / 2);
    }

    // @Override
    defaultRender($ctx, $tick, $zone){
        this.drawCircle();
    }

    drawCircle(){
        this.context.beginPath();
        this.context.strokeStyle = this.color;
        this.context.arc(this._p.x, this._p.y, this.r/4, 0, 2 * Math.PI, false);
        this.context.arc(this._p.x, this._p.y, this.r/2, 0, 2 * Math.PI, false);
        this.context.arc(this._p.x, this._p.y, this.r, 0, 2 * Math.PI, false);
        this.context.stroke();
    }
}


class Circle extends RenderObject{
    constructor($option={}){
        super($option);
        
        this.r = $option.r || 10;

        // 颜色
        this.color = $option.color || "#FFF";

        // private
        this._p = new Vector2d(this._disZone.width / 2, this._disZone.height / 2);
    }

    // @Override
    defaultRender($ctx, $tick, $zone){
        this.drawCircle();
    }

    drawCircle(){
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this._p.x, this._p.y, this.r, 0, 2 * Math.PI, false);
        this.context.fill();
    }
}

class Tree extends RenderObject{
    
    constructor($option={}){
        super($option);
        this._force = $option.force || 0;     // 风力
        this._size = $option.size || 60;     // 起始长度
        this._minLen = $option.minLength || 2;    // 最小长度
        this._scale = $option.scale || 0.6;   // 每次缩小比例
        this._arg = $option.intersectionAngle || Math.PI / 10; //主干与枝干的夹角
        this._rotation = $option.rotation || Math.PI/2;
        this._treeHeight = $option.treeHeight!=undefined?$option.treeHeight:this._size; // 树高度

        // 颜色
        this.color = $option.color || "#FFF";
    }

    // @Override
    defaultRender($ctx, $tick, $zone){
        this.drawTree($tick);
        this.timer.update();
    }

    set force($f){
        this._force = $f;
    }

    get force(){
        return this._force;
    }

    set size($s){
        this._size = $s;
    }

    get size(){
        return this._size;
    }

    set intersectionAngle($arg){
        this._arg = $arg;
    }

    get intersectionAngle(){
        return this._arg;
    }

    set minLength($minLen){
        this._minLen = $minLen;
    }

    get minLength(){
        return this._minLen;
    }

    drawTree($tick){
        let _this = this;
        (function drawTree(px, py, ang, scale, len, times) {
            let _len = (times == 0)?_this._treeHeight:len;

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*_len*Math.cos(ang));
            var y = Math.floor(scale*_len*Math.sin(ang));

            //设置线条颜色
            _this.context.strokeStyle = _this.color;
            // 设置线条的宽度
            _this.context.lineWidth = 0.02 * _len;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (times != 0 && scale*_len < _this._minLen)return;

            var rn = (_this._force + Math.sin($tick / 3) + 
                        Math.sin($tick / 5) + 
                        Math.sin($tick / 7)
                    ) * (Math.PI / 180);

            //递归画出左右分枝
            // let r = Math.random() * 10 > 5; 
            // if(r){
                drawTree(px + x, py - y, ang - _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
            // }else{
                drawTree(px + x, py - y, ang + _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//right
            // }
        })(this._disZone.width / 2, this._disZone.height / 2, this._rotation, this._scale, this._size, 0);
    }
    
    drawTree3($tick){
        var _this = this;
        (function drawTree(px, py, ang, scale, len, times) {
            let _len = (times == 0)?_this._treeHeight:len;

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*_len*Math.cos(ang));
            var y = Math.floor(scale*_len*Math.sin(ang));

            //设置线条颜色
            _this.context.strokeStyle = _this.color;
            // 设置线条的宽度
            _this.context.lineWidth = 0.02 * _len;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (times != 0 && scale*_len < _this._minLen)return;

            var rn = (_this._force + Math.sin($tick / 3) + 
                        Math.sin($tick / 5) + 
                        Math.sin($tick / 7)
                    ) * (Math.PI / 180);

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
            drawTree(px + x, py - y, ang + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
            drawTree(px + x, py - y, ang + _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//right
        })(this._disZone.width / 2, this._disZone.height / 2, this._rotation, this._scale, this._size, 0);
    }

    drawTree4($tick){
        var _this = this;
        (function drawTree(px, py, ang, scale, len, times) {
            let _len = (times == 0)?_this._treeHeight:len;

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*_len*Math.cos(ang));
            var y = Math.floor(scale*_len*Math.sin(ang));

            //设置线条颜色
            _this.context.strokeStyle = _this.color;
            // 设置线条的宽度
            _this.context.lineWidth = 0.02 * _len;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (times != 0 && scale*_len < _this._minLen)return;

            var rn = (_this._force + Math.sin($tick / 3) + 
                        Math.sin($tick / 5) + 
                        Math.sin($tick / 7)
                    ) * (Math.PI / 180);

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
            drawTree(px + x, py - y, ang + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
            drawTree(px + x, py - y, ang + _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//right
            drawTree(px + x, py - y, -ang + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//left
        })(this._disZone.width / 2, this._disZone.height / 2, this._rotation, this._scale, this._size, 0);
    }
}
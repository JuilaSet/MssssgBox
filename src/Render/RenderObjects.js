/*
 * 
 * 所有的可绘制动画
 * 
 * */

class Tree extends RenderObject{
    
    constructor($option={}){
        super($option);
        this._force = $option.force || 0;     // 风力
        this._size = $option.size || 60;     // 起始长度
        this._minLen = $option.minLength || 2;    // 最小长度
        this._scale = $option.scale || 0.6;   // 每次缩小比例
        this._arg = $option.intersectionAngle || Math.PI / 10; //主干与枝干的夹角
        this._rotation = $option.rotation || Math.PI/2;
        this._treeHeight = $option.treeHeight!=undefined?$option.treeHeight:this._size;// 树高度

        // 颜色
        this.color = $option.color || "#FFF";
    }

    set force($f){
        this._force = $f;
    }

    get force(){
        return this._force;
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
            drawTree(px + x, py - y, ang + _this._arg + rn, scale, scale*len, 100 * (scale*len - _this._minLen) / (len - _this._minLen), ++times);	//right
        })(this._disZone.width / 2, this._disZone.height / 2, this._rotation, this._scale, this._size, 0);
    }
}
class Animation{
    constructor($options){
        this.width = $options.width || 100;
        this.height = $options.height || 100;
        this.position = $options.position || {x:0, y:0};
        this.timer = $options.timer;
        
        this.buffer = document.createElement('canvas');
        this.context = this.buffer.getContext('2d');

        this.buffer.width = this.width;
        this.buffer.height = this.height;
        this.buffer.backgroundColor = "#FFF";
    }
    
    clearBuffer(){
        this.context.clearRect(0, 0, this.width, this.height);
    }
    
    // 设置动作
    setAction($actionFunc){
        this.action = $actionFunc;
    }

    // 绘制边
    drawFrame($once){
        this.context.save();
        this.context.fillStyle = "#FFF";
        this.context.lineWidth = 1;
        this.context.strokeRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    // 绘制树
    drawTree($force=0){
        //主干与枝干的夹角
        var arg = Math.PI / 10;
        var _this = this;
        
        (function drawTree(px, py, ang, scale, len) {

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*len*Math.cos(ang));
            var y = Math.floor(scale*len*Math.sin(ang));

            _this.context.save();
            //设置线条颜色
            _this.context.strokeStyle = 'white';
            // 设置线条的宽度
            _this.context.lineWidth = 0.03 * len;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (scale*len < 6)return;

            var rn = ( $force + Math.sin(_this.timer.tick / 3) + 
                        Math.sin(_this.timer.tick / 5) + 
                        Math.sin(_this.timer.tick / 7)
                    ) * (Math.PI / 180);

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - arg + rn, scale, scale*len);	//left
            drawTree(px + x, py - y, ang + arg + rn, scale, scale*len);	//right
            _this.context.restore();

        })(this.width/2, this.height/2 + 70, Math.PI/2, 0.78, 30);
    }
    
}
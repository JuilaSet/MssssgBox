class Display{
    constructor($canvas, $container, $timer){
        this.canvas = $canvas || document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        
        // 缓冲
        this.buffer = document.createElement('canvas');
        this.bufferContext = this.buffer.getContext('2d');

        this.container = $container || document.createElement('div');
        this.container.appendChild(this.canvas);

        // 鼠标右键取消效果
        this.container.oncontextmenu = ()=>{
            return false
        };
        document.body.appendChild(this.container);

        this.timer = $timer;
    }

    render($beforeFunc, $afterFunc){
        let _this = this;
        (function animation() {
            $beforeFunc(_this.bufferContext);
            
            // 双缓冲
            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.context.drawImage(_this.buffer, 0, 0);
            _this.bufferContext.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            $afterFunc(_this.bufferContext);

            window.requestAnimationFrame(animation);
        })();
    }

    // setters
    setFullScreen($boolean){
        if($boolean){
            this.container.onclick = ()=>{
                if (this.container.requestFullscreen) {
                    this.container.requestFullscreen();
                } else if (this.container.mozRequestFullScreen) {
                    this.container.mozRequestFullScreen();
                } else if (this.container.webkitRequestFullScreen) {
                    this.container.webkitRequestFullScreen();
                }
            }
        
        }else{
            this.container.onclick = ()=>{};
        }
    }

    // 绘制树
    drawTree($rn=0){
        //主干与枝干的夹角
        var arg = Math.PI / 10;
        var _this = this;
        
        (function drawTree(px, py, ang, scale, len) {

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*len*Math.cos(ang));
            var y = Math.floor(scale*len*Math.sin(ang));

            //设置线条颜色
            _this.bufferContext.strokeStyle = 'white';
            // 设置线条的宽度
            _this.bufferContext.lineWidth = 0.03 * len;
            // 绘制直线
            _this.bufferContext.beginPath();
            // 起点
            _this.bufferContext.moveTo(px, py);
            // 终点
            _this.bufferContext.lineTo(px + x, py - y);
            _this.bufferContext.closePath();
            _this.bufferContext.stroke();

            // 终止递归
            if (scale*len < 7)return;

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - arg + $rn, scale, scale*len);	//left
            drawTree(px + x, py - y, ang + arg + $rn, scale, scale*len);	//right
        })(this.canvas.width / 2 + 120, this.canvas.height / 2 + 70, Math.PI/2, 0.78, 50);
    }
}
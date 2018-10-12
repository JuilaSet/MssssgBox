class Game{
    constructor($options, $canvas, $container){
        this.canvas = $canvas || document.createElement('canvas');
        this.container = $container || document.createElement('div');
        
        this.context = this.canvas.getContext('2d');

        this.container.appendChild(this.canvas);
        document.body.appendChild(this.container);
    }

    // 开始游戏
    run($beforeFunc, $afterFunc){
        let _this = this;
        let _tick = 0;
        (function animation() {
            _tick++;
            $beforeFunc(_tick);
            // 清空
            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            $afterFunc(_tick);
            window.requestAnimationFrame(animation);
        })();
    }

    // getters
    getCanvas(){
        return this.canvas;
    }
    getContainer(){
        return this.container;
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

    // 绘制数
    drawTree($rn=0){
        //主干与枝干的夹角
        var arg = Math.PI / 15;
        var _this = this;
        
        (function drawTree(px, py, ang, scale, len) {

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*len*Math.cos(ang));
            var y = Math.floor(scale*len*Math.sin(ang));

            //设置线条颜色
            _this.context.strokeStyle = 'white';
            // 设置线条的宽度
            _this.context.lineWidth = 0.2;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (scale*len < 10)return;

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - arg + $rn, scale, scale*len);	//left
            drawTree(px + x, py - y, ang + arg + $rn, scale, scale*len);	//right
        })(this.canvas.width / 2 + 120, this.canvas.height / 2 + 70, Math.PI/2, 0.78, 40);
    }
}
class Game{
    constructor($options, $canvas, $container){
        this._canvas = $canvas || document.createElement('canvas');
        this._div = $container || document.createElement('div');

        this._div.appendChild(this._canvas);
    }

    // 开始游戏
    run($beforeFunc, $afterFunc){
        (function animation() {
            $beforeFunc();
            this.render();
            $afterFunc();
            window.requestAnimationFrame(animation);
        })();
    }

    // 渲染
    render($tick){

    }

    // getters
    getCanvas(){
        return this._canvas;
    }
    getContainer(){
        return this._div;
    }

    // setters
    setFullScreen($boolean){
        if($boolean){
            this._div.onclick = ()=>{
                if (this._div.requestFullscreen) {
                    this._div.requestFullscreen();
                } else if (this._div.mozRequestFullScreen) {
                    this._div.mozRequestFullScreen();
                } else if (this._div.webkitRequestFullScreen) {
                    this._div.webkitRequestFullScreen();
                }
            }
        
        }else{
            this._div.onclick = ()=>{};
        }
    }

    // 绘制数
    drawTree(){
        //js
        var canvas = this._canvas, context=canvas.getContext('2d');
        //主干与枝干的夹角
        var arg = Math.PI / 15;

        function drawTree(px, py, ang, scale, len) {
            //引入偏移随机角度，改变一下形状
            var rn = Math.random() * 10 * (Math.PI / 180);

            var x = Math.floor(scale*len*Math.cos(ang));
            var y = Math.floor(scale*len*Math.sin(ang));

            //设置线条颜色
            context.strokeStyle = 'white';
            // 设置线条的宽度
            context.lineWidth = 1;
            // 绘制直线
            context.beginPath();
            // 起点
            context.moveTo(px, py);
            // 终点
            context.lineTo(px+x, py-y);
            context.closePath();
            context.stroke();

            //终止递归
            if (scale*len<20)
                    return;

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - arg + rn, scale, scale*len);	//left
            drawTree(px + x, py - y, ang + arg + rn, scale, scale*len);	//right

        }

        function init() {

            // 拿到上下文
            context = canvas.getContext('2d');

            // 画分形树
            setInterval(function(){
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawTree(300, 300, Math.PI/2, 0.85, 50);
            }, 200);

        }
    }
}
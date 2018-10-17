class Display{
    constructor($canvas, $container, $timer){
        this.canvas = $canvas || document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;

        let dis_this = this;
        window.onresize = ()=>{
            dis_this.canvas.width = document.documentElement.clientWidth;
            dis_this.canvas.height = document.documentElement.clientHeight;
        }
        
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
        this.components = []; // []][
    }

    addAnimation($animation){
        if($animation.layer == undefined){
            $animation.layer = this.components.length;
            console.error("未指定层级的animation");
        }
        this.components[$animation.layer] = $animation;
    }

    removeAnimation($layer){
        delete this.components[$layer];
    }

    // 帧循环渲染
    render($beforeFunc, $afterFunc){
        let _this = this;
        (function animation() {
            _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            $beforeFunc(_this.context);

            // 绘制动画
            _this.components.forEach((a)=>{
                a.update();
                let p = a.position;
                _this.context.drawImage(a.buffer, p.x, p.y);
                a.clearBuffer();
            });

            // 双缓冲
            _this.context.drawImage(_this.buffer, 0, 0);
            _this.bufferContext.clearRect(0, 0, _this.buffer.width, _this.buffer.height);
            
            $afterFunc(_this.context);
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
}
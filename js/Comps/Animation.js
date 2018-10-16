class Animation extends Component{
    constructor($option){
        super($option);
        this.timer = $option.timer;
        
        this.buffer = document.createElement('canvas');
        this.context = this.buffer.getContext('2d');

        this.rotation = 0;

        this.buffer.width = this.width;
        this.buffer.height = this.height;
        this.buffer.backgroundColor = "#FFF";

        if($option.layer == undefined){
            console.error("你需要给animation对象指定layer值");
        }
    }
    
    clearBuffer(){
        this.context.save();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.restore();
    }
    
    // 设置动作
    setAction($actionFunc){
        this.action = $actionFunc;
    }

    action($context){

    }

    update(){
        this.action(this.context);
    }

    drawRandomColor(){
        this.context.save();
        var c = Math.random()*255;
        this.context.fillStyle = `rgb(${c}, ${c}, ${c})`; 
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    // 绘制边
    drawFrame(){
        this.context.save();
        this.context.strokeStyle = "#FFF";
        this.context.lineWidth = 1;
        this.context.strokeRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    fill(){
        this.context.save();
        this.context.fillStyle = "#FFF";
        this.context.lineWidth = 1;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    // (测试用)绘制树
    drawTree($force=0, $size=10, $min=2, $arg, $rotation=Math.PI/2){
        this.context.save();
        this.context.translate(this.width/2, this.height/2);
        this.context.rotate(this.rotation);
        //主干与枝干的夹角
        var arg = $arg || Math.PI / 2;
        var _this = this;

        (function drawTree(px, py, ang, scale, len, prob) {

            //引入偏移随机角度，改变一下形状
            var x = Math.floor(scale*len*Math.cos(ang));
            var y = Math.floor(scale*len*Math.sin(ang));

            //设置线条颜色
            _this.context.strokeStyle = 'white';
            // 设置线条的宽度
            _this.context.lineWidth = 0.02 * len;
            // 绘制直线
            _this.context.beginPath();
            // 起点
            _this.context.moveTo(px, py);
            // 终点
            _this.context.lineTo(px + x, py - y);
            _this.context.closePath();
            _this.context.stroke();

            // 终止递归
            if (scale*len < $min)return;
            // if ( prob && Math.floor(Math.random() * 100) > prob)return;

            var rn = ( $force + Math.sin(_this.timer.tick / 3) + 
                        Math.sin(_this.timer.tick / 5) + 
                        Math.sin(_this.timer.tick / 7)
                    ) * (Math.PI / 180);

            //递归画出左右分枝
            drawTree(px + x, py - y, ang - arg + rn, scale, scale*len, 100 * (scale*len - $min) / ($size - $min));	//left
            drawTree(px + x, py - y, ang + arg + rn, scale, scale*len, 100 * (scale*len - $min) / ($size - $min));	//right
        })(0, 0 + $size, $rotation, 0.75, $size);

        this.context.restore();
    }
    
}
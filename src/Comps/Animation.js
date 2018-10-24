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

    action($context, $this){
        
    }

    update(){
        this.action(this.context, this);
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

    applyRotation(){
        this.context.rotate(this.rotation);
    }

    alignCenter(){
        this.context.translate(this.width/2, this.height/2);
    }
}
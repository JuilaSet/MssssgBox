class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){
        
        let dis = this.display;
        dis.setFullScreen(true);

        let timer = this.timer;

        let stats = new Stats();
        dis.container.appendChild( stats.dom );

        let iotrigger = this.iotrigger;

        let animation = new Animation({
            layer:1,
            id:1,
            iotrigger: iotrigger,
            position:new Vector2d(100, 100),
            timer: timer,
            width:150,
            height:150
        }); 
        let moveController = new MoveController({
            bindObj: animation,
            frictionX: 0.22,
            frictionY: 0.22,
            maxSpeedX: 7,
            maxSpeedY: 7
        });

        let animation2 = new Animation({
            layer:2,
            id:2,
            iotrigger: iotrigger,
            position:new Vector2d(100, 40),
            timer: timer,
            width:35,
            height:35
        }); 
        animation.setAction(()=>{
            animation.drawTree(0, 35, 8);
            animation.drawFrame();
        });
        dis.addAnimation(animation);

        animation.setDblClick(()=>{
            moveController.setBindObj(animation);
        });

        animation2.setAction(()=>{
            animation2.drawTree(12, 10, 2);
            animation2.drawFrame();
        });
        dis.addAnimation(animation2);

        animation2.setDblClick(()=>{
            moveController.setBindObj(animation2);
        });

        // X
        iotrigger.setKeyUpEvent(()=>{
            moveController.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accRight(2);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
            moveController.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accLeft(2);
        }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
            moveController.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accUp(2);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
            moveController.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accDown(2);
        }, 83);

        ///
        dis.render(()=>{
            moveController.update();
            stats.update();
            timer.update();
        }, ()=>{

        });
    }

    // 暂停
    stop(){

    }
}
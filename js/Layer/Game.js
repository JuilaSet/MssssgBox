class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){
        
        let dis = this.display;
        dis.setFullScreen(false);

        let timer = this.timer;

        let stats = new Stats();
        dis.container.appendChild( stats.dom );

        let iotrigger = this.iotrigger;

        let animation = new Animation({
            layer:1,
            id:1,
            position:new Vector2d(100, 100),
            timer: timer,
            width:300,
            height:300
        }); 
        let mc = new MoveController({
            bindObj: animation,
            frictionX: 0.22,
            frictionY: 0.22,
            maxSpeedX: 7,
            maxSpeedY: 7
        });

        mc.setOnMove(()=>{

        });
        let animation2 = new Animation({
            layer:2,
            id:2,
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

        animation2.setAction(()=>{
            animation2.drawTree(12, 10, 2);
            animation2.drawFrame();
        });
        dis.addAnimation(animation2);

        // mouse
        iotrigger.setMouseMove(animation, (e)=>{
        //    mc.bindObj = animation;
            console.log(1);
        });
        
        iotrigger.setMouseMove(animation2, (e)=>{
        //    mc.bindObj = animation2;
            console.log(2);
        });

        // X
        iotrigger.setKeyUpEvent(()=>{
            mc.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
            mc.accRight(2);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
            mc.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            mc.accLeft(2);
        }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
            mc.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
            mc.accUp(2);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
            mc.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            mc.accDown(2);
        }, 83);

        ///
        dis.render(()=>{
            mc.update();
            stats.update();
            timer.update();
        }, (ctx)=>{

        });
    }

    // 暂停
    stop(){

    }
}
class Game{
    constructor(){
        this.display = new Display();
        this.iotrigger = new IOTrigger({display: this.display});
    }

    // 开始游戏
    run(){
        
        let dis = this.display;
        dis.setFullScreen(false);

        let stats = new Stats();
        dis.container.appendChild( stats.dom );
        
        let timer = new Timer();

        let iotrigger = this.iotrigger;

        let animation = new Animation({
            layer:1,
            id:1,
            position:new Vector2d(100, 100),
            timer: timer,
            width:30,
            height:30
        }); 
        let mc = new MoveController({
            bindObj: animation,
            frictionX: 0.01,
            frictionY: 0.01,
        });

        mc.setOnMove(()=>{

        });
        let animation2 = new Animation({
            layer:2,
            id:2,
            position:new Vector2d(100, 40),
            timer: timer,
            width:30,
            height:30
        }); 
        animation.setAction(()=>{
            animation.drawTree();
            animation.drawFrame();
        });
        dis.addAnimation(animation);

        animation2.setAction(()=>{
            animation2.drawTree(12);
            animation2.drawFrame();
        });
        dis.addAnimation(animation2);

        // mouse
        iotrigger.setDblClick(animation, (e)=>{
            mc.bindObj = animation;
        });
        
        iotrigger.setDblClick(animation2, (e)=>{
            mc.bindObj = animation2;
        });

        // X
        iotrigger.setKeyUpEvent(()=>{
            mc.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
            mc.accRight(0.31);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
            mc.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            mc.accLeft(0.31);
        }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
            mc.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
            mc.accUp(0.31);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
            mc.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            mc.accDown(0.31);
        }, 83);


        console.log(iotrigger.downPosition);
        ///
        dis.render(()=>{
        }, ()=>{
            mc.update();
            stats.update();
            timer.update();
            // 
            Math.atan(4/5);
        });
    }

    // 暂停
    stop(){

    }
}
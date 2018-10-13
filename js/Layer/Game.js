class Game{
    constructor(){
        this.display = new Display();
    }

    // 开始游戏
    run(){
        
        let dis = this.display;
        dis.setFullScreen(false);

        let stats = new Stats();
        dis.container.appendChild( stats.dom );
        
        let iotrigger = new IOTrigger();
        iotrigger.startMonitDom();

        let timer = new Timer();
        let animation = new Animation({
            layer:0,
            position:{x:0,y:0},
            timer: timer,
            width:30,
            height:30
        }); 

        let mc = new MoveController({
            bindObj: animation,
            frictionX: 0.1,
            frictionY: 0.1,
        });

        let f = 0;
        animation.setAction(()=>{
            animation.drawTree(f);
            animation.drawFrame();
        });

        dis.addAnimation(animation);

        // X
        iotrigger.setKeyUpEvent(()=>{
            mc.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
            mc.accRight(0.11);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
            mc.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            mc.accLeft(0.11);
        }, 65);

        // Y
        iotrigger.setKeyUpEvent(()=>{
            mc.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
            mc.accUp(0.11);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
            mc.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            mc.accDown(0.11);
        }, 83);

        ///
        dis.render(()=>{
        }, ()=>{
            console.log(iotrigger.keyUp);
            mc.update();
            stats.update();
            iotrigger.update();
            timer.update();
        });
    }

    // 暂停
    stop(){

    }
}
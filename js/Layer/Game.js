class Game{
    constructor(){
        this.display = new Display();
    }

    // 开始游戏
    run(){
        
        let dis = this.display;
        dis.setFullScreen(false);

        let iotrigger = new IOTrigger();
        iotrigger.startMonitDom();

        let timer = new Timer();
        let animation = new Animation({
            position:{x:0,y:0},
            timer: timer
        }); 
        
        let f = 0, a = 0;
        let speed = 0;
        animation.setAction(()=>{
            animation.drawTree(f);
            animation.drawFrame();
        });

        dis.addAnimation(animation);

        iotrigger.setKeyUpEvent(()=>{
            a = 0;
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
            f = speed = 0;
            a = 0.1;
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
            a = 0;
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            f = speed = 0;
            a = -0.1;
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            f = speed = a = 0;
        }, 32);

        ///
        dis.render(()=>{}, ()=>{
            speed += a;
            animation.position.x += speed;
            f += 10 * a;
            iotrigger.update();
            timer.update();
        });
    }
}
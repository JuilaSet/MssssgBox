class Game{
    constructor(){
        this.display = new Display();
    }

    // 开始游戏
    run(){
        
        let dis = this.display.setFullScreen(false);
        let trigger = this.trigger = new Trigger();
        
        ///
        let rn = 0;
        let timer = new Timer();
        this.display.render(($ctx)=>{
            timer.interval(()=>{
                rn = ( 10 + Math.sin(timer.tick * 4) + 
                            Math.sin(timer.tick / 5) + 
                            Math.sin(timer.tick / 7)
                     ) * (Math.PI / 180);
            }, 3);
            this.display.drawTree(rn);
        },($ctx)=>{
            timer.update();
        });
    }
}
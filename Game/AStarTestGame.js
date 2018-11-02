"strict mode";
class AStarTestGame{
    constructor(){
        this.timer = new Timer();
        this.display = new Display(undefined, undefined, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
        this.pause = false;
    }

    // 开始游戏
    run(){
        let dis = this.display;
        let timer = this.timer;

        let animation = new Animation({
            position : new Vector2d(0, 0),
            width : dis.canvas.width,
            height : dis.canvas.height,
            iotrigger : this.iotrigger,
            id : 1,
            layer : 1
        });

        // AI模块
        // GridAI 测试 {i, j}
        let grids = new GridNet({
            position : new Vector2d(100, 100),
            w : 30,
            h : 30,
            wn : 15,
            hn : 15
        });

        let gridAi = new AStarAI({
            gridNet : grids,
            aimRas : {i: 0, j: 0},
            orgRas : {i: 10, j: 7}
        });
        gridAi.initStateSpace();

        animation.setAction(($ctx)=>{
            animation.drawFrame();
            gridAi.render($ctx);
        });

        animation.setDblClick((e)=>{
            let ras = grids.getRasterize(e.offset);
            // 添加路径
            if(ras){
                if(e.button == 0){
                        gridAi.setAim(ras.i, ras.j);
                        gridAi.search();
                        console.log(gridAi.state);
                }
            }
        });
        animation.setMouseStretch((e)=>{
            let ras = grids.getRasterize(e.offset);
            // 添加路径
            if(ras){
                gridAi.addBlock(ras.i, ras.j);
            }
        });
        
        dis.addAnimation(animation);



        ///
        dis.render(()=>{
            timer.update();
        }, ()=>{

        });
    }
}
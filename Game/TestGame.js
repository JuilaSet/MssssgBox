"strict mode";
class TestGame{
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
                wn : 30,
                hn : 15
            });

        let blocks = [];
        for(let x = 0; x < 10; x++){
            blocks.push({
                i: 10 + x,
                j: 10 
            });
        }
        let gridAi = new GridSearchAi({
            gridNet : grids,
            orgRas : {i: 5, j: 0},
            blockRases : blocks
        });

        animation.setAction(($ctx)=>{
            animation.drawFrame();
            gridAi.render($ctx);
        });

        animation.setMouseDown((e)=>{
            // 添加路径
            let ras = grids.getRasterize(e.offset);
            if(ras){
                gridAi.setAim(ras.i, ras.j);
                gridAi.initStateSpace();
                gridAi.search();
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
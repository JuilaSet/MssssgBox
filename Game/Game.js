"strict mode";
class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
        this.pause = false;
    }

    // 开始游戏
    run(){
        // dis 模块
        let dis = this.display;
        dis.setFullScreen(false);
        let c = 10101;

        let timer = this.timer;

        let stats = new Stats();
        dis.container.appendChild( stats.dom );

        let iotrigger = this.iotrigger;
        let animation = new Animation({
            layer:1,
            id:1,
            iotrigger: iotrigger,
            position:new Vector2d(0, 0),
            timer: timer,
            width: dis.canvas.width,
            height: dis.canvas.height
        });

        // 物理模块
        let segnum = 200;
        let gen = new GroundMapGenerator({
            width: animation.width + 1,
            height: animation.height,
            segnum: segnum,
            beginHeight : 400
        });
        let segs = gen.generateSegs();
        gen.adjustSegsToValley(segs, 200);
        let ground = gen.generateMap(segs).ground;

        let world = new World({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            }),
            ground: ground
        });
        let fac = new ControlableUnitFactory({
            game: this,
            iotrigger : iotrigger
        });

        let fac2 = new AIUnitFactory({
            game: this,
            world: world
        });

        let unitm = new UnitManager();
        let tu = fac.createCrawlUnit(new Tree({treeHeight:0}), new Vector2d(40, 100), world, {});
        unitm.add(tu);

        let tu2 = fac2.createCrawlAiUnit(new Cube(), new Vector2d(400, 100), {}, {
            aimUnit: tu,
            timer: timer
        });
        unitm.add(tu2);

        iotrigger.setKeyPressEvent(()=>{

        },32);

        animation.setAction(($ctx, $this)=>{
            animation.drawFrame();
            unitm.render($ctx, timer.tick);
            // world.render($this);
            ground.render($ctx);
        });
        dis.addAnimation(animation);
        
        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                world.update();
                unitm.update();
            }
        }, ()=>{

        });
    }

    // 暂停切换
    switch(){
        this.pause =! this.pause;
    }

    // 暂停
    stop(){
        this.pause = true;
    }
    
    // 继续
    resume(){
        this.pause = false;
    }
}
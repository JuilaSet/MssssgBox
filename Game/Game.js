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
        // AI 模块测试
        let rulebai = new RuleBasedAiSystem();
        let ISDIE = 0x1, CANBEKILLED=0x2, CONNBEKILLED=0x3, KILL=0x4, DIE=0x5, ALIVE=0x6;
        rulebai.addRules([
            new Rule({
                result:DIE,
                expression:[ISDIE, Fact.OR, CANBEKILLED]
            }), new Rule({
                result:ALIVE,
                expression: [KILL, Fact.AND, CONNBEKILLED]
            })
        ]);
        rulebai.mssageRules = [KILL, CONNBEKILLED];
        console.log( rulebai.infer() );

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
            iotrigger : iotrigger,
            world: world
        });

        let fac2 = new AIUnitFactory({
            game: this,
            world: world
        });

        let unitm = new UnitManager();

        let hero = fac.createTreeHeroUnit(new Vector2d(40, 100), {angle: Math.PI / 4});
        unitm.add(hero);

        // animation 事件
        animation.setAction(($ctx, $this)=>{
            animation.drawFrame();
            unitm.render($ctx, timer.tick);
            world.render($this);
            // ground.render($ctx);
        });
        dis.addAnimation(animation);
        
        // survival game logic
        let genZone = new Zone({
            position: new Vector2d(0, 0),
            width: animation.width,
            height: animation.height
        });
        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                timer.interval(()=>{
                    hero.renderObject.size -= 1;
                    hero.controller.maxSpeed = Math.max(hero.controller.maxSpeed - 5, 50);
                    if(hero.renderObject.size < 15){
                        alert('你饿死了');
                    }
                }, 80);
                timer.interval(()=>{
                    unitm.add(
                        fac2.createEdibleCrawAIUnit(
                            new Cube({color: '#0F0'}), 
                            genZone.getRandomPosition(),
                            ()=>{
                                hero.renderObject.size += 5;
                                hero.controller.maxSpeed = Math.min(hero.controller.maxSpeed + 25, 150);
                            }, {}, {
                                speed : 40,
                                aimUnit: hero,
                                timer: timer,
                                escape: false
                            })
                    );
                }, 100);
                timer.interval(()=>{
                    unitm.add(
                        fac2.createHostileCrawAIUnit(
                            // new Cube({color: '#0F0'}), 
                            genZone.getRandomPosition(), 
                            {color: '#F00'},
                            ()=>{
                                hero.renderObject.size -= 1;
                                hero.controller.maxSpeed = Math.max(hero.controller.maxSpeed - 1, 50);
                                if(hero.renderObject.size < 15){
                                    alert('你饿死了');
                                }
                            }, {}, {
                                speed : 40,
                                aimUnit: hero,
                                timer: timer,
                                escape: false
                            })
                    );
                }, 500);
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
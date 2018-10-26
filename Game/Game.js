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

        let aif = new AIUnitFactory({
            game: this,
            world: world,
            timer: timer
        });

        let fac2 = new ShootPointFactory({
            game: this,
            world: world,
            timer: timer
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
        animation.setMouseDown((e)=>{
            world.addBody(
                new Point({
                    position: e.offset,
                    force: new Vector2d(0, 100)
                })
            );
        });
        dis.addAnimation(animation);
        

        let enableShoot = true, shootSize = 8;
        function shootSkill($hero){
            if(enableShoot){
                world.addBody(fac2.createFireBallPoint(
                    $hero.position.clone(),
                    new Vector2d($hero.controller.handler.linearVelocity.x * 2, 
                                    $hero.controller.handler.linearVelocity.y * 2),
                    $hero,
                    {
                        size : shootSize
                    }
                ));
                enableShoot = false;
                timer.callLater(()=>{
                    enableShoot = true;
                }, 10);
            }
        }
        iotrigger.setKeyPressEvent((e)=>{
            // let segs = gen.generateSegs();
            // gen.adjustSegsToValley(segs, 200);
            // let ground = gen.generateMap(segs).ground;
            // world.ground = ground;
        }, 32);
        
        let shoottime = 50;
        iotrigger.setKeyDownEvent(()=>{
            if(shoottime > 0){
                shootSkill(hero);
                shoottime--;
            }
        }, 83);

        iotrigger.setKeyUpEvent(()=>{}, 83);

        // game logic
        let genZone = new Zone({
            position: new Vector2d(0, 0),
            width: animation.width,
            height: 100
        });
        
        let num = 0;
        let eeee = true;
        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                timer.interval(()=>{
                    if(num < 3){
                        num++;
                        let zq = aif.createHostileCrawlAIUnit(genZone.getRandomPosition(), {
                            aimUnit : hero
                        }, ()=>{
                            if(eeee){
                                hero.renderObject.size -= 5;
                                if(hero.renderObject.size < 30){
                                    hero.kill();
                                    alert('you lose');
                                }
                                eeee = false;
                                timer.callLater(()=>{
                                    eeee = true;
                                }, 100);
                            }
                        }, 50, 50);
                        zq.setOnKill(()=>{
                            num--;
                        });
                        unitm.add(zq);
                    }
                }, 100)
                timer.interval(()=>{
                    let box = aif.createEdibleCrawlAIUnit(
                        new Cube({
                            color : '#0F0'
                        }),
                        genZone.getRandomPosition(), {
                        aimUnit:hero
                    }, ()=>{
                        shoottime+=5;
                    });
                    unitm.add(box);
                }, 500);
                // timer.interval(()=>{
                //     let segs = gen.generateSegs();
                //     gen.adjustSegsToValley(segs, 200);
                //     let ground = gen.generateMap(segs).ground;
                //     world.ground = ground;
                // }, 1000)
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
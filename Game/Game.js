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

        let unitm = new UnitManager();

        let hero = fac.createTreeHeroUnit(new Vector2d(40, 100), {
            angle: Math.PI / 4,
        }, 60);
        unitm.add(hero);

        let hero2 = fac.createTreeHeroUnit(new Vector2d(40, 100), {
            angle: Math.PI / 4,
        }, 60, 150, 150, [37, 39, 38]);
        unitm.add(hero2);

        // animation 事件
        animation.setAction(($ctx, $this)=>{
            animation.drawFrame();
            unitm.render($ctx, timer.tick);
            world.render($this);
            // ground.render($ctx);
        });
        // 用户io事件
        animation.setMouseDown((e)=>{
            let p = new Point({
                position: e.offset,
                force: new Vector2d(0, 100)
            })
            timer.callLater(()=>{
                p.kill();
            }, 5);
            world.addBody(p);
        });
        dis.addAnimation(animation);

        let weapen = new FireBallWeapon({
            game: this,
            user : hero,
            world: world,
            timer: timer,
            hurt : 10,
            onDestory : ()=>{
                earthquake(animation);
            }
        })

        let weapen2 = new HemophagiaWeapon({
            game: this,
            user : hero2,
            world: world,
            timer: timer,
            hurt : 10,
            ammo : 90,
            power : 60,
            fireRate: 5,
            onDestory : ()=>{
                // earthquake(animation);
            }
        })


        iotrigger.setKeyPressEvent((e)=>{
            weapen.power = 8;
        }, 32);
        
        iotrigger.setKeyDownEvent(()=>{
            weapen.shoot();
        }, 83);
        iotrigger.setKeyUpEvent(()=>{}, 83);

        iotrigger.setKeyDownEvent((e)=>{
            weapen2.shoot();
        }, 40);
        iotrigger.setKeyUpEvent((e)=>{}, 40);

        function earthquake($animation){
            $animation.position.y += 10;
            timer.callLater(()=>{
                $animation.position.y -= 10;
                timer.callLater(()=>{
                    $animation.position.y += 10;
                    timer.callLater(()=>{
                        $animation.position.y -= 10;
                    }, 4);
                }, 4);
            }, 4);
        }


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
                        let zq = aif.createHostileCrawlAIUnit(genZone.getRandomPosition(),
                            hero, 40, ()=>{}, "#F00");
                        zq.setOnKill(()=>{
                            num--;
                        });
                        let u = new HemophagiaWeapon({
                            game: this,
                            user : zq,
                            world: world,
                            timer: timer,
                            hurt : 10,
                            ammo : 90,
                            power : 60,
                            fireRate: 5,
                            color : "#F00",
                            onDestory : ()=>{
                                // earthquake(animation);
                            }
                        });
                        u.shoot();
                        unitm.add(zq);
                    }
                }, 100)
                timer.interval(()=>{
                    let box = aif.createEdibleCrawlAIUnit(
                        new Cube(),
                        genZone.getRandomPosition(),
                        hero,
                        ()=>{
                            weapen.ammo+=5;
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
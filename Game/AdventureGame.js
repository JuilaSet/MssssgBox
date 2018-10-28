"strict mode";
class AdventureGame{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
        this.pause = false;
    }

    // 开始游戏
    run(){
        // init
        let dis = this.display;
        dis.setFullScreen(false);

        let timer = this.timer;

        let stats = new Stats();
        dis.container.appendChild( stats.dom );

        let game = this;

        let iotrigger = this.iotrigger;

        // 局部函数
        function earthquake($animation){
            $animation.position.y += 10;
            timer.callLater(()=>{
                $animation.position.y -= 10;
                timer.callLater(()=>{
                    $animation.position.y += 10;
                    timer.callLater(()=>{
                        $animation.position.y -= 10;
                    }, 1);
                }, 4);
            }, 2);
        }

        // 游戏显示框
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

        // 生成世界
        let zqBuidingPosition = new Vector2d(0, 0);
        function genWorld($stage=0){
            let segs = gen.generateSegs();
            gen.adjustSegsToValley(segs, 200);
            // 找到最小的y
            let py = segs[0].origionPosition.y, px = segs[0].origionPosition.x;
            segs.forEach(e=>{
                if(e.origionPosition.y < py ){
                    py = e.origionPosition.y;
                    px = e.origionPosition.x;
                }
            });
            zqBuidingPosition.set(px, py);
            gen.adjustSegsToSpine(segs, $stage, -100);
            gen.adjustSegsToGivenFunc(segs, x=>Math.pow(x-100, 2) / (180 - $stage*10));
            let ground = gen.generateMap(segs).ground;
            world.ground = ground;
        }
        
        let world = new World({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            })
        });
        genWorld(0);

        // 单位建造工厂
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
        
        // Player Unit
        let hero = fac.createTreeHeroUnit(new Vector2d(40, 100), {
            angle: Math.PI / 4,
        }, 60);
        hero.setOnKill(()=>{
            alert('你输了');
            this.stop();
        });
        hero.team = 1;
        unitm.add(hero);

        // weapon
        let weapen = new FireBallWeapon({
            team : 1,
            game: this,
            user : hero,
            world: world,
            timer: timer,
            ammo : 25,
            power: 5,
            hurt : 70,
            fireRate: 8,
            onDestory : ()=>{
                earthquake(animation);
            }
        })

        // animation 事件
        animation.setAction(($ctx, $this)=>{
            animation.drawFrame();
            unitm.render($ctx, timer.tick);
            world.render($this);
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
        
        iotrigger.setKeyDownEvent(()=>{
            weapen.shoot();
        }, 83);
        iotrigger.setKeyUpEvent(()=>{}, 83);

        // game logic
        let genZone = new Zone({
            position: new Vector2d(0, 0),
            width: animation.width,
            height: 100
        });

        // 产生建筑 building
        let buildingFactory = new BuildingFactory({
            game: this,
            world: world
        });

        let genZqbuilding;
        function zqBuiding(){
            genZqbuilding = buildingFactory.createBasicBuilding(
                "000010000,"+
                "001101100,"+
                "011000110,"+
                "011000110,"+
                "110000011",
                5,
                20, 15, zqBuidingPosition.sub(new Vector2d(0, 50)), 60
            );
            genZqbuilding.team = 0;
            unitm.add(genZqbuilding);
        }
        zqBuiding();

        // 产生zq
        let zqs = [];
        function createZq(){
            if(num < maxZqMun && genZqbuilding.living){
                num++;
                let zq = aif.createHostileCrawlAIUnit(
                    genZqbuilding.randomPosition(),
                    hero, 20, ()=>{}, "#F00");
                zq.team = 0;
                zqs.push(zq);
                giveWeaponToZq(zq);
                unitm.add(zq);
            }
        }

        // 关卡数
        let stage = 0, firball = true;

        // 给予zq武器
        let num = 0, maxZqMun = 3, fr = 10;
        function giveWeaponToZq(zq){
            let u = new HemophagiaWeapon({
                game: game,
                user : zq,
                team : 0,
                world: world,
                timer: timer,
                hurt : 10,
                ammo : 90,
                power : 60,
                fireRate: 5,
                color : "#F00"
            });
            zq.setOnKill(()=>{
                num--;
                u.kill();
                if(firball && Math.random() * 100 < stage * 2){ // stage% 概率生成新武器 
                    firball = false;
                    let box = aif.createEdibleCrawlAIUnit(
                        new Tree({
                            intersectionAngle : Math.PI / 4,
                            color : "#EFC",
                            treeHeight: 0,
                            minLength : 10
                        }),
                        zq.position.clone(),
                        hero,
                        ()=>{
                            // 调用新武器
                            weapen = new FireBallWeapon({
                                team : 1,
                                game: game,
                                user : hero,
                                world: world,
                                timer: timer,
                                ammo : 25,
                                power: 5,
                                hurt : 70,
                                fireRate: fr,
                                onDestory : ()=>{
                                    earthquake(animation);
                                }
                            });
                            fr = Math.max(fr - 1, 3);
                        }
                    );
                    timer.callLater(()=>{
                        box.kill();
                    }, 300);
                    ammoUs.push(box);
                    unitm.add(box);
                }
            });
            u.shoot();
        }

        // 产生弹药包
        let ammoUs = [];
        genZqbuilding.setOnKill(()=>{
            if(Math.random() * 100 < 50){ // 50% 概率生成
                let box = aif.createEdibleCrawlAIUnit(
                    new Tree({
                        intersectionAngle : Math.PI / 6,
                        color : "#55F",
                        treeHeight: 0
                    }),
                    genZqbuilding.randomPosition(),
                    hero,
                    ()=>{
                        // 增加武器属性
                        weapen.color="#4CF";
                        weapen.hurt = Math.min(weapen.hurt + 8, 70);
                        weapen.power = Math.min(weapen.power + 3, 10);
                        weapen.fireRate = Math.max(weapen.fireRate - 2, 3);
                    }
                );
                ammoUs.push(box);
                unitm.add(box);
            }
        });
        function createAmmo(){
            if(genZqbuilding.living){
                let box;
                if(Math.random() * 100 < 75){ // 75 % 概率生成弹夹
                    box = aif.createEdibleCrawlAIUnit(
                        new Cube(),
                        genZone.getRandomPosition(),
                        hero,
                        ()=>{
                            weapen.ammo += 25;
                        });
                    ammoUs.push(box);
                    unitm.add(box);
                }
            }
        }

        // 进入下一关
        function nextStage(){
            hero.controller.position.x = 0;
            genWorld(stage);
            zqs.forEach(zq => {
                zq.kill();
            });
            num = 0;
            ammoUs.forEach(au => {
                au.kill();
            });
            zqBuiding();
            stage++;
        }
        hero.controller.handler.setOnStrictHit(($strict, $which)=>{
            if($which == Zone.LEFT){
                hero.controller.handler.strictBounce($strict, $which);
            }else if($which = Zone.RIGHT){
                if(!genZqbuilding.living)nextStage();
                else hero.controller.handler.strictBounce($strict, $which);
            }
        });
        
        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                timer.interval(()=>{
                    createZq();
                }, 100)
                timer.interval(()=>{
                    createAmmo();
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
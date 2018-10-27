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
        
        let num = 0, maxZqMun = 8;
        function giveWeaponToZq(zq, world, game){
            // 给予武器
            let u = new HemophagiaWeapon({
                game: game,
                user : zq,
                team : 0,
                world: world,
                timer: game.timer,
                hurt : 10,
                ammo : 90,
                power : 60,
                fireRate: 5,
                color : "#F00"
            });
            zq.setOnKill(()=>{
                num--;
                u.kill();
            });
            u.shoot();
        }

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
        let weapen = new ArrowWeapon({
            team : 1,
            game: this,
            user : hero,
            world: world,
            timer: timer,
            power: 20,
            hurt : 70,
            fireRate: 5,
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

        // building
        let buildingFactory = new BuildingFactory({
            game: this,
            world: world
        });
        let building = buildingFactory.createBasicBuilding(
            "00010000001000,"+
            "00111000011100,"+
            "01111100111110,"+
            "11111111111111,"+
            "11111111111111,"+
            "11111111111111,"+
            "11111111111111",
            5,
            20, 15, new Vector2d(400, 200), 40
        );
        building.team = 0;
        building.setOnKill(()=>{
            console.log('TAG', "kill");
        });
        unitm.add(building);
        
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
        
        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                timer.interval(()=>{
                    if(num < maxZqMun && building.living){
                        num++;
                        // 产生赵强
                        let zq = aif.createHostileCrawlAIUnit(
                            building.randomPosition(),
                            hero, 20, ()=>{}, "#F00");
                        zq.team = 0;
                        giveWeaponToZq(zq, world, this);
                        unitm.add(zq);
                    }
                }, 100)
                timer.interval(()=>{
                    let box = aif.createEdibleCrawlAIUnit(
                        new Cube(),
                        genZone.getRandomPosition(),
                        hero,
                        ()=>{
                            weapen.ammo += 5;
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
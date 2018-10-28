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
            alert('红色获胜'); //[]][
            this.stop();
        });
        hero.team = 1;
        unitm.add(hero);

        // Player2 Unit
        let hero2 = fac.createTreeHeroUnit(new Vector2d(800, 100),{
            color: '#F00',
            angle : Math.PI / 4
        }, 60, 150, 120, [37, 39, 38]);
        hero2.setOnKill(()=>{
            alert('白色获胜'); //[]][
        });
        hero2.team = 0;
        unitm.add(hero2);

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
        });
        let weapen2 = new FireBallWeapon({
            team : 0,
            game: this,
            user : hero2,
            world: world,
            timer: timer,
            ammo : 25,
            power: 5,
            hurt : 70,
            fireRate: 8,
            colors:["#F00", "#F00", "#E20"],
            onDestory : ()=>{
                earthquake(animation);
            }
        });

        // animation 事件
        dis.addAnimation(animation);
        
        animation.setAction(($ctx, $this)=>{
            animation.drawFrame();
            unitm.render($ctx, timer.tick);
            world.render($this);
        });

        // 用户io事件

        iotrigger.setKeyDownEvent(()=>{
            weapen.shoot();
        }, 83);
        iotrigger.setKeyUpEvent(()=>{}, 83);
        
        iotrigger.setKeyDownEvent(()=>{
            weapen2.shoot();
        }, 40);
        iotrigger.setKeyUpEvent(()=>{}, 40);
        
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
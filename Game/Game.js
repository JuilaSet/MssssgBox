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

        let dis = this.display;
        dis.setFullScreen(false);

        let timer = this.timer;

        let stats = new Stats();
        dis.container.appendChild( stats.dom );

        let iotrigger = this.iotrigger;

        let p = new Vector2d(0, 0);
        let animation = new Animation({
            layer:1,
            id:1,
            iotrigger: iotrigger,
            position:p,
            timer: timer,
            width: dis.canvas.width,
            height: dis.canvas.height
        });

        // 物理模块
        let segnum = 200;
        let gen = new GroundMapGenerator({
            width: animation.width,
            height: animation.height,
            segnum: segnum,
            beginHeight : 400
        });
        let segs = gen.generateSegs();
        // gen.adjustToWaveSegs(segs, 10, 4);
        gen.adjustToValleySegs(segs, 200);
        let ground = gen.generateMap(segs).ground;

        // 控制器模块
        let moveController = new CrawlController({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            })
        });
        let world = new World({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            }),
            ground: ground
        });
        let sssss = new StaticSquareGroup({
            sqrts: [
                new StaticSquare({
                    position: new Vector2d(100, 100)
                }),
                new StaticSquare({
                    position: new Vector2d(200, 200)
                })
            ]
        });
        moveController.statics = world.statics;
        let handler = new Point({
            position: new Vector2d(200, 200)
        });
        handler.setPositionToGround(ground);
        moveController.ground = ground;
        world.addBody(sssss);


        let sqr = new StaticSquare({
            position: new Vector2d(0, 0),
            width: 20,
            height: 20
        });
        world.addBody(sqr);

        let a1 = Math.random() * 10 + 2, f1 = Math.random() * 20 - 10, h1 = Math.random() * 15 + 45;
        let rn1 = Math.floor(Math.random() * (segnum - 1) + 1);
        let tpositon = ground.segments[rn1].origionPosition.clone().sub(new Vector2d(0, h1));

        // let unit = new Unit();
        // moveController.offset.set(-unit.displayZone.width / 2, -unit.displayZone.height / 2);
        let tree = new Tree({
            force : f1,
            size : h1,
            minLength : 1,
            intersectionAngle : Math.PI / Math.abs(a1),
            treeHeight: 0
        });
        moveController.bindObj = tree;
        moveController.offset.set(-tree.width / 2, -tree.height / 2);
        tree.position = tpositon.sub(new Vector2d(tree.width/2, tree.height/2 - h1));
        moveController.position = tree.position.clone();
        tree.addRenderFrame(($ctx, $tick)=>{
            tree.drawTree($tick);
            // tree.drawFrame();
        });
        animation.setAction(($context, $this)=>{
            moveController.render($context, $this);
            animation.drawFrame();
            tree.force = moveController.velocityX / 5;
            tree.intersectionAngle = Math.PI / Math.abs(a1) - Math.min(
                moveController.velocityY / 1200,
                500 / 1200);
            tree.render($context, timer.tick);
            world.render($this);
            sssss.moveTo(handler.position.clone().sub(new Vector2d(50, 50)));
        });
        dis.addAnimation(animation);
        
        // X
        iotrigger.setKeyUpEvent(()=>{
           moveController.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
           moveController.accRight(13);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
           moveController.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accLeft(13);
         }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
        //    moveController.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController.accUp(8);
           moveController.jump(400);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
        //    moveController.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController.accDown(8);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            let px = new Point({
                position: moveController.bindObj.position.clone().add(new Vector2d(10, 10)),
                linearVelocity: new Vector2d(100, 0),
                force: new Vector2d(100, 0),
                enableStaticBounce: false
            })
            px.setOnGroundHit(()=>{
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                px.kill();
            });
            world.addBody(px);
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{
            this.switch();
        }, 32);

        ///
        dis.render(()=>{
            if(!this.pause){
                world.update();
                moveController.update();
                stats.update();
                timer.update();
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
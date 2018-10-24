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
            width: animation.width + 1,
            height: animation.height,
            segnum: segnum,
            beginHeight : 400
        });
        let segs = gen.generateSegs();
        gen.adjustSegsToValley(segs, 200);
        let ground = gen.generateMap(segs).ground;

        // 控制器模块
        let moveController = new CrawlController({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            }),
            maxSpeed: 100,
            jumpTimes: 3
        }),moveController2 = new CrawlController({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            }),
            maxSpeed: 120
        });
        
        let world = new World({
            strict : new Zone({
                position: new Vector2d(0, -1000),
                width: animation.width,
                height: 2000
            }),
            ground: ground
        });
        moveController.ground = ground;
        moveController2.ground = ground;
        let lll = 0;
        let enc = false;
        function newWorld(){
            let gen = new GroundMapGenerator({
                width: animation.width,
                height: animation.height,
                segnum: segnum,
                beginHeight : 400
            });
            let segs = gen.generateSegs();
            gen.adjustSegsToGivenFunc(segs, x => -Math.pow((x - 100) / 3, 2));
            gen.adjustSegsToValley(segs, 200);
            gen.adjustSegsToSpine(segs, lll+=5, -400);
            gen.adjustSegsToCutRange(segs, 100, 200)
            gen.adjustSegsToValley(segs, 200);
            gen.adjustSegsToCutRange(segs, 300, 200)
            let ground = gen.generateMap(segs).ground;
            world.ground = ground;
            moveController.ground = ground;
            moveController2.ground = ground;
            enc = false;
        }
        moveController2.handler.setOnStrictHit(($strict, $which)=>{
            if($which == Zone.LEFT){
                moveController2.handler.strictBounce($strict, $which);
            }else if($which == Zone.RIGHT){
                moveController2.handler.position.x -= animation.width - 2;
                newWorld();
                enc = true;
            }
        });

        let a1 = 2, f1 = Math.random() * 20 - 10, h1 = Math.random() * 15 + 45;
        let rn1 = Math.floor(Math.random() * (segnum - 1) + 1);
        let tpositon = ground.segments[rn1].origionPosition.clone().sub(new Vector2d(0, h1));

        let tree = new Tree({
            force : f1,
            size : h1,
            minLength : 9,
            intersectionAngle : Math.PI / a1,
            treeHeight: 0
        }),
        tree2 = new Tree({
            intersectionAngle : Math.PI / 10,
            treeHeight : 9
        });
        tree.j = 210;
        tree2.j = 300;
        moveController.bindObj = tree;
        moveController.offset.set(-tree.width / 2, -tree.height / 2);
        tree.position = new Vector2d(1000, tpositon.y + tree.height/2 - h1);
        moveController.position = tree.position.clone();
        tree.addRenderFrame(($ctx, $tick)=>{
            tree.color = "#F00";
            tree.drawTree3($tick);
        });

        moveController2.bindObj = tree2;
        moveController2.offset.set(-tree2.width / 2, -tree2.height / 2);
        tree2.position = new Vector2d(100, tpositon.y + tree2.height/2 - h1);
        moveController2.position = tree2.position.clone();
        

        tree2.addRenderFrame(($ctx, $tick)=>{
            tree2.drawTree($tick);
        });

        animation.setAction(($context, $this)=>{
            moveController.render($context, $this);
            animation.drawFrame();
            tree.force = moveController.velocityX / 5;
            tree.intersectionAngle = Math.PI / a1 - Math.min(
                moveController.velocityY / 1200,
                500 / 1200);
            tree.render($context, timer.tick);

            moveController2.render($context, $this);
            tree2.force = moveController2.velocityX / 5;
            tree2.intersectionAngle = Math.PI / 10 - Math.min(
                moveController2.velocityY / 1200,
                500 / 1200);
            tree2.render($context, timer.tick);
            world.render($this);
        });
        dis.addAnimation(animation);
        

        let ai = new CrawlAI({
            crawlController : moveController,
            aim : moveController2.handler,
            timer: timer
        });
        let ddd = true;
        ai.setOnNear(()=>{
            // ai.defaultOnNear();
            if(ddd){
                ddd = false;
                tree2.size -= 2;
                tree2.j -= 3;
                
                moveController.maxSpeed += 5;
                tree.size += 2;
                tree.j += 5;
                timer.callLater(()=>{
                    ddd = true;
                }, 5);
            }
            if(tree2.size < tree2.minLength){
                this.stop();
                alert('zq把你变成了秃头，你也要戴假发了！')
            }
        });
        ai.setOnFar(()=>{});

        // X
        //   38
        //37 40 39
        iotrigger.setKeyUpEvent(()=>{
           moveController2.accRight(0);
        }, 68);
        iotrigger.setKeyUpEvent(()=>{
           moveController.accRight(0);
        }, 39);

        iotrigger.setKeyDownEvent(()=>{
           moveController2.accRight(13);
        }, 68);
        iotrigger.setKeyDownEvent(()=>{
           moveController.accRight(13);
        }, 39);

        iotrigger.setKeyUpEvent(()=>{
           moveController2.accLeft(0);
        }, 65);
        iotrigger.setKeyUpEvent(()=>{
            moveController.accLeft(0);
        }, 37);

        iotrigger.setKeyDownEvent(()=>{
            moveController2.accLeft(13);
        }, 65);
        iotrigger.setKeyDownEvent(()=>{
            moveController.accLeft(13);
        }, 37);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
        //    moveController2.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController2.accUp(8);
            moveController2.jump(tree2.j);
        }, 87);
        iotrigger.setKeyDownEvent(()=>{
        //    moveController2.accUp(8);
            moveController.jump(tree.j);
        }, 38);

        iotrigger.setKeyUpEvent(()=>{
        //    moveController2.accDown(0);
        }, 83);
        iotrigger.setKeyUpEvent(()=>{
        //    moveController2.accDown(0);
        }, 38);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController2.accDown(8);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            if(enc)newWorld();
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{
            // this.switch();
        }, 32);

        ///
        dis.render(()=>{
            if(!this.pause){
                stats.update();
                timer.update();
                ai.update();
                moveController.update();
                moveController2.update();
                world.update();
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
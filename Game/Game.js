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
        // 控制器模块
        let moveController = new CrawlController({
            // frictionX : 0.9,
            // frictionY : 0.9,
            // maxSpeedX : 8,
            // maxSpeedY : 8
        });

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
        let segnum = 20, segs = [], last = 400;
        for(let x = 0; x <= segnum; x++){
            last = (Math.random() * 50 - 25) + last;
            segs[x] = new GroundSegment({
                origionPosition:new Vector2d(
                    (animation.width / segnum) * x, last
                )
            });
        }

        let ground = new Ground({
            groundChain: segs
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
                    position: new Vector2d(100, 100),
                    linearVelocityConsume : 0.001
                }),
                new StaticSquare({
                    position: new Vector2d(200, 200),
                    linearVelocityConsume : 0.001
                })
            ]
        });
        let handler = new Point({
            position: new Vector2d(200, 200)
        });
        moveController.bindObj = handler;
        handler.setPositionToGround(ground);
        moveController.ground = ground;
        world.addBody(sssss);


        let sqr = new StaticSquare({
            position: new Vector2d(0, 0),
            width: 140,
            height: 25
        });
        world.addBody(sqr);

        let a1 = Math.random() * 10 + 3, f1 = Math.random() * 20 - 10, h1 = Math.random() * 15 + 20;
        let rn1 = Math.floor(Math.random() * (segnum - 1) + 1);
        let tpositon = ground.segments[rn1].origionPosition.clone().sub(new Vector2d(0, h1));
        animation.setAction(($context, $this)=>{
            animation.drawFrame();
            animation.drawTree(
                tpositon,
                f1, 
                h1, 5, 
                Math.PI / Math.abs(a1)
            );
            world.render($this);
        });
        dis.addAnimation(animation);
        
        let sqrs;
        let orgPosition, dp;
        animation.setMouseDown(event=>{
            dp = orgPosition = event.offset;
            sqrs = new StaticSquareGroup();
            world.addBody(sqrs);
        });

        animation.setMouseStretch(event=>{
            let sqrs2 = sqrs;   // 闭包陷阱
            if(event.downbutton == 2){
                let sq = new StaticSquare({
                    position: event.offset,
                    zone: new Zone({
                        position: event.offset,
                        width: Math.random() * 20 + 10,
                        height: Math.random() * 20 + 10
                    })
                });
                sqrs2.addStaticSquare(sq);
                sqrs2.setOnHit(($point, $which, $staticSqr)=>{
                    $staticSqr.kill();
                    if(sqrs2.size < 10){
                        sqrs2.kill();
                    }
                });
            }
        });

        animation.setMouseUp(event=>{
            if(event.button == 0){
                let ddp = dp.clone();
                let point = new Point({
                    linearVelocity : orgPosition.sub(event.offset).multiply(4),
                    livingZone: world.strict,
                    position : ddp,
                    force : new Vector2d(0, 100),
                    border : 10,//Math.random() * 10 + 8,
                    enableStrictBounce: false,
                    linearVelocityConsume: 1
                });
                point.setOnUpdate(()=>{
                    let p = new Point({
                        linearVelocity : new Vector2d(Math.random() * 45 - 45/2, Math.random() * 45 - 45/2),
                        position : point.position.clone(),
                        enableStrictBounce : false,
                        enableGroundBounce : false,
                        enableStaticBounce : false,
                        border : point.border
                    });
                    p.setOnUpdate(()=>{
                        p.border -= 0.4;
                        if(p.border < 0.4){
                            p.kill();
                        }
                    });
                    world.addBody(p);
                });
        
                point.setOnGroundHit(($groundSeg)=>{
                    point.downBounce($groundSeg);
                    point.setPositionToGroundSegment($groundSeg.origionPosition, $groundSeg.angle);
                    $groundSeg.ground.addSegments(
                        new GroundSegment({
                            origionPosition:point.position.add(new Vector2d(0, 3)).clone()
                        })
                    );
                    point.border -= 3;
                    if(point.border < 3){
                        point.kill();
                    }
                });
                point.setOnStaticHit(($which, $static)=>{
                    if(!$static)alert();
                    point.staticBounce($which, $static);
                    point.setPointToStaticSquare($static);
                    if(sqr != $static){
                        point.border -= 3;
                        if(point.border < 3){
                            point.kill();
                        }
                    }
                    if($static.group){
                        $static.group.calcCenter();
                        if($static.group.size == 0){
                            $static.group.kill();
                        }
                    }
                    for(let f=0; f < 1/*point.border / 2*/; f++){
                        let p0 = new Point({
                            linearVelocity : new Vector2d(Math.random() * 245 - 245/2, Math.random() * 245 - 245/2),
                            force: new Vector2d(0, 300),
                            position : point.position.clone(),
                            enableStrictBounce : false,
                            border : 3
                        });
                        p0.setOnGroundHit(($ground)=>{
                            p0.downBounce($ground);
                            timer.callLater(()=>{
                                p0.kill();
                            },10);
                        });
                        p0.setOnStaticHit(($which, $static)=>{
                            p0.staticBounce($which, $static);
                            if(sqr != $static)$static.kill();
                            if($static.group){
                                $static.group.calcCenter();
                                if($static.group.size == 0){
                                    $static.group.kill();
                                }
                            }
                            timer.callLater(()=>{
                                p0.kill();
                            },10);
                        });
                        world.addBody(p0);
                    }
                });
                world.addBody(point);
            }
        });
        
        // X
        iotrigger.setKeyUpEvent(()=>{
           moveController.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
           moveController.accRight(9);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
           moveController.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accLeft(9);
         }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
        //    moveController.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController.accUp(8);
           moveController.jump();
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
        //    moveController.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
        //    moveController.accDown(8);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            let px = new Point({
                position: moveController.bindObj.position.clone(),
                linearVelocity: new Vector2d(100, 0),
                force: new Vector2d(100, 0),
                enableStaticBounce: false
            })
            px.setOnStrictHit(()=>{
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    border: 5,
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    border: 5,
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                world.addBody(new Point({
                    position: px.position,
                    linearVelocity: new Vector2d(Math.random() * 100, Math.random() * 100),
                    border: 5,
                    enableStrictBounce :false,
                    livingZone: world.livingZone
                }));
                px.kill();
            });
            world.addBody(px);
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{

        }, 32);

        ///
        dis.render(()=>{
            if(!this.pause){
                world.update();
                moveController.update();
                stats.update();
                timer.update();
                sssss.moveTo(handler.position.clone().sub(new Vector2d(50, 50)));
            }
        }, ()=>{

        });
    }

    // 暂停
    stop(){
        this.pause = !this.pause;
    }
}
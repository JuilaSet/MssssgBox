"strict mode";
class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){

        // 控制器模块
        let moveController = new MoveController({
            frictionX : 0.9,
            frictionY : 0.9,
            maxSpeedX : 8,
            maxSpeedY : 8
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
        let segnum = 100, segs = [], last = 400;
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
                position: new Vector2d(0, 0),
                width: animation.width,
                height: animation.height
            }),
            ground: ground
        });
        
        let sqr = new StaticSquare({
            position: new Vector2d(0, 0),
            width: 140,
            height: 25
        });
        world.addBody(sqr);
        moveController.bindObj = sqr;

        let a1 = Math.random() * 10 + 3, f1 = Math.random() * 20 - 10, h1 = Math.random() * 15 + 20;
        let rn1 = Math.floor(Math.random() * (segnum - 1)+ 1);
        animation.setAction(($context, $this)=>{
            animation.drawFrame();
            animation.drawTree(
                ground.segments[rn1].origionPosition.clone().sub(new Vector2d(0, h1)), 
                moveController.speedX - f1, 
                h1, 5, 
                Math.PI / Math.abs(moveController.speedY - a1)
            );
            world.render($this);
        });
        dis.addAnimation(animation);
        
        let sqrs;
        animation.setMouseDown((event=>{
            sqrs = new StaticSquareGroup();
            world.addBody(sqrs);
        }));

        animation.setMouseStretch((event)=>{
            if(event.downbutton == 0){
                sqrs.addStaticSquare(
                    new StaticSquare({
                        position: event.offset,
                        zone: new Zone({
                            position: event.offset,
                            width: Math.random() * 20 + 10,
                            height: Math.random() * 20 + 10
                        })
                    })
                );
            }
        });

        animation.setMouseUp(event=>{
        })

        animation.setDblClick((event, down)=>{
            let point = new Point({
                linearVelocity : new Vector2d(Math.random() * 120 - 120/2, Math.random() * 120 - 120/2),
                position : event.offset,
                force : new Vector2d(0, 100),
                border : Math.random() * 10 + 8
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
    
            point.setOnGroundHit(($ground)=>{
                point.downBounce($ground.argue);
                point.setPositionToGroundSegment($ground.origionPosition, $ground.argue);
                point.border -= 3;
                if(point.border < 3){
                    point.kill();
                }
            });
            point.setOnStaticHit(($which, $static)=>{
                console.log($which);
                point.staticBounce($which);
                point.border -= 3;
                if(point.border < 3){
                   point.kill();
                }
                if(sqr != $static)$static.kill();
                if($static.group){
                    $static.group.calcCenter();
                    if($static.group.size == 0){
                        $static.group.kill();
                    }
                }
                for(let f=0; f < point.border / 2; f++){
                    let p0 = new Point({
                        linearVelocity : new Vector2d(Math.random() * 245 - 245/2, Math.random() * 245 - 245/2),
                        force: new Vector2d(0, 300),
                        position : point.position.clone(),
                        enableStrictBounce : false,
                        border : 3
                    });
                    p0.setOnGroundHit(($ground)=>{
                        p0.downBounce($ground.argue);
                        setTimeout(()=>{
                            p0.kill();
                        }, 1000);
                    });
                    p0.setOnStaticHit(($which, $static)=>{
                        p0.staticBounce($which);
                        if(sqr != $static)$static.kill();
                        if($static.group){
                            $static.group.calcCenter();
                            if($static.group.size == 0){
                                $static.group.kill();
                            }
                        }
                        setTimeout(()=>{
                            p0.kill();
                        }, 500);
                    });
                    world.addBody(p0);
                }
            });
            world.addBody(point);
        });
        
        // X
        iotrigger.setKeyUpEvent(()=>{
           moveController.accRight(0);
        }, 68);

        iotrigger.setKeyDownEvent(()=>{
           moveController.accRight(8);
        }, 68);

        iotrigger.setKeyUpEvent(()=>{
           moveController.accLeft(0);
        }, 65);

        iotrigger.setKeyDownEvent(()=>{
            moveController.accLeft(8);
         }, 65);
        
        // Y
        iotrigger.setKeyUpEvent(()=>{
           moveController.accUp(0);
        }, 87);

        iotrigger.setKeyDownEvent(()=>{
           moveController.accUp(8);
        }, 87);

        iotrigger.setKeyUpEvent(()=>{
           moveController.accDown(0);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
           moveController.accDown(8);
        }, 83);

        iotrigger.setKeyDownEvent(()=>{
            console.log(world.statics);
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{

        }, 32);

        ///
        dis.render(()=>{
            world.update();
            moveController.update();
            stats.update();
            timer.update();
        }, ()=>{

        });
    }

    // 暂停
    stop(){

    }
}
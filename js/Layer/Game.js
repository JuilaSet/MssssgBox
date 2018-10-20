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
            width:1350,
            height:600
        });

        // 物理模块
        let segnum = 10, segs = [], last = 400;
        for(let x = 0; x <= segnum; x++){
            last = (Math.random() * 100 - 50) + last;
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
        let sqrs = new StaticSquares({
            sqrts: [
                new StaticSquare({
                    position: new Vector2d(150, 150),
                    zone: new Zone({
                        position: new Vector2d(150, 150),
                        width: 45,
                        height: 10
                    })
                }),
                new StaticSquare({
                    position: new Vector2d(150, 140),
                    zone: new Zone({
                        position: new Vector2d(150, 140),
                        width: 45,
                        height: 10
                    })
                }),
                new StaticSquare({
                    position: new Vector2d(150, 130),
                    zone: new Zone({
                        position: new Vector2d(150, 130),
                        width: 45,
                        height: 10
                    })
                })
            ]
        });
        world.addBody(sqrs);

        
        // moveController.bindObj = point;

        // moveController.bindObj = animation;
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

        animation.setMouseUp((event)=>{
            if(event.button == 2){
                sqrs.addStaticSquare(
                    new StaticSquare({
                        position: event.offset,
                        zone: new Zone({
                            position: event.offset,
                            width: 45,
                            height: 10
                        })
                    })
                );
            }
        });

        animation.setDblClick((event, down)=>{
            let point = new Point({
                linearVelocity : new Vector2d(Math.random() * 120 - 120/2, Math.random() * 120 - 120/2),
                position : event.offset,
                force : new Vector2d(0, 100),
                border : Math.random() * 10 + 3
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
                    point.setPositionToGroundSegment(ground.getGroundUndered(point.position));
                    point.kill();
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
            console.log(world.bodies);
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
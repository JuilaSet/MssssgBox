"strict mode";
class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){
        // AI模块
        var sol = 378;
        let stateSpace = new StateSpace();
        stateSpace.setGenRule(($father)=>{
            if($father.state < sol)
                return [new TNode({
                    state :$father.state * 2,
                    handleMsg : "*2"
                }), new TNode({
                    state :$father.state * 3,
                    handleMsg : "*3"
                }), new TNode({
                    state :$father.state * 7,
                    handleMsg : "*7"
                })];
            else return [];
        });

        stateSpace.setJudge((node)=>{
            return (node.state == sol)? true:false;
        });
        stateSpace.setHeuristicFunc((node)=>{
            return (sol / node.state);
        });

        let first = new TNode({state:1});
        let res = stateSpace.localOptimizationSearch(first);

        for(var x of res){
            console.log("t:", x.state, x.handleMsg, "index", x.index, "father", x.father);
        }
        console.log("TOTAL STEP", stateSpace.step);

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

        //let stats = new Stats();
        //dis.container.appendChild( stats.dom );

        let iotrigger = this.iotrigger;

        let p = new Vector2d(0, 0);
        let animation = new Animation({
            layer:1,
            id:1,
            iotrigger: iotrigger,
            position:p,
            timer: timer,
            width:400,
            height:400
            // ,zone: new Zone({
            //     position: new Vector2d(0, 0),
            //     width: this.display.canvas.width,
            //     height: this.display.canvas.height
            // })
        });

        // 物理模块
        
        let ground = new Ground({
            groundChain: [
                new GroundSegment({
                    origionPosition:new Vector2d(0, 300 - Math.random()*100)
                }),
                new GroundSegment({
                    origionPosition:new Vector2d(100, 300 - Math.random()*100)
                }),
                new GroundSegment({
                    origionPosition:new Vector2d(200, 300 - Math.random()*100)
                }),
                new GroundSegment({
                    origionPosition:new Vector2d(300, 300 - Math.random()*100)
                }),
                new GroundSegment({
                    origionPosition:new Vector2d(400, 300 - Math.random()*100) 
                })
            ]
        });
        let world = new World({
            strict : new Zone({
                position: new Vector2d(0, 0),
                width: animation.width,
                height: animation.height
            })
            ,ground: ground
        });

        moveController.bindObj = animation;
        let a1 = Math.random() * 10 + 3, f1 = Math.random() * 20 - 10, h1 = Math.random() * 15 + 20;
        let a2 = Math.random() * 10 + 3, f2 = Math.random() * 20 - 10, h2 = Math.random() * 15 + 20;
        animation.setAction(($context, $this)=>{
            animation.drawFrame();
            animation.drawTree(
                ground.segments[2].origionPosition.clone().sub(new Vector2d(0, h1)), 
                moveController.speedX + f1, 
                h1, 5, 
                Math.PI / Math.abs(moveController.speedY + a1)
            );
            animation.drawTree(
                ground.segments[3].origionPosition.clone().sub(new Vector2d(0, h2)), 
                moveController.speedX + f2, 
                h2, 5, 
                Math.PI / Math.abs(moveController.speedY + a2)
            );
            world.render($this);
        });
        dis.addAnimation(animation);

        animation.setMouseDown((event)=>{
            world.addBody(new Point({
                position : event.offset,
                linearVelocity : new Vector2d(0, 200),
                    // Math.random() * 200 - 100, Math.random() * 200 - 100),
                force : new Vector2d(0, 100),
                border : 10
            }));
        });

        animation.setDblClick((event)=>{

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
            
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{

        }, 32);

        ///
        dis.render(()=>{
            world.update();
            moveController.update();
        //    stats.update();
            timer.update();
        }, ()=>{

        });
    }

    // 暂停
    stop(){

    }
}
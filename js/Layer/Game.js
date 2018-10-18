class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){
        // AI模块
        var sol = 12;
        let stateSpace = new StateSpace();
        stateSpace.setGenRule(($father)=>{
            let node1 = new TNode($father.state + 5);
            node1.msg = "+5";
            let node2 = new TNode($father.state + 7);
            node2.msg = "+7";
            let node3 = new TNode($father.state + 6);
            node3.msg = "+6";
            if($father.h > 0)
                return [node1, node2, node3];
            else return [];
        });
        stateSpace.setJudge((node)=>{
            return (node.state == sol)? true:false;
        });
        stateSpace.setHeuristicFunc((node)=>{
            return (sol - node.state);
        });

        let first = new TNode(0);
        let res = stateSpace.localOptimizationSearch(first);

        for(var x of res){
            console.log("t:", x.state, x.msg, "index", x.index, "father", x.father);
        }
        console.log("TOTAL STEP", stateSpace.step);

        // 物理模块
        let point = new Point({
            force : new Vector2d(0, 1000)
        });
        let world = new World();
        world.addBody(point);
        
        let t = new Ticker();
        t.tick(()=>{
            world.update();
        });

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

        let animation = new Animation({
            layer:1,
            id:1,
            iotrigger: iotrigger,
            position:new Vector2d(100, 100),
            timer: timer,
            width:450,
            height:450
        });
        
        moveController.bindObj = animation;
        animation.setAction(($context, $this)=>{
            animation.drawFrame();
            animation.drawTree(moveController.speedX, 75, 10, Math.PI / Math.abs(moveController.speedY + 10));

            world.bodies.forEach((d)=>{
                d.drawCircle($context, $this);
            })
        });
        dis.addAnimation(animation);

        animation.setMouseStretch((event)=>{
            world.addBody(new Point({
                position : event.offset,
                linearVelocity : new Vector2d(155, -145),
                force : new Vector2d(0, 100)
            }));
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
            t.stop();
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{
            t.continue();
        }, 32);

        ///
        dis.render(()=>{
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
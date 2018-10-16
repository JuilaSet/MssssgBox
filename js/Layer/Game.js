class Game{
    constructor($option={}){
        this.timer = new Timer();
        this.display = new Display($option.canvas, $option.container, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
    }

    // 开始游戏
    run(){
        
        var sol = 75;

        let stateSpace = new StateSpace();
        stateSpace.setEcho((step)=>{

        });
        stateSpace.setGenRule(($father)=>{
            let node1 = new Node($father.state + 5);
            node1.msg = "+5";
            let node2 = new Node($father.state + 7);
            node2.msg = "+7";
            if($father.state < 200)return [node1, node2];
            else return [];
        });
        stateSpace.setJudge((node)=>{
            return (node.state == sol)? true:false;
        });
        let res = stateSpace.breathFirstSearch(new Node(0));

        var str = '';   
        if(res){ 
            res.forEach(element => {
                if(element.msg){
                    str = element.msg + str; 
                }
            });
        }else{
            console.log("无解");
        }
        console.log(sol+"=0"+str);

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
        
        moveController.bindObj=animation;
        animation.setAction(()=>{
            animation.drawTree(moveController.speedX, 75, 10, Math.PI / Math.abs(moveController.speedY + 10));
            animation.drawFrame();
        });
        dis.addAnimation(animation);
        
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
            animation.rotation += Math.PI / 10;
        }, 32);
        
        iotrigger.setKeyUpEvent(()=>{
            animation.rotation += Math.PI / 10;
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
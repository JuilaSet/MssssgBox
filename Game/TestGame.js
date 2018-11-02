"strict mode";
class TestGame{
    constructor(){
        this.timer = new Timer();
        this.display = new Display(undefined, undefined, this.timer);
        this.iotrigger = new IOTrigger({display: this.display}); // 单例对象
        this.pause = false;
    }

    // 开始游戏
    run(){
        let dis = this.display;
        let timer = this.timer;
        let iotrigger = this.iotrigger;

        let animation = new Animation({
            position : new Vector2d(0, 0),
            width : dis.canvas.width,
            height : dis.canvas.height,
            iotrigger : this.iotrigger,
            id : 1,
            layer : 1
        });

        // AI模块
        // GridAI 测试 {i, j}
        const wn = 5, hn = 5;
        let gridNet = new GridNet({
            position : new Vector2d(100, 100),
            w : 30,
            h : 30,
            wn : wn,
            hn : hn
        });

        let grids = [];
        let gridArraysGroup = {};       // answer => 图像
        let gridArrays = new Array(wn * hn);    // 记录单元格的数组
        for(let x = 0; x < gridArrays.length; x++){
            gridArrays[x] = 0;
        }

        // 事件
        let answer = "?";
        animation.setAction(($ctx)=>{
            animation.drawFrame();

            //
            $ctx.fillStyle = "#FFF";
            $ctx.font = 'bold 35px Arial';
            $ctx.fillText("请绘制数字，并在左边输入期望值", 100, 70);

            // answer
            animation.context.fillStyle = "#FFF";
            animation.context.font = 'bold 65px Arial';
            animation.context.fillText(answer, 450, 190);

            gridNet.render($ctx);
            grids.forEach(g => {
                g.render($ctx);
            });
        });

        animation.setMouseStretch((e)=>{
            let ras = gridNet.getRasterize(e.offset);
            // 添加路径
            if(ras){
                let g = gridNet.getGrid(ras.i, ras.j);
                grids.push(g);
                gridArrays[g.rank] = 1;
            }
        });
        dis.addAnimation(animation);
            
        // create the network
        let myPerceptron = new Perceptron(hn * wn, [hn], 10);

        $("#clear").click(()=>{
            for(let x=0; x < gridArrays.length; x++){
                grids = [];
                gridArrays[x] = 0;
            }
        });

        $("#push").click(()=>{
            let n = $("#expectation").val();
            let arrs = new Array(wn * hn);    // 记录单元格的数组
            for(let x = 0; x < arrs.length; x++){
                arrs[x] = gridArrays[x];
            }
    
            gridArraysGroup[n] = arrs;
            console.log("存放信息", gridArraysGroup);
        });

        $("#answer").click(()=>{
            // test the network
            let arrs = myPerceptron.activate(gridArrays);
            // 找到最大的数字
            let max = 0, r = 0;
            for(let i in arrs){
                if(max < arrs[i]){
                    max = arrs[i];
                    r = i;
                }
            }
            answer = r;
            $("#expectation").val(r);
            console.log("result=>", arrs);
        });

        let inputArr = new Array(10);
        $("#train").click(()=>{
            // train the network - learning
            let learningRate = .3;
            for (let i = 0; i < 40000; i++)
            {
                for(let x in gridArraysGroup){
                    for(let i=0; i < inputArr.length; i++){
                        if(i == x)inputArr[i] = 1;
                        else inputArr[i] = 0;
                    }
                    myPerceptron.activate(gridArraysGroup[x]);
                    myPerceptron.propagate(learningRate, inputArr);
                }
            }
            answer = "训练完成";
        });

        dis.render(()=>{
            timer.update();
        }, ()=>{

        });
    }
}
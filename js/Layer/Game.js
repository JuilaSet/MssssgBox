class Game{
    constructor(){
        this.display = new Display();
    }

    // 开始游戏
    run(){
        
        this.display.setFullScreen(true);

        ///

        var rn = 0;
        this.display.render(($tick)=>{
            
        },($tick)=>{
            if($tick % 5 == 0){
                rn = (5 + 3 * Math.sin(Math.random() * 4)) * (Math.PI / 180);
            }
            this.display.drawTree(rn);
        });
    }
}
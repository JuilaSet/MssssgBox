class AStarAI{
    constructor($option={}){
        this._net = $option.gridNet || console.error('未指定网格');
        let aimRas = $option.aimRas;  // 默认最右下方为目标
        let orgRas = $option.orgRas;  // 默认最左上方为目标
        
        if(aimRas){
            this._aim = this._net.getGrid(aimRas.i, aimRas.j);
        }
        
        if(orgRas){
            this._org = this._net.getGrid(orgRas.i, orgRas.j);
        }else{
            console.error("AStarAI", "没有定义起点");
        }

        this._blockGrids = {};  // 阻碍物表 rank -> grid
        if($option.blockRases){
            $option.blockRases.forEach(ras => {
                let grid = this._net.getGrid(ras.i, ras.j);
                this._blockGrids[grid.rank] = grid;
            });
        }

        // private
        this.init();
        
        // 状态空间
        this._stateSpace = new StateSpace();
    }

    // grid到grid的距离
    _distance($org, $aim){
        return Math.sqrt(
            ($org.i - $aim.i) * ($org.i - $aim.i) + ($org.j - $aim.j) * ($org.j - $aim.j)
        );
    }

    // 返回路径
    get trace(){
        return this._resultGrids;
    }

    // 是否找到
    get state(){
        return this._state;
    }

    // 初始化
    init(){
        this._state = false;
        this._stepGrids = {};   // 路径表 rank -> grid
        this._resultGrids = []; // 结果路径数组,越接近第一个越接近目标
    }

    // 设置状态空间
    initStateSpace(){
        if(this._aim){
            this._net.clearAllGrid();
            let stateSpace = this._stateSpace;
            stateSpace.setGenRule(($father)=>{
                let nodes = [];
                this._net.getRasterizeAround($father.grid.i, $father.grid.j).forEach((ras)=>{
                    let grid = this._net.getGrid(ras.i, ras.j);
                    let rankStr = `${grid.rank}`;
                    if( !Object.keys(this._blockGrids).includes(rankStr) &&
                        !Object.keys(this._stepGrids).includes(rankStr) ){    // 判断是否是合法路径 []][
                        let n = new GridNode({
                            grid : grid,
                            distance : this._distance(grid, this._aim)
                        });
                        this._stepGrids[grid.rank] = grid;
                        nodes.push(n);
                    }
                });
                return nodes;
            });
    
            stateSpace.setJudge((node)=>{
                // 是否到终点
                if(node.grid.i == this._aim.i && node.grid.j == this._aim.j){
                    this._state = true;
                    return true;
                }else{
                    return false; 
                } 
            });
            
            stateSpace.setHeuristicFunc((node)=>{
                return node.distance;
            });
        }else{
            if(!this._aim){
                console.error("AStarAI", "没有定义目标");
            }
        }
    }

    search(){ 
        if(this._aim){
            this.init();
            let stateSpace = this._stateSpace;
            let first = new GridNode({
                grid : this._org,
                distance : this._distance(this._org, this._aim)
            });
            this._stepGrids[this._org.rank] = this._org;
            let res = stateSpace.globalOptimizationSearch(first);
            for(let gridnode of res){
                let grid = gridnode.grid;
                if( !(grid.i == this._aim.i && grid.j == this._aim.j) && 
                    !(grid.i == this._org.i && grid.j == this._org.j)){
                    this._resultGrids.push(grid);    // 添加至结果路径,越接近第一个越接近目标
                }
            }
            console.info("AStarAI", "TOTAL STEPS = ", stateSpace.step);
            return this._resultGrids;
        }else{
            if(!this._aim){
                console.error("AStarAI", "没有定义目标");
            }
        }
    }

    addBlock($gridori, $j){
        if(arguments.length == 1){
            this._blockGrids[$grid.rank] = $gridori;
        }else{
            let grid = this._net.getGrid($gridori, $j);
            this._blockGrids[grid.rank] = grid;
        }
    }

    setAim($i, $j){
        if(this._net.check($i, $j)){
            this._aim = this._net.getGrid($i, $j);
        }else{
            console.error("AStarAI", "目标位置不存在");
        }
    }

    // 渲染相关
    render($ctx){
        this.drawSteps($ctx, "#F00");
        this.drawResult($ctx, "#453");

        this.drawOrg($ctx, "#00F");
        this.drawAim($ctx, "#EF0");

        this.drawBlocks($ctx, "#EEE");
        this._net.drawGridNet($ctx);
    }
    
    drawResult($ctx, $color){
        for(let x in this._resultGrids){
            this._resultGrids[x].render($ctx, $color);
        }
    }

    drawSteps($ctx, $color){
        for(let x in this._stepGrids){
            this._stepGrids[x].render($ctx, $color);
        }
    }

    drawBlocks($ctx, $color){
        for(let x in this._blockGrids){
            this._blockGrids[x].render($ctx, $color);
        }
    }

    drawAim($ctx, $color){
        if(this._aim)this._aim.render($ctx, $color);
    }

    drawOrg($ctx, $color){
        this._org.render($ctx, $color);
    }
}
class GridNode extends TNode{
    constructor($option={}){
        super($option);
        this._grid = $option.grid;
        this.distance = $option.distance || 0;
    }

    get grid(){
        return this._grid;
    }
}
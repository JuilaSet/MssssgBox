class StateSpace{
    constructor($option={}){
        this.open = [];
        this.closed = [];
    }

    setGenRule($func){
        this.generate = $func;
    }

    generate($father){
        return [];
    }

    setJudge($judge){
        this.judge = $judge;
    }

    judge($node){
        return true;
    }

    setEcho($func){
        this.echo = $func;
    }
    
    echo($step){

    }

    init(){
        this.open = [];
        this.closed = [];
    }

    breathFirstSearch($node){
        this.init();
        if(!$node instanceof Node)console.error('$node必须为Node对象');
        let result = [], depth = 0, n = 0;
        $node.depth = depth;
        // 将第一个结点设置为待拓展的结点
        this.open.push($node);
        let step = 0;
        // 直到没有带拓展的对象为止
        while(this.open.length != 0){
            this.echo(step++);

            // 从open中取出结点，放入closed中
            let node = this.open.shift();
            node.index = n++;
            this.closed.push(node);

            // 判断是否是目标结点
            if(this.judge(node)){
                // 找到目标，放入结果集合
                result.push(node);
                do{
                    node = this.closed[node.father];
                    result.push(node);
                }while(node.index != 0);
                return result;
            }

            // 拓展结点
            let exts = this.generate(node);
            if(exts || exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    exts[i].father = node.index;
                    exts[i].depth = node.depth + 1;
                    this.open.push(exts[i]);
                }
            }
        }
        return; // 失败
    }

    depthFirstSearch($node, $maxDepth=15){
        this.init();
        if(!$node instanceof Node)console.error('$node必须为Node对象');
        if($maxDepth > 20)console.warn("深度过大可能导致性能问题,当前maxDepth=" + $maxDepth);
        let result = [], depth = 0, n = 0;
        let step = 0;
        $node.depth = depth;
        this.open.push($node);
        while(this.open.length != 0){
            this.echo(step++);

            // 从open中取出结点，放入closed中
            let node = this.open.pop();
            node.index = n++;
            this.closed.push(node);

            // 判断深度是否足够
            if(node.depth != $maxDepth){
                // 判断是否是目标结点
                if(this.judge(node)){
                    // 找到目标，放入结果集合
                    result.push(node);
                    do{
                        node = this.closed[node.father];
                        result.push(node);
                    }while(node.index != 0);
                    return result;
                }

                // 拓展结点
                let exts = this.generate(node);
                if(exts || exts.length != 0){
                    for(let i = 0; i < exts.length; i++){
                        exts[i].father = node.index;
                        exts[i].depth = node.depth + 1;
                        this.open.push(exts[i]);
                    }
                }
            }
        }
        return result;
    }
}

// 树结点
class TNode{
    constructor($state=0, $father=0, $depth=0){
        this.state = $state;
        this.father = $father;
        this._depth = $depth;
    }

    set index($index){
        this._index = $index;
    }

    get index(){
        return this._index;
    }

    set depth($depth){
        this._depth = $depth;
    }

    get depth(){
        return this._depth;
    }
}

// 图结点
class GNode{
    constructor($state=0){
        this.state = $state;
        this.ins = [];
        this.outs = [];
        // 结点价值
        this.f = 0;
        // 结点距离初始点的代价
        this.g = 0;
        // 结点距离结束点的代价
        this.h = 0;
    }

    addin($index){
        this.ins.push($index);
    }

    addout($index){
        this.outs.push($index);
    }
}
class StateSpace{
    constructor($option={}){
        this.open = [];
        this.closed = [];
        this.step = 0;
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
        this.callBack = $func;
    }
    
    callBack($step){

    }

    init(){
        this.open = [];
        this.closed = [];
    }

    breathFirstSearch($node){
        this.init();
        if(!($node instanceof TNode))console.error('$node必须为TNode对象');

        let result = [], depth = 0, n = 0;
        $node.depth = depth;
        // 将第一个结点设置为待拓展的结点
        this.open.push($node);
        this.step = 0;
        // 直到没有带拓展的对象为止
        while(this.open.length != 0){
            this.callBack(this.step++);

            // 从open中取出结点，放入closed中
            let node = this.open.shift();
            node.index = n++;
            this.closed[node.index] = node;

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
            if(exts instanceof Array && exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    exts[i].father = node.index;
                    exts[i].depth = node.depth + 1;
                    this.open.push(exts[i]);
                }
            }
        }
        return result; // 失败
    }

    depthFirstSearch($node, $maxDepth=15){
        this.init();
        if(!($node instanceof TNode))console.error('$node必须为TNode对象');
        if($maxDepth > 20)console.warn("深度过大可能导致性能问题,当前maxDepth=" + $maxDepth);

        let result = [], depth = 0, n = 0;
        this.step = 0;
        $node.depth = depth;
        this.open.push($node);
        while(this.open.length != 0){
            this.callBack(this.step++);

            // 从open中取出结点，放入closed中
            let node = this.open.pop();
            node.index = n++;
            this.closed[node.index] = node;

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
                if(exts instanceof Array && exts.length != 0){
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

    // 计算结点的价值
    F($node, $graphic){
        return this.G($node, $graphic) + this.H($node, $graphic);
    }

    setHeuristicFunc($h){
        this.H = $h;
    }

    setHowFarFromOriginFunc($g){
        this.G = $g;
    }
    
    // g，从起点到结点node的实际代价
    G($node, $graphic){
        return $node.g;
    }

    // h，启发函数，从结点node到目标结点的估计代价
    H($node, $graphic){
        return $node.h;
    }
     
    // 局部择优搜索
    localOptimizationSearch($tnode){
        this.init();
        if(!($tnode instanceof TNode))console.error('$node必须为TNode对象');

        let result = [];
        this.step = 0;
        let n = 0;
        // 取出距离目标代价最小的
        $tnode.h = this.H($tnode);
        this.open.push($tnode);
        while(this.open.length != 0){
            this.callBack(this.step++);
            if(this.step % 1000 == 0){
                if(!confirm("次数过多是否继续？")){
                    return result;
                };
            }

            let node = this.open.shift();
            node.index = n++;
            this.closed.push(node);
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
            if(exts instanceof Array && exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    exts[i].h = this.H(exts[i]);
                    exts[i].father = node.index;
                    exts[i].depth = node.depth + 1;
                }
                // 对exts列表进行排序
                exts.sort((n1 ,n2)=>{
                    return (n1.h - n2.h);
                });
                // 一一放入
                for(let i = 0; i < exts.length; i++){
                    this.open.unshift(exts[i]);
                }
            }else{
                continue;
            }
        }
        return [];
    }

    // 全局择优搜索
    globalOptimizationSearch($tnode){
        this.init();
        if(!($tnode instanceof TNode))console.error('$node必须为TNode对象');

        let result = [];
        this.step = 0;
        let n = 0;
        // 取出距离目标代价最小的
        $tnode.h = this.H($tnode);
        this.open.push($tnode);
        while(this.open.length != 0){
            this.callBack(this.step++);
            if(this.step % 1000 == 0){
                if(!confirm("次数过多是否继续？")){
                    return result;
                };
            }

            let node = this.open.shift();
            node.index = n++;
            this.closed.push(node);
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
            if(exts instanceof Array && exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    exts[i].h = this.H(exts[i]);
                    exts[i].father = node.index;
                    exts[i].depth = node.depth + 1;
                    this.open.push(exts[i]);
                }
                // 对open列表进行排序
                this.open.sort((n1 ,n2)=>{
                    return (n1.h - n2.h);
                });
            }else{
                continue;
            }
        }
        return [];
    }

    generalGraphHeuristicSearch($gnode){
        this.init();
        if(!($gnode instanceof GNode))console.error('$node必须为GNode对象');

        let result = [], graphic = [];
        this.step = 0
        let n = 0;
        graphic.push($gnode);
        this.open.push($gnode);
        while(this.open.length != 0){
            this.callBack(this.step++);

            // 从open中取出f最小的结点，放入closed中
            let node = this.open.shift();
            node.index = n++;
            this.closed[node.index] = node;

            // 判断是否是目标结点
            if(this.judge(node)){
                // 找到目标，放入结果集合
                result.push(node);
                do{
                    node = this.closed[node.father];
                    result.push(node);
                }while(node.index != 0);
                return {
                    trace :result, 
                    graphic: graphic
                };
            }

            // 拓展结点
            let exts = this.generate(node);
            if(exts instanceof Array && exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    if(!exts[i] instanceof GNode)console.error('$node必须为GNode对象');

                    // 填入grphic
                    node.addout(exts[i]);
                    exts[i].addin(node);
                    graphic.push(exts[i]);

                    // 计算f
                    let f = this.F(exts[i], graphic);
                    let father = node.index;

                    // 判断open和close表中是否已经有这个点
                    let noexist = false;
                    let x = this.open.indexOf(exts[i]);
                    if(x >= 0){
                        // 比较g，设置g值较小的node的返回指针
                        if(this.open[x].g > ext[i].g){
                            this.open[x].f = exts[i].f;
                            this.open[x].father = exts[i].father;
                        }
                    }else{
                        noexist = true;
                    }
                    if(this.closed[exts[i].index]){
                        // 比较g，设置g值较小的node的返回指针
                        if(this.closed[exts[i].index].g > exts[i].g){
                            this.closed[exts[i].index].f = exts[i].f;
                            this.closed[exts[i].index].father = exts[i].father;
                            // 修改通向该节点的后裔节点的g
                            for(let n = exts[i].father; n.index != 0; n = n.father){
                                n.g = this.G(n);
                            }
                        }
                    }else if(noexist){
                        exts[i].f = f;
                        exts[i].father = father;
                        this.open.push(exts[i]);
                    }
                }
            }else{
                // 没有后继
                continue;
            }
            
            // 对open的数据按f从小到大排序
            this.open.sort((n1, n2)=>{
                return (n1.f - n2.f);
            });
        }

        return {
            graphic: graphic,
            trace : result
        };
    }
}

// 树结点
class TNode{
    constructor($state=0, $father=0, $depth=0){
        this.state = $state;
        this.father = $father;
        this._depth = $depth;
        this.f = 0;
        this.g = 0;
        this.h = 0;
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
    constructor($state=0, $father=0){
        this.state = $state;
        this.father = $father;
        
        this.ins = [];
        this.outs = [];
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }

    set index($index){
        this._index = $index;
    }

    get index(){
        return this._index;
    }

    addin($index){
        this.ins.push($index);
    }

    addout($index){
        this.outs.push($index);
    }
}
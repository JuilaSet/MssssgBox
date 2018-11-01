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
                        exts[i].depth = node.depth + 1;     // ***
                        this.open.push(exts[i]);
                    }
                }
            }
        }
        return result;
    }

    setHeuristicFunc($h){
        this.H = $h;
    }

    setDepthFunc($g){
        this.G = $g;
    }
    
    // g，从起点到结点node的实际代价
    G($father, $current){
        if($father){
            return $father.g + 1;
        }else{
            // 是第一个结点
            return 0;
        }
    }

    // h，启发函数，从结点node到目标结点的估计代价
    H($current){
        return $current.h;
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
                // 对exts列表进行排序，按照启发函数值进行排序，从小到大排序
                exts.sort((n1 ,n2)=>{
                    return (n2.h - n1.h);
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
    globalOptimizationSearch($first){
        this.init();
        if(!($first instanceof TNode))console.error('$node必须为TNode对象');

        let result = [];
        this.step = 0;
        let n = 0;
        $first.h = this.H($first);
        this.open.push($first);
        while(this.open.length != 0){
            // 回现以及保护措施
            this.callBack(this.step++);
            if(this.step % 1000 == 0){
                if(!confirm("次数过多是否继续？")){
                    return result;
                };
            }

            // 取出距离目标代价最小的
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
                // 对open列表进行排序，按照启发函数值进行排序，从小到大排序
                this.open.sort((n1 ,n2)=>{
                    return (n1.h - n2.h);
                });
            }else{
                continue;
            }
        }
        return [];
    }

    // 从open列表中找寻相同的结点，并返回open列表中相同的结点，如果没有返回false
    setFindOpenNodeAs($func){
        this.findOpenNodeAs = $func;
    }

    findOpenNodeAs($open, $node){
        return;
    }

    // 从closed列表中找寻相同的结点，并返回closed列表中相同的结点，如果没有返回false
    setFindClosedNodeAs($func){
        this.findClosedNodeAs = $func;
    }

    findClosedNodeAs($closed, $node){
        return;
    }

    // a*算法
    bestFirstSearch($first){
        this.init();
        if(!($first instanceof TNode))console.error('$node必须为TNode对象');

        let result = [];    // 结果路径
        this.step = 0;
        let n = 0;          // 下标
        $first.f = this.G() + this.H($first);
        this.open.push($first); // 将第一个结点加入open列表
        while(this.open.length != 0){
            // 回现以及保护措施
            this.callBack(this.step++);
            if(this.step % 1000 == 0){
                if(!confirm("次数过多是否继续？")){
                    return result;
                };
            }

            // 取出距离目标代价最小的
            let current = this.open.shift();
            current.index = n++;
            this.closed.push(current);

            // 是目标？
            if(this.judge(current)){
                result.push(current);
                do{
                    current = this.closed[current.father];
                    result.push(current);
                }while(current.father);    // 直到返回指针为空
                return result;
            }
            
            // 拓展结点
            let exts = this.generate(current);
            if(exts instanceof Array && exts.length != 0){
                // 遍历每一个新生成的结点
                for(let i = 0; i < exts.length; i++){
                    // 计算它的f
                    exts[i].g = this.G(current, exts[i]);
                    exts[i].h = this.H(exts[i]);
                    exts[i].f = exts[i].g + exts[i].h;
                    // 是否在open表和closed表中
                    let nOpen = this.findOpenNodeAs(this.open, exts[i]);
                    let nClose = this.findClosedNodeAs(this.closed, exts[i]);
                    if(!nOpen && !nClose){
                        exts[i].father = current.index;
                        exts[i].depth = current.depth + 1;
                    }
                    else{
                        if(nOpen){
                            if(nOpen.f > exts[i].f){
                                // 更新列表中结点的值
                                nOpen.g = exts[i].g;
                                nOpen.h = exts[i].h;
                                nOpen.f = exts[i].f;
                                nOpen.father = current.index;
                                nOpen.depth = current.depth + 1;
                            }
                        }else{
                            if(nClose.f > exts[i].f){
                                // 更新列表中结点的值
                                nClose.g = exts[i].g;
                                nClose.h = exts[i].h;
                                nClose.f = exts[i].f;
                                nClose.father = current.index;
                                nClose.depth = current.depth + 1;
                                // re-open
                                this.open.push(nClose);
                            }
                        }
                    }
                    if(!nOpen){
                        this.open.push(exts[i]);
                    }
                }
                // 对open列表进行排序，按照f值进行排序，从小到大排序
                this.open.sort((n1 ,n2)=>{
                    return (n1.f - n2.f);
                });
            }else{
                continue;
            }
        }
        return [];
    }

}

// 树结点
class TNode{
    constructor($option={}){
        this.state = $option.state; // 用于判断结点是否在逻辑上相同
        this.father = $option.father;
        this._depth = $option.depth;

        this.handleMsg = $option.handleMsg;
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
    constructor($option={}){
        this.state = $option.state;
        this.father = $option.father;
        this.handleMsg = $option.handleMsg;

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
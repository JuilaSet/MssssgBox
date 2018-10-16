class StateSpace{
    constructor($option){
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

    breathFirstSearch($node){
        if(!$node instanceof Node)console.error('$node必须为Node对象');
        let n = 0, result = [];
        // 将第一个结点设置为待拓展的结点
        this.open.push($node);
        // 直到没有带拓展的对象为止
        while(this.open.length != 0){
            // 从open中取出结点，放入closed中
            let node = this.open.shift();
            node.index = n++;
            this.closed.push(node);
            // 判断是否是目标结点
            if(this.judge(node)){
                // 找到目标，放入结果集合
                result.push(node);
                // 从目标结点开始回溯到开始结点
                do{
                    node = this.closed[node.father];
                    result.push(node);
                }while(node.index != 0);
                return result;
            }
            // 扩展结点
            let exts = this.generate(node);
            if(exts || exts.length != 0){
                for(let i = 0; i < exts.length; i++){
                    exts[i].father = node.index;
                    this.open.push(exts[i]);
                }
            }
        }
        return; // 失败
    }
}
class Node{
    constructor($state, $father){
        this.state = $state || 0;
        this.father = $father || 0;
    }

    setIndex($index){
        this.index = $index;
    }

    getIndex(){
        return this.index;
    }
}
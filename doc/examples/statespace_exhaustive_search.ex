ex: 将15分解为3,4,12的和
var sol = 15;
let stateSpace = new StateSpace();
stateSpace.setGenRule(($father)=>{
    let node1 = new Node($father.state + 4);
    node1.msg = "+4";
    let node2 = new Node($father.state + 3);
    node2.msg = "+3";
    let node3 = new Node($father.state + 12);
    node3.msg = "+12";
    if($father.state < 100)return [node3, node2, node1];
    else return [];
});
stateSpace.setJudge((node)=>{
    return (node.state == sol)? true:false;
});

// 深度优先遍历
let res = stateSpace.depthFirstSearch(new TNode(0), 16);
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

// 广度优先遍历
let res2 = stateSpace.breathFirstSearch(new TNode(0));
var str = '';   
if(res2){ 
    res2.forEach(element => {
    if(element.msg){
	str = element.msg + str;
    }
    });
}else{
    console.log("无解");
}
console.log(sol+"=0"+str);


// 全局择优搜索
var sol = 15;
let stateSpace = new StateSpace();
stateSpace.setGenRule(($father)=>{
    let node1 = new TNode($father.state + 3);
    node1.msg = "+3";
    let node2 = new TNode($father.state + 4);
    node2.msg = "+4";
    let node3 = new TNode($father.state + 12);
    node3.msg = "+12";
    if($father.h > 0)
	return [node1, node2, node3];
    else return [];
});
stateSpace.setJudge((node)=>{
    return (node.state == sol)? true:false;
});
stateSpace.setHeuristicFunc((node)=>{
    console.log(sol - node.state);
    return (sol - node.state);
});

let first = new TNode(0);
let res = stateSpace.globalOptimizationSearch(first);
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
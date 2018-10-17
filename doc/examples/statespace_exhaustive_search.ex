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
let res = stateSpace.depthFirstSearch(new Node(0), 16);
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
let res2 = stateSpace.breathFirstSearch(new Node(0));
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
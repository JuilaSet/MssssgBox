/* 
 *  所有AI的父类
 **/
class AI{
    constructor($option={}){

    }

    setAction($func){
        this.action = $func;
    }

    // 行动
    action(){

    }

    update(){
        this.action();
    }
}
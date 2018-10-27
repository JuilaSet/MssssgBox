/* 
 *  所有AI的父类
 **/
class AI{
    constructor($option={}){
        this._controller = $option.controller || new Controller();
    }

    set controller($c){
        this._controller = $c;
    }

    get controller(){
        return this._controller;
    }

    setAction($func){
        this.action = $func;
    }

    // 行动
    action(){

    }

    update(){
        this.action();
        this._controller.update();
    }
}
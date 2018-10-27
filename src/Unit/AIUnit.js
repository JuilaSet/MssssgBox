/* 
 *
 * 带有AI的Unit
 *
*/
class AIUnit extends Unit{
    constructor($option){
        super($option);
        this._AI = $option.AI || new AI();
        this._controller = this._AI.controller || new Controller();
    }

    get controller(){
        return this._controller;
    }

    get ai(){
        return this._AI;
    }
    
    set ai($ai){
        this._AI = $ai;
    }

    // @Override
    kill(){
        super.kill();
        this._AI.controller.kill();
    }

    update(){
        if(this._living){
            this.synStatic();
            this._AI.update();
        }
    }
}
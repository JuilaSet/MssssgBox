/* 
 *
 * 带有AI的Unit
 *
*/
class AIUnit extends Unit{
    constructor($option){
        super($option);
        this._AI = $option.AI || new AI();
    }

    get ai(){
        return this._AI;
    }
    
    set ai($ai){
        this._AI = $ai;
    }

    defaultOnUpdate(){
        super.defaultOnUpdate();
        this._AI.update();
    }

    onUpdate(){
        this.defaultOnUpdate();
    }
}
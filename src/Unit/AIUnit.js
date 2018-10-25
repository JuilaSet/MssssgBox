/* 
 *
 * 带有AI的Unit
 *
*/
class AIUnit extends ControlableUnit{
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
    }

    onUpdate(){
        this.defaultOnUpdate();
    }

    update(){
        super.update();
        if(this._living){
            this._AI.update();
        }
    }
}
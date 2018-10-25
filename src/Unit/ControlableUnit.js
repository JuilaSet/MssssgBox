class ControlableUnit extends Unit{
    constructor($option={}){
        super($option);
        this._controller = $option.controller || new Controller();
        this._controller.bindObj = this._renderObj;
    }

    // @Override
    defaultOnUpdate(){

    }

    update(){
        // super.update();
        if(this._living){
            this._controller.update();
        }
    }
}
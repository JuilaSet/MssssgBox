class ControlableUnit extends Unit{
    constructor($option={}){
        super($option);
        this._controller = $option.controller || new Controller();
        this._controller.bindObj = this._renderObj;
    }

    // @Override
    defaultOnUpdate(){
        this._controller.update();
    }
}
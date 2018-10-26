class ControlableUnit extends Unit{
    constructor($option={}){
        super($option);
        this._controller = $option.controller || new Controller();
        this._controller.bindObj = this._renderObj;
    }

    set controller($contor){
        this._controller = $contor;
    }

    get controller(){
        return this._controller;
    }

    kill(){
        super.kill();
        this._controller.kill();
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
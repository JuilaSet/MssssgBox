class Controller{
    constructor($option={}){
        this._bindObj = $option.bindObj;
    }

    get speed(){

    }

    get position(){

    }
    
    set bindObj($obj){
        this._bindObj = $obj;
    }

    get bindObj(){
        return this._bindObj;
    }

    // @enableOverride 使其无效
    kill(){

    }

    render($context){

    }

    update(){
        
    }
}
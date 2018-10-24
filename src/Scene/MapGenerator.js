class MapGenerator{
    constructor($option={}){
        this._map = new Map();
        this.width = $option.width || 450;
        this.height = $option.height || 200;
    }

    generateMap(){
        return this._map;
    }

    get map(){
        return this._map;
    }
}

class Map{
    constructor($option={}){

    }
}
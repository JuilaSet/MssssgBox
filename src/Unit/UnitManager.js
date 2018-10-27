class UnitManager{
    constructor($option={}){
        this._units = $option.units || [];
        this._buildings = $option.buildings || [];
    }

    add($unit){
        if($unit instanceof Unit){
            this._units.push($unit);
        }else if($unit instanceof Building){
            this._buildings.push($unit);
        }else{
            console.error('UnitManager', '加入的单位必须是Unit对象或者Building对象');
        }
    }

    render($ctx, $tick){
        this._units.forEach(unit => {
            unit.render($ctx, $tick);
        });
        this._buildings.forEach(unit => {
            unit.render($ctx, $tick);
        });
    }

    update(){
        this._units.forEach(unit => {
            if(unit.living){
                unit.update();
            }
        });
        this._buildings.forEach(unit => {
            if(unit.living){
                unit.update();
            }
        });
        this.cleanUnits();
    }

    cleanUnits(){
        for(let x = 0; x < this._units; x++){
            if(!this._units[x].living){
                this._units.splice(x, 1);
            }
        }
        for(let x = 0; x < this._buildings; x++){
            if(!this._buildings[x].living){
                this._buildings.splice(x, 1);
            }
        }
    }
}

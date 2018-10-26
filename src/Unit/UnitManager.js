class UnitManager{
    constructor($option={}){
        this._units = $option.units || [];
    }

    add($unit){
        this._units.push($unit);
    }

    render($ctx, $tick){
        this._units.forEach(unit => {
            unit.render($ctx, $tick);
        });
    }

    update(){
        this._units.forEach(unit => {
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
    }
}

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
            unit.update();
        });
    }
}

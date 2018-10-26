class UnitFactory{
    constructor($option={}){
        this._game = $option.game || console.error('没有指定游戏对象');
        this._world = $option.world || console.error('无法在空虚中创建物体');
    }

    createBasicUnit($renderObj, $position, $unitOption={}){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        Object.assign($unitOption, {
            position: $position,
            game: this._game,
            renderObject: $renderObj
        });
        let unit = new Unit($unitOption);
        return unit;
    }

    createBasicUnitWithBody($renderObj, $position, $unitOption={}, $bodyOption={}){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });

        // body
        if(!$bodyOption){
            $bodyOption = {
                border: 5,
                position: new Vector2d(0, 0),
                force : new Vector2d(0, 100)
            }
        }
        let point = new Point($bodyOption);
        this._world.addBody(point);

        // unit
        Object.assign($unitOption, {
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            point: point
        });
        let unit = new Unit($unitOption);
        return unit;
    }
}
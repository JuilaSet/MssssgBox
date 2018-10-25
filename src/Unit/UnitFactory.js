class UnitFactory{
    constructor($option={}){
        this._game = $option.game || console.error('没有指定游戏对象');
    }

    createBasicUnit($renderObj, $position){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        let unit = new Unit({
            position: $position,
            game: this._game,
            renderObject: $renderObj
        });
        return unit;
    }
}
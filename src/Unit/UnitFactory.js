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

    createBasicUnitWithBody($renderObj, $position, $unitOption={}, $bodyOption={
        border: 5,
        position: new Vector2d(0, 0),
        force : new Vector2d(0, 100)
    }, $staticOption={
        width : 100,
        height : 100
    }){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });

        // body
        let point = new Point($bodyOption);
        point.setOnStaticHit(()=>{});
        this._world.addBody(point);
        
        // static
        let staticsqrt = new StaticSquare($staticOption);
        this._world.addBody(staticsqrt);

        // unit
        Object.assign($unitOption, {
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            point: point,
            static : staticsqrt
        });
        let unit = new Unit($unitOption);
        return unit;
    }
}
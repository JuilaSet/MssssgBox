class ControlableUnitFactory extends UnitFactory{
    constructor($option={}){
        super($option);
        this.iotrigger = $option.iotrigger || console.error('没有指定io触发器');
    }

    createCrawlUnit($renderObj, $position, $contrOption={}, $unitOption={}, $keys=[65,68,87]){   // 左,右,上
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        
        // controller
        $contrOption.world = this._world;
        let crawlContr = new CrawlController($contrOption);

        Object.assign($unitOption,{
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr
        });
        let unit = new ControlableUnit($unitOption);

        // trigger
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.accLeft($contrOption.accLeft || 50);
        }, $keys[0]);
        this.iotrigger.setKeyUpEvent(()=>{
            crawlContr.accLeft(0);
        }, $keys[0]);
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.accRight($contrOption.accRight || 50);
        }, $keys[1]);
        this.iotrigger.setKeyUpEvent(()=>{
            crawlContr.accRight(0);
        }, $keys[1]);
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.jump($contrOption.jumpHeight || 120);
        }, $keys[2]);
        this.iotrigger.setKeyUpEvent(()=>{}, $keys[2]);
        
        return unit;
    }
    
    createCrawlUnitWithBody($renderObj, $position, $contrOption={}, $unitOption={}, $bodyOption={
            border: 5,
            position: new Vector2d(0, 0),
            force : new Vector2d(0, 100)
        }, $staticOption={
            width : 100,
            height : 100
        }, $keys=[65,68,87]){   // 左,右,上
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        
        // controller
        $contrOption.world = this._world;
        let crawlContr = new CrawlController($contrOption);

        // body
        if(!$bodyOption){
            $bodyOption = {
                border: 5,
                position: new Vector2d(0, 0),
                force : new Vector2d(0, 100)
            }
        }
        $bodyOption.enableStaticBounce = false;
        let point = new Point($bodyOption);
        this._world.addBody(point);

        // static
        let staticsqrt = new StaticSquare($staticOption);
        staticsqrt.render = ()=>{};
        this._world.addBody(staticsqrt);
        // unit
        Object.assign($unitOption,{
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr,
            point: point,
            static : staticsqrt
        });
        let unit = new ControlableUnit($unitOption);

        // trigger
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.accLeft($contrOption.accLeft || 50);
        }, $keys[0]);
        this.iotrigger.setKeyUpEvent(()=>{
            crawlContr.accLeft(0);
        }, $keys[0]);
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.accRight($contrOption.accRight || 50);
        }, $keys[1]);
        this.iotrigger.setKeyUpEvent(()=>{
            crawlContr.accRight(0);
        }, $keys[1]);
        this.iotrigger.setKeyDownEvent(()=>{
            crawlContr.jump($contrOption.jumpHeight || 120);
        }, $keys[2]);
        this.iotrigger.setKeyUpEvent(()=>{}, $keys[2]);
        
        return unit;
    }

    createTreeHeroUnit( $position, 
                        $treeOption={}, 
                        $contrOption={}, 
                        $unitOption={}, 
                        $bodyOption={}, 
                        $staticOption={},
                        $keys=[65,68,87]){
        // renderObj
        Object.assign($treeOption, {
            treeHeight:0, minLength:7
        });
        let tree = new Tree($treeOption);

        // unit
        let unit = this.createCrawlUnitWithBody(
            tree, 
            $position,
            {
                jumpHeight : 150,
                speed:120
            }, 
            $unitOption, 
            $bodyOption, 
            {
                width : 25,
                height: 25
            },
            $keys);

        // renderobj
        let contr = unit.controller;
        tree.addRenderFrame(($ctx, $tick)=>{
            tree.force = contr.velocityX / 5;
            tree.intersectionAngle = ($treeOption.angle || Math.PI / 7) - Math.min(
                contr.velocityY, 200) / 1200;
            tree.drawTree($tick);
        });

        return unit;
    }
}
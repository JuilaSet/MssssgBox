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
            crawlContr.jump($contrOption.jumpHeight || 100);
        }, $keys[2]);
        this.iotrigger.setKeyUpEvent(()=>{}, $keys[2]);
        
        return unit;
    }

    
    createCrawlUnitWithBody($renderObj, $position, $contrOption={}, $unitOption={}, $bodyOption={}, $keys=[65,68,87]){   // 左,右,上
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
        let point = new Point($bodyOption);
        this._world.addBody(point);

        // unit
        Object.assign($unitOption,{
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr,
            point: point
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
            crawlContr.jump($contrOption.jumpHeight || 100);
        }, $keys[2]);
        this.iotrigger.setKeyUpEvent(()=>{}, $keys[2]);
        
        return unit;
    }
}
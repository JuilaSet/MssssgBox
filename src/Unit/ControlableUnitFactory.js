class ControlableUnitFactory extends UnitFactory{
    constructor($option={}){
        super($option);
        this.iotrigger = $option.iotrigger || console.error('没有指定io触发器');
    }

    createCrawlUnit($renderObj, $position, $world, $contrOption={}, $keys=[65,68,87]){   // 左,右,上
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        
        // controller
        $contrOption.world = $world;
        let crawlContr = new CrawlController($contrOption);

        let unit = new ControlableUnit({
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr
        });

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
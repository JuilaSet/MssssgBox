class AIUnitFactory extends UnitFactory{
    constructor($option={}){
        super($option);
    }

    createCrawlAiUnit($renderObj, $position, $contrOption={}, $aiOption={}, $unitOption={}){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        $contrOption.world = this._world;
        let crawlContr = new CrawlController($contrOption);
        $aiOption.crawlController = crawlContr;
        let ai = new CrawlAI($aiOption);
        Object.assign($unitOption,{
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr,
            AI : ai
        });
        let unit = new AIUnit($unitOption);
        return unit;
    }
}
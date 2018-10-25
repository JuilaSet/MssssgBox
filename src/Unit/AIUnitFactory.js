class AIUnitFactory extends UnitFactory{
    constructor($option={}){
        super($option);
        this._world = $option.world || console.error('未知世界的ai无法被构建');
    }

    createCrawlAiUnit($renderObj, $position, $contrOption, $aiOption={}){
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });
        $contrOption.world = this._world;
        let crawlContr = new CrawlController($contrOption);
        $aiOption.crawlController = crawlContr;
        let ai = new CrawlAI($aiOption);
        let unit = new AIUnit({
            position: $position,
            game: this._game,
            renderObject: $renderObj,
            controller: crawlContr,
            AI : ai
        });
        return unit;
    }
}
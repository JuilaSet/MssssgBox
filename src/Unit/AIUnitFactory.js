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

    createEdibleCrawAIUnit($renderObj, $position, $eatFunc, $contrOption={}, $aiOption={}, $unitOption={}){
        // ai
        Object.assign($aiOption, {
            escape: true
        });
        // unit
        let unit = this.createCrawlAiUnit($renderObj, $position, $contrOption, $aiOption, $unitOption);
        unit.ai.setOnNear(()=>{
            unit.ai.defaultOnNear();
            $eatFunc();
            unit.kill();
        });
        return unit;
    }
    
    createHostileCrawAIUnit($position, $treeOption, $hurtFunc, $contrOption={}, $aiOption={}, $unitOption={}){
        // renderObj
        Object.assign($treeOption, {
            treeHeight:0, minLength:7
        });
        let tree = new Tree($treeOption);
       
        // ai
        Object.assign($aiOption, {
            escape: false
        });

        // unit
        let unit = this.createCrawlAiUnit(tree, $position, $contrOption, $aiOption, $unitOption);
        unit.ai.setOnNear(()=>{
            unit.ai.defaultOnNear();
            $hurtFunc();
        });

        // renderobj
        let contr = unit.controller;
        tree.addRenderFrame(($ctx, $tick)=>{
            tree.force = contr.velocityX / 5;
            tree.intersectionAngle = ($treeOption.angle || Math.PI / 2) - Math.min(
                contr.velocityY, 200) / 1200;
            tree.drawTree($tick);
        });
        return unit;
    }
}
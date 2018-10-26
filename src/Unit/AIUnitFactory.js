class AIUnitFactory extends UnitFactory{
    constructor($option={}){
        super($option);
        this._timer = $option.timer || new Timer();
    }

    createCrawlAIUnit($renderObj, $position, $aiOption={}, $contrOption={}, $unitOption={}){
        // renderobj
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });

        // contr
        Object.assign($contrOption, {
            world: this._world
        });
        let controllerx = new CrawlController($contrOption);
        
        // ai
        Object.assign($aiOption, {
            crawlController : controllerx,
            timer: this._timer
        });
        let ai = new CrawlAI($aiOption);
        
        // unit
        Object.assign($unitOption, {
            renderObject: $renderObj,
            position : $position,
            game:this._game,
            AI: ai
        });
        let unit = new AIUnit($unitOption);
        controllerx.bindObj = unit;
        return unit;
    }

    createCrawlAIUnitWithBody($renderObj, $position, $aiOption={}, $contrOption={}, $unitOption={}, 
        $bodyOption={
            border: 5,
            position: new Vector2d(0, 0),
            force : new Vector2d(0, 100)
        }, $staticOption={
            width : 100,
            height : 100
        }){
        // renderobj
        $renderObj.addRenderFrame(($ctx, $tick, $zone)=>{
            $renderObj.defaultRender($ctx, $tick, $zone);
        });

        // contr
        Object.assign($contrOption, {
            world: this._world
        });
        let controllerx = new CrawlController($contrOption);
        
        // ai
        Object.assign($aiOption, {
            crawlController : controllerx,
            timer: this._timer
        });
        let ai = new CrawlAI($aiOption);
        
        // body
        $bodyOption.enableStaticBounce = false;
        let point = new Point($bodyOption);
        point.setOnStaticHit(()=>{});
        this._world.addBody(point);
        
        // static
        let staticsqrt = new StaticSquare($staticOption);
        staticsqrt.render = ()=>{};
        this._world.addBody(staticsqrt);

        // unit
        Object.assign($unitOption, {
            renderObject: $renderObj,
            position : $position,
            game:this._game,
            AI: ai,
            point: point,
            static : staticsqrt
        });
        
        let unit = new AIUnit($unitOption);
        controllerx.bindObj = unit;
        return unit;
    }

    createEdibleCrawlAIUnit($renderObj, $position, $aiOption={}, $eatFunc=()=>{}, $contrOption={}, 
        $unitOption={},
        $bodyOption={
            border: 5,
            position: new Vector2d(0, 0),
            force : new Vector2d(0, 100)
    }){
        // ai
        Object.assign($aiOption, {
            escape: true
        });
        // unit
        let unit = this.createCrawlAIUnitWithBody(
            $renderObj,
            $position, $aiOption, $contrOption, 
            $unitOption,
            $bodyOption,
            {
                width : 25,
                height: 25
            });
        unit.point.render=()=>{
            
        }
        unit.ai.controller.handler.render=()=>{
            
        }
        unit.ai.setOnNear(()=>{
            unit.ai.defaultOnNear();
            $eatFunc();
            unit.kill();
        });
        return unit;
    }
    
    createHostileCrawlAIUnit($position, $aiOption={}, $hurtFunc=()=>{}, 
        $hurt = 10,
        $size = 70,
        $unitOption={},
        $bodyOption){
        // renderObj
        let tree = new Tree({
            size: $size,
            treeHeight:0, 
            minLength:7,
            color: "#F00"
        });
       
        // ai
        Object.assign($aiOption, {
            escape: false,
            catchDistance: 100,
            speed : 15
        });

        // unit
        let unit = this.createCrawlAIUnitWithBody(tree, $position, $aiOption, {}, 
            $unitOption,
            $bodyOption,
            {
                width : 25,
                height: 25
            });
        unit.ai.setOnNear(()=>{
            unit.ai.defaultOnNear();
            $hurtFunc();
        });
        
        let fac2 = new ShootPointFactory({
            game: this._game,
            world: this._world,
            timer: this._timer
        });

        let eee = true;
        unit.static.setOnHit(($point)=>{
            if($point != unit.point){
                if(eee){
                    unit.renderObject.size -= $hurt;
                    unit.ai.speed -= 10;
                    if(unit.renderObject.size < $size / 2){
                        unit.kill();
                    }
                    this._world.addBody(fac2.createSpotPoints(unit.position.clone(), 4, [
                        '#F00', '#F00', '#F00'
                    ]));
                    this._world.addBody(fac2.createSpotPoints(unit.position.clone(), 4, [
                        '#F00', '#F00', '#F00'
                    ]));
                    this._world.addBody(fac2.createSpotPoints(unit.position.clone(), 4, [
                        '#F00', '#F00', '#F00'
                    ]));
                    eee = false;
                    this._timer.callLater(()=>{
                        eee = true;
                    }, 40)
                }
            }
        });

        // renderobj
        let contr = unit.ai.controller;
        tree.addRenderFrame(($ctx, $tick)=>{
            tree.force = contr.velocityX / 5;
            tree.intersectionAngle = (Math.PI / 2) - Math.min(
                contr.velocityY, 200) / 1200;
            tree.drawTree($tick);
        });
        return unit;
    }
}
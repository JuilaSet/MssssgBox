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

    createEdibleCrawlAIUnit($renderObj, $position, $aimUnit, $eatFunc=()=>{}){
        // unit
        let unit = this.createCrawlAIUnitWithBody(
            $renderObj,
            $position, {
                aimUnit: $aimUnit,
                escape: true
            }, 
            {}, 
            {},
            {},
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
    
    createHostileCrawlAIUnit($position, $aimUnit, $size = 70, $hurtFunc=()=>{},
                             $color='#F00'){
        // renderObj
        let tree = new Tree({
            size: $size + 25,
            treeHeight:0, 
            minLength:7,
            color: $color
        });

        // unit
        let unit = this.createCrawlAIUnitWithBody(tree, $position, {
            escape: false,
            catchDistance: 100,
            speed : 15,
            aimUnit: $aimUnit
        },  {}, 
            {},
            {},
            // 碰撞体积
            {
                width : 25,
                height: 25
            });
        unit.ai.setOnNear(()=>{
            unit.ai.defaultOnNear();
            $hurtFunc();
        });
        unit.hitpoint = $size / 2;
        // 设置自己被子弹撞击的事件
        let sf = new ShootPointFactory({
            world : this._world,
            timer : this._timer
        });
        unit.setHeal(($heal)=>{
            unit.hitpoint += $heal;
            unit.renderObject.size = unit.hitpoint + 25;
            unit.ai.speed += 5;
        });
        unit.setHurt(($hurt)=>{
            unit.hitpoint -= $hurt;
            unit.renderObject.size = unit.hitpoint + 25;
            unit.ai.speed -= 5;
            this._world.addBody(sf.createSpotPoints(unit.position.clone(), 3, [
                $color, $color, $color
            ]));
            this._world.addBody(sf.createSpotPoints(unit.position.clone(), 4, [
                $color, $color, $color
            ]));
            this._world.addBody(sf.createSpotPoints(unit.position.clone(), 5, [
                $color, $color, $color
            ]));
        });
        unit.static.setOnHit(($point)=>{
            if($point != unit.point){
                if(!($point instanceof HurtPoint)){
                    console.warn('point必须是hurtPoint对象');
                }else{
                    if($point.user != unit){
                        $point.hurtMethod(unit);    // 调用子弹撞到自己的方法
                        if(unit.hitpoint < 0){
                            unit.kill();
                        }
                    }
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
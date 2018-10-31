class BuildingFactory{
    constructor($option={}){
        this._game = $option.game || console.error('没有指定游戏对象');
        this._world = $option.world || console.error('无法在空虚中创建物体');
    }

    // 根据给定字符串创建一个普通的建筑
    createBasicBuilding( $model="111,111,111", 
                         $hitpoint=2, $w=10, $h=20, $position, 
                         $minStructPercent=0 ){ // 小于多少时会被删除 
        let model = $model.split(',');
        let sqrts = [];
        let size = 0;
        for(let i = 0; i < model.length; i++){
            let line = model[i];
            for(let x = 0; x < line.length; x++){
                if(line.charAt(x) != 0){
                    sqrts.push(new Bricks({
                        position : new Vector2d($w * x, $h * i),
                        width: $w,
                        height: $h,
                        hitpoint : $hitpoint
                    }));
                    size++;
                }
            }
        };

        // group
        let staticGrp = new StaticSquareGroup({
            sqrts: sqrts
        });
        this._world.addBody(staticGrp);
        
        // Building
        let building = new Building({
            staticGroup: staticGrp,
            position: $position
        });
        
        staticGrp.setOnHit(($point, $which, $staticSqr)=>{
            if(staticGrp.size <= $minStructPercent/100 * size){
                staticGrp.kill();
                building.kill();
            }
        })

        // sqrt
        sqrts.forEach(sqrt => {
            sqrt.setOnHit(($point, $which, $isInside)=>{
                if($point instanceof HurtPoint && $point.team != building.team){
                    sqrt.hitpoint--;
                    if(sqrt.hitpoint <= 0){
                        sqrt.kill();
                    }
                    staticGrp.calcOutlineZone();
                }
            });
        });

        return building;
    }
}
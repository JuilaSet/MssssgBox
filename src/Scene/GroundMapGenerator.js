class GroundMapGenerator extends MapGenerator{
    constructor($option={}){
        super($option);
        this._map = new GroundMap();
        this._segnum = $option.segnum || 100;
        this._beginHeight = $option.beginHeight || 400;
    }

    generateSegs(){
        let segnum = this._segnum, segs = [];
        let dh = 0;
        for(let x = 0; x <= segnum; x++){
            segs[x] = new GroundSegment({
                origionPosition:new Vector2d(
                    (this.width / segnum) * x, this._beginHeight
                )
            });
        }
        return segs;
    }

    // 生成地图
    generateMap($segs){
        super.generateMap();
        this._map.ground = new Ground({
            groundChain: $segs
        });
        return this._map;
    }

    // 生成峡谷地形($range: 山最高高度)
    adjustSegsToValley($segs, $range=100, $periodicity=10){
        let segnum = this._segnum, last = this._beginHeight;
        let dh = 0;
        for(let x = 0; x <= segnum; x++){
            dh = Math.tan(x * Math.random() / $periodicity + Math.random() * 10);
            if(Math.abs(this._beginHeight - (last + dh)) >= $range){
                dh = 0;
            }
            last = last + dh;
            $segs[x].origionPosition.x = (this.width / segnum) * x;
            $segs[x].origionPosition.y += last - this._beginHeight;
        }
        return $segs;
    }

    // 生成波浪地形
    adjustSegsToWave($segs, $range=50, $periodicity=10){
        let segnum = this._segnum;
        let dh = 0;
        let px = Math.PI / 3 * Math.random();
        for(let x = 0; x <= segnum; x++){
            dh = $range * Math.sin(x / $periodicity * Math.PI / 2 + px);
            $segs[x].origionPosition.x = (this.width / segnum) * x;
            $segs[x].origionPosition.y += dh;
        }
        return $segs;
    }

    // 生成带尖刺的地图
    adjustSegsToSpine($segs, $rate=50, $range=50){
        let segnum = this._segnum;
        let dh = 0;
        for(let x = 0; x <= segnum; x++){
            dh = Math.random()*100 < $rate?Math.random() * $range:0;
            $segs[x].origionPosition.x = (this.width / segnum) * x;
            $segs[x].origionPosition.y += dh;
        }
        return $segs;
    }
    
    // 剪切地图地图
    adjustSegsToCutRange($segs, $maxH=100, $maxD=100){
        let segnum = this._segnum;
        for(let x = 0; x <= segnum; x++){
            $segs[x].origionPosition.x = (this.width / segnum) * x;
            let p = $segs[x].origionPosition;
            if(p.y <= this._beginHeight - $maxH)p.y = this._beginHeight - $maxH;
            if(p.y >= $maxD + this._beginHeight)p.y = $maxD + this._beginHeight;
        }
        return $segs;
    }

    // 根据函数生成地图
    adjustSegsToGivenFunc($segs, $func){
        let segnum = this._segnum;
        for(let x = 0; x <= segnum; x++){
            $segs[x].origionPosition.x = (this.width / segnum) * x;
            $segs[x].origionPosition.y += $func(x);
        }
        return $segs;
    }
}
class GroundMap extends Map{
    constructor($option={}){
        super($option);
        this._ground = $option.ground || new Ground();
    }
    
    set ground($ground){
        this._ground = $ground;
    }

    get ground(){
        return this._ground;
    }
}
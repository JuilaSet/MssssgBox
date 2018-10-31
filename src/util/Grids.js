/*
 * 栅格化工具 +
 */
class GridNet{
    constructor($option={}){
        this.position = $option.position || new Vector2d(0, 0);
        this._hn = $option.hn || 10;
        this._wn = $option.wn || 10;
        this._h = $option.h || 10;
        this._w = $option.w || 10;
        this._grids = {};   // index -> grid, index = j * wn + i 栅格化的位置区域
    }

    render($ctx){
        this.drawGridNet($ctx);
    }

    drawGridNet($ctx, $color){
        let w = this._w, h = this._h;
        let wn = this._wn, hn = this._hn;
        let p = this.position;
        // 
        $ctx.strokeStyle = $color || '#FFF';
        // 
        for(let i = 0; i < wn; i++){
            for(let j = 0; j < hn; j++){
                $ctx.strokeRect(p.x + w * i, p.y + h * j, w, h);
            }   
        }
    }

    // 检测位置是否合法
    check($gridori, $j){
        if(arguments.length == 1){
            let i = $grid.i;
            let j = $grid.j;
            if (i >= 0 && i < this._wn && j >= 0 && j < this._hn) {
                return true;
            } else {
                return false;
            }
        }else{
            if ($gridori >= 0 && $gridori < this._wn && $j >= 0 && $j < this._hn) {
                return true;
            } else {
                return false;
            }
        }
    }

    // 计算栅格化后的合法位置
    getRasterize($p){
        let p = this.position;
        let res = {
            i : Math.floor(($p.x - p.x) / this._w),
            j : Math.floor(($p.y - p.y) / this._h)
        };
        if(res.i >= 0 && res.i < this._wn && res.j >= 0 && res.j < this._hn){
            return res;
        }
    } 

    // 获取一个位置周围的位置
    getRasterizeAround($i, $j){
        let left = [-1, 0], right = [1, 0], up = [0, -1], down = [0, 1];
        let leftUp = [-1, -1], leftDown = [-1, 1], rightUp = [1, -1], rightDown = [1, 1];
        let arounds = [left, right, up, down, leftUp, leftDown, rightUp, rightDown];
        function move(dir, i, j){
            return [dir[0] + i, dir[1] + j];
        }
        let _this = this;
        function check(i, j){
            if(i >= 0 && i < _this._wn && j >= 0 && j < _this._hn){
                return true;
            }else{
                return false;
            }
        }
        let res = [];
        arounds.forEach(dir=>{
            let p = move(dir, $i, $j);
            if(check(p[0], p[1])){
                res.push({
                    i : p[0],
                    j : p[1]
                });
            }
        });
        return res;
    }

    // 获取i列j行的grid对象
    getGrid($i, $j){
        let index = $j * this._wn + $i;
        if(this._grids[index]){
            return this._grids[index];
        }else{
            let p = this.position;
            let zone = new Zone({ // 获得相对于屏幕的zone
                position : new Vector2d(p.x + $i * this._w, p.y + $j * this._h),
                width : this._w,
                height : this._h
            });
            let grid = new Grid({
                i : $i,
                j : $j,
                rank : index,
                zone : zone
            });
            this._grids[index] = grid;
            return grid;
        }
    }

    // 清空存放的Grid对象
    clearAllGrid(){
        this._grids = [];
    }
}

// 网格单元
class Grid{
    constructor($option={}){
        this.i = $option.i || 0;
        this.j = $option.j || 0;
        this.rank = $option.rank || 0;  // 从左至右，从上到下的序号, -> index
        this.zone = $option.zone || new Zone({
            position : new Vector2d(0, 0),
            width : 10,
            height : 10
        });
    }

    render($ctx, $color){
        this.drawFilledRect($ctx, $color);
    }

    drawFilledRect($ctx, $color){
        this.zone.drawFilledRect($ctx, $color);
    }
}
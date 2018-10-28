/*
 * 建筑，与Unit的区别在于含有StaticGroup用来检测碰撞
 */

class Building{
    constructor($option={}){
        this._position = $option.position || new Vector2d(0, 0);
        this._timer = $option.timer || new Timer();
        this.team = $option.team || 0; // 团队过滤

        // 自我描述属性
        this._living = true;

        // 物理对象
        this._staticGroup = $option.staticGroup || console.error('没有静态碰撞体积的建筑');
        this._staticGroup.moveTo(this._position);
    }

    set position($p){
        this._position = $p;
        this._staticGroup.moveTo(this._position);
    }

    get position(){
        return this._position;
    }

    get size(){
        return this._staticGroup.size;
    }

    // 生成单位的区域
    get genZone(){
        return this._staticGroup._outLineZone;
    }

    get living(){
        return this._living;
    }

    // 随机获得自己外边框的一个点
    randomPosition(){
        return this._staticGroup._outLineZone.getRandomPosition();
    }

    setOnKill($func){
        this.onKill = $func;
    }

    onKill(){
        
    }

    kill(){
        this._living = false;
        this._staticGroup.kill();
        this.onKill();
    }

    render($ctx, $tick){

    }

    update(){
        // this._staticGroup.moveTo(this._position);
    }
}
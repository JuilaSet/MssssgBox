
class Unit{
    constructor($option={}){
        this._game = $option.game || console.error('未指定游戏对象');
        this._renderObj = $option.renderObject || new RenderObject();   // Unit位置与渲染的位置相同
        this._renderObj.position = $option.position || this._renderObj.position;

        this._point = $option.point;    // 物理对象
        this._static = $option.static;
        
        // 自我描述属性
        this.hitpoint = $option.hitpoint || 100; // 生命值
        this._living = true;
        this._position = $option.position || this._renderObj.position;
        if(this._point){
            this._point.position = $option.position || this._renderObj.position;
        }
        if(this._static){
            this._static.position = new Vector2d(0, 0);
        }
    }
    
    get static(){
        return this._static;
    }

    get point(){
        return this._point;
    }

    get living(){
        return this._living;
    }

    get controller(){
        return this._controller;
    }

    set position($p){
        this._renderObj.position = $p;  // []][
    }

    get position(){
        return this._renderObj.position;  // []][
    }

    get renderObject(){
        return this._renderObj;
    }

    set renderObject($obj){
        $obj.position = this._renderObj.position;
        this._renderObj = $obj;
    }

    setOnKill($func){
        this.onKill = $func;
    }

    onKill(){
        
    }

    kill(){
        this._living = false;
        this._point.kill();
        this._static.kill();
        this.onKill();
    }

    setHeal($func){
        this.heal = $func;
    }

    heal($healPoint){
        
    }

    setHurt($func){
        this.hurt = $func;
    }

    hurt($hurtPoint){

    }

    onRender($ctx, $tick){
        this.defaultOnRender($ctx, $tick);
    }

    setOnRender($func){
        this.onRender = $func;
    }

    defaultOnRender($ctx, $tick){
        this._renderObj.render($ctx, $tick);
    }

    render($ctx, $tick){
        if(this._living){
            this.onRender($ctx, $tick);
        }
    }

    onUpdate(){

    }

    setOnUpdate($func){
        this.onUpdate = $func;
    }

    defaultOnUpdate(){

    }

    synStatic(){
        if(this._static){
            let p = this._renderObj.position;
            let sp = this._static.position;
            let z = this._static.zone;
            sp.x = p.x - z.width / 2;
            sp.y = p.y - z.height / 2;
        }
    }

    update(){
        if(this._living){
            this.synStatic();
            this.onUpdate();
        }
    }
}
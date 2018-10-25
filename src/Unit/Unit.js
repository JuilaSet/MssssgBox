
class Unit{
    constructor($option={}){
        this._game = $option.game || console.error('未指定游戏对象');
        this._renderObj = $option.renderObject || new RenderObject();   // Unit位置与渲染的位置相同
        this._renderObj.position = $option.position || this._renderObj.position;

        this._point = $option.point;    // 物理对象
        this._staticGroup = $option.staticGroup;
        
        // 自我描述属性
        this._living = true;
    }

    get living(){
        return this._living;
    }

    kill(){
        this._living = false;
    }

    get controller(){
        return this._controller;
    }

    set position($p){
        this._renderObj.position = $p;
    }

    get position(){
        return this._renderObj.position;
    }

    get renderObject(){
        return this._renderObj;
    }

    set renderObject($obj){
        $obj.position = this._renderObj.position;
        this._renderObj = $obj;
    }

    setHurt($func){
        this.hurt = $func;
    }

    hurt(){

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
        this.defaultOnUpdate();
    }

    setOnUpdate($func){
        this.onUpdate = $func;
    }

    defaultOnUpdate(){
        
    }

    update(){
        if(this._living){
            this.onUpdate();
        }
    }
}
class RenderObject{
    constructor($option={}){
        this.buffer = document.createElement('canvas');
        this.context = this.buffer.getContext('2d');
        // 显示层区域
        this._disZone = $option.zone || new Zone({
            position: new Vector2d(0, 0),
            width: 300,
            height: 300
        });
        this.buffer.width = this._disZone.width;
        this.buffer.height = this._disZone.height;
        this.timer = $option.timer || new Timer();

        // 设置默认项
        this.context.strokeStyle = $option.defaultStrokeStyle || '#FFF';
        this.context.fillStyle = $option.defaultFillStyle || '#FFF';
        this.context.lineWidth = $option.defaultLineWidth || 1;
        // 渲染列表
        this._renderList = [];
    }

    get displayZone(){
        return this._disZone;
    }

    get zone(){
        return this._disZone;
    }

    set zone($zone){
        this._disZone = $zone;
    }

    set position($vec){
        this._disZone.position = $vec;
    }

    get position(){
        return this._disZone.position;
    }

    set ctx($ctx){
        this.context = $ctx;
    }

    get ctx(){
        return this.context;
    }

    get width(){
        return this._disZone.width;
    }

    get height(){
        return this._disZone.height;
    }

    render($ctx, $tick){
        $ctx.drawImage(this.buffer,
            this._disZone.position.x - this._disZone.width / 2, 
            this._disZone.position.y - this._disZone.height / 2);
        this.clearBuffer();
        this._renderList.forEach(rndFunc => {
            this.context.save();
            rndFunc(this.context, $tick, this._disZone);
            this.context.restore();
        });
    }

    // @enableOverride
    defaultRender($ctx, $tick, $zone){
        this.timer.update();
    }

    clearBuffer(){
        this.context.clearRect(0, 0, this._disZone.width, this._disZone.height)
    }

    addRenderFrame($func){  // (this._context, $tick, this._disZone)
        this._renderList.push($func);
        return $func;
    }

    clearRenderFrame($func){
        let i = this._renderList.indexOf($func);
        this._renderList.splice(i, 1);
    }

    drawFrame(){
        let ctx = this.context;
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this._disZone.width, this._disZone.height);
    }
}
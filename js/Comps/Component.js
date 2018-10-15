class Component{
    constructor($option){
        this.position = $option.position || {x:0, y:0};
        this.width = $option.width || 100;
        this.height = $option.height || 100;
        this.iotrigger = $option.iotrigger || console.error("你需要指定一个iotrigger对象");

        this.id = $option.id || console.error("你需要给予一个唯一的id");
        this.layer = $option.layer || console.error("你需要给予一个唯一的layer表示该组件的层次级别");
        ///

        this.zone = $option.zone || new Zone({
            height: this.height,
            width: this.width,
            position:this.position
        });
    }
    
    setDblClick($func){
        this.iotrigger.setDblClick(this, $func);
    }

    setMouseDown($func){
        this.iotrigger.setMouseDown(this, $func);
    }

    setMouseMove($func){
        this.iotrigger.setMouseMove(this, $func);
    }

    setMouseStretch($func){
        this.iotrigger.setMouseStretch(this, $func);
    }

    setMouseUp($func){
        this.iotrigger.setMouseUp(this, $func);
    }
}
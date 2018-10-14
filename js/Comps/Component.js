class Component{
    constructor($option){
        this.position = $option.position || {x:0, y:0};
        this.width = $option.width || 100;
        this.height = $option.height || 100;

        this.id = $option.id || console.error("你需要给予一个唯一的id");
        ///

        this.zone = $option.zone || new Zone({
            height: this.height,
            width: this.width,
            position:this.position
        });

        this.speedX;
        this.speedY;
    }

    ///
}
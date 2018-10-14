class Zone{
    constructor($option){
        this.position = $option.position || console.error("没有定义区域位置");
        this.width = $option.width;
        this.height = $option.height;
    }

    check($position){
        let p = this.position;
        if( $position.x > p.x && 
            $position.y > p.y && 
            $position.x < this.width + p.x && 
            $position.y < this.height + p.y ){
                return true;
            }
            else{
                return false;
            }
    }
}
class Zone{
    constructor($option){
        this.position = $option.position || new Vector2d(0, 0);
        this.width = $option.width || 0;
        this.height = $option.height || 0;
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
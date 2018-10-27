class HurtPoint extends Point{
    constructor($option){
        super($option);
        this.hurt = $option.hurt || 0;  // 伤害
        this.user = $option.user;   // 伤害过滤
    }

    // @OverrideEnabled 设置击中单位时这个单位受到的效果
    hurtMethod($hitUnit){
        return true;
    }

    setHurtMethod($func){
        this.hurtMethod = $func;
    }
}
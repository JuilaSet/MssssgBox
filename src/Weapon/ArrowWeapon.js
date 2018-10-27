class ArrowWeapon extends Weapon{
    constructor($option={}){
        super($option);
    }
    
    set user($user){
        this._enableShoot = true;
        this._user = $user;
    }

    // @Override
    shoot(){
        if(this._enableShoot && this.ammo > 0){
            let sbf = this._shootPointFactory;
            let eee = true;
            let sb = sbf.createArrowHurtPoint(
                this.team,
                this._user.position.clone(),
                new Vector2d(this._user.controller.speed.x * 2, this._user.controller.speed.y * 0.2),
                this.power,
                this._user,
                ($unit)=>{
                    if(eee){
                        if($unit.team != sb.team){
                            $unit.hurt(this.hurt);  // 调用撞到单位的方法
                            eee = false;
                            this._timer.callLater(()=>{
                                eee = true;
                            }, 20);
                        }
                    }
                },
                this.color
            );
            sb.setOnKilled(this.onDestory);
            this._world.addBody(sb);

            // 限制射击
            this._enableShoot = false;
            this.ammo--;
            this._timer.callLater(()=>{
                this._enableShoot = true;
            }, this.fireRate);
        }
    }
}
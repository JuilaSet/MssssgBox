class FireBallWeapon extends Weapon{
    constructor($option={}){
        super($option);
        this._colors = $option.colors || ["#EEE", "#CCC", "#E8C"];
    }

    // @Override
    shoot(){
        if(this._enableShoot && this.ammo > 0){
            let fbf = this._shootPointFactory;
            let eee = true;
            let fb = fbf.createFireBallPoint(
                this.team,
                ($unit)=>{
                    if(eee){
                        if($unit.team != fb.team){
                            $unit.hurt(this.hurt);  // 调用撞到单位的方法
                            eee = false;
                            this._timer.callLater(()=>{
                                eee = true;
                            }, 40);
                        }
                    }
                },
                this._user.position.clone(),
                new Vector2d(   this._user.controller.speed.x * 2, 
                                this._user.controller.speed.y * 2),
                this._user,
                this.power,
                {
                    size : this.power * 3 / 2
                },
                this._colors
            )
            fb.setOnKilled(this.onDestory);
            this._world.addBody(fb);
            // 限制射击
            this._enableShoot = false;
            this.ammo--;
            this._timer.callLater(()=>{
                this._enableShoot = true;
            }, this.fireRate);
        }
    }
}
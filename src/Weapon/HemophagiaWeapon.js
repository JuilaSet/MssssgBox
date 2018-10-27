class HemophagiaWeapon extends Weapon{
    constructor($option={}){
        super($option);
        this._swap = true;
        this._maxLife = this._user.hitpoint + this.power / 2;
        this._bullet;
        this._hemo = $option.hemo || false; // 是否吸血
    }

    set user($user){
        this._enableShoot = true;
        this._swap = true;
        this._maxLife = this._user.hitpoint + this.power / 2;
        this._user = $user;
    }

    kill(){
        if(this._bullet){
            this._bullet.kill();
        }
    }

    // @Override
    shoot(){
        // 全局只有一个子弹
        if(this._swap){
            let eee = true;
            let sf = this._shootPointFactory;
            this._bullet = sf.createBasicHurtPoint(
                this.team,
                this._user.position,     // 绑定位置
                this.power,
                this._user,
                ($unit)=>{
                    if(eee){
                        if($unit.team != this._bullet.team){
                            $unit.hurt(this.hurt);  // 调用撞到单位的方法
                            if(this._hemo){
                                if(this._maxLife > this._user.hitpoint){
                                    this._user.heal(this.hurt);
                                }else{
                                    this._user.hurt(this.hurt);
                                }
                            }
                            eee = false;
                            this._timer.callLater(()=>{
                                eee = true;
                            }, this.fireRate);
                        }
                    }
                },
                this.color
            );
            this._bullet.setOnKilled(this.onDestory);
            this._world.addBody(this._bullet);
        }else{
            this._bullet.kill();
        }
        this._swap = !this._swap;
    }
}
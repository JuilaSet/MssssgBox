class Weapon{
    constructor($option){
        this._user = $option.user || console.error('没有指明使用者');
        if(!this._user.controller){
            console.error('使用者必须为可控制对象');
        }

        this.hurt = $option.hurt || 10; // 伤害
        this.fireRate = $option.fireRate || 50; // 射速
        this.power = $option.power || 5; // 武器威力 
        this.onDestory = $option.onDestory || (()=>{});// 子弹消失时回调
        this.ammo = $option.ammo || 10;   // 弹药量
        this.color = $option.color || "#FFF";
        this.team = $option.team || 0; // 团队过滤器
        
        // private
        this._game = $option.game || console.error('没有指定游戏对象');
        this._timer = $option.timer || console.error('需要指定时间对象');
        this._world = $option.world || console.error('无法在空虚中创建武器');
        this._shootPointFactory = new ShootPointFactory({
            world : this._world,
            timer : this._timer
        });
        this._enableShoot = true;
    }

    set user($user){
        this._enableShoot = true;
        this._user = $user;
    }
    
    get shootPointFactory(){
        return this._shootPointFactory;
    }

    // @统一接口
    shoot($onDestroy=()=>{}){   // 子弹消失时回调

    }
}
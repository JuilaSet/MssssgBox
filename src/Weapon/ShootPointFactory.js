class ShootPointFactory{    // 会给point添加伤害属性
    constructor($option={}){
        this._world = $option.world || console.error('无法在空虚中创建物体');
        this.timer = $option.timer || new Timer();
    }

    createBasicHurtPoint($team, $position, $size, $shooter, $hurtMethod, $color="#FFF"){
        let point = new HurtPoint({
            team : $team,
            position : $position,
            border : $size,
            enableStrictBounce : false,
            force :new Vector2d(0, 0),
            livingZone : this._world.strict,
            user : $shooter || console.warn('没有指定射击者')
        });

        point.render=($context)=>{//[]][
            let p = point.position;
            $context.save();
            $context.strokeStyle = $color;
            $context.beginPath();
            $context.moveTo(p.x - 8, p.y);
            $context.lineTo(p.x + 8, p.y);
            $context.stroke();
            $context.moveTo(p.x, p.y - 8);
            $context.lineTo(p.x, p.y + 8);
            $context.stroke();
            $context.moveTo(p.x - 8, p.y - 8);
            $context.lineTo(p.x + 8, p.y + 8);
            $context.stroke();
            $context.moveTo(p.x + 8, p.y - 8);
            $context.lineTo(p.x - 8, p.y + 8);
            $context.stroke();
            $context.restore();
        }
    
        point.setHurtMethod($hurtMethod);
        point.setOnStaticHit(()=>{});
        point.setOnGroundHit(()=>{});
        return point;
    }

    createArrowHurtPoint($team, $position, $dir, $size, $shooter, $hurtMethod, $color="#FFF"){
        let point = new HurtPoint({
            team : $team,
            position : $position,
            linearVelocity : new Vector2d(0, 0),
            border : $size,
            enableStrictBounce : false,
            force : $dir,
            livingZone : this._world.strict,
            user : $shooter || console.warn('没有指定射击者')
        });


        point.render=($context)=>{//[]][
            let p = point.position;
            let v = point.linearVelocity.clone().normalize();
            $context.save();
            $context.strokeStyle = $color;
            $context.beginPath();
            $context.moveTo(p.x, p.y);
            $context.lineTo(p.x + v.x * ($size + 10), p.y + v.y * ($size + 10));
            $context.stroke();
            $context.restore();
        }
    
        point.setHurtMethod($hurtMethod);
        point.setOnStaticHit(($which, $static)=>{});
        point.setOnGroundHit(($ground)=>{
            point.kill();
        });
        return point;
    }

    createSpotPoints($position, $size=10, $colors = ["#EEC", "#CCC", "#E8C"]){
        let s = 500, grav = 600;
        let p1 = new Point({
            position : $position,
            force : new Vector2d(0, grav),
            linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
            enableStrictBounce : false,
            enableStaticBounce : false,
            enableGroundBounce : false,
            border : $size
        });
        // @override --[]][
        p1.render=($context)=>{
            $context.beginPath();
            if(p1.border < 3){
                $context.fillStyle = $colors[2];
            }else if(p1.border < 6){
                $context.fillStyle = $colors[1];
            }else{
                $context.fillStyle = $colors[0];
            }
            $context.arc(p1.position.x, p1.position.y, p1.border, 0, 2 * Math.PI, false);
            $context.fill();
        }
        p1.onmove = ()=>{
            p1.border-= 0.1;
            if(p1.border < 0.1){
                p1.kill();
            }
        };
        return p1;
    }

    // 返回hurtPoint对象
    createFireBallPoint(
        $team, 
        $hurtMethod, 
        $position, 
        $dir, 
        $shooter, 
        $spotNum=5, 
        $renderOption={}, 
        $colors = ["#EEE", "#CCC", "#E8C"]){
        let hover = true;
        let s = 40, bsize = $renderOption.size || 10;
        // body
        let point = new HurtPoint({
            team : $team,
            position : $position,
            linearVelocity : $dir,
            border : bsize,
            enableStrictBounce : false,
            force :new Vector2d(0, 100),
            livingZone : this._world.strict,
            user : $shooter || console.warn('没有指定射击者')
        });
        point.setHurtMethod($hurtMethod);
        function genP(){
            let p = new HurtPoint({
                team : $team,
                position : point.position.clone(),
                linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
                border : bsize,
                enableStrictBounce : false,
                user : $shooter
            });
            p.setHurtMethod($hurtMethod);
            // @override --[]][
            p.render=($context)=>{
                $context.beginPath();
                if(p.border < 3){
                    $context.fillStyle = $colors[2];
                }else if(p.border < 6){
                    $context.strokeStyle = $colors[1];
                }else{
                    $context.fillStyle = $colors[0];
                }
                $context.arc(p.position.x, p.position.y, p.border, 0, 2 * Math.PI, false);
                $context.fill();
            }
            p.setOnStop(()=>{
                p.kill();
            });
            p.onmove = ()=>{
                p.border-= 0.8;
                if(p.border < 0.8){
                    p.kill();
                }
            };
            p.setOnStaticHit(($which, $static)=>{
                if($static != $shooter.static){
                    point.staticBounce($which, $static);
                    point.setPointToStaticSquare($static);
                }
            });
            return p;
        }
        function genSpot($b){
            let s = 500, grav = 300;
            let p1 = new HurtPoint({
                team : $team,
                border: $b,
                position : point.position.clone(),
                force : new Vector2d(0, grav),
                linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
                enableStrictBounce : false,
                border : bsize,
                user : $shooter
            });
            p1.setHurtMethod($hurtMethod);
            // @override --[]][
            p1.render=($context)=>{
                team : $team,
                $context.beginPath();
                if(p1.border < 3){
                    $context.fillStyle = $colors[2];
                }else if(p1.border < 6){
                    $context.fillStyle = $colors[1];
                }else{
                    $context.fillStyle = $colors[0];
                }
                $context.arc(p1.position.x, p1.position.y, p1.border, 0, 2 * Math.PI, false);
                $context.fill();
            }
            p1.onmove = ()=>{
                p1.border-= 0.1;
                if(p1.border < 0.1){
                    p1.kill();
                }
            };
            p1.setOnStaticHit(()=>{});
            return p1;
        }
        // @override --[]][
        point.render=($context)=>{
            $context.beginPath();
            $context.fillStyle = $colors[0];
            $context.arc(point.position.x, point.position.y, point.border, 0, 2 * Math.PI, false);
            $context.fill();
        }
        point.setOnGroundHit(($ground)=>{
            point.downBounce($ground);
            if(hover){
                for(var i = 0; i < $spotNum; i++){
                    this._world.addBody(genSpot());
                }
                bsize -= 2;
                point.kill();
                hover = false;
            }
        });
        point.setOnStaticHit(($which, $static)=>{
            if($static != $shooter.static){
                point.staticBounce($which, $static);
                point.setPointToStaticSquare($static);
                for(var i = 0; i < $spotNum; i++){
                    this._world.addBody(genSpot());
                }
                bsize -= 2;
                point.kill();
            }
        });
        point.setOnGroundHover(()=>{
            hover = true;
            point.setOnMove(()=>{
                this._world.addBody(genP(point.border / 2));
            });
        });
        return point;
    }
}
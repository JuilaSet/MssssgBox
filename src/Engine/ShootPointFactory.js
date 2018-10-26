class ShootPointFactory{
    constructor($option={}){
        this._game = $option.game || console.error('没有指定游戏对象');
        this._world = $option.world || console.error('无法在空虚中创建物体');
        this.timer = $option.timer || new Timer();
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

    createFireBallPoint($position, $dir, $shooter, $renderOption={}, $colors = ["#EEC", "#CCC", "#E8C"]){
        let hover = true;
        let s = 40, bsize = $renderOption.size || 10;
        // body
        let point = new Point({
            position : $position,
            linearVelocity : $dir,
            border : bsize,
            enableStrictBounce : false,
            force :new Vector2d(0, 100),
            livingZone : this._world.strict
        });
        function genP(){
            let p = new Point({
                position : point.position.clone(),
                linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
                border : bsize,
                enableStrictBounce : false
            });
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
            let p1 = new Point({
                border: $b,
                position : point.position.clone(),
                force : new Vector2d(0, grav),
                linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
                enableStrictBounce : false,
                border : bsize
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
                for(var i = 0; i < 3; i++){
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
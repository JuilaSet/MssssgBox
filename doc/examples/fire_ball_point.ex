
let s = 40, times = 0, bsize = 10;
function genP(){
    let p = new Point({
	position : point.position.clone(),
	linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
	border : bsize
    });
    p.setOnStop(()=>{
	p.kill();
    });
    p.onmove = ()=>{
	p.border-= 0.4;
	if(p.border < 0.4){
	    p.kill();
	}
    };
    return p;
}
let hover = true, tishi;
point.setOnGroundHit(($ground)=>{
    if(hover){
	let s = 500, grav = 300;
	let p1 = new Point({
	    position : point.position.clone(),
	    force : new Vector2d(0, grav),
	    linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
	    enableStrictBounce : false,
	    border : bsize
	});
	p1.onmove = ()=>{
	    p1.border-= 0.1;
	    if(p1.border < 0.1){
		p1.kill();
	    }
	};
	let p2 = new Point({
	    position : point.position.clone(),
	    force : new Vector2d(0, grav),
	    linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
	    enableStrictBounce : false,
	    border : bsize
	});
	p2.onmove = ()=>{
	    p2.border-= 0.1;
	    if(p2.border < 0.1){
		p2.kill();
	    }
	};
	let p3 = new Point({
	    position : point.position.clone(),
	    force : new Vector2d(0, grav),
	    linearVelocity : new Vector2d(Math.random() * s - s/2, Math.random() * s - s/2),
	    enableStrictBounce : false,
	    border : bsize
	});
	p3.onmove = ()=>{
	    p3.border-= 0.1;
	    if(p3.border < 0.1){
		p3.kill();
	    }
	};
	world.addBody([p1, p2, p3]);
	times++;
	bsize -= 2;
	point.border = bsize;
	if(point.border < 2){
	    point.kill();
	}
	if(times == 4){
	    point.kill();
	    return;
	}else{
	    point.downBounce($ground.argue);
	    point.setPositionToGround($ground.origionPosition, $ground.argue);
	}
	hover = false;
    }
    tishi = setTimeout(()=>{ 
	point.kill();
    }, 5000);
});

point.setOnGroundHover(()=>{
    hover = true;
    clearTimeout(tishi);
    point.setOnMove(()=>{
	world.addBody(genP());
    });
});
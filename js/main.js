window.onload = function(){
	///

	// 鼠标右键取消效果
	document.oncontextmenu = ()=>{
		return false
	};

	///
	let game = new Game();
	game.setFullScreen(true);

	///

	function before($tick){

	}

	var rn = 0;
	function after($tick){
		if($tick % 5 == 0){
			rn = (5 + 3 * Math.sin(Math.random() * 4)) * (Math.PI / 180);
		}
		game.drawTree(rn);
	}

	game.run(before, after);
	///

}
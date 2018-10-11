window.onload = function(){
	///

	
	// 鼠标右键取消效果
	document.oncontextmenu = ()=>{
		return false
	};

	///
	let game = new Game();
	game.setFullScreen(true);
	document.body.appendChild(game.getContainer());

	///

	function before(){

	}

	function after(){

	}

	///

}
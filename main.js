window.onload = function(){
	
	///

	// let canvas = document.getElementsByTagName("canvas")[0];
	// canvas.width = document.documentElement.clientWidth;
	// canvas.height = document.documentElement.clientHeight;
	// let game = new AStarTestGame();
	let game = new AdventureGame();
	// let game = new SurviveGame();
	game.run();

	// // // create the network
	// let myPerceptron = new Perceptron(2, [3], 2);

	// // train the network - learning
	// let learningRate = .3;
	// for (let i = 0; i < 40000; i++)
	// {
	// 	myPerceptron.activate([100, 100, 100]);
	// 	myPerceptron.propagate(learningRate, [1,1]);
		
	// 	myPerceptron.activate([100, 100, 0]);
	// 	myPerceptron.propagate(learningRate, [0,1]);

	// 	myPerceptron.activate([100, 0, 0]);
	// 	myPerceptron.propagate(learningRate, [1,1]);

	// 	myPerceptron.activate([0, 0, 15]);
	// 	myPerceptron.propagate(learningRate, [0,1]);
	// }

	// // test the network
	// let x1 = 100, x2 = 0, x3 = 0;
	// for(x3 = 0; x3 < 100; x3++){
	// 	console.log(`[${x1},${x2},${x3}]=>`, myPerceptron.activate([x1,x2,x3]));
	// }

	// console.log("END");
}
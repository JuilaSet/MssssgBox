const { Architect, Layer, Network, Neuron, Trainer } = window.synaptic;
class Perceptron extends Network{
    constructor(input, hiddens, output)
    {
        super();
        // 创建感知层
        var inputLayer = new Layer(input);
        var hiddenLayers = [];
        for(var i in hiddens){
            hiddenLayers[i] = new Layer(hiddens[i]);
        }
        var outputLayer = new Layer(output);

        // 连接感知层
        inputLayer.project(hiddenLayers[0]);
        for(var i = 0; i < hiddenLayers.length; i++){
            if(i == hiddenLayers.length - 1){
                hiddenLayers[i].project(outputLayer);
            }else{
                hiddenLayers[i].project(hiddenLayers[i + 1]);
            }
        }

        // 设置感知层
        this.set({
            input: inputLayer,
            hidden: hiddenLayers,
            output: outputLayer
        });
    }
}
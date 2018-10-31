/*
 * 基于系统的AI
 */
class BasedAI{
    constructor($option={}){
        this._aiSystem = $option.aiSystem || console.error('没有指明ai系统');
        
        // private
        this._aiActions = [];
    }

    action($actionName=""){
        this._aiActions[$actionName]();
    }

    addAction($actionName, $actionFunc){
        let item = {
            name: $actionName,
            action: $actionFunc
        };
        this._aiActions.push(item);
    }
}
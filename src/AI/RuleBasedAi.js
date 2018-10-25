/*
 * 基于知识的AI系统
 */
 class RuleBasedAiSystem{
    constructor($option={}){
        this._rules = [];
        this._msgStack = new Set();
    }

    get mssageStack(){
        return this._msgStack;
    }

    set mssageRules($msgStack){
        if($msgStack instanceof Array){
            this._msgStack = new Set($msgStack);
        }else{
            console.error('RuleBaseAiSystem', '规则信息必须是数组类型');
        }
    }

    get mssageRules(){
        return this._rules;
    }

    addRule($rule){
        this._rules.push($rule);
    }

    addRules($rules=[]){
        for(let r of $rules){
            this._rules.push(r);
        }
    }

    addFactMsg($factMsg){
        this._msgStack.add($factMsg);
    }

    addFactMsgs($factMsgs=[]){
        for(let r of $factMsgs){
            this._msgStack.add(r);
        }
    }

    infer(){
        this._rules.forEach(r => {
            r.active = true;
        });
        let activennum = this._rules.length;
        let hasTrged = true;
        while(activennum > 0 && hasTrged){ // 直到没有可推理项目为止
            let msg = Fact.NOTHING;
            hasTrged = false;
            // 没有规则可触发时，退出
            for(let i = 0; i < this._rules.length; i++){
                let r = this._rules[i];
                if(r.active){
                    msg = r.infer(this._msgStack);
                }
                if(msg != Fact.NOTHING){
                    // 得到新结点
                    this._msgStack.add(msg);
                    this._rules[i].active = false;   // 删除使用过的规则
                    activennum--;
                    hasTrged = true;
                }
            };
        }
        return this._msgStack;
    }
}



class Rule{
    constructor($option={}){
        if($option.result instanceof Fact){
            this._resultFact = $option.result;
        }else{
            this._resultFact = new Fact({message:$option.result});
        }
        this._lines = [];        // operator => fact
        this.active = true;

        if($option.factList instanceof Array){
            this.addFact($option.factList);
        }else{
            console.error('factList 必须是数组类型，元素之间用逻辑运算分割');
        }
    }

    get rules(){
        return this._lines;
    }

    infer($msgStack){
        let lin = this._lines;
        let res = $msgStack.has(lin[0].fact.message);
        res = (lin[0].operator == Fact.IFNOT) ? !res:res;
        for(let i = 1; i < lin.length; i++){
            switch(lin[i].operator){
                case Fact.AND:
                    res = res && $msgStack.has(lin[i].fact.message);    
                    break;
                case Fact.OR:
                    res = res || $msgStack.has(lin[i].fact.message);    
                    break;
                case Fact.ANDNOT:
                    res = res && !$msgStack.has(lin[i].fact.message);    
                    break;
                case Fact.ORNOT:
                    res = res || !$msgStack.has(lin[i].fact.message);    
                    break;
                default:
                    console.error('Rule', 'judging error');
            }
        }
        if(res){
            return this._resultFact.message;    // 返回自然语言消息
        }else{
            return Fact.NOTHING;
        }
    }

    // 添加推理规则，$operator: AND，OR
    // addFact($fact)
    addFact($arg1, $fact){
        if($arg1 instanceof Array){
            let fst = $arg1[0], begin = 0;
            if(($arg1.length - 1) % 2 != 0){
                this._lines.push({
                    operator : $arg1[0],
                    fact : new Fact({
                        message:$arg1[1]
                    })
                });
                begin = 2;
            }else{
                this._lines.push({
                    operator : Fact.IF,
                    fact : new Fact({
                        message:$arg1[0]
                    })
                });
                begin = 1;
            }
            for(let i = begin; i < $arg1.length; i += 2){
                this._lines.push({
                    operator : $arg1[i],
                    fact : new Fact({
                        message:$arg1[i + 1]
                    })
                });
            }
        }else if(arguments.length == 1){
            this._lines.push({
                operator : Fact.IF,
                fact : $arg1
            });
        }else{
            this._lines.push({
                operator : $arg1,
                fact : $fact
            });
        }
        return this;
    }

    // 设置结果
    setResutFact($fact){
        this._resultFact = $fact;
        return this;
    }
}


class Fact{
    constructor($option={}){
        this._not = false;
        this._message = $option.message || Fact.NOTHING;   // 自然语言描述事实
    }

    // 返回消息
    get message(){
        return this._message;
    }
}
Fact.IFNOT = 'if-'; // 开头
Fact.IF = 'if';     // 开头
Fact.AND = '&';
Fact.OR = '|';
Fact.ANDNOT = '&-';
Fact.ORNOT = '|-';
Fact.NOTHING = 'nothing';
||> 这是一个用于编写帮助文档的小工具。
||
||> 使用步骤：
||1. 在json目录下新建一个json文件
||
||2. json文件格式如下：
||例子:
||{
||	"title": "Click类",
||	"type": "class",
||	"methods": [
||		{
||			"name": "方法名称",
||			"disc": ""
||		}
||	],
||	"properties": [
||		{
||			"name": "属性名称",
||			"disc": ""
||		}
||	]
||}
||* "title"：后面写上要说明的对象的名称。
||* "type"：表示说明对象的类型,有["class","function","var"]，现在只支持class。
||* "methods"：方法描述，name是方法名称，disc是对它的使用说明。
||* "properties"：属性描述，name是方法名称，disc是对它的使用说明。
||
||3. 保存json后，打开config.json
||在files后的数组中添加你的json文件名称。
||例子:
||{
|| "files": [ "Game.json", "Click.json"]
||}
||
||4. 使用兼容的浏览器(IE 10+)打开doc.html
||(最新版的火狐和Chrome好像因为无法读取json文件不能用。)

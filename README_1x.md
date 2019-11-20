## 简介
Layui的树形表格treeTable，支持异步加载(懒加载)、复选框联动、折叠状态记忆。

演示地址：[https://whvse.gitee.io/treetable-lay/](https://whvse.gitee.io/treetable-lay/)


## 更新日志

- 2019-11-18 (v2.0)

    - 重构treeTable，不再基于数据表格table模块
    - 支持懒加载(异步加载)、支持数据渲染
    - 同时支持pid形式数据和children形式数据
    - 无需指定最顶级pid，自动查找
    - 支持复选框联动，支持半选状态
    - 支持折叠状态记忆
    - 支持只刷新某个节点下数据
    - 支持自定义树形图标
    - 支持设置节点勾选、获取勾选节点
    - 支持行单击、双击、单元格单击、双击事件
    - 支持单元格编辑，并且支持校验格式
    - 支持固定表头，支持ful-xxx的写法
    - 支持自定义复杂表头
    - 优化搜索功能，提供更好的搜索体验
- 2018-07-22 (v1.0)
    - 基于数据表格table模板实现树形结构
    - 实现折叠/展开功能 

<br/>

---

## 使用文档

> 以下是1.0版本使用文档

### 引入模块
下载module/treetable-lay整个文件夹，放在你的项目里面，然后使用模块加载的方式使用：
```javascript
layui.config({
    base: 'module/'
}).extend({
    treetable: 'treetable-lay/treetable'
}).use(['treetable'], function () {
    var treetable = layui.treetable;
    
});
```

### 渲染表格
```html
<table id="table1" class="layui-table" lay-filter="table1"></table>

<script>
layui.use(['treetable'], function () {
    var treetable = layui.treetable;
    
    // 渲染表格
    treetable.render({
        treeColIndex: 2,          // treetable新增参数
        treeSpid: -1,             // treetable新增参数
        treeIdName: 'd_id',       // treetable新增参数
        treePidName: 'd_pid',     // treetable新增参数
        treeDefaultClose: true,   // treetable新增参数
        treeLinkage: true,        // treetable新增参数
        elem: '#table1',
        url: 'json/data1.json',
        cols: [[
            {type: 'numbers'},
            {field: 'id', title: 'id'},
            {field: 'name', title: 'name'},
            {field: 'sex', title: 'sex'},
            {field: 'pid', title: 'pid'},
        ]]
    });
});
</script>

```

> 注意：<br>
> &emsp;&emsp;可以使用url传递数据，也可以使用data传递数据，如果使用url传递数据，参数是where字段，
> 跟layui数据表格的使用方式一致。

<br/>

**数据格式**

&emsp;总而言之就是以id、pid的形式，不是以subMenus的形式，当然id、pid这两个字段的名称可以自定义：
```json
{
  "code": 0,
  "msg": "ok",
  "data": [{
      "id": 1,
      "name": "xx",
      "sex": "male",
      "pid": -1
    },{
      "id": 2,
      "name": "xx",
      "sex": "male",
      "pid": 1
    }
  ]
}
```

### 参数说明
&emsp;layui数据表格的所有参数都可以用，除此之外treetable新增的参数有：

 参数 | 类型 | 是否必填 | 描述 |
 --- | --- | --- | ---
 treeColIndex | int | 是 | 树形图标显示在第几列
 treeSpid | object | 是 | 最上级的父级id
 treeIdName | string | 否 | id字段的名称
 treePidName | string | 否 | pid字段的名称
 treeDefaultClose | boolean | 否 | 是否默认折叠
 treeLinkage | boolean | 否 | 父级展开时是否自动展开所有子级


**treeColIndex**

树形图标（箭头和文件夹、文件的图标）显示在第几列， 索引值是cols数组的下标。

**treeSpid**

最上级的父级id，比如你可以规定pid为0或-1的是最顶级的目录。
 
**treeIdName**

treetable是以id和pid字段来渲染树形结构的，如果你的数据没有id和pid字段，你可以指定id和pid字段的名称。

**treePidName**

pid在你的数据字段中的名称。

**treeDefaultClose**

默认是全部展开的，如果需要默认全部关闭，加上treeDefaultClose:true即可。

**treeLinkage**

父级展开时是否自动展开所有子级


### 注意事项

- 不能使用分页功能，即使写了page:true，也会忽略该参数。
- 不能使用排序功能，不要开启排序功能。
- table.reload()不能实现刷新，请参考demo的刷新。
- 除了文档上写的treetable.xxx的方法之外，其他数据表格的方法都使用table.xxx。
- 建议删除和修改请求完后台之后请刷新（重新渲染）表格，最好不要使用obj.delete方式删除。

### 其他方法

**全部展开**
```javascript
treetable.expandAll('#table1');
```
 
**全部折叠**
 ```javascript
treetable.foldAll('#table1');
```

### 如何修改图标

通过css来修改图标，content是图标的unicode字符。

**修改文件夹图标：**
```css
/** 未展开 */
.treeTable-icon .layui-icon-layer:before {
    content: "\e638";
}

/** 展开 */
.treeTable-icon.open .layui-icon-layer:before {
    content: "\e638";
}
```

**修改文件图标：**
```css
.treeTable-icon .layui-icon-file:before {
    content: "\e621";
}
```

**修改箭头的图标：**
```css
/** 未展开 */
.treeTable-icon .layui-icon-triangle-d:before {
    content: "\e623";
}

/** 展开 */
.treeTable-icon.open .layui-icon-triangle-d:before {
    content: "\e625";
}
```


## 效果展示

![树形表格1](https://s2.ax1x.com/2019/11/18/McaLa8.jpg)

![树形表格2](https://s2.ax1x.com/2019/11/18/McaOIS.jpg)

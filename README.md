# treetable-lay
实现layui的树形表格treeTable

## 简介
在layui数据表格之上进行扩展实现，而非在laui的tree上进行扩展，所以可以使用数据表格的所有功能。

## 使用方法

### 引入模块
下载treetable-lay整个文件夹，放在你的项目里面，然后使用模块加载的方式使用：
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
数据格式：
```json
{
  "code": 0,
  "msg": "ok",
  "data": [
    {
      "d_id": 1,
      "name": "xx",
      "sex": "male",
      "d_pid": -1
    },
    {
      "d_id": 2,
      "name": "xx",
      "sex": "male",
      "d_pid": 1
    }
  ],
  "count": 2
}
```

### 参数说明
layui数据表格的所有参数都可以用，除此之外treetable新增的参数有：

 参数 | 类型 | 是否必填 | 描述 |
 --- | --- | --- | ---
 treeColIndex | int | 是 | 树形图标显示在第几列
 treeSpid | object | 是 | 最上级的父级id
 treeIdName | string | 否 | id字段的名称
 treePidName | string | 否 | pid字段的名称
 
#### treeColIndex
树形图标（箭头和文件夹、文件的图标）显示在第几列， 索引值是cols数组的下标。

#### treeSpid

最上级的父级id，比如你可以规定pid为0或-1的是最顶级的目录。
 
#### treeIdName
treetable是以id和pid字段来渲染树形结构的，如果你的数据没有id和pid字段，你可以指定id和pid字段的名称。

#### treePidName
pid在你的数据字段中的名称。


### 注意事项
树形表格treetable不能使用分页功能，即使写了page:true，也会忽略该参数。

### 其他方法

#### 全部展开
```javascript
treetable.expandAll('#table1');
```
 
 #### 全部折叠
 ```javascript
treetable.foldAll('#table1');
```
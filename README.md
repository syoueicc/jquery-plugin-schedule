jquery-plugin-schedule
======================

基于jquery1.10的日期排期插件

### [Schedule Demo ](http://cancel.sinaapp.com/schedule.html)<br />

### 使用方法
    <script src="js/jquery-1.10.2.js"></script>
    <script src="js/jquery-plugin-schedule.js"></script>
    <link rel="stylesheet" href="js/schedule.css">
    
    <div id="container"></div>
    $("#container").Schedule(options);
    
### 初始化参数 Default options
    options = {
      width: 600,
      height: 500,
      unit: ["元", "点击", "元/CPM"],  //弹窗输入框单位
      week: ["日", "一", "二", "三", "四", "五", "六"], //星期文本
      currentDay: new Date() //当前时间
    }
    
### API
    $(item).Schedule("function");
    
    function: getSetData
    说明： 得到控件设置的数据字符串，格式： "2014/07/07,1.00,2,1.00,1|2014/07/17,1.00,2,1.00,1"
    function: setSetData
    说明： 设置控件数据 $(item).Schedule("setSetData", data);
    function: getTotalDays
    说明： 得到已设置数据的总天数
    function: getStartEndDate
    说明： 得到已设置数据的开始日期与结束日期  [startDate, endDate]
    function: getTotal
    说明： 得到已设置数据的总预算
    function: getTotalAntUnit
    说明： 得到已设置数据的总预期单价

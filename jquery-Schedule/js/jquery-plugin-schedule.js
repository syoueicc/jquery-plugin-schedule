$.fn.Schedule = function(options){

  if(typeof options == "string") {
    try{
      switch(arguments.length) {
        case 2:
          return $(this).data("Schedule")[arguments[0]](arguments[1]);
          break;
        default :
          return $(this).data("Schedule")[arguments[0]]();
      }
    }catch(e){
      throw new Error("not found function.");
    }
  }
  if(typeof $(this).data("Schedule") == "object") return;
  var _default = {
    width: 600,
    height: 500,
    unit: ["元", "点击", "元/CPM"],
    week: ["日", "一", "二", "三", "四", "五", "六"],
    currentDay: new Date()
  }

  function Schedule() {
    try{
      options.currentDay.getTime();
    }catch(e){
      options.currentDay = new Date(options.currentDay);
    }
    this._default_ = $.extend({}, _default, options);
    this.titleText = this._default_.currentDay.getFullYear() + " " + (this._default_.currentDay.getMonth() + 1)
  }

  Schedule.prototype = {
    isSelect: true,
    startDateItem: null,
    endDateItem: null,
    settingData: null,
    setUnit: function(unit, index) {
      this._default_.unit[index] = unit;
    },
    getSetData: function() {
      return this.settingData;
    },
    setSetData: function(newValue) {
      
      try{
        this.settingData = newValue;
        this.renderDateItem();
      }catch(e){
        throw new Error("选择日期数据格式有误！");
      }
    },
    createDatePanel: function() {
      var _mainPanel = $("<div></div>")
          ,_titlePanel = $("<div><div class='cc-dc-title-btn'><div class='pre'>&lt;</div><div class='next'>&gt;</div></div><div class='cc-dc-title-text'></div></div>")
          ,_contentPanel = $("<div></div>")
          ,infoPanel = $("<div class='cc-infoPanel'><div class='total'>当前总预算：<label></label></div><div class='putDate'>投放日期：<label></label></div><div class='totalDays'>共计：<label></label></div><div class='unit'>平均单价：<label></label></div></div>")
          ,datePanel = $("<div id='cc-datePicker'></div>");

      _titlePanel.addClass("cc-dc-title");
      this.preMonthEvent(_titlePanel.find(".pre"));
      this.nextMonthEvent(_titlePanel.find(".next"));
      _contentPanel.addClass("cc-dc-content");
      _mainPanel.addClass("cc-dc").append(_titlePanel).append(_contentPanel);
      infoPanel.find("div").hide();
      datePanel.append(_mainPanel).append(infoPanel);
      return datePanel;
    },
    showMesWin: function(setting, fn) {
      var win = $("<div class='cc-dc-win'></div>"),
          mask = $("<div class='cc-dc-win-mask'></div>"),
          mesWin = $("<div class='cc-dc-win-mes'></div>"),
          mesWinTitle = $("<div class='cc-dc-win-mes-title'>排期信息设置<div class='closeX'>X</div></div>"),
          mesWinContent = $("<div class='cc-dc-win-mes-content'></div>"),
          dateRow = $("<div class='rowLine'><div class='left text'>选择的日期:</div><div class='right text'></div></div>"),
          dayAntRow = $("<div class='rowLine'><div class='left text'>每日预算:</div><div class='right'><input id='dayAnt' precision=2 type='text' style='width:140px;' />&nbsp;<label></label></div></div>"),
          antEffectRow = $("<div class='rowLine'><div class='left text'>预期效果:</div><div class='right'><input id='antEffect' type='text' style='width:140px;' />&nbsp;<label></label></div></div>"),
          antUnitRow = $("<div class='rowLine'><div class='left text'>预期单价:</div><div class='right'><input id='antUnit' precision=2 type='text' style='width:140px;' />&nbsp;<label></label></div></div>"),
          putTypeRow = $("<div class='rowLine'><div class='left text'>单日投放方式:</div><div class='right'><input type='radio' checked name='day-putType' id='day-uniform' value='0'/>&nbsp;<label for='day-uniform'>匀速</label>&nbsp;&nbsp;<input name='day-putType' type='radio' id='day-speedup' value='1'/>&nbsp;<label for='day-speedup'>加速</label></div></div>"),
          centerBtn = $("<div class='enter'>确定</div>"),
          clearBtn = $("<div class='clear'>清空</div>"),
          cancelBtn = $("<div class='cancel'>取消</div>"),
          btnPanel = $("<div class='btn-Panel'></div>"),
          mesWinBtnPanel = $("<div class='cc-dc-win-mes-btnPanel'></div>"),
          self = this;


      var defalutSetting = {
        startDate: "",
        endDate: "",
        dayAnt: "",
        antEffect: "",
        antUnit: "",
        putType: 0
      }
      defalutSetting = $.extend({}, defalutSetting, setting);

      mesWinContent.append(dateRow).append(dayAntRow).append(antEffectRow).append(antUnitRow).append(putTypeRow);
      btnPanel.append(centerBtn).append(clearBtn).append(cancelBtn);
      mesWinBtnPanel.append(btnPanel);
      mesWin.append(mesWinTitle).append(mesWinContent).append(mesWinBtnPanel);
      win.append(mask).append(mesWin);
      $("body").append(win);
      
      /*win.find(".right input.easyui-numberbox").eq(0).numberbox();
      win.find(".right input.easyui-numberbox").eq(1).numberbox();
      win.find(".right input.easyui-numberbox").eq(2).numberbox();*/
      mesWinContent.find(".right input[type='text']").on("blur", function() {
        if(isNaN($(this).val())) {
          $(this).val("");
        }else {
          if($(this).attr("precision")) $(this).val(parseFloat($(this).val()).toFixed($(this).attr("precision")));
        }
      });
      settingArgs(mesWinContent);
      setWinPosition(mesWin);
      mesWinTitle.find(".closeX").on("click", closeWin);
      mask.on("click", closeWin);
      cancelBtn.on("click", closeWin);
      centerBtn.on("click", function() {
        var _days = self.__get2DateDays(new Date(self.startDateItem), new Date(self.endDateItem)),
            inputPanel = $(this).parents(".cc-dc-win-mes").find(".right input"),
            riadoItem = $(this).parents(".cc-dc-win-mes").find(".right input[type='radio']");
        if(!inputPanel.eq(0).val()) {
          alert("请输入每日预算！");
          return;
        }
        if(!inputPanel.eq(1).val()) {
          alert("请输入预期效果！");
          return;
        }
        if(!inputPanel.eq(2).val()) {
          alert("请输入预期单价！");
          return;
        }
        for(var i = 0; i < _days.length; i++){
          _days[i] += "," + inputPanel.eq(0).val() +","+ inputPanel.eq(1).val() +","+ inputPanel.eq(2).val();
          var checkedVal = riadoItem.eq(0).is(":checked") ? riadoItem.eq(0).val() : riadoItem.eq(1).val();
          _days[i] += "," + checkedVal;
        }
        self.__setDateSource(_days);
        self.renderDateItem();
        closeWin();
      });
      clearBtn.on("click", function() {
        if(confirm("确定要清除吗？")) {
          self.__clearSource();
          self.renderDateItem();
          closeWin();
        }
      });
      if(typeof callBack == "function") callBack();
      function setWinPosition(_win) {
        var screenWidth = document.documentElement.clientWidth,
            screenHeight = document.documentElement.clientHeight,
            winWidth = _win.width(),
            winHeight = _win.height(),
            winPosX = (screenWidth -  winWidth) / 2,
            winPosY = (screenHeight -  winHeight) / 2;

        _win.css({"left": winPosX + "px", "top": winPosY + "px"});
      }

      function closeWin() {
        win.remove();
        if(typeof fn == "function") fn();
      }
      function settingArgs(mesPanel) {
        mesPanel.find(".right").eq(0).text(defalutSetting.startDate+" -- "+defalutSetting.endDate);
        var dayAnt = null, antEffect = null, antUnit = null, putType = null;
        $(".days.selected").each(function(i, item) {
          if(dayAnt == null) {
            dayAnt = $(item).find(".row").not(".dateLine").eq(0).text().split(" ")[0];
          }else {
            if(dayAnt != $(item).find(".row").not(".dateLine").eq(0).text().split(" ")[0]) dayAnt = "";
          }
          if(antEffect == null) {
            antEffect = $(item).find(".row").not(".dateLine").eq(1).text().split(" ")[0];
          }else {
            if(antEffect != $(item).find(".row").not(".dateLine").eq(1).text().split(" ")[0]) antEffect = "";
          }
          if(antUnit == null) {
            antUnit = $(item).find(".row").not(".dateLine").eq(2).text().split(" ")[0];
          }else {
            if(antUnit != $(item).find(".row").not(".dateLine").eq(2).text().split(" ")[0]) antUnit = "";
          }
          if(putType == null) {
            putType = $(item).find(".row").not(".dateLine").eq(3).text();
          }else {
            if(putType != $(item).find(".row").not(".dateLine").eq(3).text()) putType = 0;
          }
        });
        /*mesPanel.find(".right input").eq(0).val(dayAnt);
        mesPanel.find(".right input").eq(1).val(antEffect);
        mesPanel.find(".right input").eq(2).val(antUnit);*/
        mesPanel.find(".right input").eq(0).val(dayAnt);
        mesPanel.find(".right input").eq(1).val(antEffect);
        mesPanel.find(".right input").eq(2).val(antUnit);
        if(putType == 0) {
          mesPanel.find(".right input[type='radio']").eq(0).prop("checked", true);
        }else {
          mesPanel.find(".right input[type='radio']").eq(1).prop("checked", true);
        }
        mesPanel.find(".right label").eq(0).text(self._default_.unit[0]);
        mesPanel.find(".right label").eq(1).text(self._default_.unit[1]);
        mesPanel.find(".right label").eq(2).text(self._default_.unit[2]);
      }
    },
    renderDateItem: function() {
      if(!this.settingData) {
        $("#cc-datePicker").find(".daysPanel .days").removeClass("seted");
        $("#cc-datePicker").find(".daysPanel .days").find(".row").not(".dateLine").text("");
        this.showInfoBox();
        return;
      };
      var dateSource = this.settingData.replace(/\//g, "-"), _ds, self = this;
      $(".days").each(function(i, item) {
        eval('var reg = /' + $(item).data("date").join("-") + ',\\d{1,}\\.\\d{2},\\d{1,},\\d{1,}\\.\\d{2},[01]/');
        if(_ds = dateSource.match(reg)) {
          if(!$(item).hasClass("seted")) $(item).addClass("seted");
          _ds = _ds[0].split(",");
          $(item).find(".row").not(".dateLine").eq(0).text(_ds[1] + " " + self._default_.unit[0]);
          $(item).find(".row").not(".dateLine").eq(1).text(_ds[2] + " " + self._default_.unit[1]);
          $(item).find(".row").not(".dateLine").eq(2).text(_ds[3] + " " + self._default_.unit[2].split("/")[0]);
          $(item).find(".row").not(".dateLine").eq(3).text(_ds[4]);
        }else {
          $(item).removeClass("seted");
          $(item).find(".row").not(".dateLine").text("");
        }
      });
      this.showInfoBox();
    },
    showInfoBox: function() {
      if(!this.settingData) {
        $("#cc-datePicker .cc-infoPanel div").hide();
        return;
      }
      $("#cc-datePicker .cc-infoPanel div").eq(0).find("label").text(this.getTotal() + this._default_.unit[0]);
      $("#cc-datePicker .cc-infoPanel div").eq(1).find("label").text(this.getStartEndDate()[0] +"-"+ this.getStartEndDate()[1]);
      $("#cc-datePicker .cc-infoPanel div").eq(2).find("label").text(this.getTotalDays() + " 天");
      $("#cc-datePicker .cc-infoPanel div").eq(3).find("label").text(parseInt(this.getTotal() / this.getTotalDays()) + this._default_.unit[0]);
      $("#cc-datePicker .cc-infoPanel div").show();
    },
    getTotalDays:function() {
      if(this.settingData == null) return 0;
      var dateSource = this.settingData.replace(/\//g, "-");
      return dateSource.match(/\d{4}-\d{2}-\d{2}/g).length;
    },
    getStartEndDate: function() {
      if(this.settingData == null) return "null";
      var dateSource = this.settingData.replace(/\//g, "-");
      dateSource = dateSource.match(/\d{4}-\d{2}-\d{2}/g);
      var _startDay = dateSource[0], _endDay = dateSource[0];
      for(var i = 1; i < dateSource.length; i++) {
        _startDay = new Date(_startDay).getTime() < new Date(dateSource[i]).getTime() ? _startDay : dateSource[i];
        _endDay = new Date(_endDay).getTime() > new Date(dateSource[i]).getTime() ? _endDay : dateSource[i];
      }
      return [_startDay.replace(/-/g, "-"), _endDay.replace(/-/g, "-")];
    },
    getTotal: function() {
      if(this.settingData == null) return 0;
      var dateSource = this.settingData.replace(/\//g, "-");
      dateSource = dateSource.match(/\d{4}-\d{2}-\d{2},\d{1,}\.\d{2}/g);
      var _total = [];
      for(var i=0; i < dateSource.length; i++) {
        _total.push(dateSource[i].split(",")[1]);
      }
      
      return eval(_total.join("+"));
    },
    getTotalAntUnit: function() {
      if(this.settingData == null) return 0;
      var dateSource = this.settingData.replace(/\//g, "-");
      dateSource = dateSource.match(/\d{4}-\d{2}-\d{2},\d{1,}\.\d{2},\d{1,},\d{1,}\.\d{2}/g);
      var _total = [];
      for(var i=0; i < dateSource.length; i++) {
        _total.push(dateSource[i].split(",")[1]);
      }
      
      return eval(_total.join("+"));
    },
    __clearSource: function() {
      if(!this.settingData) return;
      var dateSource = this.settingData.replace(/\//g, "-");
      $(".days.selected").each(function(i, item) {
        eval('var reg = /' + $(item).data("date").join("-") + ',\\d{1,}\\.\\d{2},\\d{1,},\\d{1,}\\.\\d{2},[01]/');
        if(dateSource.match(reg)) {
          dateSource = dateSource.replace(reg, "");
        }
      });
      var dataArray = dateSource.match(/\d{4}-\d{2}-\d{2},\d{1,}\.\d{2},\d{1,},\d{1,}\.\d{2},[01]/g);
      if(dataArray && dataArray.length) {
        this.settingData = dataArray.join("|").replace(/-/g, "/");
      }else {
        this.settingData = "";
      }
    },
    __setDateSource: function(argsArray) {
      //var reg = /\d{4}\/\d{2}\/\d{2},\d{1,}\.\d{2},\d{1,}\.\d{2},\d{1,}\.\d{2},[01]/g;
      if(this.settingData) {
        var exData = this.settingData;
        exData = exData.replace(/\//g, "-");
        for(var i = 0; i < argsArray.length; i++) {
          eval('var reg = /' + argsArray[i].split(",")[0].replace(/\//g,"-") + ',\\d{1,}\\.\\d{2},\\d{1,},\\d{1,}\\.\\d{2},[01]/');
          if(exData.match(reg)) {
            exData = exData.replace(reg, argsArray[i]);
          }else{
            exData += "|" + argsArray[i];
          }
        }
        this.settingData = exData.replace(/-/g, "/");
        console.log(this.settingData);
        return;
      }
      this.settingData = argsArray.join("|");
    },
    __get2DateDays: function(begin, end) {
      var _b = this.__contrast2Date(begin, end) ? end : begin,
          _e = this.__contrast2Date(begin, end) ? begin : end,
          days = [];

      while(this.__contrast2Date(_e, _b)) {
        days.push(this.__formatDateString(_b));
        _b.setDate(_b.getDate() + 1);
      }

      return days;
    },
    __formatDateString: function(_d, str) {
      var _str = str || "/";
      return _d.getFullYear() + _str + this.__formatDate(_d.getMonth() + 1) + _str + this.__formatDate(_d.getDate());
    },
    __formatDate: function(date) {
      return parseInt(date) < 10 ? "0" + date : date.toString();
    },
    __getDays: function(currentDay) {
      var curDay, today, totalDD, YYYY, MM, DD;
      curDay = new Date();

      if(currentDay) curDay = new Date(currentDay);
      today = curDay.getDay();
      curDay.setMonth(curDay.getMonth() + 1);
      curDay.setDate(0);
      totalDD = curDay.getDate();
      YYYY = curDay.getFullYear();
      MM = curDay.getMonth() + 1;
      var curDate = {
        date: []
      };
      for(var i = 1; i <= totalDD; i++) {
        curDate.date.push([YYYY, this.__formatDate(MM), this.__formatDate(i)]);
      }

      return curDate;
    },
    __setTimezero: function(time) {
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);
      return time;
    },
    __fillDaysComplete: function(__curDay) {
      var currMonth = this.__getDays(__curDay).date,
          firstDay  = currMonth[0],
          endDay    = currMonth[currMonth.length - 1],
          curFirDay, curEndDay, timeTemp = null;
          

      firstDay = new Date(firstDay.join("/"));
      endDay = new Date(endDay.join("/"));
      this.__setTimezero(firstDay);
      this.__setTimezero(endDay);

      curFirDay = firstDay.getDay();
      curEndDay = endDay.getDay();

      timeTemp = firstDay;
      for (var i = curFirDay; i > 0; i--) {
        timeTemp.setDate(timeTemp.getDate() - 1);
        currMonth.unshift([timeTemp.getFullYear(), this.__formatDate(timeTemp.getMonth() + 1), this.__formatDate(timeTemp.getDate())]);
      };
      timeTemp = endDay;
      for (var i = curEndDay; i < 6; i++) {
        timeTemp.setDate(timeTemp.getDate() + 1);
        currMonth.push([timeTemp.getFullYear(), this.__formatDate(timeTemp.getMonth() + 1), this.__formatDate(timeTemp.getDate())]);
      };

      return currMonth;
    },
    preMonthEvent: function(dom) {
      var self = this;
          
      
      dom.on("click", function() {
        var titleText = self.titleText, titleDate;
        titleDate = new Date((titleText + " 1").split(" ").join("/"));
        titleDate.setMonth(titleDate.getMonth() - 1);
        self.titleText = titleDate.getFullYear() + " " + (titleDate.getMonth() + 1);
        
        self.__createDateItems(self.dom, titleDate);

      });
    },
    nextMonthEvent: function(dom) {
      var self = this;
      
      dom.on("click", function() {
        var titleText = self.titleText, titleDate;
        titleDate = new Date((titleText + " 1").split(" ").join("/"));
        titleDate.setMonth(titleDate.getMonth() + 1);
        self.titleText = titleDate.getFullYear() + " " + (titleDate.getMonth() + 1);
        
        self.__createDateItems(self.dom, titleDate);
      });
    },
    __bindItemEvent: function(dom) {
      var self = this;
      dom.find(".daysPanel .days").on("click", function() {
        if($(this).hasClass("past")) return;
        if(!$(this).hasClass("selected")) $(this).addClass("selected");
        self.isSelect = !self.isSelect;
        if(self.isSelect) {
          var $this = $(this),
              $result = self.__contrast2Date(new Date(self.startDateItem), new Date($(this).data("date").join("/"))),
              $startDate = $result ? $(this).data("date").join("/") : self.startDateItem,
              $endDate = $result ? self.startDateItem : $(this).data("date").join("/");
          self.endDateItem = $(this).data("date").join("/");
          self.showMesWin({
            startDate: $startDate,
            endDate: $endDate
          },function() {
            $this.parent().children(".days").removeClass("selected").removeClass("startDate");
            self.startDateItem = null;
            self.endDateItem = null;
          });

          
          return;
        }
        $(this).siblings().removeClass("startDate");
        $(this).addClass("startDate");
        
        self.startDateItem = $(this).data("date").join("/");
      });
      dom.find(".daysPanel .days").not(".past").on("mouseover", function() {
        if(!self.isSelect && !!self.startDateItem) {
          var startIndex = $(this).parent().find(".startDate").index(),
              currendIndex = $(this).index(), _begin, _sequ;
          startIndex = startIndex >= 0 ? startIndex : 0;
          _begin = startIndex > currendIndex ? currendIndex : startIndex;
          _sequ = Math.abs(startIndex - currendIndex);
          $(this).parent().children(".days").removeClass("selected");
          var getCurrentElement = contrastDate(new Date($(this).data("date").join("/")), new Date(self.startDateItem));
          $(this).parent().children().not(".past").each(getCurrentElement);
        }
      });

      function contrastDate(curDate, startDate) {
        var curDateTime = curDate.getTime(),
            startDateTime = startDate.getTime();
            //result = curDateTime > startDateTime;
        if(self.__contrast2Date(curDateTime, startDateTime)) {
          return function(i, item) {
            var $thisItemDate = new Date($(item).data("date").join("/")).getTime();
            if($thisItemDate >= startDateTime && $thisItemDate <= curDateTime) $(this).addClass("selected");
          }
        }else {
          return function(i, item) {
            var $thisItemDate = new Date($(item).data("date").join("/")).getTime();
            if($thisItemDate <= startDateTime && $thisItemDate >= curDateTime) $(this).addClass("selected");
          }
        }
      }

      /*function contrast2Date(date1, date2) {
        if(date1 instanceof Date) date1 = date1.getTime();
        if(date2 instanceof Date) date2 = date2.getTime();
        return result = date1 > date2
      }*/
      return dom;
    },
    __contrast2Date: function(date1, date2) {
        if(date1 instanceof Date) date1 = date1.getTime();
        if(date2 instanceof Date) date2 = date2.getTime();
        return result = date1 >= date2
    },
    __createDateItems: function(dom, __curDay) {
      var items = this.__fillDaysComplete(__curDay),
          parentDomWidth = this._default_.width,
          itemsWidth = parseInt(parentDomWidth * 0.95),
          itemsPanel = $("<div></div>"),
          itemWidth = parseInt((itemsWidth - 14) / 7),
          week = this._default_.week;
      dom.find(".cc-dc-title-text").text(this.titleText + "月");
      itemsPanel.addClass("itemPanel").css({"width": itemsWidth+"px"});
      var weekPanel = $("<div class='weekPanel'></div>");
      for(var i = 0; i < week.length; i++) {
        var temp = $("<div></div>");
        temp.addClass("item").addClass("week").text(week[i]).css({ "width": itemWidth + "px" });
        weekPanel.append(temp);
      }
      itemsPanel.append(weekPanel);
      var daysPanel = $("<div class='daysPanel'></div>");
      for(var i = 0; i < items.length; i++) {
        var temp = $("<div></div>");
        temp.addClass("item").addClass("days").css({ "width": itemWidth + "px", "height":  parseInt(itemWidth * 0.8) + "px"});
        temp.data("date", items[i]);
        var today = new Date(), tempTime = new Date();
        today = this.__setTimezero(today);
        tempTime.setUTCFullYear(items[i][0], parseInt(items[i][1]) - 1, items[i][2]); 
        tempTime = this.__setTimezero(tempTime);
       
        if(today.getTime() > tempTime.getTime()) temp.addClass("past");
        if(today.getTime() == tempTime.getTime()) temp.addClass("current");
        if(today.getMonth() < tempTime.getMonth()) temp.addClass("future");
        if(this.startDateItem) {
          if(temp.data("date").join("/") == this.startDateItem) temp.addClass("startDate");
        }
        temp.append($("<div class='row dateLine'></div><div class='row'></div><div class='row'></div><div class='row'></div><div class='row' style='display:none;'></div>"))
        temp.find(".dateLine").text(items[i][2]);
        daysPanel.append(temp);
      }
      itemsPanel.append(daysPanel);
      this.__bindItemEvent(itemsPanel);
      dom.find(".cc-dc-content").empty().append(itemsPanel);

      this.renderDateItem();
      return dom;
    },
    init: function() {
      var dom = this.createDatePanel();
      dom = this.__createDateItems(dom, this._default_.currentDay);
      
      this.dom = dom;
      return dom;
    }
  }
  return $.each($(this), function(i, item) {
    var dc = new Schedule();
    $(item).append(dc.init());
    $(item).data("Schedule", dc);
  });
}
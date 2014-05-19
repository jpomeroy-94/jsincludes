var calendarObject = Class.create({
//--- initialize
	initialize: function() {
		null;
	},
//--- displayMessage   
	displayMessage: function(base,calendarName) {
		var eventName=base.innerHTML;
		var theMessage=calendarAry[calendarName]['desc'][eventName];
		alert(theMessage);
	},
//--- nextMonth
	nextMonth: function(calendarName) {
		var curMonthNo=calendarAry[calendarName]['etc']['curmonthno'];
		var curYearNo=calendarAry[calendarName]['etc']['curyearno'];
		curMonthNo++;
		if (curMonthNo>12){
			curMonthNo=1;
			curYearNo++;
		}
		calendarAry[calendarName]['etc']['curmonthno']=curMonthNo;
		calendarAry[calendarName]['etc']['curyearno']=curYearNo;
		this.displayMonth(calendarName);
	},
//--- prevMonth
	prevMonth: function(calendarName) {
		var curMonthNo=calendarAry[calendarName]['etc']['curmonthno'];
		var curYearNo=calendarAry[calendarName]['etc']['curyearno'];
		var oldCurMonthNo=curMonthNo;
		curMonthNo--;
		if (curMonthNo<1){
			curMonthNo=12;
			curYearNo--;
		}
		calendarAry[calendarName]['etc']['curmonthno']=curMonthNo;
		calendarAry[calendarName]['etc']['curyearno']=curYearNo;
		this.displayMonth(calendarName);
	},
//--- displayMonth
	displayMonth: function(calendarName){
		null;
	},
//--- test alert
	doAlert: function(alertMsg){
		alert (alertMsg);
	} 
}); 

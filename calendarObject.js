var calendarObject = Class.create({
//- data structures
//this.calendarName
//this.calendarHash[<calendarName>]['etc']['id']		... id
//										 ['curmonthno']	... current month 
//										 ['curyearno']	... current year
//										 ['formname']   ... form name
//										 ['emptablename'] ... table name for employees 
//										 ['calendarentrydatename'] ... date to put in day bucket
//										 ['calendarentrytitlename'] ... title to display in day bucket
//										 ['calendarentryclassname'] ... class to assign it to
//										 ['calendarentrydbtablename'] ... table name
//										 ['calendarentrykeyname'] ... key name
//										 ['calendarentrystarttimename'] ... start time	????
//										 ['calendarmenucontainerid'] ... menu of days events
//										 ['calendarmenuformname'] ... form within menu of days events
//										 ['calendarmenucontainerid'] ... container for menu of days events
//				 					['desc'][<message name>]    ... message
//				 					['dataary'][<yearno>][<monthno>][<dayno>][]['title'] ... <title>
//																				['desc']  ... <desc>						
//																				['class'] ... <class>
//																				['datetype'] ... holiday/???/???
//																				['starttime'] ... hh:mm
//																				['lengthoftime'] ... hh:mm
//																				['assigned'][][emprowno]
//				['workdayary'][][title/desc/class/datatype/starttime/...]
//==============================================================================
	initialize: function() {
		this.calendarHash = new Hash();
	},
//==============================================================================
	setName: function(calendarName){
		this.calendarName=calendarName;
		this.setupDirs();
	},
//==============================================================================
	reset: function(job,container,loadId,menuName,menuElementNo){
		containerObj.jsDebug('calendarObj.reset(job,container,loadId,menuName,menuElementNo)');
		calendarName=this.calendarName;
		var tableName=this.getEtcValue('calendarentrydbtablename');
		tableObj.setTableName(tableName);
		this.calendarHash[calendarName]['etc']= new Hash();
		this.calendarHash[calendarName]['dataary'] = new Array();
		this.calendarHash[calendarName]['workdayary'] = new Array();
		menuObj.reset(job,container,loadId,menuName,menuElementNo);
	},
//==============================================================================
	itIsInside: function(startDate,endDate,checkDate){
		containerObj.jsDebug('calendarObj.itIsInside(startDate,endDate,checkDate');
		var startDateMins=utilObj.getDateStuff(startDate,'allminutes');
		var endDateMins=utilObj.getDateStuff(endDate,'allminutes');
		var checkDateMins=utilObj.getDateStuff(checkDate,'allminutes');
		if (endDateMins >= checkDateMins && startDateMins <= checkDateMins){
			var itIsOk=true;
		}
		else { var itIsOk=false;}
		return itIsOk;
	},
//==============================================================================
	displayDay: function(base,theCode){
		containerObj.jsDebug('calendarObj.displayDay(base,theCode)');
		var calendarName=this.calendarName;
		var theDayAll=base.innerHTML;
		var theDayAllAry=theDayAll.split('<');
		var theDayNo=theDayAllAry[0];
		this.setEtcValue('curdayno',theDayNo);
		this.setEtcValue('daydisplay',0);
		var theMonthNo=this.getEtcValue('curmonthno');
		var theYearNo=this.getEtcValue('curyearno');
		//containerObj.displayAry(this.calendarHash[calendarName]['etc']);//
		var theTableName=this.getEtcValue('calendarentrydbtablename');
		var selectColumn=this.getEtcValue('calendarentrydatename');
		tableObj.setTableName(theTableName);
		var dataAry=tableObj.getRowsByDate(theYearNo,theMonthNo,theDayNo,selectColumn,0);		
		//- get id of table and do clears
		var calendarMenuId=this.getEtcValue('calendarmenuid');
		//- delete all rows with forms
		var startRow=1;
		var endRow=99;
		utilObj.deleteTableRows(calendarMenuId,startRow,endRow);
		var formName=this.getEtcValue('calendarmenuformname');
		formObj.setFormName(formName);
		//- set insert form
		utilObj.insertTableRow(calendarMenuId,1);
		formObj.addFormHtml(calendarMenuId,1,'insert');
		dataHash=new Hash();
		var entryDateName=this.getEtcValue('calendarentrydatename');
		var thisEntryDate=theMonthNo+'/'+theDayNo+'/'+theYearNo;
		dataHash.set(entryDateName,thisEntryDate);
		formObj.addFormData(calendarMenuId,1,dataHash);
		//- set update forms
		var theLength=dataAry.length;
		for (var rowLp=0;rowLp<theLength;rowLp++){
			var dataHash=tableObj.convertToHash(dataAry[rowLp]);
			var tableRowNo=Number(rowLp)+2;
			utilObj.insertTableRow(calendarMenuId,tableRowNo);
			formObj.addFormHtml(calendarMenuId,tableRowNo,'update');
			formObj.addFormData(calendarMenuId,tableRowNo,dataHash);
		}
		//- loop on bottom two
		//- load repeating form into table cell
		//- update repeating form with data
		//- make container unhidden
		var menuContainerId=this.getEtcValue('calendarmenucontainerid');
		var theBase=$(menuContainerId);
		try {
			theBase.style.visibility='visible';
		} catch (err){
			alert ('calendarObj.displayDay: '+err+' menuContainerId: '+menuContainerId);
		}
		containerObj.setFocus(menuContainerId,15);	
		//alert ('set loadclass: '+menuContainerId+' to 15');//xxxd
	},
	//===================================================xxxf22
	displayDayNote: function(calendarName, theEventNo, theDayNo, theMonthNo, theYearNo){
		var theTitleName=this.getEtcValue('calendarentrytitlename');
		var theMessageName=this.getEtcValue('calendarentrymessagename');
		var theTitle=this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo][theEventNo].get(theTitleName);
		var theMessage=this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo][theEventNo].get(theMessageName);
		//var message=calendarAry[calendarName][title];
		alert (theTitle + ': ' + theMessage);
	},
//==============================================================================
	getMenuDisplay: function(theDays){
		containerObj.jsDebug('calendarObj.getMenuDisplay(theDays)');
		var calendarName=this.calendarName;
		this.setEtcValue('daydisplay',theDays);
		var theDayNo=this.getEtcValue('curdayno');
		var theMonthNo=this.getEtcValue('curmonthno');
		var theYearNo=this.getEtcValue('curyearno');
		//containerObj.displayAry(this.calendarHash[calendarName]['etc']);//
		var theTableName=this.getEtcValue('calendarentrydbtablename');
		var selectColumn=this.getEtcValue('calendarentrydatename');
		tableObj.setTableName(theTableName);
		var dataAry=tableObj.getRowsByDate(theYearNo,theMonthNo,theDayNo,selectColumn,theDays);		
		//- get id of table and do clears
		var calendarMenuId=this.getEtcValue('calendarmenuid');
		//- delete all rows with forms
		var startRow=1;
		var endRow=99;
		utilObj.deleteTableRows(calendarMenuId,startRow,endRow);
		var formName=this.getEtcValue('calendarmenuformname');
		formObj.setFormName(formName);
		//- set insert form
		utilObj.insertTableRow(calendarMenuId,1);
		formObj.addFormHtml(calendarMenuId,1,'insert');
		dataHash=new Hash();
		var entryDateName=this.getEtcValue('calendarentrydatename');
		var thisEntryDate=theMonthNo+'/'+theDayNo+'/'+theYearNo;
		dataHash.set(entryDateName,thisEntryDate);
		formObj.addFormData(calendarMenuId,1,dataHash);
		//- set update forms
		var theLength=dataAry.length;
		for (var rowLp=0;rowLp<theLength;rowLp++){
			var dataHash=tableObj.convertToHash(dataAry[rowLp]);
			var tableRowNo=Number(rowLp)+2;
			utilObj.insertTableRow(calendarMenuId,tableRowNo);
			formObj.addFormHtml(calendarMenuId,tableRowNo,'update');
			formObj.addFormData(calendarMenuId,tableRowNo,dataHash);
		}
		var menuContainerId=this.getEtcValue('calendarmenucontainerid');
		containerObj.setFocus(menuContainerId,15);
	},
//==============================================================================
	getDayInfo: function(base){
		containerObj.jsDebug('calendarObj.getDayInfo(base)');
		var calendarName=this.calendarName;
		var theDayAll=base.innerHTML;
		var theDayAllAry=theDayAll.split('<');
		var theDayNo=theDayAllAry[0];
		if (theDayNo.length==1){theDayNo='0'+theDayNo;}
		var theMonthNo=this.calendarHash[calendarName]['etc'].get('curmonthno');
		if (theMonthNo.length==1){theMonthNo='0'+theMonthNo;}
		var theYearNo=this.calendarHash[calendarName]['etc'].get('curyearno');
		var thisDate=theMonthNo+'/'+theDayNo+'/'+theYearNo;
		return thisDate;
	},
//==============================================================================
	getClientJob: function(theDate,searchString){
		containerObj.jsDebug('calendarObj.getClientJob(theDate,searchString');
		var calendarName=this.calendarName;
		var keyName=this.getEtcValue('calendarentrykeyname');
		var dateName=this.getEtcValue('calendarentrydatename');
		var theDateAry=theDate.split('/');
		var theDayNo=theDateAry[1];
		theDayNo=Number(theDayNo);
		var theMonthNo=theDateAry[0];
		theMonthNo=Number(theMonthNo);
		var theYearNo=theDateAry[2];
		theYearNo=Number(theYearNo);
		theDayAry=this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo];
		if (theDayAry==undefined){theDayAry=new Array();}
		//alert (calendarName+', '+theMonthNo+'/'+theDayNo+'/'+theYearNo);
		var noJobs=theDayAry.length;
		var foundIt=false;
		for (var searchLp=0;searchLp<noJobs;searchLp++){
			var dontCheck=false;
			var theJobHash=theDayAry[searchLp];
			var theKey=theJobHash.get(keyName);
			if (theKey=='' ){dontCheck=true;}
			if (theKey==undefined){dontCheck=true;}
			if (searchString==''){alert ('thesearchstring is null');}
			if (searchString==theKey && !dontCheck){
				var returnHash=theJobHash;
				searchLp=noJobs;
				var foundIt=true;
			}
		}
		if (!foundIt){
			returnHash=new Hash();
		}
		return returnHash;
	},
//==============================================================================
	openForm: function(base,formType){
		containerObj.jsDebug('calendarObj.fileForm()');
		calendarName=this.calendarName;
		var currentEventKey=this.getEtcValue('thekey');
		if (currentEventKey != undefined){
			this.calendarHash[calendarName]['etc'].unset('thekey');	
//- clicked on a job
			var theDate=this.getDayInfo(base);
			var formData=this.getClientJob(theDate,currentEventKey);
			this.calendarHash[calendarName]['etc'].set('formmode','update');
			var updateKey=base.innerHTML;
			this.calendarHash[calendarName]['etc'].set('formkey',updateKey);
		}		
		else {
//- clicked on blank space or second time after clicking on job
			var updateFlagStrg=this.calendarHash[calendarName]['etc'].get('formmode');
			if (updateFlagStrg == 'update'){
				var searchKey=this.calendarHash[calendarName]['etc'].get('formkey');
				var updateFlag=true;
			}
			else {var updateFlag=false;}
			thisDate=this.getDayInfo(base);
			if (updateFlag){
				//blows below
				var clientJob=this.getClientJob(thisDate,searchKey);
				var keyName=this.getEtcValue('calendarentrykeyname');
				var tst=clientJob.get(keyName);
				if (tst==undefined){updateFlag=false;}
				else {
					var formData=clientJob;
				}
			}
			if (!updateFlag){
				formData=new Hash();
				var dateName=this.getEtcValue('calendarentrydatename');
				formData.set(dateName,thisDate);
				formData.set('formmode','insert');
			}
		}
		var dbTableName=this.getEtcValue('calendarentrydbtablename');
		tableObj.setTableName(dbTableName);
		var formName=this.getEtcValue('formname');
		formObj.setFormName(formName);
		keyName=this.getEtcValue('calendarentrykeyname');
		tst=formData.get(keyName);
		if (tst=='' || tst==undefined){
			alert ('ca.openform: keyvalue is null!');
			exit();
		}
		var dateName=this.getEtcValue('calendarentrydatename');
		var entryDate_raw=formData.get(dateName);
		var entryDate=utilObj.convertDate(entryDate_raw,'dateconv1');
		formData.set(dateName,entryDate);
		formObj.openForm(formData);
	},
//==============================================================================
	setupDirs: function(){
		containerObj.jsDebug('calendarObj.setupDirs()');
		calendarName=this.calendarName;
		tst=this.calendarHash[calendarName];
		if (tst==undefined){
			this.calendarHash[calendarName]=new Hash();
		}
		tst=this.calendarHash[calendarName]['etc'];
		if (tst==undefined){
			this.calendarHash[calendarName]['etc']=new Hash();
		}
		tst=this.calendarHash[calendarName]['desc'];
		if (tst==undefined){
			this.calendarHash[calendarName]['desc']=new Hash();
		}
		tst=this.calendarHash[calendarName]['dataary'];
		if (tst==undefined){
			this.calendarHash[calendarName]['dataary']=new Array();
		}	
	},
//==============================================================================
	loadDesc: function (saveName,saveValue){
		containerObj.jsDebug('calendarObj.setupDirs('+saveName+', '+saveValue+')');
		this.setupDirs();
		calendarName=this.calendarName;
		this.calendarHash[calendarName]['desc'].set(saveName,saveValue);
	},
//==============================================================================
	setupDataDirs: function (yearNo,monthNo,dayNo){
		containerObj.jsDebug('calendarObj.setupDataDirs(yearNo,monthNo,dayNo');
		calendarName=this.calendarName;
		tst=this.calendarHash[calendarName]['dataary'][yearNo];
		if (tst==undefined){this.calendarHash[calendarName]['dataary'][yearNo]=new Array();}
		tst=this.calendarHash[calendarName]['dataary'][yearNo][monthNo];
		if (tst==undefined){this.calendarHash[calendarName]['dataary'][yearNo][monthNo]=new Array();}
		tst=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo];
		if (tst==undefined){this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo]=new Array();}
	},
//==============================================================================
	loadEventData: function (yearNo,monthNo,dayNo,dataStrg){
		containerObj.jsDebug('calendarObj.loadData('+yearNo+', '+monthNo+', '+dayNo+', '+dataStrg+')');
		//vl=prompt(yearNo+', '+monthNo+', '+dayNo+', '+dataStrg,'exit');if (vl=='exit'){exit();}
		this.setupDataDirs(yearNo,monthNo,dayNo);
		var workAry=dataStrg.split('~');
		var workAryLength=workAry.length;
		var eventHash=new Hash();
		for (var workLp=0;workLp<workAryLength;workLp++){
			var workStrg2=workAry[workLp];
			var workAry2=workStrg2.split(':');
			eventHash.set(workAry2[0],workAry2[1]);
		}
		var theLen=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo].length;
		var titleName='title';
		var className='class';
		var theTitle=eventHash.get(titleName);
		var theDate=yearNo+'-'+monthNo+'-'+dayNo;
		var theTime="00:00";
		var theClass=eventHash.get(className);
		var theKey=100;
		var theType='holiday';
		this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo][theLen]=new this.dayObj(theKey,theTitle,theDate,theTime,theClass,theType);	
	},
//==============================================================================
	dayObj: function(keyId,dayTitle,dayDate,dayTime,dayClass,dayType){
		this.keyId=keyId;
		this.dayTitle=dayTitle;
		this.dayDate=dayDate;
		this.dayTime=dayTime;
		this.dayClass=dayClass;
		this.dayType=dayType;
	},
//==============================================================================
	loadDataDir: function (yearNo,monthNo,dayNo,eventHash){
		containerObj.jsDebug('calendarObj.loadDataDir('+yearNo+', '+monthNo+', '+dayNo+'dataStrg)');
		var keyName=this.getEtcValue('calendarentrykeyname');
		var titleName=this.getEtcValue('calendarentrytitlename');
		var dateName=this.getEtcValue('calendarentrydatename');
		var timeName=this.getEtcValue('calendarentrystarttimename');
		var className=this.getEtcValue('calendarentryclassname');
		var theTitle=eventHash.get(titleName);
		var theDate=eventHash.get(dateName);
		var theDate=utilObj.convertDate(theDate,'internal');
		var theTime=eventHash.get(timeName);
		var theClass=eventHash.get(className);
		var theKey=eventHash.get(keyName);
		calendarName=this.calendarName;
		this.setupDataDirs(yearNo,monthNo,dayNo);
		var theLen=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo].length;
		var doInsert=true;
		if (theLen>0){
			for (var theLp=0;theLp<theLen;theLp++){
				var dontCheck=false;
				var oldKey=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo][theLp].keyId;
				if (oldKey==undefined){dontCheck=true;}
				if (oldKey==''){dontCheck=true;}
				if (theKey==''){alert ('theKey is null');}
				if (oldKey==theKey && !dontCheck){
					//vl=prompt(theKey+', '+theTitle+', '+theDate+', '+theTime+', '+theClass);//xxx
					this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo][theLp]=new this.dayObj(theKey,theTitle,theDate,theTime,theClass,'event');
					doInsert=false;
				}
			}
		}
		if (doInsert){
			this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo][theLen]=new this.dayObj(theKey,theTitle,theDate,theTime,theClass);
		}
	},
//==============================================================================
	deprecateddisplayDataDir: function (yearNo,monthNo,dayNo){
		var theLen=this.calendarHash[this.calendarName]['dataary'][yearNo][monthNo][dayNo].length;
		for (var lp=0;lp<theLen;lp++){
			var rowHash=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo][lp];
			containerObj.displayAry(rowHash);		
		}
	},
//==============================================================================
	loadEtc: function(saveName,saveValue){
		containerObj.jsDebug('calendarObj.loadEtc('+saveName+', '+saveValue+')');
		this.setEtcValue(saveName,saveValue);
	},
//==============================================================================
	saveEtcValue: function(saveName,saveValue){
		this.setEtcValue(saveName,savevalue);
	},
//==============================================================================
	setEtcValue: function(saveName,saveValue){
		containerObj.jsDebug('calendarObj.setEtcValue('+saveName+', '+saveValue+')');
		calendarName=this.calendarName;
		this.setupDirs();
		this.calendarHash[calendarName]['etc'].set(saveName,saveValue);	
	},	
//==============================================================================
	getEtcValue: function(getName){
		containerObj.jsDebug('calendarObj.getEtcValue(getName)');
		try {
			var etcValue=this.calendarHash[this.calendarName]['etc'].get(getName);
		} 
		catch (err){
			alert ('ca.getEtcValue: bad calendar name: '+ this.calendarName);
			exit();
		}
		return etcValue;
	},
//==============================================================================
	areYouAlive: function(){
		containerObj.jsDebug('calendarObj.areYouAlive()');
		calendarName=this.calendarName;
		if (calendarName==undefined){var areYouAlive=false;}
		else {var areYouAlive=true;}
		return areYouAlive;
	},
//==============================================================================
	 displayMessage: function(aBase,calendarName) {
		containerObj.jsDebug('calendarObj.displayMessage(*base*, '+calendarName+')');
		calendarName=this.calendarName;
		var eventString=aBase.innerHTML;
		var eventAry=eventString.split('~');
		var theKey=eventAry[1];
		if (theKey != '' && theKey != undefined){
			this.calendarHash[calendarName]['etc'].set('thekey',theKey);
		}
	},
//==============================================================================
	nextMonth: function(calendarName) {
		containerObj.jsDebug('calendarObj.nextMonth('+calendarName+')');
		calendarName=this.calendarName;
		var curMonthNo=this.calendarHash[calendarName]['etc'].get('curmonthno');
		var curYearNo=this.calendarHash[calendarName]['etc'].get('curyearno');
		curMonthNo++;
		if (curMonthNo>12){
			curMonthNo=1;
			curYearNo++;
		}
		this.calendarHash[calendarName]['etc'].set('curmonthno',curMonthNo);
		this.calendarHash[calendarName]['etc'].set('curyearno',curYearNo);
		this.displayMonth(calendarName);
	},
//============================================================================== 
	prevMonth: function(calendarName) {
		calendarName=this.calendarName;
		var curMonthNo=this.calendarHash[calendarName]['etc'].get('curmonthno');
		var curYearNo=this.calendarHash[calendarName]['etc'].get('curyearno');
		var oldCurMonthNo=curMonthNo;
		curMonthNo--;
		if (curMonthNo<1){
			curMonthNo=12;
			curYearNo--;
		}
		this.calendarHash[calendarName]['etc'].set('curmonthno',curMonthNo);
		this.calendarHash[calendarName]['etc'].set('curyearno',curYearNo);
		this.displayMonth(calendarName);
	},
//============================================================================== 
	reDisplayCalendar: function(){
		var calendarName=this.calendar;
		this.displayMonth(calendarName);
	},
//==============================================================================
	displayMonth: function(unusedcalendarname){
		var calendarName=this.calendarName;
		var calendarId=this.calendarHash[calendarName]['etc'].get('id');
		if (calendarId==''){alert ('calendarid is null');}
		else {
//- display it
			//alert ($('thecalendarid').innerHTML);//xxxf
			//xxx: below should be defineable
			//containerObj.displayAry(this.calendarHash[calendarName]['etc']);//xxxf
			var doInsertClass='doinsert';
			var theBase=$(calendarId);
			var monthNo=this.calendarHash[calendarName]['etc'].get('curmonthno');
			var yearNo=this.calendarHash[calendarName]['etc'].get('curyearno');
			var formName=this.calendarHash[calendarName]['etc'].get('formname');
			var dateColumnName=this.getEtcValue('calendarentrydatename');
			var titleColumnName=this.getEtcValue('calendarentrytitlename');
			var classColumnName=this.getEtcValue('calendarentryclassname');
			var typeColumnName=this.getEtcValue('calendareventtypename');
			var messageColumnName=this.getEtcValue('calendarentrymessagename');
			var theEvent=this.getEtcValue('calendarevents');
			//alert ('cadt: '+titleColumnName+', tcn: '+typeColumnName);//xxxd
			var keyName=this.getEtcValue('calendarentrykeyname');
			var timeName=this.getEtcValue('calendarentrystarttimename');
			var theWeekDayClass=this.getEtcValue('weekclass');
			var theWeekEndClass=this.getEtcValue('weekendclass');
			var theTodayClass=this.getEtcValue('todayclass');
			var dayNo=1;
			var lastDayNo;
			if ('x_1_3_5_7_8_10_12_'.indexOf('_'+monthNo+'_',0)>0){lastDayNo=31;}
			else if (monthNo==2){lastDayNo=28;}
			else {lastDayNo=30;}
			var startDate= new Date();
//- get today info
			var todayDayNo=startDate.getDate();
			var todayMonthNo=startDate.getMonth();
			todayMonthNo++;
			var todayYearNo=startDate.getFullYear();
//- below it has months between 0 and 11
			startDate.setFullYear(yearNo,(monthNo-1),dayNo);
			wday=startDate.getDay();
			var monthNameAry=new Array('January','February','March','April','May','June','July','August','September','October','November','December');
			try {
				//xxxd - theBase is bad?!
				//alert ('calendarid: '+calendarId+', thebase: '+theBase);//xxxd
				theBase.caption.innerHTML=monthNameAry[(monthNo-1)]+' '+yearNo;
			}
			catch (err){alert ('calendarObj.displaymonth('+err+') monthno: '+monthNo);}
			var doneIt=false;
			for (var rowCtr=1;rowCtr<=6;rowCtr++){
				var rowAccess=theBase.rows[rowCtr].cells;
				for (var colCtr=0;colCtr<7;colCtr++){
					if (rowCtr==1 && colCtr<wday || dayNo>lastDayNo){
						rowAccess[colCtr].innerHTML='&nbsp;';
						//--? if (dayNo>lastDayNo){rowAccess[colCtr].className='hidden';}
						rowAccess[colCtr].className='hidden';
					}
					else {
						//alert ('yearno: '+yearNo+', todayyearno: '+todayYearNo+', monthno: '+monthNo+', todaymonthno: '+todayMonthNo);//xxxd
						var todayClassInsert='';
						var todayMsg='';
						if (yearNo==todayYearNo){
							if (monthNo==todayMonthNo){
								if (dayNo==todayDayNo){
									useClass=theTodayClass;
									todayClassInsert='class="'+theTodayClass+'"';
									todayMsg='today';
									//alert ('didit insert: '+todayClassInsert);
								}
							}
						}
						//xxxd
						//var vl=prompt('useclass: '+useClass,'x');if (vl=='x'){exit();}
						var insertStrg='<div '+todayClassInsert+'>'+dayNo+' '+todayMsg+'</div>';
						//alert ('insertString: '+insertStrg);//xxxd
						var tstYear=this.calendarHash[calendarName]['dataary'][yearNo];
						if (tstYear != undefined){
							var tstMonth=this.calendarHash[calendarName]['dataary'][yearNo][monthNo];
							if (tstMonth != undefined){
								var tstDayAry=this.calendarHash[calendarName]['dataary'][yearNo][monthNo][dayNo];
								if (tstDayAry != undefined){
									var theLength=tstDayAry.length;
									for (var eventLp=0;eventLp<theLength;eventLp++){
										var eventObj=tstDayAry[eventLp];
										//vl=prompt(eventObj.dayClass,'x');if (vl=='x'){exit();}
										var theTitle=eventObj.get(titleColumnName);
										var theDesc='';
										//-class
										var theClass=eventObj.get(classColumnName);
										if (theClass==undefined){
											theClass='holiday';
										}
										//-key
										var theKey=eventObj.get([keyName]);
										var theKeyInsert="<span class=\"hidden\">~"+theKey+"~</span>";
										//-time
										var startTime=eventObj.dayTime;
										//- need to change below xxxr
										var theDateType=eventObj.get(typeColumnName);
										var useTheEvent=theEvent.gsub('%sglqt%',"'");
										useTheEvent=useTheEvent.gsub('%dblqt%','"');
										useTheEvent=useTheEvent.sub('%eventno%',eventLp);
										useTheEvent=useTheEvent.sub('%theday%',dayNo);
										useTheEvent=useTheEvent.sub('%themonth%',monthNo);
										useTheEvent=useTheEvent.sub('%theyear%',yearNo);
										//alert ('title: '+theTitle+', event: '+useTheEvent);//xxxf
										if (theDateType=='holiday'){
											insertStrg+='<span class="'+theClass+'" '+useTheEvent+'>'+theTitle+'</span>';
										}
										else {
											insertStrg+='<div class="'+theClass+'" title="'+startTime+'"'+useTheEvent+'">'+theTitle+theKeyInsert+'</div>';
										}
										//xxxf
										//vl=prompt(insertStrg,'x');if (vl=='x'){exit();}
									}
								}
							}
						}
						if (colCtr==0 || colCtr==6){var useClass=theWeekEndClass;}
						else {var useClass=theWeekDayClass;}
						rowAccess[colCtr].className=useClass;
						rowAccess[colCtr].innerHTML=insertStrg;
						dayNo++;
					}
				}
			}
		}
		//alert ($('thecalendarid').innerHTML);//xxxf
	},
//==============================================================================
	copyInTable: function(dbTableName){
		containerObj.jsDebug('calendarObj.copyInTable('+dbTableName+')');
		var dateColumnName=this.getEtcValue('calendarentrydatename');
		//xxxr - needs to be redone below
		var theDateType='clientjob';
		//- end of stuff I need to change
		tableObj.setTableName(dbTableName);
		var dataDef=tableObj.getEtcValue('datadef');
		var dataDefAry=dataDef.split('~');
		var dataCnt=dataDefAry.length;
		var tableRowsAry=tableObj.getSortedRows();
		var tableRowCnt=tableRowsAry.length;
		for (var dataRowLp=0;dataRowLp<tableRowCnt;dataRowLp++){
			tableRowAry=tableRowsAry[dataRowLp];
			var newTableRowHash=new Hash();
			for (var dataLp=0;dataLp<dataCnt;dataLp++){
				newTableRowHash.set(dataDefAry[dataLp],tableRowAry[dataLp]);
			}
			var tableRowDate=newTableRowHash.get(dateColumnName);
			dateHash=utilObj.convertDateToHash(tableRowDate);
			var theYear=dateHash.get('yearno');
			var theMonth=dateHash.get('monthno');
			var theDay=dateHash.get('dayno');
			newTableRowHash.set('datetype',theDateType);
			this.loadDataDir(theYear,theMonth,theDay,newTableRowHash);
		}
	},
//============================================================================== 
	fileForm: function(){
		var dateColumnName=this.getEtcValue('calendarentrydatename');
		var titleColumnName=this.getEtcValue('calendarentrytitlename');
		var classColumnName=this.getEtcValue('calendarentryclassname');
		var keyName=this.getEtcValue('calendarentrykeyname');
		//xxx - needs to be ajax fed!!!
		var theDateType='clientjob';
		//xxx - needs to be found in employeeprofile
		formObj.fileForm();
		newTableRowHash=tableObj.getLastRowUpdated();
		var tableRowDate=newTableRowHash.get(dateColumnName);
		var dateHash=utilObj.convertDateToHash(tableRowDate);
		theYear=dateHash.get('yearno');
		theMonth=dateHash.get('monthno');
		theDay=dateHash.get('dayno');
		var theTitle=newTableRowHash.get(titleColumnName);
		if (theTitle==''){theTitle='none';}
		var theClass=newTableRowHash.get(classColumnName);
		if (theClass==''){theClass='calendarentry';}
		theKey=newTableRowHash.get(keyName);
		if (theKey==''){
			alert ('ca.fileform: the key is null!');
			exit();
		}
//- may not have to do the below
		newTableRowHash.set('datetype',theDateType);
		this.loadDataDir(theYear,theMonth,theDay,newTableRowHash);
		this.displayMonth();
		//this.displayDataDir(theYear,theMonth,theDay);//xxx
	},
//============================================================================== 
	fileFormV2: function(rowNo){
		var dateColumnName=this.getEtcValue('calendarentrydatename');
		var titleColumnName=this.getEtcValue('calendarentrytitlename');
		var classColumnName=this.getEtcValue('calendarentryclassname');
		var keyName=this.getEtcValue('calendarentrykeyname');
		//xxx - needs to be ajax fed!!!
		var theDateType='clientjob';
		//xxx - needs to be found in employeeprofile
		formObj.fileFormV2(rowNo);
		newTableRowHash=tableObj.getLastRowUpdated();
		var tableRowDate=newTableRowHash.get(dateColumnName);
		var dateHash=utilObj.convertDateToHash(tableRowDate);
		theYear=dateHash.get('yearno');
		theMonth=dateHash.get('monthno');
		theDay=dateHash.get('dayno');
		var theTitle=newTableRowHash.get(titleColumnName);
		if (theTitle==''){theTitle='none';}
		var theClass=newTableRowHash.get(classColumnName);
		if (theClass==''){theClass='calendarentry';}
		alert ('xxxf4');
		theKey=newTableRowHash.get(keyName);
		if (theKey==''){
			alert ('ca.fileFormV2: error thekey: '+theKey);
			exit();
		}
//- may not have to do the below
		newTableRowHash.set('datetype',theDateType);
		this.loadDataDir(theYear,theMonth,theDay,newTableRowHash);
		this.sortDataDir(theYear,theMonth,theDay);
		this.displayMonth();
		var theDays=this.getEtcValue('daydisplay');
		this.getMenuDisplay(theDays);
		//this.displayDataDir(theYear,theMonth,theDay);//xxx
	},
//==============================================================================
	sortDataDir: function(yearNo,monthNo,dayNo){
		monthNo=Number(monthNo);
		dayNo=Number(dayNo);
		this.calendarHash[this.calendarName]['dataary'][yearNo][monthNo][dayNo].sort(this.compareLines);
	},
//==============================================================================
	compareLines: function(firstLine,secondLine){
		if (firstLine.dayTime>secondLine.dayTime){theValue=1;}
		else {theValue=-1;}
		return theValue;
	},
//============================================================================== 
	deleteEntry: function(){
		var keyName=this.getEtcValue('calendarentrykeyname');
		var keyValue=formObj.deleteEntry(keyName);
		this.removeClientJob(keyValue);
		this.displayMonth();
	},
//==============================================================================
	removeClientJob: function(keyValue){
		var calendarName=this.calendarName;
		var theMonthNo=Number(this.getEtcValue('curmonthno'));
		var theYearNo=Number(this.getEtcValue('curyearno'));
		var formKey=this.getEtcValue('formkey');
		var formKeyAry=formKey.split('<');
		var theDayNo=Number(formKeyAry[0]);
		var keyName=this.getEtcValue('calendarentrykeyname');
		var deleteRowNo=9999;
		var dmy=this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo].each(function(theObj,theRowNo){
			var aKeyValue=theObj.keyId;
			if (keyValue==aKeyValue){
				deleteRowNo=theRowNo;
			}
		});
		if (deleteRowNo != 9999){
			this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo].splice(deleteRowNo,deleteRowNo+1);
		};
	},
//============================================================================== 
	deleteEntryV2: function(menuRowNo){
		var keyName=this.getEtcValue('calendarentrykeyname');
		var dateName=this.getEtcValue('calendarentrydatename');
		var returnHash=formObj.deleteEntryV2(keyName,dateName,menuRowNo);
		var keyValue=returnHash['keyvalue'];
		var dateValue=returnHash['datevalue'];
		this.removeCalendarData(keyValue,dateValue);
		this.displayMonth();
		var theDays=this.getEtcValue('daydisplay');
		this.getMenuDisplay(theDays);
	},
//==============================================================================
	removeCalendarData: function(keyValue,dateValue){
		var calendarName=this.calendarName;
		var dateHash=utilObj.convertDateToHash(dateValue);
		var theMonthNo=Number(dateHash.get('monthno'));
		var theYearNo=Number(dateHash.get('yearno'));
		var theDayNo=Number(dateHash.get('dayno'));
		var keyName=this.getEtcValue('calendarentrykeyname');
		var deleteRowNo=9999;
		var dmy=this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo].each(function(theObj,theRowNo){
			var aKeyValue=theObj.keyId;
			if (keyValue==aKeyValue){
				deleteRowNo=theRowNo;
			}
		});
		if (deleteRowNo != 9999){
			this.calendarHash[calendarName]['dataary'][theYearNo][theMonthNo][theDayNo].splice(deleteRowNo,deleteRowNo+1);
		};
	},
//==============================================================================
	loadEventsJson: function(calendarName,dirName,jsonString){
		var jsonAry=jsonString.evalJSON();
		this.setName(calendarName);
		var dmy=this.calendarHash[calendarName][dirName];
		if (dmy==undefined){
			this.calendarHash[calendarName][dirName]=new Array();
		}
		//- loop through and setup
		var displayYearsAry=new Hash(jsonAry);
		var that=this;
		displayYearsAry.each(function(pairsYear){
			var yearNo=parseInt(pairsYear.key,10);
			//- xxxf create year directory if needed
			var dmy=that.calendarHash[calendarName][dirName][yearNo];
			if (dmy==undefined){
				that.calendarHash[calendarName][dirName][yearNo]=new Array();
			}
			var displayMonthsAry=new Hash(pairsYear.value);
			displayMonthsAry.each(function(pairsMonth){
				var monthNo=parseInt(pairsMonth.key,10);
				//- xxxf create month directory if needed
				var dmy=that.calendarHash[calendarName][dirName][yearNo][monthNo];
				if (dmy==undefined){
					that.calendarHash[calendarName][dirName][yearNo][monthNo]=new Array();
				}
				var displayDaysAry=new Hash(pairsMonth.value);
				displayDaysAry.each(function(pairsDay){
					var dayNo=parseInt(pairsDay.key,10);
					//- xxxf create day directory if needed
					var dmy=that.calendarHash[calendarName][dirName][yearNo][monthNo][dayNo];
					if (dmy==undefined){
						that.calendarHash[calendarName][dirName][yearNo][monthNo][dayNo]=new Array();
					}
					var displayEventsAry=new Hash(pairsDay.value);
					displayEventsAry.each(function(pairsEvent){
						var eventNo=parseInt(pairsEvent.key,10);
						//- create event directory if needed
						if (pairsEvent.key.length<3){
							//- write out event stuff
							var theLen=that.calendarHash[calendarName][dirName][yearNo][monthNo][dayNo].length;
							that.calendarHash[calendarName][dirName][yearNo][monthNo][dayNo][theLen]=new Hash(pairsEvent.value);
						}
					});
				});
			});
		});
		//containerObj.displayAry(this.calendarHash[calendarName]['dataary'][2009][3][29][0]);//xxxf
	},
//============================================================================== 
	doAlert: function(alertMsg){
		alert (alertMsg);
	} 
}); 

var tableObject = Class.create({
// 2/1/13 new method showHideTableColumn
//- data structures
//this.tableName
//this.tableHash[<tablename>]['etc']['datadef']		... name1~name2~name3
//								   ['tabledef']		... colname1~colname2~colname3
//								   ['currentrow']	... current row
//								   ['sendtoserver'] ... true/false/undefined
//								   ['dbtablename']	... database table name
//								   ['lastrowupdated']... last row updated
//								   ['keyname'] ... keyname
//								   ['datepos'] ... date position no
//								   ['timepos'] ... time position no
//								   ['keypos'] ... key position no
//								   ['tempprofileidpos'] ... key postion no
//this.tableHash[<tablename>]['dataary'][<rowno>]    ... 0->dataAry1,1->dataAry2,2->dataAry3
//							 ['datasortary'][<rowno>] ... 0->dataObj(dataaryid,date,time),1->
//							 ['datakeyindexhash']	... <id>->0,<id2>->1,<id3>->2
//                           ['selectary'][<rowno>]  ... 
//							 ['displayary'][<rowno>] ... 0->formatted data1,1->formatted data2,...
//							 ['reducedary'][<rowno>] ... 0->formatted data1, 1->formatted data2,...
//							 ['toserver'] 			... 0->rownno,1->rowno2
//							 ['newdataary'][<rowno>]   ... ->dataAry1, 1->dataAry2, 2->dataAry3
//							 ['newselectary'][<rowno>]  ... 0->combined data1,1->combined data2
//
//==============================================================================
// ?@ initialize: function()?C reset this.tableHash table
	initialize: function() {this.tableHash = new Hash();},
//==============================================================================
// ?@ doAlert: function(alertMsg)?C do an alert
	doAlert: function(alertMsg){alert (alertMsg);},
//========================================================
// ?@ displayEtc: function()?C display all of tablehash[tablename]['etc']
	displayEtc: function(){containerObj.displayHash('table/etc',this.tableHash[this.tableName]['etc']);},
//==============================================================================
// ?@ deleteTableRowServer: function(jobName, tableName, dbKeyValue)?C calls postAjaxSimple(formname,jobname,operation,tablename,senddataary), 
	deleteTableRowServer: function(jobName,tableName,dbKeyValue){
		this.setTableName(tableName);
		var dbTableName=this.getEtcValue('dbtablename');
		var dbKeyName=this.getEtcValue('keyname');
		var sessionName=this.getEtcValue('sessionname');
		//alert ('sessionname: '+sessionName);//xxxd
		//containerObj.displayAry(this.tableHash[this.tableName]['etc']);//xxxd
		sendDataAry=new Array();
		sendDataAry[sendDataAry.length]='dbtablename|'+dbTableName;
		sendDataAry[sendDataAry.length]=dbKeyName+'|'+dbKeyValue;
		sendDataAry[sendDataAry.length]='paramnames|sessionname';
		sendDataAry[sendDataAry.length]='paramvalues|'+sessionName;
		//alert (sendDataAry);//xxxd
		operation='delete_db_from_ajax';
		formName='';
		tableName='';
		//alert ('form: '+formName+', jobname: '+jobName+', operation: '+operation+', tablename: '+tableName);//xxxd
		//alert (sendDataAry);//xxxd
		ajaxObj.postAjaxSimple(formName,jobName,operation,tableName,sendDataAry);
	},
//==============================================================================
// ?@ dataSortObj: function(dataAryId,dataDate,dataTime)?C sort an object
	dataSortObj: function(dataAryId,dataDate,dataTime){
		this.sortId=dataAryId;
		if (dataTime=='' || dataTime==undefined){dataTime="00:00";}
		this.sortDate=dataDate;
		this.sortTime=dataTime;
	},
//==============================================================================
// ?@ sortTheDataAry: function(firstLine,secondLine)?C ?
	sortTheDataAry: function(firstLine,secondLine){
		if (firstLine.sortDate>secondLine.sortDate){theValue=1;}
		else if (firstLine.sortDate==secondLine.sortDate){
			if (firstLine.sortTime>secondLine.sortTime){theValue=1;}
			else {theValue=-1;}
		}
		else {theValue=-1;}
		return theValue;
	},
//==============================================================================
// ?@ rebuildTheSortAry: function()?C ?
	rebuildTheSortAry: function(){
		containerObj.jsDebug('tableObj.rebuildTheSortAry()');
		//- only used with the calendar so make sure it is there 
		//- and that this is the table tied to the calendar
	   	var areYouLive=calendarObj.areYouAlive();
	   	var doItThisTime=false;
	   	if (areYouLive){
	   		var checkTableName=calendarObj.getEtcValue('calendarentrydbtablename');
			var tableName=this.tableName;
			if (checkTableName == tableName && checkTableName != undefined){
				doItThisTime=true;				
			}
	   	}
	   	if (doItThisTime){
			var datePos=this.getEtcValue('datepos');
			var timePos=this.getEtcValue('timepos');
			var dataSortAry=new Array();
			var theLen=this.tableHash[this.tableName]['dataary'].length;
			for (var lp=0;lp<theLen;lp++){
				var theDataRow=this.tableHash[this.tableName]['dataary'][lp];
				var theDate=theDataRow[datePos];
				theDate=utilObj.convertDate(theDate,'internal');
				theTime=theDataRow[timePos];
				dataSortAry[lp]=new this.dataSortObj(lp,theDate,theTime);
			}
			this.tableHash[this.tableName]['datasortary']=dataSortAry;
			this.sortDataAryObj();
	   	}
	},
//==============================================================================
// ?@ sortDataAryObj: function()?C
	sortDataAryObj: function(){
		containerObj.jsDebug('tableObj.sortDataAryObj()');
		var tst=this.tableHash[this.tableName]['datasortary'];
		if (tst==undefined){this.tableHash[this.tableName]['datasortary']=new Array();}
		try {
			this.tableHash[this.tableName]['datasortary'].sort(this.sortTheDataAry);
		} catch (err){
			alert ('tableObj.sortDataAryObj: '+err+', tablename: '+this.tableName);
			containerObj.displayAry(this.tableHash[this.tableName]['etc']);//xxxd
		}
	},
//==============================================================================
// ?@ getRows(): function?C
	getRows: function(){
		containerObj.jsDebug('tableObj.getRows()');
		var theDataAry= this.tableHash[this.tableName]['dataary'];
		if (theDataAry==undefined){theDataAry=new Array();}
		return theDataAry;
	},
//==============================================================================
// ?@ getSortedRows: function()?C
	getSortedRows: function(){
		containerObj.jsDebug('tableObj.getSortedRows()');
		var returnAry=new Array();
		var theDataAry= this.tableHash[this.tableName]['dataary'];
		this.sortDataAryObj();
		var theCnt=this.tableHash[this.tableName]['datasortary'].length;
		for (var lp=0;lp<theCnt;lp++){
			var indexNo=this.tableHash[this.tableName]['datasortary'][lp].sortId;
			var returnAryLength=returnAry.length;
			var theRow=this.tableHash[this.tableName]['dataary'][indexNo];
			returnAry[returnAryLength]=theRow;
		}
		return returnAry;
	},
//==============================================================================
// ?@ getRowsByDate: function(theYearNo,theMonthNo, theDayNo, selectColumn, selectRange)?C
	getRowsByDate: function(theYearNo,theMonthNo,theDayNo,selectColumn,selectRange){
		containerObj.jsDebug('tableObj.getRowsByDate(theYearNo,theMonthNo,theDayNo,selectColumn,selectRange)');
		returnAry=this.getRowsByDateV2(theYearNo,theMonthNo,theDayNo,selectRange);
		return returnAry;
	},
//==============================================================================
// ?@ getRowsByDateV2: function(startYearNo,startMonthNo,startDayNo,selectRange)
	getRowsByDateV2: function(startYearNo,startMonthNo,startDayNo, selectRange){
		containerObj.jsDebug('tableObj.getRowsByDateV2(theYearNo,theMonthNo,theDayNo,selectColumn,selectRange)');
		var tableName=this.tableName;
		this.sortDataAryObj();
		var debugStrg='';
		var startDate=startMonthNo+'/'+startDayNo+'/'+startYearNo;
		endDate=utilObj.getEndDate(startDate,selectRange);
		endDate=utilObj.convertDate(endDate,'internal');
		startDate=utilObj.convertDate(startDate,'internal');//just for debugging
		endDateAry=endDate.split('-');
		endYearNo=Number(endDateAry[0]);
		endMonthNo=Number(endDateAry[1]);
		endDayNo=Number(endDateAry[2]);
		var dataSortAry=this.tableHash[tableName]['datasortary'];
		var returnAry=new Array();
		var theSortLen=this.tableHash[tableName]['datasortary'].length;
		var foundOne=false;
		for (var getLp=0;getLp<theSortLen;getLp++){
			var dataId=dataSortAry[getLp].sortId;
			var sortDate=dataSortAry[getLp].sortDate;
			var sortDateAry=sortDate.split('-');
			var sortYearNo=Number(sortDateAry[0]);
			var sortMonthNo=Number(sortDateAry[1]);
			var sortDayNo=Number(sortDateAry[2]);
			if (startYearNo<=sortYearNo && endYearNo>=sortYearNo){
				if ((startMonthNo<=sortMonthNo && endMonthNo>=sortMonthNo) || endYearNo>sortYearNo){
					var itIsYounger=false;
					var itIsOlder=false;
        			if (sortMonthNo>startMonthNo){var itIsOlder=true;}
        			else if (sortMonthNo==startMonthNo){
          				if (sortDayNo>=startDayNo){itIsOlder=true;}
        			}
        			if (sortMonthNo<endMonthNo){itIsYounger=true;}
        			else if (sortMonthNo==endMonthNo){
          				if (sortDayNo<=endDayNo){itIsYounger=true;}
        			}
        			if (itIsYounger && itIsOlder) {
						theLen=returnAry.length;
						returnAry[theLen]=this.tableHash[tableName]['dataary'][dataId];
						//debugStrg+='ta.day inside: '+startDate+' < '+ sortDate + ' < '+ endDate + ': '+ dataSortAry[getLp].sortId+ ', '+dataSortAry[getLp].sortTime+"\n";//xxx
						foundOne=true;
					}
					else {
						if (foundOne){getLp=theSortLen;}
						//debugStrg+='ta.day outside: '+startDate+' < '+ sortDate + ' < '+ endDate+"\n";//xxxd
					}
				}
				else {
					if (foundOne){getLp=theSortLen;}
					//debugStrg+='ta.month outside: '+startDate+' < '+ sortDate + ' < '+ endDate+"\n";//xxxd
				}
			}
			else {
				if (foundOne){getLp=theSortLen;}
				//debugStrg+='ta.year outside: '+startDate+' < '+ sortDate + ' < '+ endDate+"\n";//xxxd
			}
		}
		//debugStrg+='end of loop';//xxxd
		//alert (debugStrg);//xxxd
		return returnAry;
	},
//=============================================================================deprecated
	// ?@openForm: function(dataProfileId) ?C		
	linkToForm: function(rowNo){
		containerObj.jsDebug('tableObj.linkToForm('+rowNo+')');
		alert ('this is deprecated');
		tableDataAry=this.tableHash[this.tableName]['dataary'][rowNo];
		//alert (rowNo+': '+tableDataAry);//xxx
		var tableDataDefStrg=this.tableHash[this.tableName]['etc'].get('datadef');
		tableDataDefStrg=tableDataDefStrg+'';
		var tableDataDefAry = tableDataDefStrg.split('~');
		var formDataAry=new Hash();
		var theCnt=tableDataDefAry.length;
		for (var lp=0;lp<theCnt;lp++){
			//alert (tableDataDefAry[lp]+', '+tableDataAry[lp]);//xxx
			formData.set(tableDataDefAry[lp],tableDataAry[lp]);
		}
		this.tableHash[this.tableName]['etc'].set('currentrow',rowNo);
		formObj.openForm(formData);
	}, 
//==============================================================================
	// ?@openForm: function(dataProfileId) ?C
	openForm: function(dataProfileId){
		containerObj.jsDebug('tableObj.linkToForm('+dataProfileId+')');
		tableName=this.tableName;
		rowNo=this.tableHash[tableName]['datakeyindexhash'].get(dataProfileId);
		tableDataAry=this.tableHash[tableName]['dataary'][rowNo];
		formData=this.convertToHash(tableDataAry);
		this.tableHash[this.tableName]['etc'].set('currentrow',rowNo);
		formObj.openForm(formData);
	},
//==============================================================================
// ?@convertToHash: function(tableDataAry) ?C
	convertToHash: function(tableDataAry){
		containerObj.jsDebug('tableObj.convertToHash(tableDataAry');
		var tableDataDefStrg=this.tableHash[this.tableName]['etc'].get('datadef');
		tableDataDefStrg=tableDataDefStrg+'';
		var tableDataDefAry = tableDataDefStrg.split('~');
		var dataHash=new Hash();
		var theCnt=tableDataDefAry.length;
		for (var lp=0;lp<theCnt;lp++){
			try {
				dataHash.set(tableDataDefAry[lp],tableDataAry[lp]);
			}
			catch (err){
				if (tableDataAry == undefined){
					var aryName='tabledataary';
				}
				else {
					var aryName='tabledatadefary';
				}
				alert ('error with array '+aryName+' lp: '+lp);
				containerObj.displayStack();
				theCnt=0;
			}
		}
		return dataHash;
	},
//==============================================================================
	// ?@insertRow: function() ?C
	insertRow: function(){
		containerObj.jsDebug('tableObj.insertRow()');
		var tableName=this.tableName;
		var tst=this.tableHash[tableName]['dataary'];
		if (tst==undefined){this.tableHash[tableName]['dataary']=new Array();}
		rowNo=this.tableHash[this.tableName]['dataary'].length;
		tableDataAry=new Array();
		//alert (rowNo+': '+tableDataAry);//xxx
		var tableDataDefStrg=this.tableHash[this.tableName]['etc'].get('datadef');
		tableDataDefStrg=tableDataDefStrg+'';
		var tableDataDefAry = tableDataDefStrg.split('~');
		var formData=new Hash();
		var theCnt=tableDataDefAry.length;
		for (var lp=0;lp<theCnt;lp++){
			//alert (tableDataDefAry[lp]+', '+tableDataAry[lp]);//xxx
			formData.set(tableDataDefAry[lp],'');
		}
		this.tableHash[this.tableName]['etc'].set('currentrow',rowNo);
		formObj.openForm(formData);
	}, 
//==============================================================================
//?@setError: function(errorMsg)
	setError: function(errorMsg){
		containerObj.jsDebug('tableObj.setError('+errorMsg+')');
		this.tableHash[tableName]['etc'].set('errorcode',errorMsg);
		alert (errorMsg);
	},
//==============================================================================
// ?@setTableName: function(tableName) ?C
	setTableName: function(tableName){
		containerObj.jsDebug('tableObj.setTableName('+tableName+')');
		//alert ('set table name to: '+tableName);//xxx
		this.tableName=tableName;
		var tst=this.tableHash[this.tableName];
		if (tst==undefined){this.tableHash[this.tableName]=new Hash();}
	},
//==============================================================================
// ?@setName: function(tableName) ?C
	setName: function(tableName){this.setTableName(tableName);},
//==============================================================================
// ?@loadEtc: function(etcName,etcValue)?C
	loadEtc: function(etcName,etcValue){
		//alert (etcName+': '+etcValue);//xxx
		containerObj.jsDebug('tableObj.loadEtc('+etcName+')');
		var tst=this.tableHash[this.tableName]['etc'];
		if (tst==undefined){this.tableHash[this.tableName]['etc']=new Hash();}
		this.tableHash[this.tableName]['etc'].set(etcName,etcValue);
	},
//==============================================================================
//?@loadDisplay: function(displayStrg)?C
	loadDisplay: function(displayStrg){
		containerObj.jsDebug('tableObj.loadDisplay(displaystrg:...)');
		var thisDisplayAry=displayStrg.split('~');
		tst=this.tableHash[this.tableName]['displayary'];
		if (tst==undefined){this.tableHash[this.tableName]['displayary'] = new Array();}
		this.tableHash[this.tableName]['displayary'][this.tableHash[this.tableName]['displayary'].length] = thisDisplayAry;
	},
//==============================================================================
	//?@loadSelect: function(selectStrg)?C
	loadSelect: function(selectStrg){
		containerObj.jsDebug('tableObj.loadSelect(selectstrg:...)');
		tst=this.tableHash[this.tableName]['selectary'];
		if (tst==undefined){this.tableHash[this.tableName]['selectary'] = new Array();}
		this.tableHash[this.tableName]['selectary'][this.tableHash[this.tableName]['selectary'].length] = selectStrg;
	},
//==============================================================================
	//?@loadData: function(dataStrg)?C
	loadData: function(dataStrg){
		containerObj.jsDebug('tableObj.dataStrg(datastrg:...)');
	   	var thisDataAry=dataStrg.split('~');
	   	//document.write(dataStrg+'<br>');//xxx
		tst=this.tableHash[this.tableName]['dataary'];
	   	if (tst==undefined){this.tableHash[this.tableName]['dataary'] = new Array();}
	   	var currentId=this.tableHash[this.tableName]['dataary'].length;
	   	this.tableHash[this.tableName]['dataary'][currentId] = thisDataAry;
	   	var areYouLive=calendarObj.areYouAlive();
	   	if (areYouLive){
		   	var checkTableName=calendarObj.getEtcValue('calendarentrydbtablename');
	   	}
	   	else {
	   		checkTableName='thereisnoname';
	   	}
	   	if (this.tableName == checkTableName){
		   	tst=this.tableHash[this.tableName]['datasortary'];
		   	if (tst==undefined){this.tableHash[this.tableName]['datasortary'] = new Array();}
		   	var datePos=this.getEtcValue('datepos');
		   	if (datePos==undefined){
			   	var dateName=calendarObj.getEtcValue('calendarentrydatename');
	   			var timeName=calendarObj.getEtcValue('calendarentrystarttimename');
	   			var dataDefs=this.getEtcValue('datadef');
	   			var dataDefsAry=dataDefs.split('~');
	   			var getCtr=0;
	   			for (var lp=0;lp<dataDefsAry.length;lp++){
	   				if (dateName==dataDefsAry[lp]){
	   					this.setEtcValue('datepos',lp);
	   					getCtr++;
	   				}
	   				if (timeName==dataDefsAry[lp]){
	   					this.setEtcValue('timepos',lp);
	   					getCtr++;
	   				}
	   				if (dataDefsAry[lp]=='tempprofileid'){
	   					this.setEtcValue('tempprofileidpos',lp);
	   					getCtr++;
	   				}	
	   				if (getCtr>=3){
	   					lp=dataDefsAry.length;
	   				}
	   			}
	   			datePos=this.getEtcValue('datepos');
		   	}
		   	timePos=this.getEtcValue('timepos');
		   	tempProfileIdPos=this.getEtcValue('tempprofileidpos');
		   	if (tempProfileIdPos != undefined && tempProfileIdPos != ''){
		   		thisDataAry[tempProfileIdPos]=false;
		   	}
		   	var theDate=thisDataAry[datePos];
		   	theDate=utilObj.convertDate(theDate,'internal');
		   	var theTime=thisDataAry[timePos];
	   		this.tableHash[this.tableName]['datasortary'][currentId]=new this.dataSortObj(currentId,theDate,theTime);
	   	}
	   	//document.write(theLen+', ');//xxx
	},
//==============================================================================
	//?@pagePrevious: function(tableName)?C
	pagePrevious: function(tableName){
		containerObj.jsDebug('tableObj.pagePrevious(tablename: '+tableName+')');
		this.tableName=tableName;
		var pageNo=this.tableHash[this.tableName]['etc'].get('pageno');
		pageNo--;
		if (pageNo<1){pageNo=1;}
		this.tableHash[this.tableName]['etc'].set('pageno',pageNo);
		this.displayPage();
	},
//==============================================================================
	//?@pageNext: function(tableName)?C
	pageNext: function(tableName){
		containerObj.jsDebug('tableObj.pageNext()');
		this.tableName=tableName;
		var pageNo=this.tableHash[this.tableName]['etc'].get('pageno');
		pageNo++;
		this.tableHash[this.tableName]['etc'].set('pageno',pageNo);
		this.displayPage();
	},
//==============================================================================
	//?@pageFirst: function()?C
	pageFirst: function(){
		containerObj.jsDebug('tableObj.pageFirst()');
		var pageNo=1;
		this.tableHash[this.tableName]['etc'].set('pageno',pageNo);
		this.displayPage();
	},
//==============================================================================
	//?@pageLast: function()?C
	pageLast: function(){
		containerObj.jsDebug('tableObj.pageLast()');
		var maxDataAry=this.tableHash[this.tableName]['etc'].get('maxdataary');
		var pageSize=this.tableHash[this.tableName]['etc'].get('pagesize');
		var pageNo=Math.round(maxDataAry / pageSize)+1;
		this.tableHash[this.tableName]['etc'].set('pageno',pageNo);
		this.displayPage();
	},
//==============================================================================xxxdwip
	//?@displayPage: function()?C
	displayPage: function(){
		utilObj.writeLog('debug1id','!!tableObj.displaypage!!');
//- copy in page number save during reset to priorpageno
		var pageNoId=this.tableHash[this.tableName]['etc'].get('pagenoid');
		var priorPageNo=this.tableHash[this.tableName]['etc'].get('priorpageno');
		if (priorPageNo != undefined){
			this.setEtcValue('pageno',priorPageNo);
			this.removeEtcValue('priorpageno');
		}
//- get page stuff
		var pageNo=Number(this.tableHash[this.tableName]['etc'].get('pageno'));
		var	pageSize=Number(this.tableHash[this.tableName]['etc'].get('pagesize'));
		var columnCnt=Number(this.tableHash[this.tableName]['etc'].get('columncnt'));
		var tableId=this.tableHash[this.tableName]['etc'].get('tableid');
		var maxDataAry=this.tableHash[this.tableName]['etc'].get('maxdataary');
		var displayAry=this.tableHash[this.tableName]['displayary'];
		var dataAry=this.tableHash[this.tableName]['dataary'];
		var reducedAry=this.tableHash[this.tableName]['reducedary'];
//- adjust page number and write if there is a spot to do it
		if (pageNo < 1){pageNo=1;}
		if (pageNoId != ''){
			try {$(pageNoId).innerHTML=pageNo;}
			catch (err){alert ('error with: '+pageNoId+', pageno: '+pageNo);}
		}
//- ???
		var startAryRow = (pageNo-1) * (pageSize) + 1;
		var rowCtr, columnCtr;
	//- why do we have to do the below? - it was blowing up on the extra row
		var adjPageSize = pageSize+1;
//- do reset stuff
		var reset=this.getEtcValue('reset');
		utilObj.writeLog('debug1id',"tableobj.dispg: reset: "+reset);
		if (reset==true){
			utilObj.writeLog('debug1id',"do reset for table");//xxxd
			this.setEtcValue('reset',false);
			reducedAry=this.tableHash[this.tableName]['displayary'];
			this.tableHash[this.tableName]['reducedary']=reducedAry;
//--- date select
			try {
				var fromDateId=userObj.getEtcValue(tableName+'_fromdateid');
				var toDateId=userObj.getEtcValue(tableName+'_todateid');
				var dateColName=userObj.getEtcValue(tableName+'_datecolname');
				utilObj.writeLog('debug3id','tableObj.dispge: fromdateid: '+fromDateId+', todateid: '+toDateId+', datecolname: '+dateColName);
				if (fromDateId != undefined && fromDateId != '' && toDateId != undefined && toDateId != ''){
					if (dateColName != undefined && dateColName != ''){
						//this.setEtcValue('dontdisplaypage',true);
						var selectItAry = new Array();
						selectItAry[selectItAry.length]=this.tableName;
						selectItAry[selectItAry.length]=fromDateId;
						selectItAry[selectItAry.length]=toDateId;
						selectItAry[selectItAry.length]=dateColName;
						this.selectRowsValue(selectItAry);
						var reducedAry=this.tableHash[this.tableName]['reducedary'];
					}
				}
			}
			catch (err){
				alert ('tableObj.displayPage: '+err);
				containerObj.displayHash(this.tableName,this.tableHash[this.tableName]['etc']);
			}
			var reducedAryLen=reducedAry.length;
			utilObj.writeLog('debug3id','after selectdate before select reducedAryLen: '+reducedAryLen);
//--- typeselect
			try {
				var valueSelect=userObj.getEtcValue(tableName+'_selectcolumnvalue');
				var columnSelect=userObj.getEtcValue(tableName+'_selectcolumnname');
				var columnNoSelect=userObj.getEtcValue(tableName+'_selectcolumnno');
				utilObj.writeLog('debug1id','tableObj.dispge: valueselect: '+valueSelect+', columnSelect: '+columnSelect+', columnNoSelect: '+columnNoSelect);
				if (valueSelect != undefined){
					if (columnSelect != null && columnSelect != undefined){
						this.setEtcValue('dontdisplaypage',true);
						var selectItAry = new Array();
						selectItAry[selectItAry.length]=this.tableName;
						selectItAry[selectItAry.length]=valueSelect;
						selectItAry[selectItAry.length]=columnSelect;
						this.selectRowsValue(selectItAry);
						var reducedAry=this.tableHash[this.tableName]['reducedary'];
					}
				}
			}
			catch (err){
				alert ('tableObj.displayPage: '+err+' nameString: '+nameString);
				containerObj.displayHash(this.tableName,this.tableHash[this.tableName]['etc']);
			}
			var reducedAryLen=reducedAry.length;
			utilObj.writeLog('debug3id','after selectvalue before select reducedAryLen: '+reducedAryLen);
//--- general select
			try {
				var nameString=userObj.getEtcValue(this.tableName+'_namestring');
				utilObj.writeLog('debug3id','tableobj.dispge: namestring: '+nameString);
				if (nameString != undefined){
					var nameStringValue=$(nameString).value;
					if (nameStringValue != null && nameStringValue != undefined){
						utilObj.writeLog('debug3id','tableObj.displayPage call selectRows');
						this.selectRows(nameString);
						var reducedAry=this.tableHash[this.tableName]['reducedary'];
					}
				}
				else {
					//reducedAry=this.tableHash[this.tableName]['displayary'];
					utilObj.writeLog('debug3id','tableObj.displayPage: namestring is undefined so do nothing');
				}
			}
			catch (err){
				alert ('tableObj.displayPage: '+err+' nameString: '+nameString);
				containerObj.displayHash(this.tableName,this.tableHash[this.tableName]['etc']);
			}
		}
		else {
			if (reducedAry == undefined){
				utilObj.writeLog('debug3id',"tableObj.displayPage: reset is false and reducedary is: "+reducedAry+", reducedary=displayary");
				reducedAry=this.tableHash[this.tableName]['displayary'];
				this.tableHash[this.tableName]['reducedary']=reducedAry;
			}
		}
//
		utilObj.writeLog('debug3id',"tableObj.displayPage: reducedaryLen: "+reducedAry.length+', displayaryLen: '+displayAry.length);//xxxd
		maxDataAry=reducedAry.length;
		this.tableHash[this.tableName]['etc'].set('maxdataary',maxDataAry);
		utilObj.writeLog('debug3id',"tableObj.displayPage: adjPageSize: "+adjPageSize+', maxDataAry: '+maxDataAry);
		var debugStrg='';
		for (rowCtr=1;rowCtr<adjPageSize;rowCtr++){
			//utilObj.writeLog('debug3id','rowctr: '+rowCtr);
			var curAryRowCtr=startAryRow+(rowCtr-1);
			if (curAryRowCtr < maxDataAry){
				//aborts below because tableid is null
				if (tableId == ''){alert ('tableid is null!!!');exit();}
				else {
					var tableAccess=document.getElementById(tableId);
					try {var rowAccess=tableAccess.rows[rowCtr].cells;}
					catch(err){alert ('rowaccess error: row: '+rowCtr+', adjpagesize: '+adjPageSize+', tableid: '+tableId);}						
					//debugStrg+="\n"+', row: '+rowCtr+': ';
					for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
						var newData=reducedAry[curAryRowCtr][columnCtr];
						rowAccess[columnCtr].innerHTML=newData;
						//rowAccess[columnCtr].innerHTML=columnCtr+':'+newData;//xxxd
						//if (columnCtr==10){alert (newData+'xxxxx');}
					}
				}
			}
			else {
//- if less data than page size then rows may not exist!
				var rowError=false;
				var tableAccess=document.getElementById(tableId);
				try {
					var rowAccess=tableAccess.rows[rowCtr].cells;
				}
				catch (err){
					rowError=true;
					//alert ('tableObj.displayPage: '+err+' rowCtr: '+rowCtr+', tableid: '+tableId);
				}
				if (!rowError){
					for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
						rowAccess[columnCtr].innerHTML='&nbsp;';
					}
				}
			}		
		}
		//utilObj.writeLog('debug3id','debugStrg: '+debugStrg);
	},
//==============================================================================
	//?@preSelRows: function(jobParamsAry)?C
	preSelRows: function(jobParamsAry){
		utilObj.writeLog('debug1id','!!tableObj.preselrows!!');
		var tableName=jobParamsAry[0];
//- select rows
		var nameString=jobParamsAry[1];
		this.tableName=tableName;
		utilObj.writeLog('debug1id','call selectrows with tablename: '+tableName+', nameString: '+nameString);
		this.selectRows(nameString);
//- re display page
		this.displayPage();
	},
//==============================================================================xxxdwip
	//?@selectRows: function(nameString)?C
	selectRows: function(nameString){
		utilObj.writeLog('debug1id','!!tableObj.selectRows!!');
		var selectAry=this.tableHash[this.tableName]['newselectary'];
		if (selectAry == undefined){
			var selectAry=this.tableHash[this.tableName]['selectary'];
		}
		var dataAry=this.tableHash[this.tableName]['newdataary'];
		if (dataAry == undefined || dataAry == ''){
			var dataAry=this.tableHash[this.tableName]['dataary'];
		}
		var displayAry=this.tableHash[this.tableName]['newdisplayary'];
		if (displayAry == undefined){
			displayAry=this.tableHash[this.tableName]['displayary'];
		}
		//xxxd - below is grabbing the id value from the others table
		var selectString = $(nameString).value;
		//alert ('nameString: '+nameString+'selectstring: '+selectString);//
		this.setEtcValue('namestring',nameString);
		userObj.setEtcValue(this.tableName+'_namestring',nameString);
		var selectString_lower = selectString.toLowerCase();
		var selectStringLen = selectString.length;
		var posCtr, posCtr2;
		var chkData, chkData_lower, chkChar, dataCtr, maxDataAryBak;
		var lineNo = 0;
		var reducedAry = new Array();
		//var reducedDataAry = new Array();
		//- get heading in there
		reducedAry[0]=displayAry[0];
		//reducedDataAry[0]=displayAry[0];
		var maxDataAry=dataAry.length;
		var debugStrg='';
		if (selectString == ''){
			reducedAry=displayAry;
			//reducedDataAry = new Array();
			//reducedDataAry=dataAry;
			//reducedDataAry.unshift(displayAry[0]);
			debugStrg+="make reducedary same as displayary<br>";
		}
		else {
			//xxxd!!! selectary has row zero for heading of displayary so start with one and go one more-data ary doesnt have heading line
			debugStrg+="!!do the loop maxdataary: "+maxDataAry+"<br>";
			for (dataCtr=1;dataCtr<=maxDataAry;dataCtr++){
				chkData=selectAry[dataCtr];
				var errorFlg=false;
				try {
					chkData_lower=chkData.toLowerCase();
				}
				catch (err){
					//alert ('tableObj.selectrows: '+err+', selectarylen: '+selectAry.length+', datactr: '+dataCtr);
					errorFlg=true;
					debugStrg+=dataCtr+': error! chkdata: '+chkData+'<br>';
				}
				if (!errorFlg){
					posCtr=chkData_lower.indexOf(selectString_lower);
					debugStrg+=dataCtr+': '+posCtr+', '+chkData_lower+', '+selectString_lower+"<br>";//xxxd
					if (posCtr>-1){
						reducedAry[reducedAry.length]=displayAry[dataCtr];
						//reducedDataAry[reducedDataAry.length]=dataAry[dataCtr];
					}
				}
			}
		}
		//utilObj.writeLog('debug1id',debugStrg);
		pageNo=1;
		lineNo=1;
		maxDataAry=reducedAry.length;
		this.tableHash[this.tableName]['reducedary']=reducedAry;
		//this.tableHash[this.tableName]['reduceddataary']=reducedDataAry;
		var reducedAryLen=reducedAry.length;
		utilObj.writeLog('debug1id','end of selectrows reducedarylen: '+reducedAryLen);
	},
//==============================================================================xxxdwip
	//?@selectRowsDate: function(jobParamsAry)?C
	selectRowsDate: function(jobParamsAry){
		utilObj.writeLog('debug1id','!!tableObj.selectRowsDate!!');
		var tableName=jobParamsAry[0];
		this.tableName=tableName;
		var dataAry=this.tableHash[this.tableName]['dataary'];
//- from Date
		var fromDateId=jobParamsAry[1];
		var fromDateRaw=$(fromDateId).value;
		var fromDate=utilObj.convertDate(fromDateRaw,'internal');
		var fromDateNumber=utilObj.convertDate(fromDate,'millisecondsbeginofday');
//- to Date
		var toDateId=jobParamsAry[2];
		var toDateRaw=$(toDateId).value;
		var toDate=utilObj.convertDate(toDateRaw,'internal');
		var toDateNumber=utilObj.convertDate(toDate,'millisecondsendofday');
//- column number of date column
		var dateColName=jobParamsAry[3];
		//containerObj.displayHash('etc',this.tableHash[this.tableName]['etc']);
		var dataDef=this.getEtcValue('datadef');
		try {
			var colNamesAry=dataDef.split('~');
		} catch (err){alert (this.tableName+': '+err);exit();}
		var colNamesAryLength=colNamesAry.length;
		var theDateCol=9999;
		for (var lp=0;lp<colNamesAryLength;lp++){
			var colName=colNamesAry[lp];
			if (colName == dateColName){
				var theDateCol=lp;
				break;
			}
		}
		this.setEtcValue('fromdate',fromDate);
		this.setEtcValue('todate',toDate);
		userObj.setEtcValue(fromDateId,this.tableName+'_fromdateid');
		userObj.setEtcValue(toDateId,this.tableName+'_todateid');
		userObj.setEtcValue(dateColName,this.tableName+'_datecolname');
		var posCtr, posCtr2;
		var chkData, chkData_lower, chkChar, dataCtr, maxDataAryBak;
		var lineNo = 0;
		var displayAry=this.tableHash[this.tableName]['displayary'];
		var selectAry = this.tableHash[this.tableName]['selectary'];
		var reducedAry = new Array();
		var newDataAry = new Array();
		var newSelectAry = new Array();
		//- get heading in there
		reducedAry[0]=displayAry[0];
		var maxDataAry=this.tableHash[this.tableName]['dataary'].length;
		maxDataAry=Number(maxDataAry)+Number(1);
		utilObj.writeLog('debug1id','tableObj.selectRowsDate: todate: '+toDate+', fromDate: '+fromDate+', thedatecol: '+theDateCol+', maxdataary: '+maxDataAry);
		var debugStrg='compare detail...<br>';
		if (toDate == '' || fromDate == '' || theDateCol == 9999){reducedAry=displayAry;}
		else {
			for (dataCtr=1;dataCtr<maxDataAry;dataCtr++){
				chkDateRaw=dataAry[dataCtr-1][theDateCol];
				chkDate=utilObj.convertDate(chkDateRaw,'internal');
				chkDateNumber=utilObj.convertDate(chkDate,'millisecondsbeginofday');
				if (chkDateNumber != undefined){
					var debugStrg2='fromdate: '+fromDateNumber+' <= chkDateNumber: '+chkDateNumber+' <= thDateNumber: '+toDateNumber;
					if (fromDateNumber <= chkDateNumber && toDateNumber >= chkDateNumber){
						debugStrg2+=" ... correct<br>";
						reducedAry[reducedAry.length]=displayAry[dataCtr];
						newDataAry[newDataAry.length]=dataAry[dataCtr-1];
						newSelectAry[newSelectAry.length]=selectAry[dataCtr-1];
					}
					else {
						debugStrg2+=" ... false<br>";
					}
					debugStrg=debugStrg2+debugStrg;
				}
				else {
					alert ('invalid date: '+chkDate);
				}
			}
			utilObj.writeLog('debug1id',debugStrg);
		}
		pageNo=1;
		lineNo=1;
		maxDataAry=reducedAry.length;
		this.setEtcValue('maxdataary',maxDataAry);
		this.tableHash[this.tableName]['reducedary']=reducedAry;
		this.tableHash[this.tableName]['newselectary']=newSelectAry;
		this.tableHash[this.tableName]['newdataary']=newDataAry;
		this.tableHash[this.tableName]['newdisplayary']=reducedAry;
		this.setEtcValue('reset',false);
		utilObj.writeLog('debug1id','since redid reducedary, newselect, newdata, newdisplay then turn off reset because no need');
		utilObj.writeLog('debug1id','end of selectrowsdate: reducedarylen: '+reducedAry.length+', newselectarylen: '+newSelectAry.length+', newdataarylen: '+newDataAry.length+', newdisplayarylen: '+reducedAry.length);
	},
//==============================================================================xxxdwip
	//?@selectRowsValue: function(jobParamsAry)?C
	selectRowsValue: function(jobParamsAry){
		utilObj.writeLog('debug1id','!!selectrowsvalue!!');
		var tableName=jobParamsAry[0];
		this.tableName=tableName;
		var dataAry=this.tableHash[this.tableName]['dataary'];
//- value to select
		var selectColumnValue=jobParamsAry[1];
//- column number to select from
		var selectColumnName=jobParamsAry[2];
		userObj.setEtcValue('selectcolumnvalue',selectColumnValue);
		userObj.setEtcValue('selectcolumnname',selectColumnName);
		//containerObj.displayHash('etc',this.tableHash[this.tableName]['etc']);
		var dataDef=this.getEtcValue('datadef');
		try {
			var colNamesAry=dataDef.split('~');
		} catch (err){alert (this.tableName+': '+err);exit();}
		var colNamesAryLength=colNamesAry.length;
		var theSelCol=9999;
		for (var lp=0;lp<colNamesAryLength;lp++){
			var colName=colNamesAry[lp];
			//alert (colName+': '+selectColumnName);//xxxf
			if (colName == selectColumnName){
				var theSelCol=lp;
				break;
			}
		}
		if (theSelCol==9999){alert ('tableObj.selectRowsValue: invalid select column: '+theSelCol);exit();}
		//exit();//xxxf
		//xxxd ??? why are we doing the below
		userObj.setEtcValue(tableName+'_selectcolumnvalue',selectColumnValue);
		userObj.setEtcValue(tableName+'_selectcolumnname',selectColumnName);
		userObj.setEtcValue(tableName+'_selectcolumnno',theSelCol);
		var posCtr, posCtr2;
		var chkData, chkData_lower, chkChar, dataCtr, maxDataAryBak;
		var lineNo = 0;
		var displayAry=this.tableHash[this.tableName]['displayary'];
		var selectAry = this.tableHash[this.tableName]['selectary'];
		var reducedAry = new Array();
		var newDataAry = new Array();
		var newSelectAry = new Array();
		//- get heading in there
		reducedAry[0]=displayAry[0];
		newSelectAry[0]=selectAry[0];
		var maxDataAry=this.tableHash[this.tableName]['dataary'].length;
		maxDataAry=Number(maxDataAry)+Number(1);
		if (selectColumnValue == ''){reducedAry=displayAry;}
		else {
			for (dataCtr=1;dataCtr<maxDataAry;dataCtr++){
				chkValueRaw=dataAry[dataCtr-1][theSelCol];
				//alert ('datactr: '+dataCtr+', name: '+dataAry[dataCtr-1][1]+', chkvalueraw: '+chkValueRaw+', theselcol: '+theSelCol+', selectColumnName: '+selectColumnName);//
				if (chkValueRaw != undefined){
					if (chkValueRaw == selectColumnValue || selectColumnValue == '?GALL?G'){
						reducedAry[reducedAry.length]=displayAry[dataCtr];
						newSelectAry[newSelectAry.length]=selectAry[dataCtr];
						newDataAry[newDataAry.length]=dataAry[dataCtr-1];
					}
				}
				else {
					alert ('invalid data! selectcolumnname: '+selectColumnName+', column no: '+theSelCol+', chkvalueraw: '+chkValueRaw);
				}
			}
		}
		pageNo=1;
		lineNo=1;
		maxDataAry=reducedAry.length;
		this.setEtcValue('maxdataary',maxDataAry);
		this.tableHash[this.tableName]['reducedary']=reducedAry;
		this.tableHash[this.tableName]['newselectary']=newSelectAry;
		var newSelLen=newSelectAry.length;
		this.tableHash[this.tableName]['newdataary']=newDataAry;
		var newDataLen=newDataAry.length;
		this.tableHash[this.tableName]['newdisplayary']=reducedAry;
		var reducedAryLen=reducedAry.length;
		utilObj.writeLog('debug1id',"tableObj.selectRowsValue at end: newSelectAry: "+newSelLen+', newdatalen: '+newDataLen+', reducedLen: '+reducedAryLen);
	},
//==============================================================================
	//?@removeDisplay: function()?C
	removeDisplay: function(){
		containerObj.jsDebug('tableObj.removeDisplay()');
		containerObj.removeDisplay();
	},
//==============================================================================
	//?@getEtcValue: function(etcName)?C
	getEtcValue: function(etcName){
		containerObj.jsDebug('tableObj.getEtcValue(etcName: '+etcName+')');
		try {etcValue=this.tableHash[this.tableName]['etc'].get(etcName);}
		catch(err){
			alert ('tablename: '+this.tableName+', filename: '+etcName+' is not in etc!');
			containerObj.displayStack('ta.getEtcValue');
		}
		return etcValue;
	},
//==============================================================================
	//?@setEtcValue: function(etcName,etcValue)?C
	setEtcValue: function(etcName,etcValue){
		containerObj.jsDebug('tableObj.setEtcValue(etcName: '+etcName+', etcvalue: '+etcValue+')');
		this.tableHash[this.tableName]['etc'].set(etcName,etcValue);
	},
//==============================================================================
	//?@removeEtcValue: function(etcName)?C
	removeEtcValue: function(etcName){
		//containerObj.displayHash('etcbefore',this.tableHash[this.tableName]['etc']);
		this.tableHash[this.tableName]['etc'].unset(etcName);
		//containerObj.displayHash('etcafter',this.tableHash[this.tableName]['etc']);
	},
//==============================================================================
	//?@appendToServerQueue: function(rowNo)?C
	appendToServerQueue: function(rowNo){
		containerObj.jsDebug('tableObj.appendToServerQueue(rowNo: '+rowNo+')');
		var tableName=this.tableName;
		var tst=this.tableHash[this.tableName]['toserver'];
		if (tst == undefined){this.tableHash[this.tableName]['toserver']=Array();}
		toServerStrg=this.tableHash[tableName]['toserver'].toString();
		toServerStrg=','+toServerStrg+',';
		if (toServerStrg.search(rowNo)<0){
			var lastNo=this.tableHash[tableName]['toserver'].length;
			this.tableHash[tableName]['toserver'][lastNo]= rowNo;
			toServerStrg=this.tableHash[tableName]['toserver'].toString();
			toServerStrg=','+toServerStrg+',';
			var toServerAry=this.tableHash[tableName]['toserver'];
		}
	},
//==============================================================================
	//?@setCurrentRow: function(rowHash)?C
	setCurrentRow: function(rowHash){
		containerObj.jsDebug('tableObj.setCurrentRow(rowHash)');
		tableName=this.tableName;
		var keyName=this.getEtcValue('keyname');
		var keyValue=rowHash.get(keyName);
		if (keyValue==undefined || keyValue==''){
			keyValue=Math.random();
			keyValue=keyValue * 100000;
			keyValue=Math.round(keyValue);
			rowHash.set(keyName,keyValue);
			rowHash.set('tempprofileid',true);
			//alert ('ta.scr: since keyvalue is undefined set tempprofileid');//xxx
			var tst=this.tableHash[tableName]['dataary'];
			if (tst==undefined){
				this.tableHash[tableName]['dataary']= new Array();
			}
			try {
				rowNo=this.tableHash[tableName]['dataary'].length;
			} catch (err){
				alert ('tableObj.setCurrentRow: '+err+' tablename: '+tableName+' dataary');
			}
			this.updateDataAryIndex(keyValue, rowNo);
		}
		else {
			var rowNo=this.tableHash[tableName]['datakeyindexhash'].get(keyValue);
			if (rowNo==undefined){
				this.rebuildKeyIndex();
				var rowNo=this.tableHash[tableName]['datakeyindexhash'].get(keyValue);
			}
		}
		if (rowNo!=undefined){
			this.setEtcValue('currentrow',rowNo);	
		}
		else {
			alert ('ta.setcurrentrow: invalid rowno: '+rowNo+"\n"+'tablename: '+tableName+', keyvalue: '+keyValue);exit();
		}
	},
//==============================================================================
	//?@fileUpdate: function(rowHash)?C
	fileUpdate: function(rowHash){
		containerObj.jsDebug('tableObj.fileUpdate(rowAry: ...)');
		var tmpAdj=1;
	//- init
		var tableName=this.tableName;
		var currentRow=this.getEtcValue('currentrow');
		if (currentRow == undefined){
			alert ('ta.fileupdate: invalid current row: '+currentRow);
			exit();
		}
	//- save rowno to transfer directory
		this.appendToServerQueue(currentRow);
//- write row onto data
		var dataDefStrg=this.tableHash[this.tableName]['etc'].get('datadef');
		dataDefStrg=dataDefStrg+'';
		var dataDefAry = dataDefStrg.split('~');
		var foreignTableNamesStrg=this.getEtcValue('foreigntablenames');
		var foreignTableNamesAry=foreignTableNamesStrg.split('~');
		var foreignKeyNamesStrg=this.getEtcValue('foreignkeynames');
		var foreignKeyNamesAry=foreignKeyNamesStrg.split('~');
		var oldRowDataAry=this.tableHash[tableName]['dataary'][currentRow];
		//- below would happen if inserting a row
		if (oldRowDataAry==undefined){var oldRowDataAry=new Array();}
		var rowDataAry=new Array();
		var oldRowDataHash=new Hash();
		var theColumnCnt=dataDefAry.length;
		var foreignHash = new Hash();
//-------------------------------- loop through all columns looking for foreign keys
		for (var columnLp=0;columnLp<theColumnCnt;columnLp++){
			var columnName=dataDefAry[columnLp];
			var foreignTableName=foreignTableNamesAry[columnLp];
			if (foreignTableName != ''){
//-------------------------------- foreign key so get the foreign row and save
				var foreignKeyValue=rowHash.get(columnName);
				var tst=this.tableHash[foreignTableName];
				if (tst!=undefined){
					var foreignRowNo=this.tableHash[foreignTableName]['datakeyindexhash'].get(foreignKeyValue);
					if (foreignRowNo != undefined){
						var foreignRowAry=this.tableHash[foreignTableName]['dataary'][foreignRowNo];
						foreignDataDefs=this.tableHash[foreignTableName]['etc'].get('datadef');
						foreignDataDefsAry=foreignDataDefs.split('~');
						var foreignRowHash=new Hash();
						var dmyCnt=foreignDataDefsAry.length;
						for (var dmyLp=0;dmyLp<dmyCnt;dmyLp++){
							foreignDataDefsName=foreignDataDefsAry[dmyLp];
							foreignRowHash.set(foreignDataDefsName,foreignRowAry[dmyLp]);				
						}
						foreignHash[columnName]=foreignRowHash;
					}
					else {foreignHash[columnName]=new Hash();}
				}
				else {foreignHash[columnName]=new Hash();}
			}
		}
//--------------------------------- update row with foreignnames
		for (var columnLp=0;columnLp<theColumnCnt;columnLp++){
			var columnName=dataDefAry[columnLp];
			var columnValue=rowHash.get(columnName);
			var foreignKeyName=foreignKeyNamesAry[columnLp];
			if (foreignKeyName != ''){
				var foreignRowHash=foreignHash[foreignKeyName];
				if (foreignRowHash != undefined){
					columnValue=foreignRowHash.get(columnName);
				}
			}
			rowDataAry[rowDataAry.length]=columnValue;
			oldRowDataHash.set(dataDefAry[lp],oldRowDataAry[lp]);
		}
//-------------------------------- save row into dataary xxx
		var tempProfileIdPos=this.getEtcValue('tempprofileidpos');
		if (tempProfileIdPos==undefined){
			this.getDataAryPointers();
			var tempProfileIdPos=this.getEtcValue('tempprofileidpos');
		}
		var oldRowDataAry=this.tableHash[tableName]['dataary'][currentRow];
		if (oldRowDataAry != undefined){
			var tempProfileId=oldRowDataAry[tempProfileIdPos];
			//alert ('ta.fileupdate: oldrowdataary tempprofileid: '+tempProfileId);//xxx
			if (tempProfileId==true){
				rowDataAry[tempProfileIdPos]=true;
			}
		}
		this.tableHash[tableName]['dataary'][currentRow]=rowDataAry;
		this.tableHash[tableName]['etc'].unset('currentrow');
		this.loadEtc('lastrowupdated',currentRow);
//-------------------------------- write row into tabledisplay
		var tableDefStrg=this.tableHash[tableName]['etc'].get('tabledef');
		tableDefStrg=tableDefStrg+'';
		var tableDefAry = tableDefStrg.split('~');
		var rowTableAry=new Array();
		var useRowNo=Number(currentRow)+Number(tmpAdj);
		var oldRowTableAry=this.tableHash[tableName]['displayary'][useRowNo];
		if (oldRowTableAry==undefined){var oldRowTableAry=new Array();}
		var theCnt=tableDefAry.length;
//------------------------ loop through tabledefary columns
		for (var lp=0;lp<theCnt;lp++){
			var oldRowValue=oldRowTableAry[lp];
			if (oldRowValue==undefined){
				oldRowValue='<p></p>';
			}
			leaveAlone=false;
			var newRowDataValue=rowHash.get(tableDefAry[lp]);
			if (newRowDataValue==undefined){
				newData=oldRowValue;
			}
			else {
				var pos=oldRowValue.indexOf('<');
				if (pos>=0){
//-------------- save old row html but put in new data
				var oldRowDataValue=oldRowDataHash.get(tableDefAry[lp]);
				if (oldRowDataValue==undefined){oldRowDataValue='';}
				if (oldRowDataValue != newRowDataValue){
					var startPos=oldRowValue.indexOf('>');
					var endPos=oldRowValue.indexOf('<',startPos);
					beginNewData=oldRowValue.substring(0,startPos+1);
					endNewData=oldRowValue.substring(endPos);
					newData=beginNewData+newRowDataValue+endNewData;
				}
				else {
					var newData=oldRowValue;
				}
				}
				else {
//-------------------- dont have any html, just data
					var newData=newRowDataValue;
				}
			}
			rowTableAry[rowTableAry.length]=newData;
		}
//------------------- update row, send to server msg, make icon blinking
		//alert ('rowtableary: '+rowTableAry+' rowno: '+Number(currentRow)+Number(tmpAdj));//xxx
		//vl=prompt(leaveAlone,'x');if (vl=='x'){exit();}
		var updateRowNo=Number(currentRow)+Number(tmpAdj);
		this.tableHash[tableName]['displayary'][updateRowNo]=rowTableAry;
		this.tableHash[tableName]['etc'].set('sendtoserver',true);
		var iconMenu=this.getEtcValue('tableiconmenu');
		if (iconMenu != ''){
			menuObj.swap(iconMenu);
			menuObj.setAlertClass('set');
			menuObj.reverseSwap();
		}
		else {alert ('no icon menu');}	
		var nameString=this.tableHash[tableName]['etc'].get('namestring');
		if (nameString==undefined || nameString==''){
			this.tableHash[tableName]['reducedary']=this.tableHash[tableName]['displayary'];
		}
		else {
			this.selectRows(nameString);
		}
		this.rebuildTheSortAry();
		this.displayPage();
	},
//==============================================================================
	//?@writeDbRowsToServer: function()?C
	writeDbRowsToServer: function(){
		containerObj.jsDebug('tableObj.writeDbRowsToServer()');
//-xxxr below needs to be fixed
		var jobName='pgesidesktop';
		var operationName='write_db_from_ajax';
//- end needing to fix
//========== updates
		var sendDataAry=new Array();
		var tableName=this.tableName;
//--- get dbtablename
		var dbTableName=this.getEtcValue('dbtablename');
		var theLen=sendDataAry.length;
		sendDataAry[theLen]='dbtablename|'+dbTableName;
//--- get keyname
		var keyName=this.getEtcValue('keyname');
		var theLen=sendDataAry.length;
		sendDataAry[theLen]='keyname|'+keyName;
//--- get column titles
		var dataDef=this.getEtcValue('datadef');
		var theLen=sendDataAry.length;
		sendDataAry[theLen]='datadef|'+dataDef;
//--- get column data
		var tempProfileIdPos=tableObj.getEtcValue('tempprofileidpos');
		var keyPos=tableObj.getEtcValue('keypos');
		if (tempProfileIdPos == undefined || keyPos == undefined){
			this.getDataAryPointers();
			var tempProfileIdPos=tableObj.getEtcValue('tempprofileidpos');
			var keyPos=tableObj.getEtcValue('keypos');
		}
		var queueAry=this.tableHash[tableName]['toserver'];
		if (queueAry==undefined){queueAry=new Array();}
		queueAry.each(function(rowNo) {
			if (rowNo != undefined){
				//this. does not work within this loop so had to do tableObj!!!
				tableDataAry=tableObj.tableHash[tableName]['dataary'][rowNo];
				//alert ('ta.wdbrts: id '+tableDataAry[keyPos]+', tempprofileid: '+tableDataAry[tempProfileIdPos]);//xxx
				updateRow=tableDataAry.join('~');
				sendDataAry[sendDataAry.length]='tabledata|'+updateRow;
			} 
		}); 
//======== now send deletes
		tst=this.tableHash[tableName]['sendtoserverdelete'];
		if (tst != undefined){
			var theDelNo=this.tableHash[tableName]['sendtoserverdelete'].length;
			if (theDelNo>0){
				var theLen=sendDataAry.length;
				var keyNoStrg='';
				var delim='';
				this.tableHash[tableName]['sendtoserverdelete'].each(function(keyNo) {
					if (keyNo != undefined){
						keyNoStrg+=delim+keyNo;
						delim='~';
					} 
				}); 
				sendDataAry[sendDataAry.length]='deldata|'+keyNoStrg;
			}
		}
		//containerObj.displayAry('jobname: '+jobName+', operationname: '+operationName);//xxx
		ajaxObj.ajaxPostToServer(jobName,operationName,sendDataAry);		
	},
//==============================================================================
	//?@clearUpdateFlags: function()?C
	clearUpdateFlags: function(){
		containerObj.jsDebug('tableObj.clearUpdateFlags()');
		tableName=this.tableName;
		this.tableHash[tableName]['toserver'] = new Array();
		this.tableHash[tableName]['etc'].set('sendtoserver',false);
		//alert ('tableobj: clearupdatflags: xxx');//xxx
		menuObj.setAlertClass('unset');
	},
//==============================================================================
	//?@convertRowAryToHash: function(rowAry)?C
	convertRowAryToHash: function(rowAry){
		containerObj.jsDebug('tableObj.convertRowAryToHash(rowAry)');
		var dataDefStrg=this.tableHash[this.tableName]['etc'].get('datadef');
		var dataDefAry = dataDefStrg.split('~');
		var theCnt=rowAry.length;
		rowHash = new Hash;
		for (var theLp=0;theLp<theCnt;theLp++){
			var dataName=dataDefAry[theLp];
			var dataValue=rowAry[theLp];
			if (dataValue==undefined){dataValue='';}
			rowHash.set(dataName,dataValue);
		}
		return rowHash;
	},
//==============================================================================
	//?@getLastRowUpdated: function()?C
	getLastRowUpdated: function(){
		containerObj.jsDebug('tableObj.getLastRowUpdated()');
		var lastRowUpdated=this.getEtcValue('lastrowupdated');
		var rowAry=this.tableHash[this.tableName]['dataary'][lastRowUpdated];
		var rowHash=this.convertRowAryToHash(rowAry);
		return rowHash;
	},
//===============================================================================
	//?@loadKeyIndex: function(keyIndexStrg)?C
	loadKeyIndex: function(keyIndexStrg){
		containerObj.jsDebug('tableObj.loadKeyIndex(keyIndexStrg)');
		tableName=this.tableName;
		var keyIndexAry=keyIndexStrg.split('~');
		var keyIndexNo=keyIndexAry.length;
		this.tableHash[tableName]['datakeyindexhash']=new Hash();
		for (var keyLp=0;keyLp<keyIndexNo;keyLp++){
		//- below may be slower, second field is just incrementer
			updateAry=keyIndexAry[keyLp].split(':');
			this.tableHash[tableName]['datakeyindexhash'].set(updateAry[0],updateAry[1]);
		}
	},
//===============================================================================
	//?@rebuildKeyIndex: function()?C
	rebuildKeyIndex: function(){
		containerObj.jsDebug('tableObj.rebuildKeyIndex()');
		tableName=this.tableName;
		var keyPos=this.getEtcValue('keypos');
		if (keyPos == undefined){
			keyName=this.getEtcValue('keyname');
			var dataDefs=this.getEtcValue('datadef');
			dataDefsAry=dataDefs.split('~');
			var theLen=dataDefsAry.length;
			for (var lp=0;lp<theLen;lp++){
				var dataDefsName=dataDefsAry[lp];
				if (keyName==dataDefsName){
					var keyPos=lp;
					this.setEtcValue('keypos',keyPos);
					lp=theLen;
				}
			}
		}
		var dataAryNo=this.tableHash[tableName]['dataary'].length;
		this.tableHash[tableName]['datakeyindexhash']=new Hash();
		for (var keyLp=0;keyLp<dataAryNo;keyLp++){
		//- key field has to be in first column
		//- backup key field has to be in the second column
			var keyNo=this.tableHash[tableName]['dataary'][keyLp][keyPos];
			this.tableHash[tableName]['datakeyindexhash'].set(keyNo,keyLp);
		}
	},
//===============================================================================
	//?@getRowFromKey: function(keyId)?C
	getRowFromKey: function(keyId){
		containerObj.jsDebug('tableObj.getRowFromKey(keyId)');
		tableName=this.tableName;
		rowNo=this.tableHash[tableName]['datakeyindexhash'].get(keyId);
		return rowNo;
	},
//===============================================================================
	//?@deleteEntry: function(keyValue)?C
	deleteEntry: function(keyValue){
		containerObj.jsDebug('tableObj.deleteEntry(keyValue)');
		tableName=this.tableName;
		var rowNo=this.getRowFromKey(keyValue);
		//- remove row in display
		var delRowNo=Number(rowNo)+1;
		this.tableHash[tableName]['displayary'].splice(delRowNo,1);
		//- remove row in data
		var delRowNo=Number(rowNo);
		this.tableHash[tableName]['dataary'].splice(delRowNo,1);
		//- write to a queue to delete on the server
		tst=this.tableHash[tableName]['sendtoserverdelete'];
		if (tst==undefined){this.tableHash[tableName]['sendtoserverdelete']=new Array();}
		var theLength=this.tableHash[tableName]['sendtoserverdelete'].length;
		this.tableHash[tableName]['sendtoserverdelete'][theLength]=keyValue;
		//alert ('sendtoserverdelete: '+this.tableHash[tableName]['sendtoserverdelete']);//xxx
		this.tableHash[tableName]['etc'].set('sendtoserver',true);
		var iconMenu=this.getEtcValue('tableiconmenu');
		if (iconMenu != ''){
			menuObj.swap(iconMenu);
			menuObj.setAlertClass('set');
			menuObj.reverseSwap();
		}
		else {alert ('no icon menu');}	
		var nameString=this.tableHash[tableName]['etc'].get('namestring');
		if (nameString==undefined || nameString==''){
			this.tableHash[tableName]['reducedary']=this.tableHash[tableName]['displayary'];
		}
		else {
			this.selectRows(nameString);
		}
		this.rebuildKeyIndex();
		this.rebuildTheSortAry();
		this.displayPage();
	},
//========================================================================
	//?@reset: function(showHtml)?C
	reset: function(showHtml){
		containerObj.jsDebug('tableObj.reset()');
		tableName=this.tableName;
		if (showHtml==false){var pageNo=this.getEtcValue('pageno');}
		this.tableHash[tableName]=new Array();
		this.tableHash[tableName]['etc']=new Hash();
		if (showHtml==false){this.setEtcValue('priorpageno',pageNo);}
		//alert ('full reset sets reset to true');//
		this.tableHash[tableName]['etc'].set('reset',true);
		this.tableHash[tableName]['dataary']=new Array();
		this.tableHash[tableName]['datasortary']=new Array();
		this.tableHash[tableName]['displayary']=new Array();
		this.tableHash[tableName]['selectary']=new Array();
		this.tableHash[tableName]['datakeyindexhash']=new Hash();
		this.tableHash[tableName]['toserver']=new Array();
		this.tableHash[tableName]['sendtoserverdelete']=new Array();
		this.tableHash[tableName]['reducedary']=new Array();
		this.tableHash[tableName]['newdataary']=new Array();
	},
//========================================================================
	//?@getIndexNo: function(theKeyId)?C
	getIndexNo: function(theKeyId){
		containerObj.jsDebug('tableObj.getIndexNo(theKeyId)');
		var indexId=this.tableHash[this.tableName]['datakeyindexhash'].get(theKeyId);
		//alert ('ta.gin: indexId: '+indexId+', thekeyid: '+theKeyId);//xxx
		//containerObj.displayAry(this.tableHash[this.tableName]['datakeyindexhash']);//xxx
		return indexId;
	},
//========================================================================
	//?@renameDataAryIndex: function(theTempId,theRealId,indexId)?C
	renameDataAryIndex: function(theTempId,theRealId,indexId){
		containerObj.jsDebug('tableObj.renameDataAryIndex(theTempId,theRealId,indexId)');
		this.tableHash[this.tableName]['datakeyindexhash'].remove(theTempId);
		this.tableHash[this.tableName]['datakeyindexhash'].set(theRealId,indexId);
	},
//========================================================================
	//?@updateDataAryIndex: function(keyId,indexId)?C
	updateDataAryIndex: function(keyId,indexId){
		containerObj.jsDebug('tableObj.updateDataAryIndex(keyId,indexId)');
		tst=this.tableHash[this.tableName]['datakeyindexhash'];
		if (tst==undefined){this.tableHash[this.tableName]['datakeyindexhash']= new Hash();}
		this.tableHash[this.tableName]['datakeyindexhash'].set(keyId,indexId);
	},
//========================================================================
	//?@getDataAryPointers: function()?C
	getDataAryPointers: function(){
		containerObj.jsDebug('tableObj.getgetDataAryPointers()');
		var keyName=this.getEtcValue('keyname');
		//-do the below only for the calendar
		var areYouLive=calendarObj.areYouAlive();
	   	if (areYouLive){
	   		var dateName=calendarObj.getEtcValue('calendarentrydatename');
			var timeName=calendarObj.getEtcValue('calendarentrystarttimename');
			var dataDef=this.getEtcValue('datadef');
			var dataDefAry=dataDef.split('~');
			var dataDefLength=dataDefAry.length;
			for (var lp=0;lp<dataDefLength;lp++){
				if (dataDefAry[lp]=='tempprofileid'){
					this.setEtcValue('tempprofileidpos',lp);
				}
				else if (dataDefAry[lp]==keyName){
					this.setEtcValue('keypos',lp);
				}
				else if (dataDefAry[lp]==dateName){
					this.setEtcValue('datepos',lp);
				}
				else if (dataDefAry[lp]==timeName){
					this.setEtcValue('timepos',lp);
				}
			}
	   	}
	},
//========================================================================
	//?@convTempIds: function(tableName,idConvAry)?C
	convTempIds: function(tableName,idConvAry){
		containerObj.jsDebug('tableObj.convTempIds(tableName,idConvAry)');
		this.tableName=tableName;
		var keyPos=this.getEtcValue('keypos');
		//alert ('ta.convtempids: tablename: '+tableName+', idconvary: '+idConvAry);//xxx
		if (keyPos == undefined){
			//this.rebuildKeyIndex();
			this.getDataAryPointers();
			var keyPos=this.getEtcValue('keypos');
		}
		var tempProfileIdPos=this.getEtcValue('tempprofileidpos');
		if (tempProfileIdPos==undefined){
			this.getDataAryPointers();
		}
		idConvAry.each(function(theValueStrg){
			var theValueAry=theValueStrg.split('%');
			var theTempId=theValueAry[0];
			var theRealId=theValueAry[1];
			var theIndexId=tableObj.getIndexNo(theTempId);
			//- the below blows up because theIndexId is undefined
			tableObj.tableHash[tableName]['dataary'][theIndexId][keyPos]=theRealId;
			//alert ('xxx2');
			tableObj.tableHash[tableName]['dataary'][theIndexId][tempProfileIdPos]=false;
			//alert ('ta.ctids: renamedataaryindex: thetempid: '+theTempId+', therealid: '+theRealId+', theindexid: '+theIndexId);//xxx
			tableObj.renameDataAryIndex(theTempId,theRealId,theIndexId);
			//alert ('ta.ctids: change id '+theTempId+ ' to '+theRealId);//xxx
		});
	},
//========================================================================
	//?@retrieveTableDbFromServer: function(jobName,tableName)?C
	retrieveTableDbFromServer: function(jobName,tableName){
		operationName='retrieve_table_db_from_ajax';
		this.setTableName(tableName);
		var dbTableName=this.getEtcValue('dbtablename');
		var selectKey1=this.getEtcValue('selectkey1');
		var selectKey1Value=this.getEtcValue('selectkey1value');
		var selectKey2=this.getEtcValue('selectkey2');
		var selectKey2Value=this.getEtcValue('selectkey2value');
		var selectKey3=this.getEtcValue('selectkey3');
		var selectKey3Value=this.getEtcValue('selectkey3value');
		var sortKey1=this.getEtcValue('sortkey1');
		var sortKey2=this.getEtcValue('sortkey2');
		var sortKey3=this.getEtcValue('sortkey3');
		var ctr=0;
		sendDataAry=new Array();
		sendDataAry[ctr]='tablename|'+tableName;ctr++;
		sendDataAry[ctr]='dbtablename|'+dbTableName;ctr++;
		if (selectKey1 != undefined){sendDataAry[ctr]='selectkey1|'+selectKey1+'~'+selectKey1Value;ctr++;}
		if (selectKey2 != undefined){sendDataAry[ctr]='selectkey2|'+selectKey2+'~'+selectKey2Value;ctr++;}
		if (selectKey3 != undefined){sendDataAry[ctr]='selectkey3|'+selectKey3+'~'+selectKey3Value;ctr++;}
		if (sortKey1 != undefined){sendDataAry[ctr]='sortkey1|'+sortKey1;ctr++;}
		if (sortKey2 != undefined){sendDataAry[ctr]='sortkey2|'+sortKey2;ctr++;}
		if (sortKey3 != undefined){sendDataAry[ctr]='sortkey3|'+sortKey3;ctr++;}
		getTableDbViaAjax(jobName,operationName,sendDataAry);
	},
//====================================================================
	//?@loadTableValue: function(theParamsAry)?C
	loadTableValue: function(theParamsAry){
		var tableName=theParamsAry[0];
		var rowId=theParamsAry[1];
		var idName=theParamsAry[2];
		var columnName=theParamsAry[3];
		this.setTableName(tableName);
		var rowNo=this.tableHash[this.tableName]['datakeyindexhash'].get(rowId);
		//alert ('rowno: '+rowNo+', rowid: '+rowId);//xxx
		var theRowAry=this.tableHash[this.tableName]['dataary'][rowNo];
		var theDataDef=this.getEtcValue('datadef');
		var theDataDefAry=theDataDef.split('~');
		var theDataDefCnt=theDataDefAry.length;
		var tableValue=columnName+' column not found';
		for (var lp=0;lp<theDataDefCnt;lp++){
			if (theDataDefAry[lp]==columnName){
				var tableValue=theRowAry[lp];
				lp=theDataDefCnt;
			}
		}
		tableValue = utilObj.convertString(tableValue);
		tableValue = '<pre>'+tableValue+'</pre>';
		$(idName).innerHTML=tableValue;
		//alert (tableValue);//
		//alert ('tablename: '+tableName+', rowid: '+rowId+', idname: '+idName+', rowno: '+rowNo+', columnname: '+columnName);
	},
//=================================================================================
	//?@totalAmountColumns: function(jobParamsAry)?C
	totalAmountColumns: function(jobParamsAry){
		var tableName=jobParamsAry[0];
		var columnName=jobParamsAry[1];
		var updateId=jobParamsAry[2];
		var amtConversion=jobParamsAry[3];
		if (amtConversion == undefined){amtConversion='n';}
		var noAfterDec=jobParamsAry[4];
		if (noAfterDec == undefined){noAfterDec=0;}
		//alert ('tablename: '+tableName+', columnname: '+columnName+', updateid: '+updateId);
		this.tableName=tableName;
		var dataDef=this.getEtcValue('datadef');
		try {
			var colNamesAry=dataDef.split('~');
		} catch (err){alert (this.tableName+': '+err);exit();}
		var colNamesAryLength=colNamesAry.length;
		var theDateCol=9999;
		for (var lp=0;lp<colNamesAryLength;lp++){
			var colName=colNamesAry[lp];
			if (colName == columnName){
				var theDateCol=lp;
				break;
			}
		}
		var dataAry=this.tableHash[this.tableName]['newdataary'];
		var dataAryLen=dataAry.length;
		//containerObj.displayAry('dataary',dataAry);//
		var amtTotal=0;
		if (theDateCol<9999){
			for (var lp=0;lp<dataAryLen;lp++){
				try{
					var theAmt=dataAry[lp][theDateCol];
					//alert ('theamt: '+theAmt+', lp: '+lp);//
				}
				catch (err){
					alert ('tableObj.totalAmountColumns: '+err+', lp: '+lp);
				}
				var amtTotal=Number(amtTotal)+Number(theAmt);
			}
//- make it look like currency
			switch (amtConversion){
			case 'c':
				var AmtTotalObj=new Number(amtTotal);
				amtTotal=AmtTotalObj.toFixed(2);
				amtTotal='$'+amtTotal;
				break;
			case 'n':
				var AmtTotalObj=new Number(amtTotal);
				amtTotal=AmtTotalObj.toFixed(noAfterDec);
				break;
			default:
			}
			try {
				$(updateId).innerHTML=amtTotal;
			}
			catch (err){
				alert ('tableObj.totalAmoutColumns: '+err+', updateid: '+updateId);
			}
		}
	},
//=========================================================
	//?@convertAryToTable: function(jobParamsAry)?C
	convertAryToTable: function(jobParamsAry){
		var tableName=jobParamsAry[0];
		this.tableName=tableName;
		var aryName=jobParamsAry[1];
		var saveName=jobParamsAry[2];
		var noColsMax=jobParamsAry[3];
		if (noColsMax == undefined || noColsMax == ''){noColsMax=0;}
		noColsMax=Number(noColsMax);
		utilObj.writeLog('debug1id','tableObj.convertarytotable: tablename: '+tableName+', aryname: '+aryName+', savename: '+saveName);//xxxd
		this.tableName=tableName;
		var theAry=this.tableHash[this.tableName][aryName];
		if (theAry == '' || theAry == undefined){
			theAry=this.tableHash[this.tableName]['displayary'];
		}
		var printTitle=this.getEtcValue('tableprinttitle');
		if (printTitle != undefined){
			var pos=printTitle.indexOf('?D');
			if (pos>0){
				var workAry = printTitle.split('?D');
				var workAryLen=workAry.length;
				var newPrintTitle='';
				for (var lp=0;lp<workAryLen;lp=lp+2){
					theText=workAry[lp];
					theId=workAry[lp+1];
					// the below assumes that everything is in lower case
					if (theId != undefined){
						switch (theId){
							case 'br':
								var theIdValue='<br>';
								break;
							default:
								var theIdValue=$(theId).innerHTML;
						}
					}
					else {var theIdValue='';}
					newPrintTitle+=theText+' '+theIdValue;
				}
			}
			else {var newPrintTitle=printTitle;}
		}
		var tableHtml='<table class="printtable">';
		if (newPrintTitle != ''){
			tableHtml+='<caption class="printcaption">'+newPrintTitle+'</caption>';
		}
		var noRows=theAry.length;
		//xxxf22 new dev needed - put in style statement for printing or something to have better style statement
		for (var rowLp=0;rowLp<noRows;rowLp++){
			var theRowAry = theAry[rowLp];
			var noCols=theRowAry.length;
			if (noColsMax>0){noCols=noColsMax;}
			var theRowStrg='<tr>';
			for (var colLp=0;colLp<noCols;colLp++){
				var theCol=theRowAry[colLp];
				var theClass="printcol"+colLp;
				theRowStrg+='<td class="'+theClass+'" style="vertical-align:top">'+theCol+'</td>';
			}
			theRowStrg+='</tr>'+"\n";
			tableHtml+=theRowStrg;
		}
		tableHtml+='</table>'+"\n";
		this.setEtcValue(saveName,tableHtml);
		//containerObj.displayHash('etc',this.tableHash[this.tableName]['etc']);//xxxd
	},
//=========================================================
//?@convertAryToCutPaste: function(jobParamsAry)?C
convertAryToCutPaste: function(jobParamsAry){
		var tableName=jobParamsAry[0];
		this.tableName=tableName;
		var aryName=jobParamsAry[1];
		var saveName=jobParamsAry[2];
		utilObj.writeLog('debug1id','tableObj.convertarytotable: tablename: '+tableName+', aryname: '+aryName+', savename: '+saveName);//xxxd
		this.tableName=tableName;
		try {
			var theAry=this.tableHash[this.tableName][aryName];
		}
		catch (err){
			alert ('tableObj.convertAryToCutPast: ('+err+'), tableName: '+tableName);
		}
		if (theAry == '' || theAry == undefined){
			theAry=this.tableHash[this.tableName]['dataary'];
		}
		var tableHtml='<pre>';
		/*
		if (newPrintTitle != ''){
			tableHtml+='<caption class="printcaption">'+newPrintTitle+'</caption>';
		}
		*/
		var noRows=theAry.length;
		for (var rowLp=0;rowLp<noRows;rowLp++){
			var theRowAry = theAry[rowLp];
			var noCols=theRowAry.length;
			var theRowStrg='';
			for (var colLp=0;colLp<noCols;colLp++){
				var theCol=theRowAry[colLp];
				theCol=theCol.replace(/p>/,"span>");
				theCol=theCol.replace(/<p/,"<span");
				theRowStrg+=theCol+',';
			}
			theRowStrg+="\n";
			tableHtml+=theRowStrg;
		}
		tableHtml+='</pre>'+"\n";
		this.setEtcValue(saveName,tableHtml);
		//containerObj.displayHash('etc',this.tableHash[this.tableName]['etc']);//xxxd
	},
//================================= total table fields
//?@totalTableFields: function(jobParamsAry)
//?@- totalFieldsAry {a}?C  data structure: use to total all amounts on a row
//?@--0/1/2... {h}
//?@---'colno' {n} ... colno {v}
//?@----'oper' {n}  ... oper {v}
//?@- totalsHash {h}?C data structure: save totals by date by breakoutcode
//?@--theKey {h}?C (1_1_yearno/monthno_1_yearno/monthno/dayno/yearno/allofit)
//?@--- theBreakoutValue {n} ... oldValue {v}
//?@- totalsAry {a}?C data structure: save all date keys for sorting and listing
//?@-- 0/1/2 {n} ... theKey {v}   
	totalTableFields: function(jobParamsAry){
		utilObj.writeLog('debug1id','!!tableObj.totalTableFields!!');
		//containerObj.displayAry('totaltablefields',jobParamsAry);
		var typeOfTotal_raw=jobParamsAry[0];
		utilObj.writeLog('debug1id','typeoftotal_raw: '+typeOfTotal_raw);
//- get type of break by all/year/month/week/day
		if (typeOfTotal_raw.indexOf('?I',0)>-1){
			var typeOfTotalAry=typeOfTotal_raw.split('?I');
			var typeOfTotalRef=typeOfTotalAry[1];
			var typeOfTotal=$(typeOfTotalRef).value;
			utilObj.writeLog('debug1id','ref: '+typeOfTotalRef+', is '+typeOfTotal);
		}
//- get breakoutcolname
		//var breakoutColName=jobParamsAry[3];
		var breakoutColName_raw=jobParamsAry[3];
		utilObj.writeLog('debug1id','breakoutcolname_raw: '+breakoutColName_raw);
		if (breakoutColName_raw.indexOf('?I',0)>-1){
			var breakoutColNameAry=breakoutColName_raw.split('?I');
			var breakoutColNameRef=breakoutColNameAry[1];
			var breakoutColName=$(breakoutColNameRef).value;
			if (breakoutColName == undefined || breakoutColName == ''){breakoutColName='umpquatype';}
			utilObj.writeLog('debug1id','ref: '+breakoutColNameRef+', is '+breakoutColName);
		} else {
			var breakoutColName=breakoutColName_raw;
		}
//- get all variables
		var tableName=jobParamsAry[1];
		var dateColName=jobParamsAry[2];
		var updateIdName=jobParamsAry[4];
		this.setTableName(tableName);
//- get column numbers for column names of values (more than one a row possibly
		var jobParamsCnt=jobParamsAry.length;
		var totalFieldsAry=new Array();
		for (var lp=5; lp<jobParamsCnt; lp++){
			var colName=jobParamsAry[lp];
			var pos=colName.indexOf('debit');
			if (pos>-1){var theOper=-1;}
			else {var theOper=1;}
			var colNo=this.getDataNo(colName);
			var colNoHash=new Hash();
			colNoHash.set('colno',colNo);
			colNoHash.set('oper',theOper);
			totalFieldsAry[totalFieldsAry.length]=colNoHash;
			utilObj.writeLog('debug1id',' total field '+lp+', is '+jobParamsAry[lp]+', colno: '+colNo+', oper: '+theOper);
		}
		var noTotalFields=totalFieldsAry.length;
//- get column number for datecolname, breakoutcolname
		var dateColNo=this.getDataNo(dateColName);
		var breakoutColNo=this.getDataNo(breakoutColName);
		//utilObj.writeLog('debug1id',' breakoutcolname: '+breakoutColName+', breakoutcolno: '+breakoutColNo);exit();
//- get array that is main data input
		var useAry=this.tableHash[this.tableName]['newdataary'];
		if (useAry == undefined || useAry == ''){
			var useAry=this.tableHash[this.tableName]['dataary'];
		}
		totalsHash = new Hash();
		totalsAry = new Array();
//- loop through data array
		var theLen=useAry.length;
		for (var theLp=0;theLp<theLen;theLp++){
			var theRowAry=useAry[theLp];
			var theBreakoutValue=theRowAry[breakoutColNo];
			var theDate=theRowAry[dateColNo];
			theTotalRowValue=new Number(0);
			for (var theLp2=0; theLp2<noTotalFields; theLp2++){
				//- get colno
				try {var valueColNo=totalFieldsAry[theLp2].get('colno');}
				catch (err){alert ('tableObj.totalTableFields: '+err+', theLp2: '+theLp2);}
				var aRowValue = new Number(theRowAry[valueColNo]);
				//- get oper
				try {var theOper=totalFieldsAry[theLp2].get('oper');}
				catch (err){alert ('tableObj.totalTableFields: '+err+', theLp2: '+theLp2);}
				var useOper=new Number(theOper);
				//- get value of row
				aRowValue *= useOper;
				theTotalRowValue += aRowValue;
			}
			var dateHash=utilObj.convertDateToHash(theDate);
			var theMonthNo=dateHash.get('monthno');
			var theDayNo=dateHash.get('dayno');
			var theYearNo=dateHash.get('yearno');
			switch (typeOfTotal){
			case 'yearly':
				var theKey='1_1_'+theYearNo;
				break;
			case 'monthly':
				var theKey=theMonthNo+'_1_'+theYearNo;
				break;
			case 'daily':
				var theKey=theMonthNo+'_'+theDayNo+'_'+theYearNo;
				break;
			default:
				var theKey='allofit';
			}
			var dmy=totalsHash[theKey];
			if (dmy==undefined){
				totalsHash[theKey]=new Hash();
				totalsAry[totalsAry.length]=theKey;
			}
			try {
				var oldValue_raw = totalsHash[theKey].get(theBreakoutValue);
			}
			catch (err){
				alert ('the error: '+err+', thekey: '+theKey+', theLp: '+theLp+',thebreakoutvalue: '+theBreakoutValue+' dmy: '+dmy+', totalshash[thekey]: '+totalsHash[theKey]);
			}
			if (oldValue_raw == undefined){oldValue_raw=0;}
			oldValue= new Number(oldValue_raw);
			oldValue+=theTotalRowValue;
			totalsHash[theKey].set(theBreakoutValue,oldValue);
			utilObj.writeLog('debug1id',theKey+'('+theBreakoutValue+'): '+oldValue);
			//utilObj.writeLog('debug1id',theLp+') '+theMonthNo+'/'+theDayNo+'/'+theYearNo+', '+theBreakoutValue+', '+theTotalRowValue+', oldvalue: '+oldValue);
		}
		//containerObj.displayHash('totalshash',totalsHash);//xxxf
//--- Create report looking for income and expense fields
		if (breakoutColName == 'umpquatype' || breakoutColName == 'jefftype'){
		var theStrg="<table><tr><td>&nbsp;</td><td>income</td><td>expense</td><td>net</td><td>transfer</td></tr>\n";
		var theTableAry = new Array();
		var theNoKeys=totalsAry.length;
		var totalIncome_all=new Number(0);
		var totalExpense_all=new Number(0);
		var totalTransfer_all=new Number(0);
		for (var totalsLp=0;totalsLp<theNoKeys;totalsLp++){
			var theKey=totalsAry[totalsLp];
			theStrg+="<tr><td>"+theKey+"</td>";
			var totalIncome=new Number(0);
			var totalExpense=new Number(0);
			var totalTransfer=new Number(0);
			totalsHash[theKey].each(function(pairs){
				var theValue=Number(pairs.value).toFixed(2);
				var theKey2=pairs.key;
				switch (theKey2){
				case 'income':
					totalIncome = Number(totalIncome) + Number(theValue);
					totalIncome_all = Number(totalIncome_all) + Number(theValue);
					break;
				case 'expense':
					totalExpense = Number(totalExpense) + Number(theValue);
					totalExpense_all = Number(totalExpense_all) + Number(theValue);
					break;
				default:
					totalTransfer = Number(totalTransfer) + Number(theValue);
					totalTransfer_all = Number(totalTransfer_all) + Number(theValue);
				}
				//theStrg+="<td>"+pairs.key+'</td><td>'+theValue+'</td>\n';
			});
			var netIncome= Number(totalIncome) + Number(totalExpense);
			if (netIncome>0){var colorInsert=";color:black";}
			else {var colorInsert=";color:red";}
			theStrg+="<td style=\"text-align:right\">"+totalIncome.toFixed(2)+"</td><td style=\"text-align:right\">"+totalExpense.toFixed(2)+"</td><td style=\"text-align:right"+colorInsert+"\">"+netIncome.toFixed(2)+"</td><td style=\"text-align:right\">"+totalTransfer.toFixed(2)+"</td></tr>\n";
		}
		var netIncome_all= Number(totalIncome_all) + Number(totalExpense_all);
		if (netIncome_all>0){var colorInsert=";color:black";}
		else {var colorInsert=";color:red";}
		theStrg+="<td>total</td><td style=\"text-align:right\">"+totalIncome_all.toFixed(2)+"</td><td style=\"text-align:right\">"+totalExpense_all.toFixed(2)+"</td><td style=\"text-align:right"+colorInsert+"\">"+netIncome_all.toFixed(2)+"</td><td style=\"text-align:right\">"+totalTransfer_all.toFixed(2)+"</td></tr>\n";
		theStrg+="</table>";
		}
		else {
//- get all totals first
			var tableTotals=new Hash();
			var theNoKeys=totalsAry.length;
			for (var totalsLp=0;totalsLp<theNoKeys;totalsLp++){
				var theKey=totalsAry[totalsLp];
				totalsHash[theKey].each(function(pairs){
					var theName=pairs.key;
					var theValue=pairs.value;
					theOldValue=tableTotals.get(theName);
					if (theOldValue == '' || theOldValue == undefined){theOldValue=0;}
					var theTotal=Number(theValue)+Number(theOldValue);
					if (theName != undefined && theName != ''){
						tableTotals.set(theName,theTotal);
					}
				});
			}
//- build array from tableTotals
			tableTotalsAry = new Array();
			tableTotals.each(function(pairs){
				var theName=pairs.key;
				var theValue=pairs.value;
				tableTotalsAry[tableTotalsAry.length]=theName;
				var theValue=theValue.toFixed(2);
				tableTotals.set(theName,theValue);
			});
			tableTotalsAry.sort();
//- build the display table
			var theNoKeys=totalsAry.length;
			var theNoCols=tableTotalsAry.length;
			theStrg="<table><tr><td></td>";
			for (var catLp=0; catLp<theNoCols;catLp++){
				theCatName=tableTotalsAry[catLp];
				theStrg+="<td>"+theCatName+"</td>";
			}
			theStrg+="</tr>";
			for (var totalsLp=0;totalsLp<theNoKeys;totalsLp++){
				theStrg+="<tr>";
				var theKey=totalsAry[totalsLp];
				theStrg+="<td>"+theKey+"</td>";
				for (var catLp=0;catLp<theNoCols;catLp++){
					var theName=tableTotalsAry[catLp];
					var theValue_raw=totalsHash[theKey].get(theName);
						if (theValue_raw != undefined){
							theValue=Number(theValue_raw).toFixed(2);
						}
						else {
							theValue=Number(0).toFixed(2);
						}
					theStrg+="<td style=\"text-align:right;\">"+theValue+"</td>";
				}
				theStrg+="</tr>";
			}
			theStrg+="<tr><td></td>";
			for (var colsLp=0;colsLp<theNoCols;colsLp++){
				var theName=tableTotalsAry[colsLp];
				var theValue=tableTotals.get(theName);
				theStrg+="<td style=\"text-align:right;\">"+theValue+"</td>";
			}
			theStrg+="</tr>";
			theStrg+="</table>";
			//containerObj.displayAry('tabletotalsary',tableTotalsAry);//xxxf
			//containerObj.displayHash('tableTotals',tableTotals);//xxxf
		}
		switch (updateIdName){
		case 'alert': 
			alert (theStrg);
			break;
		case 'prompt':
			vl = prompt(theStrg,'x');if (vl == 'x'){exit();}
			break;
		default:
			try {
				$(updateIdName).innerHTML=theStrg;
			}
			catch (err){
				alert ('tableObj.totalTableFields: '+err+', updateidname: '+updateIdName);
			}
		}
	},
//===================================== get data number
	//?@getDataNo: function(dataColName)?C build dataaryxref if not there and then get colno from etc/datadef
	getDataNo: function(dataColName){
		var tst=this.tableHash['dataaryxref'];
		if (tst == undefined){
			var dataDef=this.getEtcValue('datadef');
			var dataDefAry=dataDef.split('~');
			dataAryXrefHash=new Hash();
			var theLen=dataDefAry.length;
			for (var theLp=0; theLp<theLen; theLp++){
				var updateDataColName=dataDefAry[theLp];
				dataAryXrefHash.set(updateDataColName,theLp);
			}
			this.tableHash[this.tableName]['dataaryxref']=dataAryXrefHash;
		}
		var dataColNo=this.tableHash[this.tableName]['dataaryxref'].get(dataColName);
		//alert ('datacolname: '+dataColName+', datacolno: '+dataColNo);//xxxf
		return dataColNo;
	},
//======================================= hide/show table column
	showHideTableColumn: function(jobParamsAry){
		var tableName=jobParamsAry[0];
		var colNo=jobParamsAry[1];
		var firstChange=jobParamsAry[2];
		this.setTableName(tableName);
		var tableId=this.getEtcValue('tableid');
		var curChange=userObj.getEtcValue('tablecolumntogglestate');
		if (curChange == undefined){curChange=firstChange;}
		//alert ('curchange: '+curChange+', colno: '+colNo+', tablename: '+tableName+', tableid: '+tableId);//xxxf
		if (curChange=='hide'){
			jQuery('#'+tableId+' td:nth-child('+colNo+')').hide();
			curChange='show';
		}
		else {
			jQuery('#'+tableId+' td:nth-child('+colNo+')').show();
			curChange='hide';
		}
			userObj.setEtcValue('tablecolumntogglestate',curChange);
	},
//======================================= changeTdColClass
	// there are occasions where this does not work - not sure why?
	changeTdClass: function(jobParamsAry){
		var theCode=jobParamsAry[0];
		var tableId=jobParamsAry[1];
		var firstClass=jobParamsAry[2];
		var secondClass=jobParamsAry[3];
		if (theCode == 'toggle'){
			var toggleName=tableId+'_toggle';
			var theFlag=userObj.getEtcValue(toggleName);
			if (theFlag == undefined || theFlag == 'false'){
				var fromClass=firstClass;
				var toClass=secondClass;
				theFlag='true';
			}
			else {
				var fromClass=secondClass;
				var toClass=firstClass;
				theFlag='false';
			}
			userObj.setEtcValue(tableId+'_toggle',theFlag);
		}
		else {
			var fromClass=firstClass;
			var toClass=secondClass;
		}
		try {var tableBase=$(tableId);}
		catch (err){alert ('tableObj.changeTdClass: '+err+', tableId: '+tableId);}
		tableBase.rows[3].cells[3].innerHTML='xxxf';
		tableBase.rows[3].cells[3].className='ttdnotes';
		if (tableBase != undefined){
			var noRows=tableBase.rows.length;
			for (var rowLp=0;rowLp<noRows;rowLp++){
				var rowBase=tableBase.rows[rowLp];
				var noCells=rowBase.cells.length;
				for (var cellLp=0;cellLp<noCells;cellLp++){
					var cellBase=rowBase.cells[cellLp];
					if (cellBase.className==fromClass){
						cellBase.className=toClass;
						//cellBase.style.width=theWidth;
						//alert ('rowLp,cellLp: '+rowLp+','+cellLp+', fromclassname: '+fromClass+', toclass: '+toClass+', cellbase.classname: '+cellBase.className+', inner: '+cellBase.innerHTML);//xxxf
						//cellBase.innerHTML='xxxf';
						//dmy+=rowLp+':'+cellLp+'('+toClass+'),';
					}
				}
				//dmy+='\n';
			}
		}
	}
//--- end of methods
}); 
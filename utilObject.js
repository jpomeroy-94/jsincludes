var UtilObject = Class.create({
//2/4/13 winopn made body have mainbody class and added margin style to it, also change hidden; to visible; if in body - hard coded
//--- initialize
	initialize: function() {
		this.dayMs = Number(86400000);
	},
//============================================================
	setSelectedClass: function(menuName,menuElementNo){
	var menuSelectedClass=menuAry[menuName]['menuselectedclass'];
	//alert ('sc: ' +menuSelectedClass+' for menu '+menuName);//xxx
	var menuNonSelectedClass=menuAry[menuName]['menuclass'];
	var lastMenuElementNo=menuAry[menuName]['lastmenuelementno'];
	var menuId=menuAry[menuName]['menuid'];
	elementBase=$(menuId).getElementsByTagName('a')[menuElementNo];
	elementBase.className=menuSelectedClass;
	if (menuElementNo != lastMenuElementNo){
		//elementBase=$(menuId).rows[0].cells[lastMenuElementNo].getElementsByTagName('a')[0];
		elementBase=$(menuId).getElementsByTagName('a')[lastMenuElementNo];
		//alert(elementBase.innerHTML);
		elementBase.className=menuNonSelectedClass;
	}
		menuAry[menuName]['lastmenuelementno']=menuElementNo;
	},
//===============================================================
	setZIndex: function(jobParamsAry){
		var containerId=jobParamsAry[0];
		var zIndexNo=jobParamsAry[1];
		var isItOk=this.validateField(zIndexNo, 'n');
		if (isItOk){
			//alert ('set '+containerId+', to '+zIndexNo);//xxxf
			$(containerId).style.zIndex=zIndexNo;
		}
	},
//========================================================================
	displayCss: function (){
		var theBase=document.styleSheets[0];
		var theLen=theBase.cssRules.length;
		for (var theLp=0;theLp<theLen;theLp++){
			theText=theBase.cssRules[theLp].cssText;
			var pos=theText.indexOf('mainmenu');
			if (pos>-1){
			vl=prompt(theText,'exit');
			if (vl=='exit'){exit();}
			}
			//document.write(theText);
		}
		exit();
	},
//========================================================================
	convertDateToHash: function(theDate){
		if (theDate==undefined){
			ContainerObj.displayStack('ut.convertDateToHash');
			exit();
		}
		pos=theDate.indexOf('-');
		if (pos>0){
// yyyy-mm-dd
			var theDateAry=theDate.split('-');
			var theYear=new Number(theDateAry[0]);
			var theMonth=new Number(theDateAry[1]);
			var theDay=new Number(theDateAry[2]);
		}
		else {
// mm/dd/yyyy
			var theDateAry=theDate.split('/');
			var theMonth=new Number(theDateAry[0]);
			var theDay=new Number(theDateAry[1]);
			var theYear=new Number(theDateAry[2]);
		}
		returnHash=new Hash();
		returnHash.set('yearno',theYear);
		returnHash.set('monthno',theMonth);
		returnHash.set('dayno',theDay);
		return returnHash;
	},
//========================================================================
	convertDate: function(theDate,convType){
		var dateHash=this.convertDateToHash(theDate);
		theYear=String(dateHash.get('yearno'));
		theMonth=String(dateHash.get('monthno'));
		theDay=String(dateHash.get('dayno'));
		if (convType=='dateconv1'){
			returnDate=theMonth+'/'+theDay+'/'+theYear;
		}
		else if (convType=='internal'){
			if (theMonth.length==1){theMonth='0'+String(theMonth);}
			if (theDay.length==1){theDay='0'+String(theDay);}
			var returnDate=theYear+'-'+theMonth+'-'+theDay;
		}
		else if (convType=='millisecondsbeginofday'){
			var returnDate=Date.UTC(theYear, theMonth, theDay, 0, 0, 0, 0);
		}
		else if (convType=='millisecondsendofday'){
			var returnDate=Date.UTC(theYear, theMonth, theDay, 23, 59, 59, 0);
		}
		else {
			returnDate=theDate;
		}
		return returnDate;
	},
//========================================================================
	getDateObject: function(theDate){
		pos=theDate.indexOf('-');
		if (pos>-1){
			theDateAry=theDate.split('-');
			returnDateObj=new Date();
			returnDateObj.setDate(theDateAry[2]);
			returnDateObj.setMonth(theDateAry[1]);
			returnDateObj.setYear(theDateAry[0]);
		}
		else {
			theDateAry=theDate.split('/');
			returnDateObj=new Date();
			returnDateObj.setDate(theDateAry[1]);
			returnDateObj.setMonth(theDateAry[0]);
			returnDateObj.setYear(theDateAry[2]);			
		}
		return returnDateObj;
	},
//========================================================================
	getDateFromObject: function(dateObj,convType){
		theDay=String(dateObj.getDate());
		theMonth=String(dateObj.getMonth());
		theYear=String(dateObj.getFullYear());
		switch (convType){
			case 'dateconv1':
				returnDate=theMonth+'/'+theDay+'/'+theYear;
			break;
			case 'internal':
				if (theMonth.length==1){theMonth='0'+theMonth;}
				if (theDay.length==1){theDay='0'+theDay;}
				returnDate=theYear+'-'+theMonth+'-'+theDay;
			break;
			case 'hash':
				returnDate=new Hash();
				returnDate['theday']=theDay;
				returnDate['themonth']=theMonth;
				returnDate['theyear']=theYear;
			break;
			default:
				returnDate='';
		}
		return returnDate;
	},
//==========================================================================
	getDateStuff: function(theDate,theCode){
		theDateObj=this.getDateObject(theDate);
		switch (theCode){
			case 'allminutes':
				var returnValue=theDateObj.getTime();			
			break;
			default:
			var returnValue='';
		}
		return returnValue;
	},
//==========================================================================
	getEndDate: function(startDate,noDays){
		returnDateObj=this.getDateObject(startDate);
		var nowMs=returnDateObj.getTime();
		var addMs=this.dayMs * Number(noDays);
		var newNowMs=nowMs + addMs;
		returnDateObj.setTime(newNowMs);
		var endDate=this.getDateFromObject(returnDateObj,'dateconv1');
		return endDate;
	},
//==========================================================================
	setClass: function(accessId,theClass){
		//alert ('accessid: '+accessId+', theclass: '+theClass);//xxx
		//alert ($(queuemsgid2_main).innerHTML);//xxx
		base=$(accessId);
		$(accessId).className=theClass;		
	},
//==========================================================================
	deleteTableRows: function(calendarMenuId,startRow,endRow){
		var theBase=$(calendarMenuId);
		try {
			var noRows=theBase.rows.length;
			noRows--;
			if (endRow>noRows){endRow=noRows;}
			for (var rowLp=startRow;rowLp<=endRow;rowLp++){
				theBase.deleteRow(startRow);		
			}
		} catch (err){
			alert ('UtilObj.deleteTableRows: '+err+' calendarmenuid: '+calendarMenuId);
		}
	},
//==========================================================================
	debugDocument: function(){
		var theBodyStuff=$('bodyid').innerHTML;
		document.write(theBodyStuff);//xxxf
		 /*
		var theBase=document.styleSheets[0];
		var theCssStuff='';
		var styleSheetsNo=document.styleSheets.length;
		for (lp=0;lp<styleSheetsNo;lp++){
			var thebase=document.styleSheets[lp];
			if (theBase != undefined){
				var theRulesAry=thebase.cssRules? theBase.cssRules: theBase.rules;
				var totalRules=theRulesAry.length;
				for (theLp=0;theLp<totalRules;theLp++){
				}
			}
		}
		alert ('theend');//xxxf
		exit();
		*/
	},
//==========================================================================
	insertTableRow: function(tableId,rowNo){
		$(tableId).insertRow(rowNo);			
	},
//==========================================================================
	moveContainer: function(theEvent){
		//alert (this.moveMode);//xxxf
		if (this.moveMode == undefined){this.moveMode=false;}
		if (!this.moveMode){
			document.onmousemove = this.mouseMoveContainer;
			this.moveMode=true;
		}
		else {
			document.onmousemove = '';
			this.moveMode=false;
		}
		//this.mouseMoveContainer(theEvent);
	},
//======================
	mouseMoveContainer: function(theEvent){
		//var theContainerName=ContainerObj.containerName;
		//ContainerObj.displayAry(ContainerObj.containerHash[theContainerName]['etc']);xxxd
		var loadId=ContainerObj.getEtcValue('loadid');
//- mouse
		var theClientX=theEvent.clientX;
		var theClientY=theEvent.clientY;
		leftEdge=Number(theClientX)-10;
		topEdge=Number(theClientY)-10;
//- container position
		try {
			$(loadId).style.position="absolute";
			$(loadId).style.left=leftEdge;
			$(loadId).style.top=topEdge;
		}
		catch (e){
			alert ('loadid: '+loadId+' is invalid, leftedge: '+leftEdge+', topEdge: '+topEdge);//xxxf
		}
	},
//======
	mouseEndMoveContainer: function(event){
		document.onmousemove = '';
		document.onmouseclick = '';
	},
//===============================
	hideElements: function(elementId1,elementId2,elementId3,elementId4){
		if (elementId1 != ''){this.changeVisibility(elementId1,'hidden');}
		if (elementId2 != ''){this.changeVisibility(elementId2,'hidden');}
		if (elementId3 != ''){this.changeVisibility(elementId3,'hidden');}
		if (elementId4 != ''){this.changeVisibility(elementId4,'hidden');}
	},
//===============================
	showElements: function(elementId1,elementId2,elementId3){
		if (elementId1 != ''){this.changeVisibility(elementId1,'visible');}
		if (elementId2 != ''){this.changeVisibility(elementId2,'visible');}
		if (elementId3 != ''){this.changeVisibility(elementId3,'visible');}
	},
//=================================
	changeVisibility: function(elementId,theValue){
		try {
			$(elementId).style.visibility=theValue;
		} catch (err){
			alert('UtilObj.changeVisibility: ('+err+') elementid: '+elementId+', value: '+theValue);
		}
	},
//=================================
	changeOpacity: function(direction,increments,theId){
		var opacity;
		if (direction=='up'){opacity_use=0;}
		else {opacity_use=1;}
		setTimeout("UtilObj.doTheOpacityChange('"+opacity_use+"','"+direction+"','"+theId+"')",1);
	},
//========================================
	doTheOpacityChange: function(opacity_fed, direction, theId){
		var doContinue=true;
		//var vl=prompt('opacity_fed: '+opacity_fed,'x');
		//if (vl=='x'){exit();}
		//if (vl=='l'){doContinue=false;}
		opacity_wrk=opacity_fed*1000;
		if (direction=='up'){opacity_wrk += 1;}
		else {opacity_wrk -= 1;}
		if (opacity_wrk < 0){doContinue=false;}
		if (opacity_wrk > 1000){doContinue=false;}
		var opacity_use = opacity_wrk / 1000;
		try {$(theId).style.opacity=opacity_use;}
		catch (err) {alert ('MenuObj.autoRotateImage: ('+err+') theid: '+theId+', opacity_use: '+opacity_use);}
		if (doContinue){
			setTimeout("UtilObj.doTheOpacityChange('"+opacity_use+"','"+direction+"','"+theId+"')",1);
		}
		else {
			MenuObj.setEtcValue('iamdone','alldone');
		}
	},
//=========================================
	changeImageSize: function(paramsAry){
		var rowId=paramsAry[2];
		var colId=paramsAry[1];
		var imageId=paramsAry[0];
		alert ('rowid: '+rowId+', colid: '+colId+', imageid: '+imageId);
	},
//==========================================
	toggleImageSize: function(jobParamsAry){
		var imageId=jobParamsAry[0];
		var col1=jobParamsAry[1];
		var col2=jobParamsAry[2];
		alert ('imageid: '+imageId+', col1: '+col1+', col2: '+col2);//xxxf
	},

//=============================================================
	toggleClass: function(elementBase,smallClass,largeClass){
	  var checkClassName=elementBase.className;
	  if (checkClassName == smallClass) {
	    var useClass=largeClass;
	  }
	  else {
	    var useClass=smallClass;
	  }
	//- do table class
	  elementBase.className=useClass;
	},
//==============================================================
	setClass: function(elementBase,className){
		if (className != ''){
			try {$(elementBase).className=className;}
			catch (err){alert ('UtilObj.setClass: '+err+', elementbase: '+elementBase+', classname: '+className);}
		}
	},
//==============================================================
	hideIdsViaList: function(jobParamsAry){
		var theName=jobParamsAry[0];
		//alert ('thename: '+theName);
		var theIdList=UserObj.getNamedString(theName);
		var theIdListAry=theIdList.split('~');
		var theCnt=theIdListAry.length;
		for (var theLp=0;theLp<theCnt;theLp++){
			var theId=theIdListAry[theLp];
			try {$(theId).style.visibility='hidden';}
			catch (err){alert ('UtilObj.hideIdsViaList: ('+err+') id: '+theId);}
		}
	},
//==================================================================
	convertString: function(theString){
		var theStringAry=theString.split('%');
		var theLength=theStringAry.length;
		for (var lp=1;lp<theLength;lp=lp+2){
			var delim=theStringAry[lp];
			var newDelim='';
			switch (delim){
			case 'br':
				newDelim="<br>";
				break;
			case 'sglqt':
				newDelim="'";
				break;
			case 'dblqt':
				newDelim='"';
				break;
			case 'cr':
				newDelim="\n";
			}
			theStringAry[lp]=newDelim;		
		}
		theString=theStringAry.join('');
		return theString;
	},
//==========================================
	cleanString: function(theData){
		if (theData != undefined){
//- convert \n to %cr%
			var doContinue=true;
			while (doContinue===true){
				var pos=theData.indexOf("\n",0);
				if (pos>-1){
					var endFirst=pos;
					var beforeLine=theData.substring(0,endFirst);
					var startSecond=pos+1;
					var endSecond=theData.length;
					var afterLine=theData.substring(startSecond,endSecond);
					theData=beforeLine+'%cr%'+afterLine;
				}
				else {
					doContinue=false;
				}
			}
		}
		return theData;
	},
//=========================================
	canIUseYui: function(){
		var thePlatform = navigator.platform;
		switch (thePlatform){
		case 'Linux i686':
			var useYui=true;
		case 'Win32':
			var useYui=true;
			break;
		default:
			//alert ('platform: '+thePlatform);//xxxf
			var useYui=false;
		}
		//var vl=prompt('useyui: '+useYui+', theplatform: '+thePlatform,'x');if (vl=='x'){exit();}
		return useYui;
	},
//==========================================
	runTopBatchMenu: function(){
		window.top.window.alert ('xxxf3');
	},
//==========================================
	setCookieValue: function(jobParamsAry){
		//alert ('savtockie: UtilObj.setCookieValue objtype: '+jobParamsAry[0]+', objectname: '+jobParamsAry[1]+', filename: '+jobParamsAry[2]+', cookiename: '+jobParamsAry[3]);
		var objectType=jobParamsAry[0];
		var objectName=jobParamsAry[1];
		var fileName=jobParamsAry[2];
		var cookieName=jobParamsAry[3];
		switch (objectType){
		case 'id':
			break;
		case 'table':
			var cookieValue=TableObj.getEtcValue(fileName);
			alert (cookieValue.length);
			// there can be no semicolons, commas, or white space
			document.cookie = cookieName + "=" + cookieValue;
			var tst=document.cookie;
			alert (tst.length);
			break;
		default:
			alert ('UtilObject.setCookieValue invalid objecttype: '+objectType);
		}
	},
//==========================================
	windowOpen: function(jobParamsAry){
		var theUrl=jobParamsAry[0];
		var theObjType=jobParamsAry[1];
		//alert ('theurl: '+theUrl+', theobjname: '+theObjName+', theobjtype: '+theObjType+', theHtmlName: '+theHtmlName);//xxxf
		switch (theObjType){
		case 'table':
			var theObjName=jobParamsAry[2];
			var theHtmlName=jobParamsAry[3];
			TableObj.setTableName(theObjName);
			//ContainerObj.displayHash('xxxf',TableObj.tableHash[theObjName]['etc']);
			var htmlString=TableObj.getEtcValue(theHtmlName);
			if (htmlString == undefined){
				var htmlString='error';
			}
			var htmlStyle="<style>\ncaption.printcaption{font-size:22;}\n</style>\n";
			break;
		case 'innerhtml':
			var theId=jobParamsAry[2];
			var htmlString_raw=$(theId).innerHTML;
			var htmlString=htmlString_raw.replace(/hidden;/g,'visible;');
			var htmlStyle="<style>body.mainbody{margin:100px;}</style>";
			break;	
		default:
			var htmlString='error';
		}
		//alert ('htmlstring: '+htmlString);
		htmlString='<html><heading>'+htmlStyle+'<title>print window</title></heading><body class=\"mainbody\">'+htmlString+'</body></html>';
		var newWindow=window.open(theUrl);
		newWindow.document.open();
		newWindow.document.write(htmlString);
		newWindow.document.close();
	},
//==========================================
	getCookieValue: function(jobParamsAry){
		
	},
//==========================================
	writeLog: function(debugNameId,theMsg){
		//alert ('debugnameid: '+debugNameId+', themsg: '+theMsg);
		if (debugNameId == 'doalertxxx'){alert (theMsg);}
		else {
			if (theMsg == 'clear'){
				$(debugNameId).innerHTML='';
			}
			else {
				try {
					var oldMsg=$(debugNameId).innerHTML;
					var theLen=oldMsg.length;
					if (theLen>20000){
						oldMsg=oldMsg.substring(0,20000);
					}
					oldMsg=theMsg+'<br>'+oldMsg;
					$(debugNameId).innerHTML=oldMsg;
				}
				catch (err){
						//alert ("UtilObj.writeLog: "+err+", debugnameid: "+debugNameId);
				}
			}
		}
	},
//==========================================
	clearLog: function(jobParamsAry){
		var theLen=jobParamsAry.length;
		for (var lp=0;lp<theLen;lp++){
			var theLogNameId=jobParamsAry[lp];
			try {
				$(theLogNameId).innerHTML='';
			}
			catch (err){
				alert ('UtilObj.clearLog: '+err+' debugnameid: '+debugNameId);
			}
		}
	},
//==========================================
	validateField: function(validateField,validateCode){
		switch (validateCode){
		case 'n':
			var regExpCode='^[0-9]*$';
			break;
		case 'a':
			var regExpCode='^[a-z,A-Z]*$';
			break;
		default:
			var regExpCode='';
			alert ('invalid regex code: '+validateCode+', fieldvalue: '+validateField);
		}
		if (regExpCode != ''){
			var RegExpObj = new RegExp(regExpCode);
			var returnBool=RegExpObj.test(validateField);
			//alert ('validatefield: '+validateField+', regExpCode: '+regExpCode+',  returnBool: '+returnBool)
		}
		else {
			returnBool=false;
		}
		return returnBool;
	},
//==========================================
//--- test alert x
	doAlert: function(dmyMsg){
		alert (dmyMsg);
	} 
}); 

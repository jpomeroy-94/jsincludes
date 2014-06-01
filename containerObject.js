var ContainerObject = Class.create({
// 2/1/13 fixed ?D delimitting in getServerSimpleV2
//	containerName
//	this.containerName
//  this.ajaxIsRunning
//	this.oldContainerNameAry
//	containerHash[containerName]
//		['etc']
//			inprocess	... true/false
//			loadid		... id ... loadclass is loadid missing the 'id' suffix
//			focusid	    ... id for whole container to do focus on
//		['innerhtml']	... html code for container	
//			
//
//==========================================================
	//?@initialize: function()?C 
	initialize: function() {
		this.containerHash = new Hash();
		this.doit=false;
	},
//==========================================================
	//?@isAjaxRunning: function()?C
	isAjaxRunning: function(){
		if (this.ajaxIsRunning == true){
			var ajaxIsRunning=true;
		}
		else {
			var ajaxIsRunning=false;
		}
		return ajaxIsRunning;
	},
//==========================================================
	//?@setAjaxIsRunning: function()?C
	setAjaxIsRunning: function(){
		this.ajaxIsRunning=true;
	},
//==========================================================
	//?@setAjaxIsDone: function()?C
	setAjaxIsDone: function(){
		this.ajaxIsRunning=false;
	},
//==========================================================
	//?@backgroundContainer: function()?C
	backgroundContainer: function(){
		var oldContainerName=this.containerName;
		if (oldContainerName != undefined && oldContainerName != 'none'){
			//alert ('set to background: '+oldContainerName);//xxxd
			tstAry=this.oldContainerNameAry;
			if (tstAry==undefined){this.oldContainerNameAry=new Array();}
			theCnt=this.oldContainerNameAry.length;
			var foundIt=false;
			for (var lp=0;lp<theCnt;lp++){
				if (oldContainerName==this.oldContainerNameAry[lp]){
					foundIt=true;
					lp=theCnt;
				}
			}
			if (!foundIt){
				theFocusCnt=this.oldContainerNameAry.unshift(oldContainerName);
				if (theFocusCnt==undefined){theFocusCnt=0;}
				this.setContainerFocus(theFocusCnt);
				//alert ('set '+this.containerName+' to '+theFocusCnt);//xxxd
			}
		}
	},
//==========================================================
	//?@removeIfInBackground: function(containerName)?C
	removeIfInBackground: function(containerName){
		try {
			var theCnt=this.oldContainerNameAry.length;
		}
		catch (err){
			var theCnt=0;
		}
		for (var lp=0;lp<theCnt;lp++){
			if (containerName==this.oldContainerNameAry[lp]){
				this.oldContainerNameAry.splice(lp,1);
				lp=theCnt;
			}
		}
	},
//==========================================================
	//?@foregroundContainer: function()?C
	foregroundContainer: function(){
		try {
			var lastContainerName=this.oldContainerNameAry.shift();
		} 
		catch(err){
			lastContainerName='none';
		}
		if (lastContainerName != undefined && lastContainerName != 'none'){
			//alert ('set to foreground: '+lastContainerName);//xxxd
			this.containerName=lastContainerName;
			var loadId=this.getEtcValue('loadid');
			var theLen=loadId.length;
			var cutLen=Number(theLen)-2;
			var loadClass=loadId.substring(0,cutLen); 
			//-xxxr this relies on info that may not be setup yet
			this.setContainerFocus(9);
		}
	},
//==========================================================
	//?@setDoItTrue: function(stackSize)?C
	setDoItTrue: function(stackSize){
		this.doit=true;
		if (stackSize!=undefined){this.stackSize=stackSize;}
		alert (this.stackSize);
	},
//==========================================================
	//?@setDoItFalse: function()?C
	setDoItFalse: function(){
		this.doit=false;
	},
//==========================================================
	//?@setContainerName: function(containerName)?C
	setContainerName: function(containerName){
		ContainerObj.jsDebug('ContainerObj.setContainerName');
		//alert ('set container name: '+containerName);//xxx
		this.containerName=containerName;
		tst=this.containerHash[containerName];
		if (tst==undefined){
			this.containerHash[containerName]=new Hash();
		}
		tst=this.containerHash[containerName]['etc'];
		if (tst==undefined){
			this.containerHash[containerName]['etc']=new Hash();
		}
	},
//==========================================================
	//?@setName: function(containerName)?C
	setName: function(containerName){this.setContainerName(containerName);},
//==========================================================
	//?@displayEtc: function()?C
	displayEtc: function(){this.displayHash('container('+this.containerName+')/etc',this.containerHash[this.containerName]['etc']);},
//==========================================================
	//?@loadEtc: function(etcName,etcValue)?C
	loadEtc: function (etcName,etcValue){
		ContainerObj.jsDebug('ContainerObj.loadEtc');
		this.loadEtcAjax(this.containerName, etcName, etcValue);
	},
//==========================================================
	//?@loadEtcAjax: function(containerName,etcName,etcValue)?C
	loadEtcAjax: function (containerName,etcName,etcValue){
		ContainerObj.jsDebug('ContainerObj.loadEtc');
		this.containerHash[containerName]['etc'].set(etcName,etcValue);
	},
//==========================================================
	//?@loadInnerHtml: function(theInnerHtml)?C
	loadInnerHtml: function (theInnerHtml){
		ContainerObj.jsDebug('ContainerObj.loadInnerHtml');
		this.loadInnerHtmlAjax(this.containerName,theInnerHtml);
	},
//==========================================================
	//?@loadInnerHtmlAjax: function(containerName,theInnerHtml)?C
//=== after container setup completely in ajax.js put the html
//	where it belongs
	loadInnerHtmlAjax: function(containerName,theInnerHtml){
		this.containerHash[containerName].set('innerhtml',theInnerHtml);
		var loadId=this.containerHash[containerName]['etc'].get('loadid');
		try {
			//var oldHtml=$(loadId).innerHTML;
			$(loadId).innerHTML=theInnerHtml;
			var tst=$(loadId).innerHTML;//xxxf
			if (tst == undefined){
				var higherLoadId=loadId.replace(/content/g,'');
				var tst2=$('mainbodyid').innerHTML;
				alert (higherLoadId+', '+loadId+': '+tst2);
				}
		}
		catch (err){
			alert ('ContainerObj.loadInnerHtmlAjax ('+err+'), loadid: '+loadId+', containername: '+containerName);
		}
		this.containerHash[containerName]['etc'].set('inprocess',true);
	},
//==========================================================
	//?@inProcess: function()?C
	inProcess: function(){
		ContainerObj.jsDebug('ContainerObj.inProcess');
		var inProcess=false;
		chk=this.containerName;
		if (chk != undefined){
			chk=this.containerHash[this.containerName];
			if (chk!=undefined){
				chk=this.containerHash[this.containerName]['etc'].get('inprocess');
				if (chk!=undefined){
					if (chk===true){
						inProcess=true;
					}
				}
			}
		}
		return inProcess;
	},
//==========================================================
	//?@getContainerFromServer: function(jobName,containerName,theMethod,loadId, focusId)?C
	getContainerFromServer: function(jobName,containerName,theMethod,loadId, focusId) {
		ContainerObj.jsDebug('ContainerObj.getContainerFromServer');
//- if container[containername] exists and is inprocess then remove it
		//alert ('job: '+jobName+', container: '+containerName+', method: '+theMethod+', loadid: '+loadId);//xxx
		tst=this.containerHash[containerName];
		if (tst != undefined){var reset=this.containerHash[containerName]['etc'].get('reset');}
		else {var reset=true;}
		var oldContainerName=this.containerName;
		//alert ('oldcontainer: '+oldContainerName+', continername: '+this.containerName);//xxxd
		if ((containerName == oldContainerName) && this.inProcess() && !reset){
//- click on menu and app is in process - now make it so nothing happens
			//this.removeDisplay();
		}
		else if (!reset) {
//-if not inprocess but there then load innerhtml and other stuff
			//alert ('alreadygotit');//xxx
			this.setupContainer(containerName);
		}
		else {
//-it was never there so get it via ajax
			//alert ('getfromajax');//xxx
			this.backgroundContainer();
			this.setContainerName(containerName);
//- load id is content part of container
			this.loadEtc('loadid',loadId);
//- focus id is actual container name
			this.loadEtc('focusid', focusId);
			//alert ('jobname: '+jobName+', containername: '+containerName+', method: '+theMethod);//xxxd
			AjaxObj.getContainerViaAjax(jobName,containerName,theMethod);
//error			var theLen=loadId.length;
//error			var cutLen=Number(theLen)-2;
//error			var loadClass=loadId.substring(0,cutLen); 
			//-xxxr this relies on info that may not be setup yet
			this.setContainerFocus(9);
			this.containerHash[containerName]['etc'].set('reset',false);
			//- have to be called back from ajax to do load
		}
		//this.displayAry(this.containerHash[containerName]['etc']);//xxx
	},
//============================================================
	//?@getContainerFromServerSimpleV2: function(jobParamsAry)?C
	getContainerFromServerSimpleV2: function(jobParamsAry){
		//alert (jobParamsAry);//xxxf
		UtilObj.writeLog('debug2id','!!ContainerObj.getContainerFromServerSimpleV2!!');
		//ContainerObj.displayAry('jobparamsary',jobParamsAry);//xxxf
		var theLen=jobParamsAry.length;
		var debugStrg='senddataary('+theLen+'):<br>';
		for (var lp=0;lp<theLen;lp+=1){
			var theValue=jobParamsAry[lp];
			var theValueOld=theValue;
			try {
				var pos=theValue.indexOf('?D');
				if (pos>-1){
					theValueAry=theValue.split('?D');
					theValueRef=theValueAry[1];
					var theValueNew=UserObj.getEtcValue(theValueRef);
					theValueAry[1]=theValueNew;
					theValue=theValueAry.join('');
					jobParamsAry[lp]=theValue;
				}
				//below doesnt work if ?D value in a string
				//jobParamsAry[lp]=theValue;
				
				debugStrg=' thevalue: old: '+theValueOld+', new: '+theValue+'<br>'+debugStrg;
			}
			catch (err){
				//null
			}			
		}
		var jobName=jobParamsAry[0];
		var containerName=jobParamsAry[1];
		if (containerName == 'jefftransactionhistoryupdatetr'){
			//vl=1;
			//alert ('job: '+jobName+', containerName: '+containerName);//xxxf
		}
		var theMethod='forcepost';
		var theLoadId=jobParamsAry[2];
		var fedSessionName=jobParamsAry[3];
		//xxxf99 why do I have to do the below
		if (fedSessionName == '!'){fedSessionName='';}
		//alert (fedSessionName);//xxxf
		//ContainerObj.displayAry('jobp',jobParamsAry);//xxxf
		var formName=jobParamsAry[4];
		var operName=jobParamsAry[5];
		UtilObj.writeLog('debug1id','jobname: '+jobName+', containername: '+containerName+', themethod: '+theMethod+', theloadid: '+theLoadId+', sessionname: '+sessionName+', formname: '+formName+', opername: '+operName);
		var sendDataAry = new Array();
		var paramNamesMore='';
		var paramValuesMore='';
		UtilObj.writeLog('debug1id','loop through params thelen: '+theLen);
		var delim='~';
		for (var lp=6; lp<theLen; lp+=2){
			var theName=jobParamsAry[lp];
			var theValue=jobParamsAry[lp+1];
			UtilObj.writeLog('debug1id','loop thru vars thename: '+theName+', theValue: '+theValue);
			try {
				var pos=theValue.indexOf('?D');
				if (pos>-1){
					theValueAry=theValue.split('?D');
					theValueRef=theValueAry[1];
					theValue=UserObj.getEtcValue(theValueRef);
				}
				var pos=theName.indexOf('?p');
				if (pos>-1){
					theNameAry=theName.split('?p');
					theName=theNameAry[1];
					paramNamesMore+=delim+theName;
					paramValuesMore+=delim+theValue;
					UtilObj.writeLog('debug1id','did lower p: thename: '+theName+', thevalue: '+theValue);
				}
				else {
					sendDataAry[sendDataAry.length]=theName+'|'+theValue;
					debugStrg='thename: '+theName+', thevalue: '+theValue+'<br>'+debugStrg;
				}
			}
			catch (err){
				//null
			}
		}
		UtilObj.writeLog('debug1id','end loop, debugstrg: '+debugStrg);
		if (formName != '' && formName != undefined){var getForm=true;}
		else {var getForm=false;}
//- get jobname from UserObj if coded to do that
		var jobNameAry=jobName.split('_');
		if (jobNameAry[0]=='user'){
			var fieldName=jobNameAry[1];
			jobName=UserObj.getEtcValue(fieldName);
		}
//- get containername from UserObj if coded to do that
		var containerNameAry=containerName.split('_');
//xxxd - below should be deprecated
		if (containerNameAry[0]=='user'){
			var fieldName=containerNameAry[1];
			containerName=UserObj.getEtcValue(fieldName);
		}
//- get selection value from UserObj if coded to do that
		var containerNameAry=containerName.split('_');
		var theContainerNameLen=containerNameAry.length;
		if (theContainerNameLen>1){
			var checkContainerName_raw=containerNameAry[0];
			pos=checkContainerName_raw.indexOf('?D',0);
			if (pos>-1){
				checkContainerNameAry=checkContainerName_raw.split('?D');
				var checkContainerName=checkContainerNameAry[2];
				var useContainerName=UserObj.getEtcValue(checkContainerName);
			}
			else {
				var useContainerName=checkContainerName_raw;
			}
			var containerNameFieldId=containerNameAry[1];
			var containerNameFieldValue=containerNameAry[2];
			if (containerNameFieldValue == 'uservalue'){
				containerNameFieldValue=UserObj.getEtcValue(containerNameFieldId);
			}
				containerName=useContainerName+'_'+containerNameFieldId+'_'+containerNameFieldValue;
				if (theContainerNameLen>3){
					for (var lp=3; lp<theContainerNameLen; lp=lp+2){
						var fieldName=containerNameAry[lp];
						var fieldValue=containerNameAry[lp+1];
						containerName+='_'+fieldName+'_'+fieldValue;
					}
				}
		}
		else {var useContainerName=containerName;}
		//alert ('containername: '+containerName+', usecontainername: '+useContainerName);//xxxd
//- see if we already have container and are not doing a forcepost
		containerExists=this.containerHash[useContainerName];
		if (containerExists != undefined && theMethod != 'forcepost'){
			this.reloadContainerHtml(useContainerName);
		}
		else {
//- get container via ajax
			//alert (useContainerName+': '+containerExists);//xxxd
			theMethod='post';
			this.setContainerName(useContainerName);
			//- below may create container or update one already existing
			this.loadEtcAjax(useContainerName,'loadid',theLoadId);
			var paramNames='';
			var paramValues='';
			var delim='';
			if (containerExists != undefined){
				var sessionName=this.getEtcValue('sessionname');
			}
			else {var sessionName='';}
			if (sessionName == undefined || sessionName == ''){
				if (fedSessionName != ''){sessionName=fedSessionName;}
			}
			if (sessionName != undefined){
				paramNames+='sessionname';
				paramValues+=sessionName;
				delim='~';
			}
			//else {
				//alert ('ContainerObj.getContainerFromServerSimpleV2 error: containermissing: '+useContainerName);
			//}
			var domainName=UserObj.getEtcValue('domainname');
			var companyProfileId=UserObj.getEtcValue('companyprofileid');
//- domainname
			if (domainName != undefined){
				paramNames+=delim+'dbname';
				paramValues+=delim+domainName;
				delim='~';
			}
//- companyprofileid
			if (companyProfileId != undefined){
				paramNames+=delim+'companyprofileid';
				paramValues+=delim+companyProfileId;
				delim='~';
			}
//- operation
			if (operName != undefined){
				paramNames+=delim+'operation';
				paramValues+=delim+operName;
				delim='~';
			}
//- see if this is a form based get container request?
			if (getForm === true){
				formData=FormObj.getFormData(formName);
				var ctr=0;
				formData.each(function(pairs){
					var keyName=pairs.key;
					var keyValue=pairs.value;
					if (keyName != undefined && keyValue != undefined){
						paramNames+=delim+keyName;
						paramValues+=delim+keyValue;
						delim='~';
						ctr++;
					}
				});
			}
//- add in variables designated to go into paramsAry
			paramNames+=paramNamesMore;
			paramValues+=paramValuesMore;
			sendDataAry[sendDataAry.length]='paramnames|'+paramNames;
			sendDataAry[sendDataAry.length]='paramvalues|'+paramValues;
			if (jobName == '' || containerName == ''){alert ('error in jobname or container name: jobName: '+jobName+', containerName: '+containerName);}
			else {
				//ContainerObj.displayAry('jobparamsary',jobParamsAry);//xxxf
				//ContainerObj.displayAry('senddataary',sendDataAry);//xxxf
				UtilObj.writeLog('debug1id','call getContainerViaAjaxSimple');
				AjaxObj.getContainerViaAjaxSimple(jobName,containerName,theMethod,sendDataAry);
			}
		}
		//this.displayAry(this.containerHash[containerName]['etc']);//xxx
	},
//==========================================================xxxd
	//?@getContainerFromServerSimple: function(jobName,containerName,theMethod,loadId, sessionName)?C
	getContainerFromServerSimple: function(jobName,containerName,theMethod,loadId, sessionName) {
		ContainerObj.jsDebug('ContainerObj.getContainerFromServerMulti');
//- get from UserObj if coded to do that
		var jobNameAry=jobName.split('_');
		if (jobNameAry[0]=='user'){
			var fieldName=jobNameAry[1];
			jobName=UserObj.getEtcValue(fieldName);
			//alert ('jobname: '+jobName);//xxxd
		}
		var containerNameAry=containerName.split('_');
		if (containerNameAry[0]=='user'){
			var fieldName=containerNameAry[1];
			containerName=UserObj.getEtcValue(fieldName);
			//alert ('container name: '+containerName+', fieldname: '+fieldName);//xxxf
			//UserObj.displayUser();//xxxf
		}
		//alert ('job: '+jobName+', container: '+containerName+', method: '+theMethod+', loadid: '+loadId);//xxxd
//- split out containerNameAry
		var containerNameAry=containerName.split('_');
		var theContainerNameLen=containerNameAry.length;
		if (theContainerNameLen>1){
			var useContainerName=containerNameAry[0];
			var containerNameFieldId=containerNameAry[1];
			var containerNameFieldValue=containerNameAry[2];
			if (containerNameFieldValue == 'uservalue'){
				containerNameFieldValue=UserObj.getEtcValue(containerNameFieldId);
				containerName=useContainerName+'_'+containerNameFieldId+'_'+containerNameFieldValue;
				//alert ('containername: '+containerName);//xxxd
			}
		}
		else {var useContainerName=containerName;}
//- if exists dont get a second time
		containerExists=this.containerHash[useContainerName];
		if (containerExists != undefined && theMethod != 'forcepost'){
			this.reloadContainerHtml(useContainerName);
		}
		else {
//-it was never there so get it via ajax
//- or get it a second time for data values
			theMethod='post';
			this.setContainerName(useContainerName);
			//- below may create container or update one already existing
			this.loadEtcAjax(useContainerName,'loadid',loadId);
			if (containerExists != undefined){
				sessionName=this.getEtcValue('sessionname');
			}
			var paramNames='sessionname';
			var paramValues=sessionName;
			var domainName=UserObj.getEtcValue('domainname');
			var companyProfileId=UserObj.getEtcValue('companyprofileid');
			//alert ('companyprofileid from userobj: '+companyProfileId);//xxxd
			//alert ('xxxd1');
			var sendDataAry = new Array();
			if (domainName != undefined){
				paramNames+='~'+'dbname';
				paramValues+='~'+domainName;
			}
			//alert ('xxxd1');
			if (companyProfileId != undefined){
				paramNames+='~'+'companyprofileid';
				paramValues+='~'+companyProfileId;
			}
			//alert ('paramnames: '+paramNames);//xxxd
			//xxxd - ? if (containerNameAry[3])
			sendDataAry[sendDataAry.length]='paramnames|'+paramNames;
			sendDataAry[sendDataAry.length]='paramvalues|'+paramValues;
			//alert ('senddata: '+sendDataAry);//xxxd
			if (jobName == '' || containerName == ''){alert ('error in jobname or container name: jobName: '+jobName+', containerName: '+containerName);}
			else {AjaxObj.getContainerViaAjaxSimple(jobName,containerName,theMethod,sendDataAry);}
			//- ajax has loaded up loadid stuff
		}
		//this.displayAry(this.containerHash[containerName]['etc']);//xxx
	},
//==========================================================xxxd
	//?@reloadContainerHtml: function(containerName)?C
	reloadContainerHtml: function(containerName){
		var loadId=this.getEtcValueAjax(containerName,'loadid');
		var containerHtml=this.containerHash[containerName].get('innerhtml');
		try {
			$(loadId).innerHTML=containerHtml;
		}
		catch (err){
			alert ('ContainerObj.reloadContainerHtml err in loadid: '+loadId+', containername: '+containerName+', html: '+containerHtml);
			this.displayStack();
		}
	},
//==========================================================
	//?@setupContainer: function(containerName)?C
	setupContainer: function(containerName){
		//alert ('171 setup container '+containerName);//xxxd
		//this.displayAry(this.containerHash[containerName]['etc']);//xxxd
		//- check if clicked on hide button which activated onclick event
		if (this.justHidden == undefined || this.justHidden == false){
		this.backgroundContainer();
		this.removeIfInBackground(containerName);
		this.setContainerName(containerName);
		//this.displayAry(this.containerHash[containerName]['etc']);//xxx
		tableName=this.getEtcValue('tablename');
		if (tableName != undefined){TableObj.setTableName(tableName);}
		formName=this.getEtcValue('formname');
		if (formName != undefined){FormObj.setFormName(formName);}
		menuName=this.getEtcValue('menuname');
		if (menuName != undefined){MenuObj.setMenuName(menuName);}
		calendarName=this.getEtcValue('calendarname');
		if (calendarName != undefined){calendObj.setCalendarName(calendarName);}
		this.loadCss();
		this.containerName=containerName;
		var loadId=this.getEtcValue('loadid');
		try {
			$(loadId).style.visibility='visible';
		}
		catch (err){
			alert ('ContainerObj.setupContainer err in loadid: '+loadId+', containername: '+containerName);
			this.displayStack();
		}
		//- below doesnt work - can operate buttons afterward
		//var focusId=this.getEtcValue('focusid');
		//$(focusId).style.visibility='visible';
		this.setContainerFocus(9);
		//ContainerObj.displayAry(this.containerHash[this.containerName]['etc']);//xxx
		}
		else {
			this.justHidden=false;
		}
	},
//==========================================================
	//?@goToContainer: function(containerName)?C
	goToContainer: function(containerName){
		ContainerObj.jsDebug('ContainerObj.goToNewContainer');
		//- if container[containername] exists and is inprocess then remove it
		//alert ('job: '+jobName+', container: '+containerName+', method: '+theMethod+', loadid: '+loadId);//xxx
		tst=this.containerHash[containerName];
		var oldContainerName=this.containerName;
		//alert ('oldcontainer: '+oldContainerName+', continername: '+this.containerName);//xxxd
		if (containerName != oldContainerName){
			//alert ('new: '+containerName+', old: '+oldContainerName);//xxxd
			this.backgroundContainer();
			this.removeIfInBackground(containerName);
			this.setContainerName(containerName);
			//this.displayAry(this.containerHash[containerName]['etc']);//xxx
			tableName=this.getEtcValue('tablename');
			if (tableName != undefined){TableObj.setTableName(tableName);}
			formName=this.getEtcValue('formname');
			if (formName != undefined){FormObj.setFormName(formName);}
			menuName=this.getEtcValue('menuname');
			if (menuName != undefined){MenuObj.setMenuName(menuName);}
			calendarName=this.getEtcValue('calendarname');
			if (calendarName != undefined){calendObj.setCalendarName(calendarName);}
			this.loadCss();
			this.containerName=containerName;
			//$(loadId).style.visibility='visible';
			this.setContainerFocus(9);
			//ContainerObj.displayAry(this.containerHash[this.containerName]['etc']);//xxx
		}		
	},
//==========================================================
	//?@removeDisplay: function()?C
	removeDisplay: function(){
		ContainerObj.jsDebug('ContainerObj.removeDisplay');
		//alert ('227: remove display for '+this.containerName);//xxxd
		var loadId=this.containerHash[this.containerName]['etc'].get('loadid');
		var currentInnerHtml=$(loadId).innerHTML;
		this.containerHash[this.containerName].set('innerhtml',currentInnerHtml);
		this.containerHash[this.containerName]['etc'].set('inprocess',false);
		$(loadId).style.visibility='hidden';
		this.setContainerFocus(0);
		this.containerName='none';
		this.foregroundContainer();//xxxd
		this.justHidden=true;
	},
//==========================================================
	//?@setDebug: function()?C
	setDebug: function(){
		this.doit=true;
		this.stackSize=1;
	},
//==========================================================
	//?@unSetDebug: function()?C
	unSetDebug: function(){
		this.doit=false;
	},
//==========================================================
	//?@jsDebug: function(methodName)?C
	jsDebug: function(methodName){
		var doit=this.doit;
		var stackSize=this.stackSize;
		if (stackSize==undefined){stackSize=20;}
		tst=this.runStackStrg;
		if (tst==undefined){
			this.lastRunMethod='';
			this.runStackStrg='';
			this.runStackCtr=0;
		}
		if (this.lastRunMethod == methodName){
			this.runStackStrg+='.';
		}
		else {
			this.runStackStrg+='\n'+methodName;
			this.lastRunMethod=methodName;
			this.runStackCtr++;
			if (this.runStackCtr>=stackSize){
				if (doit){this.displayStack('co.jsDebug');}
				this.runStackStrg='';
				this.runStackCtr =0;
			}
		}
	},	
//==========================================================
	//?@displayStack: function(theMessage)?C
	displayStack: function(theMessage){
		alert (theMessage+'\n'+this.runStackStrg);
	},
//==========================================================
	//?@displayAry: function(theTitle,theAry)?C
	displayAry: function(theTitle,theAry){
		//alert ('xxxd0');
		ContainerObj.jsDebug('');
		var theDisplay = $H(theAry);
		var theString='--- '+theTitle+" ---\n";
		var ctr;
		ctr=0;
		theDisplay.each(function(pairs){
			if (ctr<12){
				var theKey=pairs.key;
				if (!isNaN(theKey)){
					var theValue=pairs.value;
					var theValue = new String(theValue);
					var theValue = theValue.substring(0,80);
					theString+=ctr+') '+theKey+': '+theValue+'\n';
					ctr++;
				}
			}
		});
		alert (theString);
	},
//==========================================================
	//?@displayHash: function(theTitle, theHash)?C
	displayHash: function(theTitle, theHash){
		ContainerObj.jsDebug('');
		var theDisplay = theHash;
		var theString='--- '+theTitle+" ---\n";
		var ctr;
		ctr=0;
		try {
		theDisplay.each(function(pairs){
			var theLen=pairs.value.length;
				if (theLen<50 || theLen == undefined){
					theString+=ctr+') '+pairs.key+': '+pairs.value+'\n';
				}
				else {
					try {theString+=ctr+') '+pairs.key+': '+pairs.value.substring(0,50)+'\n';}
					catch (err){alert (pairs.key+'(len: '+theLen+', value: '+pairs.value+'): '+err);}
				}
			ctr++;
		});
		}
		catch (err){}
		alert (theString);
	},
//==========================================================
	//?@removeAllCss: function(containerName)?C
	removeAllCss: function(containerName){
		/*
		//- always save 0 delete the reset so can reload what you want
		//   multiple apps may use the same sheet so delete it also
		var noStyleSheets=document.styleSheets.length;
		for (var styleSheetNo=1;styleSheetNo<noStyleSheets;styleSheetNo++){
		//var styleSheetNo=this.containerHash[containerName]['etc'].get('containerstylesheetno');
			if (styleSheetNo!=undefined){
				var mysheet=document.styleSheets[styleSheetNo];
				if (mysheet != undefined){
					var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules;
					mysheet.crossdelete=mysheet.deleteRule? mysheet.deleteRule : mysheet.removeRule;
					var theRulesLength=myrules.length;
					for (delLp=0; delLp<myrules.length;delLp++){
						mysheet.crossdelete(0);// always delete pos 0
						delLp--;
					}
				}
			}
		}
		*/
	},
//==========================================================
	//?@setFocus: function(theId,theLevel)?C
	setFocus: function(theId,theLevel){
		//alert ('set '+theId+' to '+theLevel);//xxxd
		if (theLevel==undefined){
			ContainerObj.displayStack();
		}
		//xxxd - debug
		//vl=prompt('theId: '+theLevel,'x');if (vl=='x'){UtilObj.debugDocument();}
		$(theId).style.zIndex=theLevel;
	},
//===========================================================
	//?@setContainerFocus: function(theLevel)?C
	setContainerFocus: function(theLevel){
		//- below doesnt work - cant access buttons afterward
		//var focusId=this.getEtcValue('focusid');
		//alert ('330: set '+this.containerName+', '+loadId+' to '+theLevel);//xxxd
		//$(focusId).style.zIndex=theLevel;
		var loadId=this.getEtcValue('loadid');
		try {$(loadId).style.zIndex=theLevel;}
		catch (err){alert ('containerobj.setContainerFocus err: ('+err+') loadid: '+loadId);}
	},
//===========================================================
	//?@moveContainer: function(e)?C
	moveContainer: function(e){
		var loadId=this.getEtcValue('loadid');
		this.loadId=loadId;
		//alert ('movecontainer this.loadid: '+this.loadId);//xxx
		var thePosition=$(loadId).style.position;
		if (thePosition==''){$(loadId).style.position='absolute';}
		e = e || window.event;
  		mouseover=true;
		this.oldMouseXPos=e.clientX;
		this.oldMouseYPos=e.clientY;
  		//xxxd - the below is null until set
		var pleft=$(loadId).style.left;
		if (pleft==''){pleft=this.oldMouseXPos;}
		else {pleft=parseInt(pleft);}
		var ptop=$(loadId).style.top;
		if (ptop==''){ptop=this.oldMouseYPos;}
		else {ptop=parseInt(ptop);}
		this.oldContainerXPos=pleft;
		this.oldContainerYPos=ptop;
		//-xxxd on firefox moveimage not called unless mouse is up?
		//- actually called a few times at the beginning, then not called
		//- has cross through it
		//document.onmousedown='';
		document.onmousemove=ContainerObj.moveImage;
		document.onmouseup=this.mouseUp;
		document.onmouseout=this.mouseOut;
		var pagenoid=TableObj.getEtcValue('pagenoid');
		$(pagenoid).innerHTML='mouse down';
		return false;
	},
//==========================================================
	//?@mouseOut: function(e)?C
	mouseOut: function(e){
		var pagenoid=TableObj.getEtcValue('pagenoid');
		$(pagenoid).innerHTML='mouse out';
		return false;
	},
//==========================================================
	//?@moveImage: function(e)?C
	moveImage: function(e){
		if (e == null){e = window.event;}
		//var mousePos=e.mouseCoords;
		//var newLeft=ContainerObj.oldContainerXPos+e.clientX-ContainerObj.oldMouseXPos;
		var newLeft=e.clientX;
		//var newLeft=mousePos(e).x-10;
		//alert ('pleft: '+ContainerObj.pleft+', e.clientx: '+e.clientX+', co.xcoor: '+ContainerObj.xcoor+', newleft: '+newLeft);//xxxd
		$(ContainerObj.loadId).style.left=newLeft+'px';
		//var newTop=ContainerObj.oldContainerYPos+e.clientY-ContainerObj.oldMouseYPos;
		var newTop=e.clientY;
		//var newTop=mousePos.y-10;
		$(ContainerObj.loadId).style.top=newTop+'px';
		var pagenoid=TableObj.getEtcValue('pagenoid');
		$(pagenoid).innerHTML=newLeft+':'+newTop;
		return false;
	},
//===========================================================
	//?@mouseUp: function(e)?C
	mouseUp: function(e){
		document.onmousemove='';
		document.onmouseup='';
		var pagenoid=TableObj.getEtcValue('pagenoid');
		$(pagenoid).innerHTML='mouse up';
		return false;
	},
//==========================================================
	//?@loadCss: function()?C
	loadCss: function(){
		this.loadCssAjax(this.containerName);
	},
//==========================================================
	//?@loadCssAjax: function(containerName)?C
	loadCssAjax: function(containerName){
		this.loadCssAjaxV2(containerName);
/*
		this.removeAllCss(containerName);
		var styleSheetNo=this.containerHash[containerName]['etc'].get('containerstylesheetno');
		if (styleSheetNo==undefined){styleSheetNo=0;}
		tst=this.containerHash[containerName]['css'];
		if (tst != undefined){
			var base=document.styleSheets[styleSheetNo];
			var insertErr='ok';
			var addErr='ok';
//- check if do insert
			try {var doInsert=base.insertRule;}
			catch (insertErr){var doInsert=false;}
//- check if do add
			try {var doAdd=base.addRule;}
			catch (addErr){var doAdd=false;}
			UtilObj.writeLog('debug9id','doinsert: '+doInsert+'('+insertErr+'), doAdd: '+doAdd+'('+addErr+')');
			var theLen=this.containerHash[containerName]['css'].length;
			UtilObj.writeLog('debug9id','update length: '+theLen);
			for (var updLp=0;updLp<theLen;updLp++){
				var cssHash=this.containerHash[containerName]['css'][updLp];
				var cssGroupName=cssHash.get('cssgroupname');
				var paramStrg=cssHash.get('params');
				UtilObj.writeLog('debug9id','cssgroupname: '+cssGroupName+', paramstrg: '+paramStrg);
				if (doInsert){
					UtilObj.writeLog('debug9id','doinsert');
					try {var totalRules=base.cssRules? base.cssRules.length : base.rules.length;}
					catch (err){alert ('ContainerObj.loadCssAjax('+err+')');}
					UtilObj.writeLog('debug9id','totalrules: '+totalRules);
				  	var cssUpdateLine=cssGroupName+'{'+paramStrg+'}';
				  	if (totalRules>0){var useTotalRules=totalRules-1;}
				  	else {var useTotalRules=totalRules;}
				  	UtilObj.writeLog('debug9id','cssupdateline: '+cssUpdateLine+', usetotalrules: '+useTotalRules);
		  			base.insertRule(cssUpdateLine, useTotalRules);
				}
				else if (doAdd){
					UtilObj.writeLog('debug9id','doinsert: '+doInsert+', doAdd: '+doAdd+', cssgroupname: '+cssGroupName+', paramstrg: '+paramStrg);
		  			base.addRule(cssGroupName, paramStrg);
				}
			}
		}
		UtilObj.writeLog('debug9id','ContainerObj.loadcssajax: end of update css');
		*/
	},
//==========================================================
	loadCssAjaxV2: function(containerName){
		//?@loadCssAjaxV2: function(containerName)?C
		tst=this.containerHash[containerName]['css'];
		if (tst != undefined){
			var theLen=this.containerHash[containerName]['css'].length;
			UtilObj.writeLog('debug9id','ContainerObj.loadCssAjaxV2: update length: '+theLen);
			var that=this;
			jQuery(document).ready(function(){
				var theLen=that.containerHash[containerName]['css'].length;
			for (var updLp=0;updLp<theLen;updLp++){
				var cssHash=that.containerHash[containerName]['css'][updLp];
				//alert ('xxxf1');
				var cssGroupName=cssHash.get('cssgroupname');
				var paramStrg=cssHash.get('params');
				//alert ('xxxf2');
				var paramStrgAry=paramStrg.split(';');
				var paramNo=paramStrgAry.length;
				paramNo--;
				UtilObj.writeLog('debug9id','cssgroupname: '+cssGroupName+', paramstrg: '+paramStrg+'<br>');
				UtilObj.writeLog('debug9id','ContainerObj.loadCssAjaxV2: paramNo: '+paramNo);
				for (var paramLp=0;paramLp<paramNo;paramLp++){
					var aParam=paramStrgAry[paramLp];
					var aParamAry=aParam.split(':');
					var theProperty=aParamAry[0];
					var theValue=aParamAry[1];
					UtilObj.writeLog('debug9id','theproperty: '+theProperty+', value: '+theValue);
					try {jQuery(cssGroupName).css(theProperty,theValue);}
					catch (err){alert ('ContainerObj.loadcssajaxv2('+err+') cssgroupname: '+cssGroupName+', property: '+theProperty+', value: '+theValue);}
				}
			}
			});
		}
		/*
		//xxxf
		if (containerName=='desktopttdtr'){
			alert ('before css plug');
			jQuery('div:hover.desktopttdhd').css('cursor','move');
				var theValue=jQuery("div:hover.desktopttdhd").css('display');
				alert ('after css plug value: '+theValue);
		}
		*/
	},
//==========================================================
	//?@saveCss: function(responseLine)?C
	saveCss: function(responseLine){
		containerName=this.containerName;
		this.saveCssAjax(containerName,responseLine);
	},
//===========================================================
	//?@saveCssAjax: function (containerName,responseLine)?C
	saveCssAjax: function (containerName,responseLine){
		//alert ('ContainerObj.savecssajax l572 containerName: '+containerName);//xxxd
		var classOrIdSepar='.';
		if (actionCode=='id'){classOrIdSepar='#';}
		var classOrId=responseLineAry[1];
		if (classOrId=='none'){classOrId='';classOrIdSepar='';}
		var htmlElement=responseLineAry[2];
		if (htmlElement=='none'){htmlElement='';classOrIdSepar='';}
		var cssGroupName=htmlElement+classOrIdSepar+classOrId;
		//- get params
		var params=responseLineAry[3];
		var paramsAry=params.split('~');
		var noParams=paramsAry.length;
		var paramStrg='';
		var paramSepar='';
		for (var theLp=0;theLp<noParams;theLp++){
		  paramGroup=paramsAry[theLp];
		  paramStrg+=paramSepar+paramGroup;
		  paramSepar=';';
		}
		paramStrg+=';';
		//alert ('ContainerObj.saveCssAjax l592 containerName: '+containerName);
		tst=this.containerHash[containerName]['css'];
		if (tst==undefined){this.containerHash[containerName]['css']=new Array();}
		cssHash=new Hash();
		cssHash.set('cssgroupname',cssGroupName);
		cssHash.set('params',paramStrg);
		var theLen=this.containerHash[containerName]['css'].length;
		this.containerHash[containerName]['css'][theLen]=cssHash;
	},
//==========================================================
	//?@reset: function()?C
	reset:	function(){
		containerName=this.containerName;
		this.containerHash[containerName]['etc'].set('reset',true);
		//alert ('ContainerObj.reset xxxd: doing tableobj.reset');//xxxd
		TableObj.reset();
	},
//==========================================================
	//?@getEtcValue: function(etcName)?C
	getEtcValue: function(etcName){
		containerName=this.containerName;
		var etcValue=this.getEtcValueAjax(containerName,etcName);
		return etcValue;
	},
//==========================================================
	//?@getEtcValueAjax: function (containerName,etcName)?C
	getEtcValueAjax: function (containerName,etcName){
		etcValue=this.containerHash[containerName]['etc'].get(etcName);
		return etcValue;
	},
//==========================================================
	//?@setEtcValue: function (etcName,etcValue)?C
	setEtcValue: function (etcName,etcValue){
		try {
			this.containerHash[this.containerName]['etc'].set(etcName,etcValue);
		} catch (err) {
			alert ('containerobj.setetcvalue('+err+') etcname: '+etcName+', etcvalue: '+etcValue);
		}
	},
//==========================================================xxxd
	//?@exitContainer: function(containerId)?C
	exitContainer: function(containerId){
		//alert ('make id: '+containerId+' hidden');//xxx
		$(containerId).style.visibility='hidden';
	},
//==========================================================
	//?@showContainer: function()?C
	showContainer: function(containerId){
		$(containerId).style.visibility='visible';
	},
//==========================================================
	//?@hideContainer: function(containerName)?C
	hideContainer: function(containerName){
		var containerId=this.containerHash[containerName]['etc']['containerid'];
		try {
			$(containerId).style.visibility='hidden';
		} catch (err){
			alert ('containerobj.hideContainer: ('+err+') containerName: '+containerName+'containerid: '+containerId);
		}
	},
//=========================================================xxxd22
	//?@setupContainerViaAjaxJson: function(containerName,loadId,jsonStrg)?C
	setupContainerViaAjaxJson: function(containerName,loadId,jsonStrg){
		var dmy=this.containerHash[containerName];
		UtilObj.writeLog('debug1id','!!ContainerObj.setupContainerViaAjaxJson!!');
		if (dmy==undefined){
			this.setContainerName(containerName);
			try {
				var jsonHash=jsonStrg.evalJSON(false);
			}
			catch (err){
				UtilObj.writeLog('debug1id','error: containerobj.setupContainerViaajaxjson('+err+') container: '+containerName);
				exit();
			}
			var workHash=$H(jsonHash);
			var htmlLine=workHash.get('htmlline');
			//xxxd! need to convert pipeconvert to '|'
			//ContainerObj.displayHtml(htmlLine);//xxxd
			this.setEtcValue('htmlline', htmlLine);
			var containerPropertiesHash=$H(jsonHash['containerary']);
			var that=this;
			containerPropertiesHash.each(function(pairs){
				//alert (pairs.key+': '+pairs.value);//xxxd
				var theName=pairs.key;
				var theValue=pairs.value;
				//xxxd! need to convert pipeconvert to '|'
				that.setEtcValue(theName,theValue);
			});
			var newNode=document.createElement('div');
			newNode.innerHTML=htmlLine;
			document.body.appendChild(newNode);
		}
		else {
			UtilObj.writeLog('debug1id','container name '+containerName+' is already present so dont create it!');
		}
	},
//==========================================================
	//?@displayHtml: function(theHtml)?C
	displayHtml: function(theHtml){
		var startPos=0;
		var theLen=theHtml.length;
		var lineLen=100;
		var noLines=Number(theLen)/Number(100);
		var ctrLines=Math.ceil(noLines);
		var printIt='';
		for (var lp=0;lp<ctrLines;lp++){
			var endPos=Number(startPos)+Number(lineLen);
			var newLine=theHtml.substring(startPos,endPos)+"\n";
			printIt = printIt + newLine;
			startPos=Number(startPos)+Number(lineLen);
		}
		alert(printIt);//xxxf
	},
//============================================================
	//?@getContainerFromServerJson: function(jobParamsAry)?C
	getContainerFromServerJson: function(jobParamsAry){
//- jobParamsAry[0]job[1]container[2]loadid[3]sessionName[4]formname[5]operationname[6]selname[7]selvalue
//- 	[8]varname1[9]varvalue1[10]varname2[11]varvalue2
		UtilObj.writeLog('debug1id','!!ContainerObj.getContainerFromServerSimpleV2!!');
//- fix all references to userobj/etc fields
		for (var lp=0; lp<8; lp++){
			var theField=jobParams[lp];
			var theFieldAry=theField.split('?D');
			if (theFieldAry.length>1){
				var theFieldRef=theFieldAry[1];
				theField=UserObj.getEtcValue(theFieldRef);
				jobParams[lp]=theField;
			}
		}
//- define all working variables
		var jobName=jobParamsAry[0];
		var containerName=jobParamsAry[1];
		var theMethod='forcepost';
		var theLoadId=jobParamsAry[2];
		var sessionName=jobParamsAry[3];
		var formName=jobParamsAry[4];
		var operName=jobParamsAry[5];
		var selName=jobParamsAry[6];
		var selValue=jobParamsAry[7];
//- get additional variables
		var sendVars=new array();
		for (var lp=8;lp<jobParamsAry.length;lp++){
			
		}
		UtilObj.writeLog('debug1id','jobname: '+jobName+', containername: '+containerName+', themethod: '+theMethod+', theloadid: '+theLoadId+', sessionname: '+sessionName+', formname: '+formName+', opername: '+operName);
		var theLen=jobParamsAry.length;
		var debugStrg='senddataary:<br>';
		for (var lp=6; lp<theLen; lp+=2){
			var theName=jobParamsAry[lp];
			var theValue=jobParamsAry[lp+1];
			try {
				sendDataAry[sendDataAry.length]=theName+'|'+theValue;
				debugStrg='...'+theName+'('+theValue+')<br>'+debugStrg;
			}
			catch (err){
				//null
			}
		}
		UtilObj.writeLog('debug1id',debugStrg);
		//alert(jobParamsAry);//xxxd
		if (formName != '' && formName != undefined){var getForm=true;}
		else {var getForm=false;}
//- get jobname from UserObj if coded to do that
		var jobNameAry=jobName.split('_');
		if (jobNameAry[0]=='user'){
			var fieldName=jobNameAry[1];
			jobName=UserObj.getEtcValue(fieldName);
		}
//- get containername from UserObj if coded to do that
		var containerNameAry=containerName.split('_');
//xxxd - below should be deprecated
		if (containerNameAry[0]=='user'){
			var fieldName=containerNameAry[1];
			containerName=UserObj.getEtcValue(fieldName);
		}
//- get selection value from UserObj if coded to do that
		var containerNameAry=containerName.split('_');
		var theContainerNameLen=containerNameAry.length;
		if (theContainerNameLen>1){
			var checkContainerName_raw=containerNameAry[0];
			pos=checkContainerName_raw.indexOf('?D',0);
			if (pos>-1){
				checkContainerNameAry=checkContainerName_raw.split('?D');
				var checkContainerName=checkContainerNameAry[2];
				var useContainerName=UserObj.getEtcValue(checkContainerName);
			}
			else {
				var useContainerName=checkContainerName_raw;
			}
			var containerNameFieldId=containerNameAry[1];
			var containerNameFieldValue=containerNameAry[2];
			if (containerNameFieldValue == 'uservalue'){
				containerNameFieldValue=UserObj.getEtcValue(containerNameFieldId);
				//UserObj.displayUser();//xxxd
				//alert ('containernamefieldid: '+containerNameFieldId+', containernamefieldvalue: '+containerNameFieldValue);//xxxd
			}
				containerName=useContainerName+'_'+containerNameFieldId+'_'+containerNameFieldValue;
		}
		else {var useContainerName=containerName;}
		//alert ('containername: '+containerName+', usecontainername: '+useContainerName);//xxxd
//- see if we already have container and are not doing a forcepost
		containerExists=this.containerHash[useContainerName];
		if (containerExists != undefined && theMethod != 'forcepost'){
			this.reloadContainerHtml(useContainerName);
		}
		else {
//- get container via ajax
			//alert (useContainerName+': '+containerExists);//xxxd
			theMethod='post';
			this.setContainerName(useContainerName);
			//- below may create container or update one already existing
			this.loadEtcAjax(useContainerName,'loadid',theLoadId);
			var paramNames='';
			var paramValues='';
			var delim='';
			if (containerExists != undefined){
				sessionName=this.getEtcValue('sessionname');
				if (sessionName != undefined){
					paramNames+='sessionname';
					paramValues+=sessionName;
					delim='~';
				}
			}
			//else {
				//alert ('ContainerObj.getContainerFromServerSimpleV2 error: containermissing: '+useContainerName);
			//}
			var domainName=UserObj.getEtcValue('domainname');
			var companyProfileId=UserObj.getEtcValue('companyprofileid');
//- domainname
			if (domainName != undefined){
				paramNames+=delim+'dbname';
				paramValues+=delim+domainName;
				delim='~';
			}
//- companyprofileid
			if (companyProfileId != undefined){
				paramNames+=delim+'companyprofileid';
				paramValues+=delim+companyProfileId;
				delim='~';
			}
//- operation
			if (operName != undefined){
				paramNames+=delim+'operation';
				paramValues+=delim+operName;
				delim='~';
			}
//- see if this is a form based get container request?
			if (getForm === true){
				formData=FormObj.getFormData(formName);
				var ctr=0;
				formData.each(function(pairs){
					var keyName=pairs.key;
					var keyValue=pairs.value;
					if (keyName != undefined && keyValue != undefined){
						paramNames+=delim+keyName;
						paramValues+=delim+keyValue;
						delim='~';
						ctr++;
					}
				});
			}
			sendDataAry[sendDataAry.length]='paramnames|'+paramNames;
			sendDataAry[sendDataAry.length]='paramvalues|'+paramValues;
			if (jobName == '' || containerName == ''){alert ('error in jobname or container name: jobName: '+jobName+', containerName: '+containerName);}
			else {
				//ContainerObj.displayAry('senddataary',sendDataAry);//xxxd
				AjaxObj.getContainerViaAjaxSimple(jobName,containerName,theMethod,sendDataAry);
			}
		}
		//this.displayAry(this.containerHash[containerName]['etc']);//xxx
	},
//==========================================================
	//?@doAlert: function(alertMsg)?C
	doAlert: function(alertMsg){
		alert (alertMsg);
	} 
}); 

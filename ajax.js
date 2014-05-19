var ajaxObject = Class.create({
//- 4/28/13 added class.create to whole file 
//- 
//========================================================
getContainerViaAjax: function(jobName, containerName, theMethod) {
// version: 1.1.1
	containerObj.jsDebug('getContainerViaAjax');
	// !!! - this assumes that only one container is being retrieved
	// simultaneously
	var ajaxDelim = '~';
	var noItems = 0;
	var responseLine = "";
	var responseLineNo = 0;
	var subStr = "";
	var insertHtml = "";
	var atTablesAry = Array();
	var atMenusAry = Array();
	var atWholeMenusAry = Array();
	var atFormsAry = Array();
	var atHtml=true;
	var atEnd=false;
	var atMenus=false;
	var atWholeMenus=false;
	var atTables=false;
	var atForms=false;
	var atCss=false;
	var atImage=false;
	var atParagraph=false;
	var ctr=0;
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl+'/index.php?job='+jobName+'&container='+containerName+'&nowsecs='+secs;
	//alert (url);//xxxd
	//var secs=dateObj.getSeconds();
	//var url='/index.php?job='+jobName+'&container='+containerName+'&nowsecs='+secs;
	var tst=0;
	//alert ('ready to start ajax');//xxxd
	//alert (url);//xxxd
	containerObj.setAjaxIsRunning();
	new Ajax.Request(url, {
	   method: 'post',
	   onSuccess: function(transport){
	   	  var doTableAryCreate=true;
   	   	  var response_raw = transport.responseText || "no response text";
   	   	  //alert (response_raw);//xxxd
  	  	  var responseAry=response_raw.split(String.fromCharCode(10));
   	  	  var mainCnt=responseAry.length;
   	  	  var reDisplayCalendar=false;
   	  	  var pattern1=new RegExp("^!!");
   	  	  var pattern2=new RegExp("!!$");
   	  	  var ctr=0;
   	   	  for (var mainLp=0;mainLp<mainCnt;mainLp++){
    	   	responseLine=responseAry[mainLp];
    	   	//xxxd - 
    	   	//if (mainLp>(mainCnt-10)){alert (mainLp+') '+responseLine);}
     	   	if (responseLine != ''){
   	   	  	subStr=responseLine.match('!!');
			var isItThere=(pattern1.test(responseLine)&&pattern2.test(responseLine));
			if (isItThere){
	   	  		//alert (responseLine);//xxxd
	   	  		atEnd=false;atMenus=false;atTables=false;atForms=false;
	   	  		atHtml=false;atCss=false;atCalendar=false;atCopyToCalendar=false;
	   	  		atContainer=false;atImage=false;atParagraph=false;
	   	  		if (responseLine.match('!!table!!') != null){atTables=true;}
	   	  		else if (responseLine.match('!!form!!') != null){atForms=true;}
	   	  		else if (responseLine.match('!!menus!!') != null){atMenus=true;}
	   	  		else if (responseLine.match('!!wholemenu!!') != null){atWholeMenus=true;}
	   	  		else if (responseLine.match('!!html!!') != null){atHtml=true;}
	   	  		else if (responseLine.match('!!css!!') != null){atCss=true;}
	   	  		else if (responseLine.match('!!calendar!!') != null){atCalendar=true;}
	   	  		else if (responseLine.match('!!copytabletocalendar!!') != null){atCopyToCalendar=true;}
	   	  		else if (responseLine.match('!!container!!') != null){atContainer=true;}
	   	  		else if (responseLine.match('!!image!!') != null){atImage=true;}
	   	  		else if (responseLine.match('!!paragraph!!') != null){atParagraph=true;}
	   	  	}
	   	  	else {
 	   	  		responseLineAry=responseLine.split('|');
	   	  		actionCode=responseLineAry[0];
	   	  		actionValue=responseLineAry[1];
	   	  		//document.write(mainLp+': '+actionCode+'<br>');//xxx
	   	  		actionValue2=responseLineAry[2];
	   	  		actionValue3=responseLineAry[3];
	   	  		actionValue4=responseLineAry[4];
	  			responseLineNo=responseLineAry.length;
	  			//alert ('xxx1.11');//last spot to see
	   	  		if (atHtml){
	   	  			insertHtml=insertHtml.concat(responseLine);
	   	  		}
//------- tables	   	
	   	  		else if (atTables){
	   	  		//vl=prompt(actionCode+': '+actionValue,'x');if (vl=='x'){exit();}
	   	  			if (actionCode=='tablename'){
	   	  				tableObj.setTableName(actionValue);
	   	  			}
	   	  			else if (actionCode=='displayary'){
	   	  				tableObj.loadDisplay(actionValue);
	   	  			}
	   	  			else if (actionCode=='selectary'){
						tableObj.loadSelect(actionValue);
   	  			}
	   	  			else if (actionCode=='dataary'){
	   	  				//vl=prompt(actionCode+': '+actionValue,'x');if (vl=='x'){exit();}
	   	  				tableObj.loadData(actionValue);
	   	  			}
	   	  			else if (actionCode=='etc'){
	   	  				tableObj.loadEtc(actionValue,actionValue2);
	   	  			}
	   	  			else if (actionCode=='keyindex'){
	   	  				tableObj.loadKeyIndex(actionValue);
	   	  			}
	   	  			else {
	   	  				tableObj.setError('44: invalid action code: '+actionCode);
	   	  			}
	   	  		}
//-------- forms
	   	  		else if (atForms){
		   	  		//document.write (mainLp+'/'+mainCnt+': '+responseLine);//xxx
	   	  			if (actionCode=='formname'){
	   	  				formObj.setFormName(actionValue);
	   	  			}
	   	  			//- below for names,nameids,regexs,keymaps,errormsgs
	   	  			else if (actionCode=='loadetc'){
	   	  				formObj.loadEtc(actionValue,actionValue2);
	   	  			}
	   	  		}
//-------- menus - I think that I need to redo this	   	
	   	  		else if (atMenus){
	   	  			//vl=prompt(responseLineNo+') '+responseLine,'x');if (vl=='x'){exit();}
					if (actionCode=='initmenu'){
						//- this better be the first one!!!
						var menuName=responseLineAry[1];
						menuObj.initMenu(menuName);
					}
	   	  			if (actionCode=='setetchash'){
	   	  				menuObj.setEtcValueAjax(menuName,responseLineAry[1],responseLineAry[2]);
	   	  			}
					if (actionCode=='initsetary'){
						var theCode=responseLineAry[1];
						var elementNo=responseLineAry[2];
						var theValue=responseLineAry[3];
						var theName='dmy';
						menuObj.setArraysAjax(menuName,theCode,elementNo,theName,theValue);
					}
					if (actionCode=='initsethash'){
						var theCode=responseLineAry[1];
						var elementNo=responseLineAry[2];
						var theName=responseLineAry[3];
						var theValue=responseLineAry[4];
						menuObj.setArraysAjax(menuName,theCode,elementNo,theName,theValue);
					}
	   	  		}
//------- style
	   	  		else if (atCss){
	   	  			containerObj.saveCssAjax(containerName,responseLine);
	   	  			//alert ('save css for containername: '+containerName+' progress: '+mainLp+'/'+mainCnt);//xxxd
	   	  		}
//------- calendar
				else if (atCalendar){
				//xxxd
					//var vl=prompt(actionCode,'exit');if (vl=='exit'){exit();}
					if (actionCode=='calendarname'){
						calendarObj.setName(actionValue);
					}
					else if (actionCode=='loadetc'){
						calendarObj.loadEtc(actionValue,actionValue2);
					}
					else if (actionCode=='desc'){
						calendarObj.loadDesc(actionValue,actionValue2);
					}
					else if (actionCode=='event'){
						calendarObj.loadEventData(actionValue,actionValue2,actionValue3,actionValue4);
					}
					else {
						var vl=prompt(actionCode+': '+actionValue+', '+actionValue2+', '+responseLine,'exit');
						if (vl=='exit'){exit();}
					}
				}
//------- whole menus	   	 
	   	  		else if (atWholeMenus){atWholeMenusAry.push(responseLine);}
//------- copy a table into the calendar	   	  		
	   	  		else if (atCopyToCalendar){
	   	  			calendarObj.copyInTable(actionValue);
	   	  			var reDisplayCalendar=true;
	   	  		}
//------- get container information	   	  		
	   	  		else if (atContainer){
	   	  			//alert (actionCode+', '+actionValue+', '+actionValue2);//xxx
	   	  			if (actionCode=='containername'){
	   	  				var containerName = actionValue;
	   	  				containerObj.setContainerName(containerName);
	   	  			}
	   	  			else if (actionCode=='loadetc'){
	   	  				//alert ('load etc: '+actionValue+', '+actionValue2);//xxx
	   	  				containerObj.loadEtcAjax(containerName,actionValue,actionValue2);
	   	  			}
	   	  		}
	   	  		else if (atImage){
	   	  			if (actionCode == 'setname'){imageObj.setImageName(actionValue);}
	   	  			else if (actionCode == 'loadetc'){imageObj.setEtcValue(actionValue,actionValue2);}
	   	  			else {alert ('10: invalid action code: '+actionCode+' '+actionValue+' '+actionValue2);}
	   	  		}
	   	  		else if (atParagraph){
	   	  			if (actionCode == 'savenamedstring'){
	   	  				userObj.saveNamedString(actionValue,actionValue2);
	   	  			}
	   	  			else {
	   	  				alert ('invalid for atParagraph: '+actionCode+', '+actionValue);
	   	  			}
	   	  		}
	   	  		else {alert ('xxxd1: no ifelse: '+mainLp+'/'+mainCnt+', actioncode: '+actionCode);}
		  	}
		}
		}
		 //document.write(insertHtml);//xxxd
   	   	 // alert ('containername: '+containerName);//xxx
		 if (containerName == undefined){
			 alert ('ajax.getContainerViaAjax: container name is undefined!!<br>response_raw: <br>'+response_raw);
			 alert (response_raw);
		 }
		 else {
			 containerObj.loadCssAjax(containerName);
			 containerObj.loadInnerHtmlAjax(containerName,insertHtml);
		 }
		 if (reDisplayCalendar){this.calendarObj.reDisplayCalendar();}
		 containerObj.setAjaxIsDone();
	},
	   onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone(); }
	});
},
//=====================================================================
getContainerViaAjaxSimple: function(jobName,containerName,theMethod,sendDataAry){
	utilObj.writeLog('debug1id','!!ajax/getContainerViaAjaxSimple!!');
	utilObj.writeLog('debug1id','setajaxisrunning');
	containerObj.setAjaxIsRunning();
	utilObj.writeLog('debug1id','done with setajaxisrunning');
	containerObj.jsDebug('getContainerViaAjax');
	//- !!! this assumses that multi containers are being retrieved at the sime time
	//- the containers dont have to worry about focus, etc
	var sendDataLen=sendDataAry.length;
	var showHtml=true;
	for (var lp=0; lp<sendDataLen; lp++){
		var theField=sendDataAry[lp];
		var theFieldAry=theField.split('|');
		var theName=theFieldAry[0];
		var theValue=theFieldAry[1];
		if (theName=='showhtml'){
			if (theValue=='false'){showHtml=false;}
			break;
		}
	}
	var sendData=sendDataAry.join('`');
	//alert ('enter getcontainerviajaxsimple: '+sendData);//xxxf
	//if (jobName=='clientadminjobstats'){alert (containerName, sendData);}
	var containerNameAry=containerName.split('_');
	var containerNameAryLength=containerNameAry.length;
	var testIt='true';//xxxf
	var containerName=containerNameAry[0];
	var insertUrl='';
	if (containerNameAryLength>=3){
		for (var lp=1; lp<containerNameAryLength; lp=lp+2){
			var selectName=containerNameAry[lp];
			var selectValue=containerNameAry[lp+1];
			insertUrl+='&'+selectName+'='+selectValue;
		}
	}
	var ajaxDelim='~';
	var noItems=0;
	var responseLine = "";
	var responseLineNo = 0;
	var subStr = "";
	var insertHtml = "";
	var ctr=0;
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl+'?job='+jobName+'&container='+containerName+insertUrl+'&nowsecs='+secs;
	//alert (url+', '+sendData);//xxxf
	utilObj.writeLog('debug1id','contact server with url: '+url);
	var tst=0;
	new Ajax.Request(url, {
		method: 'post',
		onSuccess: function(transport){
		var atTablesAry = Array();
		var atMenusAry = Array();
		var atWholeMenusAry = Array();
		var atFormsAry = Array();
		var atHtml=true;
		var atEnd=false;
		var atMenus=false;
		var atWholeMenus=false;
		var atTables=false;
		var atForms=false;
		var atCss=false;
		var atImage=false;
		var atAlbum=false;
		var atParagraph=false;
		var dbFlg=0;
		var doTableAryCreate=true;
		var response_raw = transport.responseText || "no response text";
		//alert (response_raw);//xxxf
		var responseAry=response_raw.split(String.fromCharCode(10));
		var mainCnt=responseAry.length;
		//alert ('maincnt: '+mainCnt);//xxxf
		utilObj.writeLog('debug1id','start processing results mainCnt: '+mainCnt);
		var reDisplayCalendar=false;
		var pattern1=new RegExp("^!!");
		var pattern2=new RegExp("!!$");
		var ctr=0;
		debugMode=false;
		var debugStrg='--analysis of return data--'+"\n";
		//alert ('back from ajax now loop through');//xxxd
		var nowDoDebug=0;
		var statusCtr=0;
//		----------- start loop through records
		//alert ('xxxf1 maincnt: '+mainCnt);//xxxf
		for (var mainLp=0;mainLp<mainCnt;mainLp++){
			statusCtr++;
			if (statusCtr>200){
				utilObj.writeLog('debug9id','processing results mainLp: '+mainLp+'/'+mainCnt);
				statusCtr=0;
			}
			responseLine=responseAry[mainLp];
    	   	//xxxf
			//if (mainLp>20 && mainLp<23){alert (mainLp+': '+responseLine);}
			if (responseLine != ''){
				subStr=responseLine.match('!!');
				var isItThere=(pattern1.test(responseLine)&&pattern2.test(responseLine));
				//xxxf
				if (isItThere){
					nowDoDebug=1;
					debugStrg+=responseLine+"\n";
//					------------------------------- change mode of data reading
					atEnd=false;atMenus=false;atTables=false;atForms=false;
					atHtml=false;atCss=false;atCalendar=false;atCopyToCalendar=false;
					atContainer=false;atImage=false;atAlbum=false;atParagraph=false;
					atUtility=false;
					//xxxd
					//vl=prompt(responseLine,'x');if (vl=='x'){exit();}
					if (responseLine.match('!!table!!') != null){atTables=true;}
					else if (responseLine.match('!!form!!') != null){atForms=true;}
					else if (responseLine.match('!!menus!!') != null){atMenus=true;}
					else if (responseLine.match('!!wholemenu!!') != null){atWholeMenus=true;}
					else if (responseLine.match('!!html!!') != null){atHtml=true;}
					else if (responseLine.match('!!css!!') != null){atCss=true;}
					else if (responseLine.match('!!calendar!!') != null){atCalendar=true;}
					else if (responseLine.match('!!copytabletocalendar!!') != null){atCopyToCalendar=true;}
					else if (responseLine.match('!!container!!') != null){atContainer=true;}
					else if (responseLine.match('!!image!!') != null){atImage=true;}
					else if (responseLine.match('!!album!!') != null){atAlbum=true;}
					else if (responseLine.match('!!paragraph!!') != null){atParagraph=true;}
					else if (responseLine.match('!!utility!!') != null){atUtility=true;}
				}
				else {
//					----------------------------- pull apart line and perform operations
					var pos=responseLine.indexOf('?%',0);
					if (pos>-1){responseLineAry=responseLine.split('?%');}
					else {responseLineAry=responseLine.split('|');}
					actionCode=responseLineAry[0];
					actionValue=responseLineAry[1];
					if (actionValue == undefined){actionValue='';}
					//document.write(mainLp+': '+actionCode+'<br>');//xxx
					actionValue2=responseLineAry[2];
					if (actionValue2 == undefined){var actionValue2='';}
					actionValue3=responseLineAry[3];
					if (actionValue3 == undefined){var actionValue3='';}
					actionValue4=responseLineAry[4];
					if (actionValue4 == undefined){var actionValue4='';}
					responseLineNo=responseLineAry.length;
					if (nowDoDebug){
						debugStrg+=actionCode+": "+actionValue.substring(0,20)+", "+actionValue2.substring(0,20)+", "+actionValue3.substring(0,20)+", "+actionValue4.substring(0,20)+"\n";
					}
					if (atHtml){
						//xxxf
						//if (mainLp>1 && mainLp<4){alert ('load html: '+responseLine);}
						insertHtml=insertHtml.concat(responseLine);
					}
//					------- tables	   	
					else if (atTables){
						if (actionCode=='tablename'){
							//alert ('tablename: '+actionValue);//xxxd
							//alert ('ajax: calling tableobj.resetxxxd: tablename: '+actionValue);
							tableObj.setTableName(actionValue);
							tableObj.reset(showHtml);
						}
						else if (actionCode=='displayary'){
							tableObj.loadDisplay(actionValue);
						}
						else if (actionCode=='selectary'){
							tableObj.loadSelect(actionValue);
						}
						else if (actionCode=='dataary'){
							//xxxd
							//vl=prompt(actionCode+': '+actionValue,'x');if (vl=='x'){exit();}
							tableObj.loadData(actionValue);
						}
						else if (actionCode=='etc'){
							tableObj.loadEtc(actionValue,actionValue2);
						}
						else if (actionCode=='keyindex'){
							tableObj.loadKeyIndex(actionValue);
						}
						else {
							actionCode = actionCode.substring(0,10);
							alert ('action code: '+actionCode+', mainlp/maincnt: '+mainLp+'/'+mainCnt);
							exit();
							tableObj.setError('ajax.js: L 376: invalid action code: '+actionCode);
							alert ('action code: '+actionCode+', mainlp/maincnt: '+mainLp+'/'+mainCnt);
							alert (response_raw);//xxxd
							var line1No=mainLp-1;
							var line1=responseAry[line1No];
							var line2No=mainLp;
							var line2=responseAry[line2No];
							var line3No=mainLp+1;
							var line3=responseAry[line3No];
							alert (line1No+': '+line1+"\n"+line2No+': '+line2+"\n"+line3No+': '+line3);
							exit();
						}
					}
//					-------- forms
					else if (atForms){
						var vl='xxxf23';
						//vl=prompt(actionCode+': '+actionValue,'x');if (vl=='x'){exit();}
						//
						//document.write (mainLp+'/'+mainCnt+': '+responseLine);//xxx
						//xxxd - !!!! this stuff can run at the same time with another ajax screwing it up
						if (actionCode=='formname'){
							var formName=actionCode;//xxxd
							formObj.setFormName(actionValue);
						}
						//- below for names,nameids,regexs,keymaps,errormsgs
						else if (actionCode=='loadetc'){
							formObj.loadEtc(actionValue,actionValue2);
						}
					}
//					-------- menus - I think that I need to redo this	   	
					else if (atMenus){
						//alert (actionCode+': '+responseLineAry[1]+', '+responseLineAry[2]);//xxxf
						if (actionCode=='initmenu'){
							//- this better be the first one!!!
							var menuName=responseLineAry[1];
							menuObj.initMenu(menuName);
						}
						if (actionCode=='setetchash'){
							menuObj.setEtcValueAjax(menuName,responseLineAry[1],responseLineAry[2]);
						}
						if (actionCode=='initsetary'){
							var theCode=responseLineAry[1];
							var elementNo=responseLineAry[2];
							var theValue=responseLineAry[3];
							var theName='dmy';
							menuObj.setArraysAjax(menuName,theCode,elementNo,theName,theValue);
						}
						if (actionCode=='initsethash'){
							var theCode=responseLineAry[1];
							var elementNo=responseLineAry[2];
							var theName=responseLineAry[3];
							var theValue=responseLineAry[4];
							menuObj.setArraysAjax(menuName,theCode,elementNo,theName,theValue);
						}
						if (actionCode=='loadjson'){
							menuObj.loadJson(responseLineAry[1],responseLineAry[2]);
						}
					}
//					------- style
					else if (atCss){
						//xxxd
						//alert ('xxxd1');
						//var dmy=prompt(responseLine,'x');if (dmy=='x'){exit();}
						containerObj.saveCssAjax(containerName,responseLine);
						//alert ('save css for containername: '+containerName+' progress: '+mainLp+'/'+mainCnt);//xxxd
					}
//					------- calendar
					else if (atCalendar){
						//xxxd
						//var vl=prompt(actionCode,'exit');if (vl=='exit'){exit();}
						//xxxd - !!!!! this stuff can run at the same time as another ajax screwing things up
						if (actionCode=='calendarname'){
							calendarObj.setName(actionValue);
						}
						else if (actionCode=='loadetc'){
							calendarObj.loadEtc(actionValue,actionValue2);
						}
						else if (actionCode=='desc'){
							calendarObj.loadDesc(actionValue,actionValue2);
						}
						else if (actionCode=='event'){
							calendarObj.loadEventData(actionValue,actionValue2,actionValue3,actionValue4);
						}
						else if (actionCode=='loadeventsjson'){
							calendarObj.loadEventsJson(actionValue,actionValue2,actionValue3);
						}
						else {
							var vl=prompt(actionCode+': '+actionValue+', '+actionValue2+', '+responseLine,'exit');
							if (vl=='exit'){exit();}
						}
					}
//					------- whole menus	   	 
					else if (atWholeMenus){atWholeMenusAry.push(responseLine);}
//					------- copy a table into the calendar	   	  		
					else if (atCopyToCalendar){
						calendarObj.copyInTable(actionValue);
						var reDisplayCalendar=true;
					}
//					------- get container information	   	  		
					else if (atContainer){
						//alert (actionCode+', '+actionValue+', '+actionValue2);//xxxf
						if (actionCode=='containername'){
							var containerName = actionValue;
							//alert ('containername: '+containerName);//xxxd
							containerObj.setContainerName(containerName);
							//containerObj.displayAry(containerObj.containerHash[containerName]['etc']);//xxxd
						}
						else if (actionCode=='loadetc'){
							//alert ('load etc: '+containerName+', '+actionValue+', '+actionValue2);//xxxd
							containerObj.loadEtcAjax(containerName,actionValue,actionValue2);
						}
					}
//					------- get image information
					else if (atImage){
						if (actionCode == 'setname'){
							//dbFlg=1;
							//alert ('setimagename');//xxxd
							imageObj.setImageName(actionValue);
							//alert ('back from setimagename');//xxxd
						}
						else if (actionCode == 'loadetc'){
							//alert ('setetcvalue');//xxxd
							imageObj.setEtcValue(actionValue,actionValue2);
							//alert ('back from setetcvalue');//xxxd
						}
						else {alert ('2:invalid action code: '+actionCode+' '+actionValue+' '+actionValue2);}
					}
//					------- get album
					else if (atAlbum){
						if (actionCode == 'setalbumname'){
							albumObj.setName(actionValue);
						}
						else if (actionCode == 'loadalbumsrc'){
							albumObj.loadInfo('src',actionValue);
						}
						else if (actionCode == 'loadalbumtitles'){
							albumObj.loadInfo('titles',actionValue);
						}
						else if (actionCode == 'loadalbumcaptions'){
							albumObj.loadInfo('captions',actionValue);
						}
						else if (actionCode == 'loadvideoids'){
							albumObj.loadInfo('videoids',actionValue);
						}
						else if (actionCode == 'loadetc'){
							albumObj.setEtcValue(actionValue,actionValue2);
						}
						else {
							alert ('invalid for atAlbum: '+actionCode+', '+actionValue);
						}
					}
					else if (atParagraph){
						if (actionCode == 'savenamedstring'){
							userObj.saveNamedString(actionValue,actionValue2);
						}
						else {
							alert ('invalid for atParagraph: '+actionCode+', '+actionValue);
						}
					}
					else if (atUtility){
						if (actionCode == 'setupcontainerviaajaxjson'){
							containerObj.setupContainerViaAjaxJson(actionValue,actionValue2,actionValue3);
						}
					}
					else {alert ('xxxd2: no ifelse: '+mainLp+'/'+mainCnt+', actioncode: '+actionCode);};
				}
			}
		}
		//--------------------- final processing
		utilObj.writeLog('debug9id','final processing...');
		if (containerName == undefined){
			alert ('line 579 ajax.getContainerViaAjaxSimple containername is undefined!!!');
			alert (response_raw);
		}
		else {
			//alert ('going to load innerhtml = showHtml: '+showHtml+ ', '+insertHtml);//xxxf
			//xxxf
			if (showHtml != false){
				utilObj.writeLog('debug9id','ajax: load in inserthtml, showHtml: '+showHtml);
				containerObj.loadInnerHtmlAjax(containerName,insertHtml);
				utilObj.writeLog('debug9id','ajax: done with loadinnerhtmlajax for container: '+containerName);
			}
			// need to do this after html is loaded for jquery I think
			utilObj.writeLog('debug9id','loadcssajax for container: '+containerName);
			containerObj.loadCssAjax(containerName);
			utilObj.writeLog('debug9id','done loading cssajax');
		}
		if (reDisplayCalendar){this.calendarObj.reDisplayCalendar();}
		utilObj.writeLog('debug9id','set ajax is done');
		containerObj.setAjaxIsDone();
		utilObj.writeLog('debug1id','done set ajax is done');
	},
	parameters: {'senddata': sendData},
	onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone; }
	});
},
//========================================================
ajaxPostToServer: function(jobName,operationName,sendDataAry){
	containerObj.setAjaxIsRunning();
	containerObj.jsDebug('ajax: function ajaxPostToServer(jobName,operationName,sendDataAry)');
//	--- init setup
	var ajaxFieldDelim='~';
	var ajaxLineDelim='`';
	var ajaxSubLineDelim='|';
	var containerName="none";
	var url='/index.php';
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
//	--- get data to send and make it a string
	var sendData=sendDataAry.join(ajaxLineDelim);
	new Ajax.Request(url, {
		method: 'post',
		onSuccess: function(transport){
		var response_raw = transport.responseText || "no response text";
		//alert ('response_raw: '+response_raw);//xxx
		var responseAry=response_raw.split(ajaxSubLineDelim);
		var theLineCnt=responseAry.length;
		var startCapture=false;
		var gotErrorKey=false;
		var errorMsg='';
		var debugDisplay='';
		var errorKey='';
		var delStrg='';
		var updStrg='';
//		--- loop through each response line
		for (var lineLp=0;lineLp<theLineCnt;lineLp++){
			var theLine=responseAry[lineLp];
			debugDisplay+=theLine+'\n';//xxx
//			- everything sluffed off until !!message!! found
			if (startCapture){
				var lineAry=theLine.split(':');
				var cmd=lineAry[0];
				var theLen=lineAry.length;
				var vlu='';
				for (var lp=1;lp<theLen;lp++){
					vlu+=lineAry[lp]+' ';
				}
				if (cmd=='status'){
					errorKey=vlu;
					//alert ('vlu0: '+vlu);//xxx
				}
				else if (cmd=='statusmsg') {
					errorLine=vlu;
					errorLine=errorLine.strip();
					errorMsg+=errorLine+"\n";
					//alert ('vlu1: '+vlu);//xxx
				}
				else if (cmd=='del'){
					delStrg=vlu;
				}
				else if (cmd=='upd'){
					updStrg=vlu;
				}
				else if (cmd=='tempkeyconv'){
					var vluAry=vlu.split(' ');
					var dbTableName=vluAry[0];
					var vluString=vluAry[1];
					var idConvAry=vluString.split('~');
					//alert ('ajax: run convtempids');//xxx
					tableObj.convTempIds(tableName, idConvAry);
				}
			}
			if (!startCapture){
				var pos=theLine.indexOf('!!message!!',-1);
				if (Number(pos)>=0){startCapture=true;}
			}
		}
		errorKey=errorKey.strip();
		if (errorKey != 'ok'){
			alert (errorKey+') '+errorMsg);
		}
		else {
			tableObj.clearUpdateFlags();
		}
		containerObj.setAjaxIsDone();
	},
	parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
	onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone(); }
	});
},
//========================================================
postAjaxSimple: function(formName,jobName,operationName,tableName,sendDataAry){
	containerObj.setAjaxIsRunning();
	utilObj.writeLog('debug1id','!!ajaxObj.postAjaxSimple!!');
	utilObj.writeLog('debug1id','setajaxisrunning, form: '+formName+', jobname: '+jobName+', operationname: '+operationName+', tablename: '+tableName);
//	--- init setup
	//alert ('operationname: '+operationName);//xxxd
	var containerName='';
	var ajaxFieldDelim='~';
	var ajaxLineDelim='`';
	var ajaxSubLineDelim='|';
	var url='/index.php';
	var containerName="none";
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl;
	var dbName=userObj.getEtcValue('domainname');
	if (dbName == undefined){dbName='';}
//	--- get data to send and make it a string
	var sendData=sendDataAry.join(ajaxLineDelim);
	utilObj.writeLog('debug1id','url sent: '+url+', senddata: '+sendData);
	new Ajax.Request(url, {
		method: 'post',
		onSuccess: function(transport){
		var response_raw = transport.responseText || "no response text";
		var responseAry=response_raw.split(ajaxSubLineDelim);
		var errorKey=responseAry[0];
		if (responseAry.length>1){
			var errorMsg=responseAry[1];
		}
		else {var errorMsg='';}
		//alert ('postajaxsimple: back from server side, response: '+response_raw+', errorkey: '+errorKey+', errormsg: '+errorMsg);//xxxf
		if (errorKey=='ok'){
//			- ok errorKey
			if (formName != ''){
				if (formName == 'pictureprofile'){var silentForm=1;}
				else {var silentForm=0;}
				if (!(silentForm)){
					formObj.clearFormFields(formName);
					alert ('ok');//xxxd
				}
			}
		}
		else if (errorKey=='oknoalert'){
//			- ok errorKey
			if (formName != ''){
				if (formName == 'pictureprofile'){var silentForm=1;}
				else {var silentForm=0;}
				if (!(silentForm)){
					formObj.clearFormFields(formName);
				}
				
			}
		}
		else if (errorKey=='okupd'){
//			- okupd errorKey
			try {var loadId=responseAry[1];} 
			catch (err){alert ('ajax.postAjaxSimple(first field): '+err);}
			try {var loadMsg=responseAry[2];}
			catch (err){alert ('ajax.postAjaxSimple(second field): '+err);}
			//alert ('load '+loadMsg+' into '+loadId);//xxxf
			try {$(loadId).innerHTML=loadMsg;}
			catch (err){alert ('ajax.postAjaxSimple: '+err+' loadid: '+loadId);}
			//containerObj.displayAry(responseAry);//xxxd
		}
		else if (errorKey=='okmsg'){
//			- okmsg errorKey
			alert ("done\n"+errorMsg);
		}
		else if (errorKey=='okdonothing'){
//			- okdonothing errorKey
		}
		else if (errorKey=='error'){
			alert (errorMsg);
		}
		else {
//			- default error
			//100911 - make so hdec hide conditional work
			userObj.restrictHide();
			alert ('('+errorKey+') '+errorMsg);
		}
		containerObj.setAjaxIsDone();
		//alert ('postajaxsimple: done on return of postajax');//xxxf
	},
	parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'dbname': dbName, 'senddata': sendData},
	onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone(); }
	});
},
//========================================================
getFormDbViaAjax: function(jobName,operationName,sendDataAry){
	containerObj.setAjaxIsRunning();
//	--- init setup
	var ajaxFieldDelim='~';
	var ajaxLineDelim='`';
	var ajaxSubLineDelim='|';
	var url='/index.php';
	var containerName="none";
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl;
//	--- get data to send and make it a string
	var sendData=sendDataAry.join(ajaxLineDelim);
	new Ajax.Request(url, {
		method: 'post',
		onSuccess: function(transport){
		var ajaxFieldDelim='~';
		var ajaxLineDelim='`';
		var ajaxSubLineDelim='|';
		var response_raw = transport.responseText || "no response text";
		var responseAry=response_raw.split(ajaxLineDelim);
		var noLines=responseAry.length;
		var formName=null;
		var formColumnNames=null;
		var formColumnValues=null;
		for (var lp=0;lp<noLines;lp++){
			var responseLine=responseAry[lp];
			var responseLineAry=responseLine.split(ajaxSubLineDelim);
			//alert (responseLineAry);//xxxd
			var theCode=responseLineAry[0];
			var theValue=responseLineAry[1];
			//alert (theCode+': '+theValue);
			switch (theCode){
			case 'formcolumnnames':
				formColumnNames=theValue;
				break;;
			case 'formcolumnvalues':
				formColumnValues=theValue;
				break;;
			case 'formname':
				formName=theValue;
				break;;
			}
		}
		//alert ('formname: '+formName+', names: '+formColumnNames+', values: '+formColumnValues);//xxxd
		formObj.loadFormFields(formName,formColumnNames,formColumnValues);
		containerObj.setAjaxIsDone();
//		- below we do the updating of the form
	},
	parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
	onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone(); }
	});
},
//========================================================
	getTableDbViaAjaxdeprecatedduetoproblems: function(jobName,operationName,sendDataAry){
	//--- init setup
		var ajaxFieldDelim='~';
		var ajaxLineDelim='`';
		var ajaxSubLineDelim='|';
		var url='/index.php';
		var containerName="none";
		var dateObj=new Date();
		var secs=dateObj.getSeconds();
		//var secs=dateObj.getSeconds();
		var baseUrlHost=location.hostname;
		var baseUrlPath=location.pathname;
		var baseUrl=baseUrlHost+baseUrlPath;
		var url='http://'+baseUrl;
		//alert (url);//xxxd
//--- get data to send and make it a string
		var sendData=sendDataAry.join(ajaxLineDelim);
		//alert (url+', '+jobName+', '+operationName+', '+sendData);//
		new Ajax.Request(url, {
			method: 'post',
			onSuccess: function(transport){
				var ajaxFieldDelim='~';
				var ajaxLineDelim='`';
				var ajaxSubLineDelim='|';
				var response_raw = transport.responseText || "no response text";
				//alert ('raw: '+response_raw);//xxxd
				//exit();//xxxd
				var responseAry=response_raw.split(ajaxLineDelim);
				//alert ('array: '+responseAry);//xxxd
				var noLines=responseAry.length;
				var dbColumnValuesAry=new Array();
				for (var lp=0;lp<noLines;lp++){
					//alert ('xxxd0: '+lp);
					var responseLine=responseAry[lp];
					var responseLineAry=responseLine.split(ajaxSubLineDelim);
					//alert (responseLineAry);//xxxd
					//alert ('xxxd1');
					var actionCode=responseLineAry[0];
					var actionValue=responseLineAry[1];
					//alert ('xxxd2');
					var actionValue2=responseLineAry[2];
					//alert ('xxxd3: code: '+actionCode+', actionValue: '+actionValue);
					//alert (theCode+': '+theValue);//xxxd
					//if (lp>20){alert (theCode+': '+theValue);}
					//exit();//xxxd
					switch (actionCode){
					case 'tablename':
						tableObj.setTableName(actionValue);
						break;;
					case 'displayary':
		   	  			tableObj.loadDisplay(actionValue);
		   	  			break;;
					case 'selectary':
						tableObj.loadSelect(actionValue);
	   	  				break;;
					case 'dataary':
		   	  				//vl=prompt(actionCode+': '+actionValue,'x');if (vl=='x'){exit();}
						tableObj.loadData(actionValue);
						break;;
					case 'etc':
	   	  				tableObj.loadEtc(actionValue,actionValue2);
	   	  				break;;
					case 'keyindex':
		   	  			tableObj.loadKeyIndex(actionValue);
		   	  			break;;
					default:
						alert ('err: '+theCode+': '+theValue+', '+theValue2);
					}
				}
				//alert ('tableObj.displayPage()');//xxxd
				tableObj.displayPage();
				//alert ('dbtablename: '+dbTableName+', dbcolumnnames: '+dbColumnNames);//xxxd
				//alert ('dbcolumnvalues: '+dbColumnValuesAry);//xxxd
				if (tablename != undefined){
					//xxxd
				}
		   	},
		   	parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
		   	onFailure: function(){ alert('Something went wrong...'); }
		});
	},
//========================================================
	postFormDataAjax: function(jobName,operationName,sendDataAry){
		//xxxd - tableName is not used but is required!!!
		containerObj.setAjaxIsRunning();
		//--- init setup
		var containerName='';
		var ajaxFieldDelim='~';
		var ajaxLineDelim='`';
		var ajaxSubLineDelim='|';
		var containerName="none";
		var dateObj=new Date();
		var secs=dateObj.getSeconds();
		var baseUrlHost=location.hostname;
		var baseUrlPath=location.pathname;
		var baseUrl=baseUrlHost+baseUrlPath;
		var url='http://'+baseUrl;
//--- get data to send and make it a string
		var sendData=sendDataAry.join(ajaxLineDelim);
		var dbName=userObj.getEtcValue('dbname');
		if (dbName == undefined){dbName='';}
		new Ajax.Request(url, {
			method: 'post',
			onSuccess: function(transport){
				var response_raw = transport.responseText || "no response text";
				var responseAry=response_raw.split(ajaxLineDelim);
				var responseLen=responseAry.length;
				var userFlg=0;
//- loop through each response line
				for (var responseLp=0; responseLp<responseLen; responseLp++){
					var responseLine=responseAry[responseLp];
					var responseLineAry=responseLine.split(ajaxSubLineDelim);
					var responseCode=responseLineAry[0];
					var responseValue1=responseLineAry[1];
					var responseValue2=responseLineAry[2];
					var pos=responseCode.indexOf('!!');
					if (pos>-1){
//--------------- code to change mode of input
						userFlg=0;
						switch (responseCode){
						case '!!user!!':userFlg=1;break;
						default:alert ('invalid code: '+responseCode);
						}
					}
					else {
//----------------- regular response line
						if (userFlg>0){
//--- user mode	
							switch (responseCode){
							case 'etchash':
								userObj.setEtcValue(responseValue1,responseValue2);
								break;
							default:
								alert ('invalid user response code: '+responseCode);
							}
						}
						else {
//--- non user mode 
							var errorKey=responseLineAry[0];
							if (responseLineAry.length>1){
								var errorMsg=responseLineAry[1];
							}
							else {var errorMsg='';}
							//alert ('error key: '+errorKey+', error Message: '+errorMsg);
							switch (errorKey){
							case 'ok':
								if (formName != ''){
									formObj.clearFormFields(formName);
								}
								break;
							case 'loadinnerhtml':
								//alert (errMsg);//xxxf
								var loadId=responseLineAry[2];
								try {$(loadId).innerHTML=errorMsg;}
								catch (err){alert ('axajObj.postFormDataAjax '+err+' loadid: '+loadId);}
								break;
							default:
								alert ('error('+errorKey+'): '+errorMsg);
							}
							responseLp=responseLen;
						}
					}
				}
				containerObj.setAjaxIsDone();
		   	},
		   	parameters: {'dbname': dbName, 'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
		   	onFailure: function(){ alert('Something went wrong...'); containerObj.setAjaxIsDone(); }
		});
	}
});	
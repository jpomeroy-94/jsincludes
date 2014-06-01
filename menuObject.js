var MenuObject = Class.create({
// version: 1.1.1
//  menuName
//	menuHash[menuName]['etchash']
//						['menuselectedclass']
//						['menuclass']
//						['menuid']
//						['lastmenuelementno']
//						['imageId']
//					['elementsary']
//						[elementno]->'<a ...></a>'
//					['titlesary']
//						[elementno]->'title'
//					['textary']
//						[elementno]->'text'
//					['elementsotherary']
//						[elementno]
//							menuelementalertclass		
//							menuelementclass
//							menuelementalt
//							menuelementid
//===================================================
	initialize: function() {
		this.menuHash = new Hash();
		//alert ('init of menu');
	},
//=========================================================
	  removeDisplay: function(containerName){
	    ContainerObj.jsDebug('TableObj.removeDisplay()');
	    //alert ('set containername to '+containerName);//xxxd
	    //xxxf - this could be a problem
	    ContainerObj.removeDisplay();// remove what is current (subcontainer)
	    ContainerObj.setContainerName(containerName);
	    ContainerObj.removeDisplay();// remove the main container
	 },
//===================================================
	initMenu: function(menuName){
		ContainerObj.jsDebug('MenuObj.initMenu('+menuName+')');
		this.menuName=menuName;
		//UserObj.doLog('','ininitmenu this.menuName: '+this.menuName);//xxxf
		var tst=this.menuHash[menuName];
		if (tst==undefined){this.menuHash[menuName]=new Hash();}
		//UserObj.doLog('','l43');
		var tst=this.menuHash[menuName]['etchash'];
		if (tst==undefined){this.menuHash[menuName]['etchash']=new Hash();}
		//UserObj.doLog('','l45');
		var tst=this.menuHash[menuName]['elementsary'];
		if (tst==undefined){this.menuHash[menuName]['elementsary']=new Array();}
		//UserObj.doLog('','l48');
		var tst=this.menuHash[menuName]['titlesary'];
		if (tst==undefined){this.menuHash[menuName]['titlesary']=new Array();}
		//UserObj.doLog('','l51');
		var tst=this.menuHash[menuName]['textary'];
		if (tst==undefined){this.menuHash[menuName]['textary']=new Array();}
	},
//===================================================
	setMenuName: function(menuName){
		this.menuName=menuName;
	},
//===================================================
	setName: function(menuName){this.setMenuName(menuName);},
//===================================================
	showMenu: function(showMenuNames,hideMenuNames){
//- hide them
		if (hideMenuNames != ''){
			var hideMenuNamesAry=hideMenuNames.split(',');
			var noHideNames=hideMenuNamesAry.length;
			for (var lp=0;lp<noHideNames;lp++){
				var menuName=hideMenuNamesAry[lp];
				this.setMenuName(menuName);
				var menuId=this.getEtcValue('menuid');
				try {
					$(menuId).style.visibility='hidden';
				} catch (err){
					alert ('menuobj.hideMenu: ('+err+') menuid: '+menuId);
				}
			}
		}
//- show them
		if (showMenuNames != ''){
			var showMenuNamesAry=showMenuNames.split(',');
			var noShowNames=showMenuNamesAry.length;
			for (var lp=0;lp<noShowNames;lp++){
				var menuName=showMenuNamesAry[lp];
				this.setMenuName(menuName);
				var menuId=this.getEtcValue('menuid');
				try {
					$(menuId).style.visibility='visible';
				} catch (err){
					alert ('menuobj.showMenu: ('+err+') menuid: '+menuId);
				}
			}
		}
	},
//===================================================
	hideMenu: function(menuName){
		var menuId=this.menuHash[menuName]['etchash']['menuid'];
		try {
			$(menuId).style.visibility='hidden';
		} catch (err){
			alert ('MenuObj.hideMenu: ('+err+') menuname: '+menuName+', menuid: '+menuId);
		}
	},
//===================================================
	swap: function(menuToSwap){
		this.oldMenuName=this.menuName;
		this.menuName=menuToSwap;	
	},
//===================================================
	reverseSwap: function(){
		this.menuName=this.oldMenuName;
	},
//===================================================
	setSelectedClass: function(deprecatedMenuName,menuElementNo){
		ContainerObj.jsDebug('MenuObj.setSelectedClass(depr: '+deprecatedMenuName+', menuelementno: '+menuElementNo+')');
		menuName=this.menuName;
		//alert ('menuname: '+menuName);//xxx
		try {var menuSelectedClass=this.menuHash[menuName]['etchash'].get('menuselectedclass');}
		catch (err){
			alert ('MenuObj.setSelectedClass L57: menuname: '+menuName+'\n'+err);
			ContainerObj.displayStack('me.setSelectedClass');
		}
		if (menuSelectedClass != ''){
			var menuNonSelectedClass=this.menuHash[menuName]['etchash'].get('menuclass');
			var lastMenuElementNo=this.menuHash[menuName]['etchash'].get('lastmenuelementno');
			var menuId=this.menuHash[menuName]['etchash'].get('menuid');
			if (menuId != '' && menuId != undefined){
				try {
					var elementBase=$(menuId).getElementsByTagName('a')[menuElementNo];
					//alert ('set selected menuid: '+menuId+' elementno: '+menuElementNo+', class: '+menuSelectedClass);//xxxf
					elementBase.className=menuSelectedClass;
				}
				catch (err){
					alert ('MenuObj.setselectedclass: '+err+', menuId: '+menuId+', elementno: '+menuElementNo);
				}
				if (menuElementNo != lastMenuElementNo && lastMenuElementNo != undefined){
					try {
						var elementBase=$(menuId).getElementsByTagName('a')[lastMenuElementNo];
						//alert ('setback menuid: '+menuId+' elementno: '+lastMenuElementNo+', class: '+menuNonSelectedClass);//xxxf
						elementBase.className=menuNonSelectedClass;
					}
					catch (err){
						alert ('MenuObj.setselectedclass: '+err+', menuid: '+menuId+', lastmenuelementno: '+lastMenuElementNo);
					}
				}
			}
			else {
				alert ('menuid is invalid: '+menuId);
			}
		}
		//alert ('setselectedclass: '+menuName+': '+menuElementNo+', class: '+menuSelectedClass);//xxxf
		this.menuHash[menuName]['etchash'].set('lastmenuelementno',menuElementNo);
	},
//===================================================
	setAlertClass: function(code){
		ContainerObj.jsDebug('MenuObj.setAlertClass(code: '+code+')');
		var menuName=this.menuName;
		var parentMenuName=this.parentMenuName;//xxx
		if (parentMenuName != undefined){var useMenuName=parentMenuName;}
		else {var useMenuName=menuName;}
		var origMenuName=this.menuName;
		this.menuName=useMenuName;
		var alertClass=this.getElementsOther('menuelementalertclass');
		var theClass=this.getElementsOther('menuelementclass');
		if (code=='set'){var useClass=alertClass;}
		else {var useClass=theClass;}
		if (useClass != ''){
			var menuElementId=this.getElementsOther('menuelementid');
			if (menuElementId != ''){
				var elementBase=$(menuElementId);
				if (elementBase != undefined){elementBase.className=useClass;}
				else {alert ('elementbase is undefined for menuelementid: '+menuElementId);}
			}
			else {alert ('MenuObj.setAlertClass: menuelementid is null');}
		}
		else {alert ('MenuObj.setAlertClass: alertclass is null');}
		this.menuName=origMenuName;
	},
//===================================================
	getElementsOther: function(theName){
		ContainerObj.jsDebug('MenuObj.getElementsOther(theName: '+theName+')');
		var menuName=this.menuName;
		//alert ('menuName: '+menuName);//xxx
		//ContainerObj.displayAry(this.menuHash[menuName]['etchash']);//xxx
		var rtnValue = '';
		var elementNo=this.menuHash[menuName]['etchash'].get('lastmenuelementno');
		//alert ('getelementsother: '+menuName+': '+elementNo);//xxx
		if (elementNo==''){alert('elementno is null');}
		else {
			rtnValue=this.menuHash[menuName]['elementsotherary'][elementNo].get(theName);
		}
		return rtnValue;
	},
//===================================================
	setFixedMenuDisplay: function(jobParamsAry){
		ContainerObj.jsDebug('MenuObj.setMenuDisplay()');
		UserObj.doLog('init','call setfixedmenudisplay');
		//- get variables
		var fixedMenuName=jobParamsAry[0];
		var fixedMenuElementNo=jobParamsAry[1];
		var callingMenuName=jobParamsAry[2];
		var callingMenuElementId=jobParamsAry[3];
		//- get calling menu class and selected class
		this.menuName=callingMenuName;
		UserObj.doLog('','this.menuName: '+this.menuName+', which was callingmenuname');
		UserObj.doLog('','line 198 - call getetcvalue next');
		//UserObj.displayLog('line 199 just before getetcvalue');//xxxf
		var callingMenuClass=this.getEtcValue('menuclass');
		//UserObj.displayLog('line 201 after getetcvalue');//xxxf
		var callingMenuSelectedClass=this.getEtcValue('menuselectedclass');
		UserObj.doLog('','callingMenuClass: '+callingMenuClass+', callingMenuSelectedClass: '+callingMenuSelectedClass);
		//- set calling menu old element to class
		var lastId=this.getEtcValue('lastid');
		UserObj.doLog('','lastid: '+lastId+' set to callingmenuclass');
		//UserObj.displayLog('l212');//xxxf
		//UserObj.displayLog('line 203');//xxxf
		if (lastId != undefined && lastId.length > 0){
			UserObj.doLog('','did the try');
			try {$(lastId).className=callingMenuClass;}
			catch (err){alert ('MenuObj.setFixedMenuDisplay('+err+'): lastid: '+lastId+', callingmenuclass: '+callingMenuClass);}
		}
		//- set calling menu element to selected class
		UserObj.doLog('','new id: '+callingMenuElementId+' set to callingmenuselectedclass');
		try{$(callingMenuElementId).className=callingMenuSelectedClass;}
		catch (err){alert ('MenuObj.setFixedMenuDisplay('+err+'): callingmenuelementid: '+callingMenuElementId);}
		//- save id of new selected class
		this.setEtcValue('lastid',callingMenuElementId);
		//UserObj.displayLog();
		//- get new image source and update controlled menu
		this.menuName=fixedMenuName;
		//alert (theFixedSrc+', '+theFixedTitle+', '+theFixedText);//xxxf
		//- get new title and update fixed menu
		UserObj.doLog('','get thefixedtitle from this.menuname: '+this.menuName+', titlesary, fixedmenuelementno: '+fixedMenuElementNo);
		//UserObj.displayLog('l230');//xxxf
		var theFixedTitle=this.menuHash[this.menuName]['titlesary'][fixedMenuElementNo][0];
		var theFixedTitleId=this.getEtcValue('menutitleid');
		UserObj.doLog('','thefixedtitleid: '+theFixedTitleId+', thefixedtitle: '+theFixedTitle);
		if (theFixedTitleId != undefined && theFixedTitleId != ''){
			try {$(theFixedTitleId).innerHTML=theFixedTitle;}
			catch (err){alert ('MenuObj.setFixedMenuDisplay('+err+'): fixedtitleid: '+theFixedTitleId);}
		}
		//UserObj.displayLog('l237');
		//- get new text and update fixed menu
		var theFixedText=this.menuHash[this.menuName]['textary'][fixedMenuElementNo][0];
		var theFixedTextId=this.getEtcValue('menutextid');
		if (theFixedTextId != undefined && theFixedTextId.length > 0){
			try {$(theFixedTextId).innerHTML=theFixedText;}
			catch (err){alert ('MenuObj.setFixedMenuDisplay('+err+'): fixedtextid: '+theFixedTextId);}
		}
		//- get new image src and update fixed menu
		var theFixedSrc=this.menuHash[this.menuName]['elementsary'][fixedMenuElementNo][0];
		var theFixedImageId=this.getEtcValue('menuimageid');
		if (theFixedImageId != undefined && theFixedImageId.length > 0){
			try {$(theFixedImageId).src=theFixedSrc;}
			catch (err){alert ('MenuObj.setFixedMenuDisplay('+err+'): fixedimageid: '+theFixedImageId);}
		}
	},
//==================================================
	displayEtc: function(){
		ContainerObj.displayAry(this.menuHash[this.menuName]['etchash']);
	},
//===================================================
	loadEtc: function(etcName,etcValue){
		ContainerObj.jsDebug('MenuObj.loadEtc(etcName: '+etcName+', etcValue: '+etcValue+')');
		var menuName=this.menuName;
		this.initMenu(menuName);
		this.menuHash[this.menuName]['etchash'].set(etcName,etcValue);
	},
//===================================================
	retrieveEtc: function(etcName){
		ContainerObj.jsDebug('MenuObj.retrieveEtc('+etcName+')');
		var menuName=this.menuName;
		this.initMenu(menuName);
		var theRtnValue=this.menuHash[this.menuName]['etchash'].get(etcName);
		return theRtnValue;
	},
//==================================================
	setEtcValue: function(etcName,etcValue){
		this.setEtcValueAjax(this.menuName,etcName,etcValue);
	},
//==================================================
	setTmpValue: function(tmpName,tmpValue){
		var tst=this.menuHash[this.menuName]['tmphash'];
		if (tst == undefined){
			this.menuHash[this.menuName]['tmphash']=new Hash();
		}
		this.menuHash[this.menuName]['tmphash'].set(tmpName,tmpValue);
	},
//===================================================
	getTmpValue: function(tmpName){
		var tst=this.menuHash[this.menuName]['tmphash'];
		if (tst == undefined){
			this.menuHash[this.menuName]['tmphash']=new Hash();
		}
		var tmpValue=this.menuHash[this.menuName]['tmphash'].get(tmpName);
		return tmpValue;
	},
//==================================================
	setEtcValueAjax: function (menuName,etcName,etcValue){
		ContainerObj.jsDebug('MenuObj.setEtcValueAjax(etcName: '+etcName+', etcValue: '+etcValue+')');
		this.initMenu(menuName);
		this.menuHash[menuName]['etchash'].set(etcName,etcValue);
	},
//==================================================
	getEtcValue: function(etcName){
		//UserObj.doLog('','l295 getetvalue call retrieveetc');
		//UserObj.displayLog('in getetcvalue');//xxxf
		var etcValue=this.retrieveEtc(etcName);
		//UserObj.displayLog('after retrieveetc');//xxxf
		return etcValue;
	},
//===================================================
	makeHash: function(parentDir,newDir){
		menuName=this.menuName;
		//alert ('menuname: '+menuName+', parentdir: '+parentDir+', newDir: '+newDir);//xxxd
		this.menuHash[menuName][parentDir][newDir]= new Hash();
	},
//===================================================
	setArrays: function(code,elementNo,theName,theValue){
		ContainerObj.jsDebug('MenuObj.setArrays(code: '+code+', eleno: '+elementNo+',thename: '+theName+',thevalue: '+theValue+')');
		this.setArraysAjax(this.menuName,code,elementNo,theName,theValue);
	},
//===================================================
	setArraysAjax: function(menuName,code,elementNo,theName,theValue){
		ContainerObj.jsDebug('MenuObj.setArrays(code: '+code+', eleno: '+elementNo+',thename: '+theName+',thevalue: '+theValue+')');
		var tst=this.menuHash[menuName];
		if (tst==undefined){this.menuHash[menuName]=new Hash();}
		var tst=this.menuHash[menuName]['etchash'];
		if (tst==undefined){this.menuHash[menuName]['etchash']=new Hash();}
		var tst=this.menuHash[menuName]['elementsary'];
		if (tst==undefined){this.menuHash[menuName]['elementsary']=new Array();}
		var tst=this.menuHash[menuName]['titlesary'];
		if (tst==undefined){this.menuHash[menuName]['titlesary']=new Array();}
		var tst=this.menuHash[menuName]['textary'];
		if (tst==undefined){this.menuHash[menuName]['textary']=new Array();}
		var tst=this.menuHash[menuName]['albumsary'];
		if (tst==undefined){this.menuHash[menuName]['albumsary']=new Array();}
		switch (code){
		case 'etchash':
			if (elementNo != '' || elementNo == 0){
				this.menuHash[menuName]['etchash'][elementNo]=new Array();
				this.menuHash[menuName]['etchash'][elementNo][theName]=[theValue];
			}
			else {alert ('MenuObj.setArrays: (no elementNo) '+code+', '+elementNo+', '+theName+', '+theValue);}
		break;
		default:
			try {theValueAry=theValue.split('~');}
			catch (err){
				alert ('MenuObj.setArraysAjax: ('+err+')menuname: '+menuName+', code: '+code+', elementno: '+elementNo+', thename: '+theName+', thevalue: '+theValue);
				ContainerObj.displayStack();
			}
			switch (code){
				case 'elements':
					//vl=prompt(theValueAry,'x');if (vl=='x'){exit();}
					this.menuHash[menuName]['elementsary'][elementNo]=theValueAry;
				break;
				case 'titles':
					this.menuHash[menuName]['titlesary'][elementNo]=theValueAry;
				break;
				case 'text':
					this.menuHash[menuName]['textary'][elementNo]=theValueAry;
				break;
				case 'elementsother':
					tst=this.menuHash[menuName]['elementsotherary'];
					if (tst==undefined){this.menuHash[menuName]['elementsotherary']=new Array();}
					var elementsOtherAry=new Hash();
					var theCtr=0;
					var theLen=theValueAry.length;
					for (var ctr=0;ctr<theLen;ctr++){
						var theField=theValueAry[ctr];
						theField+='';
						var theFieldAry=theField.split('|');
						var theName=theFieldAry[0];
						var theValue=theFieldAry[1];
						elementsOtherAry.set(theName,theValue);
					}
					this.menuHash[menuName]['elementsotherary'][elementNo]=elementsOtherAry;
					//alert ('seteleother: '+menuName+', '+elementNo);//xxx
				break;
				default:
					alert ('invalid code: '+code);
			}
		}
	},	
//===================================================
	getContainer: function(job,container,loadId,focusId,menuName,menuElementNo){
		ContainerObj.jsDebug('MenuObj.getContainer('+job+','+container+','+loadId+','+menuName+','+menuElementNo+')');
		this.initMenu(menuName);
		ContainerObj.getContainerFromServer(job,container,'post',loadId,focusId);
		//alert ('job: '+job+', container: '+container+', loadid: '+loadId);//xxx
		//- below should go to mainmenu, but has button menu setup
		var changedMenuName=this.menuName;
		this.menuName=menuName;
		this.parentMenuName=menuName;
		this.setSelectedClass('deprecatedmenuname',menuElementNo);//works on calling menu not container menu
		this.menuName=changedMenuName;
	},
//===================================================
	writeDbRowsToServer: function(){
		ContainerObj.jsDebug('MenuObj.writeDbRowsToServer()');
		//alert ('writedbrowstoserver');//xxx
		TableObj.writeDbRowsToServer();
		this.setAlertClass('unset');//what if an error? xxxr
	},
//===================================================
	insertRow: function(){
		ContainerObj.jsDebug('MenuObj.writeDbRowsToServer()');
		TableObj.insertRow();		
	},
//===================================================
	reset: function(job,container,loadId,menuName,menuElementNo){
		//alert ('job: '+job+', container: '+container+', loadid: '+loadId+', menuname: '+menuName+', meno: '+menuElementNo);
		ContainerObj.jsDebug('MenuObj.resetTable()');
		ContainerObj.reset();
		this.getContainer(job,container,loadId,menuName,menuElementNo);
		this.setAlertClass('unset');
	},
//===================================================xxxd
	//displayMappedPicture: function(menuName,elementNo,pictureNo){
	displayMappedPicture: function(jobParamsAry){
		menuName=jobParamsAry[0];
		elementNo=jobParamsAry[1];
		pictureNo=jobParamsAry[2];
		this.setMenuName(menuName);
		var theSource=this.menuHash[menuName]['elementsary'][elementNo][pictureNo];
		//alert ('thesource: '+theSource);//xxxd
		//alert ('get titlesary for menu: '+menuName+', elementno: '+elementNo+', pictureno: '+pictureNo);//xxxf
		var theTitle=this.menuHash[menuName]['titlesary'][elementNo][pictureNo];
		//alert ('thetitle: '+theTitle);//xxxf
		var theText=this.menuHash[menuName]['textary'][elementNo][pictureNo];
		var pictureId=this.getEtcValue('menuimageid');
		var textId=this.getEtcValue('menutextid');
		var titleId=this.getEtcValue('menutitleid');
		try {$(pictureId).src=theSource;}
		catch (err){alert ('MenuObj.displayMappedPicture('+err+') pictureid: '+pictureId+' is invalid');}
		try{$(textId).innerHTML=theText;}
		catch (err){alert ('MenuObj.displayMappedPicture('+err+') textid: '+textId+' is invalid');}
		try {$(titleId).innerHTML=theTitle;}
		catch (err){alert ('MenuObj.displayMappedPicture('+err+') titleid: '+titleId+' is invalid');}
		//var theCaption=this.menuHash[menuName]['']
		//ContainerObj.displayAry(this.menuHash[menuName]['elementsary']);//xxxd
	},
//===================================================
	autoRotateImage: function(menuName){
		var tst=this.menuHash[menuName];
		if (menuName=='homedisplay'){var usePos=0;}
		else {var usePos=3;}
		this.writeToErr(usePos,'go into autoRotateImage');
		if (tst == undefined){
//--- menu not loaded yet from ajax
			if (menuName=='homedisplay'){var usePos=0;}
			else {var usePos=2;}
			this.writeToErr(usePos, 'tst: '+tst+', sleep to check menuname: '+menuName);
			sessionId=setTimeout("MenuObj.autoRotateImage('"+menuName+"')",1);
		}
		else {
//--- menu is current setup
			if (menuName=='homedisplay'){var usePos=0;}
			else {var usePos=2;}
			this.writeToErr(usePos,'set menuname: '+menuName);
			var tst=this.oldMenuName;
			if (tst != undefined){
				this.setMenuName(this.oldMenuName);
			}
//- get opacity, increments
			var oldOpacity=this.getTmpValue('opacity');
			var dmyNo=Math.random();
			if (oldOpacity == undefined){
				this.writeToErr(4, menuName+' set opacity to 0 because not on: '+this.menuName);
				oldOpacity=0;
			}
			var oldIncrements=this.getTmpValue('increments');
			if (oldIncrements==undefined){oldIncrements=1;}
//- set default menu and hopefully current opacity, increments
			this.oldMenuName=menuName;
			this.setMenuName(menuName);
			if (oldOpacity>1000){oldOpacity=1000;}
			this.setTmpValue('opacity', oldOpacity);
			this.setTmpValue('increments',oldIncrements);
			this.autoRotateImageGetNext(menuName,'init');
		}
	},
//===================================================
	autoRotateImageGetNext: function(menuName,theCode){
		if (menuName == this.menuName){
			if (this.quickExit != 'exit'){
				this.doAutoRotateImageGetNext(menuName,theCode);
			}
			else {
				this.quickExit='continue';//xxxf
				if (menuName=='homedisplay'){var usePos=0;}
				else {var usePos=2;}
				this.writeToErr(usePos,'end because quick exit set');
			}
		}
		else {
			if (menuName=='homedisplay'){var usePos=0;}
			else {var usePos=2;}
			this.writeToErr(usePos,'end because menu: '+menuName+' ne this.menu: '+this.menuName+', code: '+theCode);
		}
	},
//===================================================
	doAutoRotateImageGetNext: function(menuName,theCode){
		switch (theCode){
		case 'init':
			if (menuName=='homedisplay'){var usePos=0;}
			else {var usePos=2;}
			this.writeToErr(usePos,'init');
			this.setTmpValue('showerror',true);
			//- debug
			if (menuName=='homedisplay'){var usePos=0;}
			else {var usePos=2;}
			this.writeToErr(usePos,'init call to loweropacity w/menuname: '+menuName);
//=== go to lower opacity
			this.autoRotateImageGetNext(menuName,'loweropacity');
			break;;
		case 'loweropacity':
//--- get all of the menu settings from last time
			var menuImageId=this.getEtcValue('menuimageid');
			theOpacity_fed=this.getTmpValue('opacity');
			if (theOpacity_fed == undefined){theOpacity_fed=0;}
			showError=this.getTmpValue('showerror');
//--- get opacity and set increments and then lower opacity by increment
			theOpacity=theOpacity_fed;
			if (theOpacity<1000){var theIncrement=10;}
			else{var theIncrement=1;}
			theOpacity -= theIncrement;
//--- check to see if we are to continue
			var doContinue=true;
			if (theOpacity < 0){doContinue=false;}
//--- modify style.opacity
			if (theOpacity>1000){var useTheOpacity=1000;}
			else {var useTheOpacity=theOpacity;}
			var opacity_use = useTheOpacity / 1000;
			var quickExit=false;
			try {$(menuImageId).style.opacity=opacity_use;}
			catch (err) {
				quickExit=true;
				if (showError){
					alert ('MenuObj.autoRotateImage: ('+err+') menuname: '+this.menuName+', theid: '+menuImageId+', opacity_use: '+opacity_use);
				}
			}
//--- set current opacity
			showError=false;
			this.setTmpValue('showerror',showError);
			this.setTmpValue('opacity',theOpacity);
			if (doContinue){
//--- create timeout to continue lowering opacity
				if (!quickExit){
					if (menuName=='homedisplay'){var usePos=1;}
					else {var usePos=3;}
					var sessionId=setTimeout("MenuObj.autoRotateImageGetNext('"+menuName+"','loweropacity')",1);
					this.writeToErr(usePos,'lower opacity '+theOpacity+'('+theIncrement+'), sessionid: '+sessionId);
					this.setTmpValue('sessionid',sessionId);
					//alert ('settimeout: '+sessionId);
				}
			}
			else {
//--- we hit zero so change .src value with next elementno
				var useElementNo=this.getTmpValue('elementno');
				if (useElementNo == undefined){
					useElementNo=-1;
				}
				useElementNo++;
				var noElements=this.menuHash[this.menuName]['elementsary'][0].length;
				if (useElementNo>=noElements){useElementNo=0;}
				this.setTmpValue('elementno',useElementNo);
				//alert ('no elements: '+noElements);//xxxd
				var imageSrc=this.menuHash[this.menuName]['elementsary'][0][useElementNo];
				//alert (useElementNo+'/'+noElements+', '+imageSrc);
				var quickExit=false;
				if (menuName=='homedisplay'){var usePos=0;}
				else {var usePos=2;}
				this.writeToErr(usePos,'('+useElementNo+') '+imageSrc);
				try {
					$(menuImageId).src=imageSrc;
				}
				catch (err){
					quickExit=true;
					if (showError){
						alert (err+', imageSrc: '+imageSrc);
					}
				}
				if (!quickExit){
//--- set timeout to start raising the opacity
					var sessionId=setTimeout("MenuObj.autoRotateImageGetNext('"+menuName+"','raiseopacity')",1);
					this.setTmpValue('sessionid',sessionId);
					if (menuName=='homedisplay'){var usePos=1;}
					else {var usePos=3;}
					this.writeToErr(usePos,'raise opacity '+theOpacity+'('+theIncrement+'), sessionid: '+sessionId);
					//alert ('set timeout: '+sessionId);//xxxd
				}
			}
			break;;
		case 'raiseopacity':
//--- get old values from last session and set theIncrement
			var menuImageId=this.getEtcValue('menuimageid');
			theOpacity_fed=this.getTmpValue('opacity');
			if (theOpacity_fed == undefined){theOpacity_fed=0;}
			theOpacity=theOpacity_fed;
			if (theOpacity<50){var theIncrement=1;}
			if (theOpacity<1000 && theOpacity>=50){var theIncrement=10;}
			if (theOpacity>=1000){theIncrement=1;}
//--- change the opacity by the increment
			var chk=$(menuImageId).complete;
			if (chk){
				theOpacity += theIncrement;
			}
			var doContinue=true;
			if (theOpacity > 1500){doContinue=false;}
			if (theOpacity >1000){var useTheOpacity=1000;}
			else {var useTheOpacity=theOpacity;}
			var opacity_use = useTheOpacity / 1000;
			var quickExit=false;
//--- change the opacity
			try {$(menuImageId).style.opacity=opacity_use;}
			catch (err) {
				quickExit=true;
				if (showError){
					alert ('MenuObj.autoRotateImage: ('+err+') theid: '+menuImageId+', opacity_use: '+opacity_use);
				}
			}
//--- save the calculated opacity
			this.setTmpValue('opacity',theOpacity);
			if (doContinue){
				if (!quickExit){
//--- set timeout to continue raising the opacity
					var sessionId=setTimeout("MenuObj.autoRotateImageGetNext('"+menuName+"','raiseopacity')",1);
					this.setTmpValue('sessionid',sessionId);
					if (menuName=='homedisplay'){var usePos=1;}
					else {var usePos=3;}
					this.writeToErr(usePos,'raiseopacity '+theOpacity+'('+theIncrement+'), sessionid: '+sessionId);
					//alert ('set timeout: '+sessionId);//xxxd
				}
			}
			else {
				if (!quickExit){
//--- set timeout to start lowering the opacity
					var sessionId=setTimeout("MenuObj.autoRotateImageGetNext('"+menuName+"','loweropacity')",1);
					this.setTmpValue('sessionid',sessionId);
					if (menuName=='homedisplay'){var usePos=1;}
					else {var usePos=3;}
					this.writeToErr(usePos,'loweropacity '+theOpacity+'('+theIncrement+'), sessionid: '+sessionId);
				}
			}			
			break;
		}
	},
//===================================================
	stopBatch: function(){
		this.batchLp=this.batchAry_length;
	},
	//=================================================== old
runBatchV2: function(batchString_raw){
		var batchString=batchString_raw.replace(/\?\?/g,'?M');
		//var pos=batchString.indexOf('jefftransactionhistoryupdatetr');
		//if (pos>-1){
			//alert (batchString);//xxxf
			//var vl=1;
		//}
		//var batchAry=batchString.split('?M');
		var batchAry=batchString.split('?M');
		batchAry_length=batchAry.length;
		var chk=batchAry[0].substring(0,3);
		if (chk != 'w' && chk != 'yui'){
			UtilObj.writeLog('debug2id','- entered runbatchv2 going to fornext batch string: '+batchAry[0]);
		}
		for (var batchLp=0;batchLp<batchAry_length;batchLp++){
			//UtilObj.writeLog('debug2id','- in fornext with runBatchV2 batchLp: '+batchLp);
			this.setEtcValue('batchlp',batchLp);
			var jobAry=batchAry[batchLp].split('?:');
			var jobAryLength=jobAry.length;
			var jobName=jobAry[0];
			if (jobAryLength>1){
				var jobParams=jobAry[1];
				var jobParamsAry=jobParams.split('?!');
				var jobParamsAry_length=jobParamsAry.length;
			}
			if (jobName != 'w'){this.wCnt=0;}
			/*
			if (jobParamsAry[0]='gcfssv2'){
				alert (batchString);//xxxf
			}
			*/
			this.doRunBatch(jobName, jobParamsAry_length, batchAry_length, jobParamsAry, batchAry, 'new');
			var batchLp=Number(this.getEtcValue('batchlp'));
		}
		//UtilObj.writeLog('debug2id','!!!!exit out of runBatchV2');
	},
//=================================================== old with a change made
	preBatch: function(preBatchString){
		var useBatchString=preBatchString.replace(/\?\?/g,'|');
		this.runBatch(useBatchString);
	},
//=================================================== old
	runBatch: function(batchString){
		var batchAry=batchString.split('|');
		batchAry_length=batchAry.length;
		for (var batchLp=0;batchLp<batchAry_length;batchLp++){
			this.setEtcValue('batchlp',batchLp);
			var jobAry=batchAry[batchLp].split(':');
			var jobAryLength=jobAry.length;
			var jobName=jobAry[0];
			//alert ('job: '+jobName);//xxxf
			if (jobAryLength>1){
				var jobParams=jobAry[1];
				var jobParamsAry=jobParams.split('!');
				var jobParamsAry_length=jobParamsAry.length;
			}
			if (jobName != 'w'){this.wCnt=0;}
			this.doRunBatch(jobName, jobParamsAry_length, batchAry_length, jobParamsAry, batchAry,'old');
			var batchLp=Number(this.getEtcValue('batchlp'));
		}
	},
//====================================================
	doRunBatch: function(jobName,jobParamsAry_length, batchAry_length, jobParamsAry, batchAry, theVersion){
		if (this.jobCtr == undefined){this.jobCtr=0;};
		if (this.lastJobName == undefined){this.lastJobName='unknown';}
		if (jobName != this.lastJobName){
			UtilObj.writeLog('debug3id','MenuObj.doRunBatch: '+jobName+' <- '+this.lastJobName+'('+this.jobCtr+')');
			this.jobCtr=0;
		}
		this.jobCtr++;
		this.lastJobName=jobName;
		if (jobName != 'yui'){
			var breakpointwithnoyui = 0;
		}
			if (jobName == 'yui'){var bypass=true;}
			else if (jobName == 'w'){var bypass=true;}
			else {
				var bypass=false;
			}
			switch (jobName){
//@ w,w,wait until ajax ends(local)
			case 'w':
				var ajaxIsRunning=ContainerObj.isAjaxRunning();
				var wCnt=this.wCnt;
				if (wCnt==undefined){wCnt=0;}
				wCnt++;
				this.wCnt=wCnt;
				if (wCnt>1000){
					alert ("wcnt is > 1000, so unsetting isajaxrunning");
					ContainerObj.setAjaxIsDone();
				}
				if (ajaxIsRunning){
					var batchAryLeft=new Array();
					var batchLpUse=Number(this.getEtcValue('batchlp'));
					for (var dmyLp=batchLpUse;dmyLp<batchAry_length;dmyLp++){
						batchAryLeft[batchAryLeft.length]=batchAry[dmyLp];
					}
					if (theVersion == 'old'){batchStringLeft=batchAryLeft.join('|');}
					else {batchStringLeft=batchAryLeft.join('??');}
					if (theVersion == 'old'){sessionId=setTimeout("MenuObj.runBatch('"+batchStringLeft+"')",100);}
					else {sessionId=setTimeout("MenuObj.runBatchV2('"+batchStringLeft+"')",100);}
					batchLp=batchAry_length;
					this.setEtcValue('batchlp',batchLp);
				}
				break;;
//@ alt,alt?:message,alert a message
			case 'alt':
				alert (jobParamsAry[0]);
				break;
//@ chk,chk?:menu,check if menu undefined(local)
			case 'chk':	
				var menuName=jobParamsAry[0];
				var chk=this.menuHash[menuName];
				if (chk == undefined){
					//var vl=prompt('chk: '+batchLp,'x');if (vl=='x'){exit();}
					sessionId=setTimeout("MenuObj.runBatch('"+batchString+"')",1);
					batchLp=batchAry_length;
				}
				break;;
//@ ses,ses?:menu?!menuelementno,set select class(this.setSelectedClass)
			case 'ses':		
				var menuName=jobParamsAry[0];
				var menuElementNo=jobParamsAry[1];
				menuElementNo--;
				//alert (useMenuElementNo);//xxx
				this.oldMenuName=this.menuName;
				this.setMenuName(menuName);
				//alert ('this.menuname: '+this.menuName);//xxxd
				//ContainerObj.displayAry(this.menuHash[menuName]['etchash']);//xxxd
				//ContainerObj.displayAry(this.menuHash['mainmenu']['etchash']);//xxxd
				//alert ('setsleectclass: '+menuElementNo);//xxx
				this.setSelectedClass('', menuElementNo);
				this.setMenuName(this.oldMenuName);
				break;;
//@ she,she?:loadid1?!loadid2?!loadid3?!,show elements(local)
			case 'she':
				for (var batchLp2=0;batchLp2<jobParamsAry_length;batchLp2++){
					var loadId=jobParamsAry[batchLp2];
					try{
						$(loadId).style.visibility='visible';
					}
					catch (err){
						alert ('MenuObj.runBatch(ses): '+err+', loadid: '+loadId);
					}
				}				
				break;;
//@ hdec,hdec?:loadid1?!loadid2?!loadid3,hide conditional elements (local)
			case 'hdec':
				var doIHide = UserObj.doIHide();
				if (doIHide === false) {
					for ( var batchLp2 = 0; batchLp2 < jobParamsAry_length; batchLp2++) {
						var loadId = jobParamsAry[batchLp2];
						try {
							$(loadId).style.visibility = 'hidden';
						} catch (err) {
							alert('MenuObj.runBatch(hde): ' + err + ', loadid: ' + loadId);
						}
					}
				} 
		break;;
//@ hde,hde:loadid1!loadid2!loadid3!...,hide elements (local)
			case 'hde':
				for (var batchLp2=0;batchLp2<jobParamsAry_length;batchLp2++){
					var loadId=jobParamsAry[batchLp2];
					try{
						$(loadId).style.visibility='hidden';
					}
					catch (err){
						alert ('MenuObj.runBatch(hde): '+err+', loadid: '+loadId);
					}
				}
				break;;
//@ srd,srd?:tablename?!fromdateid?!todateid?!tabledatecolumnname,select rows date (tableObl.selectRowsDate)
			case 'srd':
				TableObj.selectRowsDate(jobParamsAry);
				break;;
//@ srl,srl?:tablename?!selectstring?!columnname deprecate soon select rows by value(TableObj.selectRowsValue)				... 
			case 'srl':
				TableObj.selectRowsValue(jobParamsAry);
				break;;
//@ srv,srv:tablename!columnname!selectstring,select rows by value(TableObj.selectRowsValue)
			case 'srv':
				TableObj.selectRowsValue(jobParamsAry);
				break;;
//@ dit,dit:menuName,display menu title(local)
			case 'dit':
				var menuName=jobParamsAry[0];
				this.setMenuName(menuName);
				var menuTitle=this.getEtcValue('menutitle');
				var menuTitleId=this.getEtcValue('menutitleid');
				//alert ('menuname: '+menuName+', menutitle: '+menuTitle+', menutitleid: '+menuTitleId);//xxxd
				if (menuTitleId != undefined && menuTitleId != ''){
					try{
						$(menuTitleId).innerHTML=menuTitle;
					}
					catch (err){
						ContainerObj.displayAry(this.menuHash[this.menuName]['etchash']);
						alert ('menuobj.runBatch(dit): '+err+', menutitleid: '+menuTitleId);
					}
				}
				break;;
//@ sar,sar:menu,start autorotate(this.autoRotateImage)
			case 'sar':
				var menuName=jobParamsAry[0];
				this.autoRotateImage(menuName);
				break;;
//@ kil,kil,kill a looping jscript(local)
			case 'kil':
				//kill all processes
				this.quickExit='exit';
				break;;
//@ nxtp,nxtp?:menu,next picture(this.nextPicture)
			case 'nxtp':
				var menuName=jobParamsAry[0];
				this.nextPicture(menuName);
				break;;
//@ prvp,prvp?:menu,previous picture(this.previousPicture)
			case 'prvp':
				var menuName=jobParamsAry[0];
				this.previousPicture(menuName);
				break;;
//@ prvap,prvap?:menu,previous album page(this.previousAlbumPage)
			case 'prvap':
				var menuName=jobParamsAry[0];
				this.previousAlbumPage(menuName);
				break;;
//@ nxtap,nxtap?:menu,next album page(this.nextAlbumPage)
			case 'nxtap':
				var menuName=jobParamsAry[0];
				this.nextAlbumPage(menuName);
				break;;
//@ ldmp,ldmp:containerid_imageid_titleid_captionid,load main picture(this.loadMainPicture)
			case 'ldmp':		
				this.loadMainPicture(jobParamsAry);
				break;;
//@ sps,sps?:loadid,set image size(this.setImageSize)
			case 'sps':					
				this.setImageSize(jobParamsAry);
				break;;
//@ wfs,wfs:job!form!formno{optional},write form to server v2(FormObj.writeFormToServerV2)
			case 'wfs':
				//FormObj.writeFormToServerV2(jobParamsAry[0],jobParamsAry[1]);
				FormObj.writeFormToServerV2(jobParamsAry);
				break;
//@ wfsa,wfsa:job!form,write all changed table rows as forms to server v2(FormObj.writeMultFormsToServer)
			case 'wfsa':
				FormObj.writeMultFormsToServer(jobParamsAry);
				break;
//@ dtrs,dtrs:job!table!keyid,delete table row from server(TableObj.deleteTableRowServer)
			case 'dtrs':	
				TableObj.deleteTableRowServer(jobParamsAry[0],jobParamsAry[1],jobParamsAry[2]);//xxxd
				break;
//@ rfds,rfds:job!form!keyid,retrieve form data from server(FormObj.retrieveFormDbFromServer)
			case 'rfds':
				FormObj.retrieveFormDbFromServer(jobParamsAry[0],jobParamsAry[1],jobParamsAry[2]);
				break;;
//@ cff,cff:formname,clear form fields but not hidden ones					... cff:formname
			case 'cff':
				FormObj.clearFormFields(jobParamsAry[0]);
				break;;
//@ rtds,rtds...,deprecated due to extreme complexity
			case 'rtds':
				TableObj.retrieveTableDbFromServer(jobParamsAry[0],jobParamsAry[1],jobParamsAry[2]);
				break;;
//@ gcfss,gcfss:job!container_selectname_selectvalue!loadid!sessionname,get container from server simple 	... 
			case 'gcfss':
				ContainerObj.getContainerFromServerSimple(jobParamsAry[0],jobParamsAry[1],'forcepost',jobParamsAry[2],'');
				break;;
//@ gcfssv2,gcfssv2?: job?! container_formname?! loadid?! sessionname?! formname?! operation?! varname?! varvalue?! ...,get container from server simple v2(ContainerObj.getContainerFromServerSimpleV2)
			case 'gcfssv2':
				//ContainerObj.displayAry('meonuobj.gcfssv2',jobParamsAry);
				ContainerObj.getContainerFromServerSimpleV2(jobParamsAry);
				break;;
//@ gcfsj,gcfsj?: job?! container?! loadid?! sessionname?! formname?! operation?! selectname?! selectvalue?! varname?! varvalue?! ...,get container from server simple v2(ContainerObj.getContainerFromServerJson)
			case 'gcfsj':
				ContainerObj.getContainerFromServerJson(jobParamsAry);
				break;;
//@ gcfss,gcfss:job!container!loadid!sessionname,get container from server simple maybe(ContainerObj.getContainerFromServerSimple)
			case 'gcfssm':
				//alert ('MenuObj.runbatch(gcfss): '+jobParamsAry[0]+', '+jobParamsAry[1]);//xxxf
				ContainerObj.getContainerFromServerSimple(jobParamsAry[0],jobParamsAry[1],'post',jobParamsAry[2],'');
				//ContainerObj.getContainerFromServerSimple(jobParamsAry);
				break;;				
//@ dp,dp,display table page(TableObj.displayPage)
			case 'dp':
				TableObj.displayPage();
				break;;
//@ tpprev,tpprev,previous table page(TableObj.pagePrevious)
			case 'tpprev':
				TableObj.pagePrevious(jobParamsAry[0]);
				break;
//@ tpnext,tpnext,next table page(TableObj.pageNext)
			case 'tpnext':
				TableObj.pageNext(jobParamsAry[0]);
				break;
//@ rfo,rfo:job!form,run form operation id->value(FormObj.runOperation)
			case 'rfo':
				//alert ('rfo: 0: '+jobParamsAry[0]+', '+jobParamsAry[1]);//xxxf
				FormObj.runOperation(jobParamsAry[0],jobParamsAry[1]);
				break;;
//@ rfo2,rfo2:job!form,run form operation name->value(FormObj.runOperationV2)
			case 'rfo2':
				FormObj.runOperationV2(jobParamsAry[0],jobParamsAry[1]);
				break;;
//@ rmo,rmo:job!operation!name1!value!name2!value2,run menu operation(this.runOperation)
			case 'rmo':
				this.runOperation(jobParamsAry);
				break;;
//@ rmo2,rmo2:job!operation!name1!value!name2!vaule2,run menu operation v2(this.runOperationV2)
			case 'rmo2':
				this.runOperationV2(jobParamsAry);
				break;;
//@ lvfid,lvfid:formElementId!formElementValue,load value into form id(UserObj.getEtcValue) 
			case 'lvfid':
				var theId=jobParamsAry[0];
				var theValue=jobParamsAry[1];
				if (theValue == 'uservalue'){
					theValue=UserObj.getEtcValue(theId);
				}
				try {$(theId).value=theValue;}
				catch (err){alert ('runbatch(lvid): '+err+' theid: '+theId+', value: '+theValue);}
				//alert ('loaded value: '+theValue+' into '+theId);//xxxd
				break;;
//@ trnvih,transfer value from form id to innerhtml(local)
			case 'trnvih':
				var fromId=jobParamsAry[0];
				var toId=jobParamsAry[1];
				try {
					$(toId).innerHTML=$(fromId).value;
				}
				catch (err){
					alert ('MenuObj.batch trnvih: '+err);
				}
				break;
//@ lvfid,lvfid:formElementId!formElementValue,load string into image source(ImageObj.loadImageSource)
			case 'ldimgsrc':
				//alert (jobParamsAry);//xxxd
				ImageObj.loadImageSource(jobParamsAry);
				break;;
//@ tbsel,tbsel:tablename!getid(has string in it),select table rows(TableObj.preSelRows)
			case 'tbsel':
				TableObj.preSelRows(jobParamsAry);				
				break;
//@ strhtml,strhtml:{id}!{store name},store innerhtml(alert?)
			case 'strhtml':
				alert ('strhtml: id: '+jobParamsAry[0]+', store name: '+jobParamsAry[1]);
				break;
//@ win,win:url,fire up window(alert?)
			case 'win':
				alert ('win: url: '+jobParamsAry[0]);
				break;
//@ ldv,ldv:{id}!{value},load value into id innerHtml(local)
			case 'ldv':
				var theId=jobParamsAry[0];
				var theValue=jobParamsAry[1];
				if (theValue == 'uservalue'){
					theValue=UserObj.getEtcValue(theId);
				}
				try {$(theId).innerHTML=theValue;}
				catch (err){alert ('runbatch(ldv): '+err+' theid: '+theId+', value: '+theValue);}
				//alert ('loaded value: '+theValue+' into '+theId);//xxxd
				break;
//@ ldts,ldts:{tablename}!{rowid}!{id}!{columnname},load table field string into innerHTML of id(TableObj.loadTableValue)
			case 'ldts':
				TableObj.loadTableValue(jobParamsAry);
				break;
//@ chgimgsz,chgimgsz:imageid!colno!rowno,increment/decrement an image size(UtilObj.changeImageSize)
			case 'chgimgsz':
				UtilObj.changeImageSize(jobParamsAry);
				break;
//@ tglimgsiz,tglimgsiz:imageid!colno1!colno2,toggle image size(ImageObj.toggleImageSize)
			case 'tglimgsiz':
				ImageObj.toggleImageSize(jobParamsAry);
				break;
//@ setimgsz,???,src for an image,load in width, height, (UtilObj.setImageSize)
			case 'setimgsz':
				UtilObj.setImageSize(jobParamsAry);
				break;
//@ stimgdtl,stimgdtl:{imgname}!{imgsrc}!{width}!{height}!rawwidth%!%rawheight%!,store image detail(ImageObj.storeImageDetail)
			case 'stimgdtl':
				ImageObj.storeImageDetail(jobParamsAry);
				break;
//@ ldiid,ldiid:{id}!{etcvalue}!{id}!{etcvalue},load image value(ImageObj.loadImageId)
			case 'ldiid':
				ImageObj.loadImageId(jobParamsAry);
				break;
//@ ldimgdta,ldimgdta:{imgname}!{field code}!{field value},load image field(ImageObj.loadImageData)
//@						field code: src, w, rw, h, rh
			case 'ldimgdta':
				ImageObj.loadImageData(jobParamsAry);
				break;
//@ shimg,shimg:{imgname},show image(ImageObj.showImage)
			case 'shimg':
				ImageObj.showImage(jobParamsAry);
				break;
//@ cip,cip:{imagename}!{w/h}!{fieldid},change image percent(ImageObj.changeImagePercent)
			case 'cip':
				ImageObj.changeImagePercent(jobParamsAry);
				break;
//@ lu,lu:{userprofile colname}!{userprofile colname2},load user value to value(id) (UserObj.loadUserValue)
			case 'lu':
				UserObj.loadUserValue(jobParamsAry);
				break;
//@ su,su:savename!savevalue!savename2!savevalue2,save user value(UserObj.saveUserValue)
			case 'su':
				UserObj.saveUserValue(jobParamsAry);
				break;
//@ luid,luid:{userprofile colname}!{loadid}! ...,load user value to valueid(UserObj.loadUserValueToId)
			case 'luid':
				UserObj.loadUserValueToId(jobParamsAry);
				break;
//@ scl,scl:id!class,set the class(UtilObj.setClass)
			case 'scl':
				UtilObj.setClass(jobParamsAry[0],jobParamsAry[1]);
				break;
//@ sfmd,sfmd:callingmenuname!callingmenueleno!fixedmenuname!fixedmenuid,set menu display(this.setFixedMenuDisplay)
			case 'sfmd':
				this.setFixedMenuDisplay(jobParamsAry);
				break;
//@ tm,tm:origmenuname!origmenuelno!,toggle menus(this.toggleMenuDisplay)
			case 'tm':
				this.toggleMenuDisplay(jobParamsAry);
				break;
//@ dmp,dmp,display mapped picture(this.displayMappedPicture)
			case 'dmp':
				this.displayMappedPicture(jobParamsAry);
				break;
//@ nmth,nmth:calendarName,next month(CalendarObj.nextMonth)
			case 'nmth':
				CalendarObj.nextMonth(jobParamsAry[0]);
				break;
//@ pmth,pmth?calendarName,previous month(CalendarObj.prevMonth)
			case 'pmth':
				CalendarObj.prevMonth(jobParamsAry[0]);
				break;
//@ prvvmp,prvvmp:menuname,previous page for vertical menu(this.previousPageVM)
			case 'prvvmp':
				this.previousPageVM(jobParamsAry);
				break;
//@ nxtvmp,nxtvmp:menuname,next page for vertical menu(this.nextPageVM)
			case 'nxtvmp':
				this.nextPageVM(jobParamsAry);
				break;
//@ dpvm,dpvm:menuname,display page for vertical menu(this.displayPageVM)
			case 'dpvm':
				this.displayPageVM(jobParamsAry);
				break;
//@ spd,spd:albumName,pictureNo,imageId,imageTitleId,imageCaptionId,set picture display(AlbumObj.setPictureDisplay)
			case 'spd':
				AlbumObj.setPictureDisplay(jobParamsAry);
				break;
//@ ???,???,???(MenuObj.setPictureDisplayV2)
			case 'spd2':
				MenuObj.setPictureDisplayV2(jobParamsAry);
				break;
//@ spd3,spd3:menuname:pictureno,set picture display 3(MenuObj.setPictureDisplayV3)
			case 'spd3':
				MenuObj.setPictureDisplayV3(jobParamsAry);
				break;
//@ dav,dav:menuname,disable fixed menu video(MenuObj.disableVideo)
			case 'dav':
				MenuObj.disableVideo(jobParamsAry);
				break;
//@ hdens,hdens:namedlist,hide using a named string for ids(UtilObj.hideIdsViaList)
			case 'hdens':
				UtilObj.hideIdsViaList(jobParamsAry);
				break;
//@ cnf,cnf:formfieldid,convert %cr% to crlf in form field(FormObj.convertField)
			case 'cnv':
				FormObj.convertField(jobParamsAry);
				break;
//@ yui,yui:{changedid},run yui(utiObj.setupDrag)
			case 'yui':
				var dmy=1;
				dmy=2;
				if (UtilObj.canIUseYui()){
					var containerId=jobParamsAry[0];
					YuiObj.setupDrag(containerId);
				}
				break;
//@ mvi,mvi:{imagename}!{imagename}!{imagename},run move images(ImageObj.moveImages)
			case 'mvi':
				ImageObj.moveImages(jobParamsAry);
				break;
//@ amttot,amttot:tablename!columnname!updateid?!c(currency)/n(number)?!{no of dec places},total amount fields and display total(TableObj.totalAmountColumns)
			case 'amttot':
				TableObj.totalAmountColumns(jobParamsAry);
				break;
//@ htmltbl,htmltbl:tablename!arrayname!formfieldid,conv TableObj arys to html string in /etc(TableObj.convertAryToTable)
			case 'htmltbl':
				TableObj.convertAryToTable(jobParamsAry);
				break;
//@ htmlcp,htmlcp:tablename!arrayname!saveName,conv TableObj arys to html cut/paste string in /etc(TableObj.convertAryToCutPaste)
			case 'htmlcp':
				TableObj.convertAryToCutPaste(jobParamsAry);
				break;
//@ savtockie,savtockie:type(table/id)!objectname(unused with id)!filename!cookiename,save {object}{objectname}etc/string(UtilObj.setCookieValue)
			case 'savtockie':
				UtilObj.setCookieValue(jobParamsAry);
				break;
//@ winopn,winopnwinopn?:theUrl?!theObjType(table/innerhtml)?!(theObjName/innerhtmlId)?!theHtmlCodeFileName/null,open a new window(UtilObj.windowOpen)
			case 'winopn':
				UtilObj.windowOpen(jobParamsAry);
				break;
//@ cllg,cllg:debug1/debug2/....,clear log file(UtilObj.clearLog)
			case 'cllg':
				UtilObj.clearLog(jobParamsAry);
				break;
//@ zi,zi?:containerid?!{no},set z-index of an id(UtilObj.setZIndex)
			case 'zi':
				UtilObj.setZIndex(jobParamsAry);
				break;
//@ sev,sev?:{t(table)/f(form)/c(container)/...}?!{objname}?!{etcname}?!{etcvalue},set etc value(<objs>.setEtcValue)
			case 'sev':
				var theCode=jobParamsAry[0];
				var theObjName=jobParamsAry[1];
				var etcName=jobParamsAry[2];
				var etcValue=jobParamsAry[3];
				UtilObj.writeLog('debug1id','thecode: '+theCode+', theobjname: '+theObjName+', etcName: '+etcName+', etcValue: '+etcValue);//xxxd22
				switch (theCode){
					case 't':
						TableObj.setName(theObjName);
						TableObj.setEtcValue(etcName,etcValue);
						break;
					case 'c':
						ContainerObj.setName(theObjName);
						ContainerObj.setEtcValue(etcName,etcValue);
						break;
					case 'f':
						FormObj.setName(theObjName);
						FormObj.setEtcValue(etcName,etcValue);
						break;
					case 'm':
						MenuObj.setName(theObjName);
						MenuObj.setEtcValue(etcName,etcValue);
						break;
				}
				//ContainerObj.displayEtc();//xxxd
				break;
//@ tbltot,tbltot?: typeofdatebreakout?! tablename?! datecolname?! breakoutname?! updateid?! columnvaluename1?! columnvaluename2 (TableObj.totalTableFields)
			case 'tbltot':
				TableObj.totalTableFields(jobParamsAry);
				break;
//@ imgchgsrc,imgchgsrc?:busy?!{img name}?!reg?!?D{code name}?D,change image source(ImageObj.changeSource)
			case 'imgchgsrc':
				ImageObj.changeSource(jobParamsAry);
				break;
//@ chgtdcls,chgtdcls?:code?!tableid?!fromclass?!toclass, change class of table td(TableObj.changeTdClass)
			case 'chgtdcls':
				TableObj.changeTdClass(jobParamsAry);
				break;
//@ imgexp,imgexp?:id, explode an image(MenuObj.runBatchV2(imgexp))
			case 'imgexp':
				var id=jobParamsAry[0];
				var pieces=jobParamsAry[1];
				if (pieces == undefined){var pieces=9;}
				var options='{pieces:'+pieces+'}';
				//alert (options);//xxxf
				jQuery("#"+id).hide( "explode",options,1000);
				break;
//@ autorot,autorot?:albumname, autorotate images in an album(AlbumObj.autoRotate(albumName)
			case 'autorot':
				AlbumObj.autoRotate(jobParamsAry);
				break;
//@ stpar,stpar?:albumname, stop autorotate(AlbumObj.stopDisplayNextImageForever(albumName)
			case 'stpar':
				var albumName=jobParamsAry[0];
				AlbumObj.stopDisplayNextImageForever(albumName);
				break;
//@ shtc,shtc?:tablename?!columnno?!'hide', show hide table column(TableObj.showHideTableColumn(jobParamsAry))
			case 'shtc':
				TableObj.showHideTableColumn(jobParamsAry);
				break;
//@ dnld,dnld?:fileName
			case 'dnld':
				var fileName=jobParamsAry[0];
				//alert ('window.location='+fileName);
				window.location=fileName;
				break;
//- default error
			default:
				alert ('menuobj.runbatch invalid jobname: '+jobName+', theversion: '+theVersion);
				ContainerObj.displayAry('jobparamsary',jobParamsAry);
				ContainerObj.displayAry('batchary',batchAry);
			}
	},
//====================================
	setImageSize: function(jobParamsAry){
		var theWidth=jobParamsAry[0];
		var theHeight=jobParamsAry[1];
		var loadId=jobParamsAry[2];
		if (theWidth>0){
			try {$(loadId).style.width=theWidth;}
			catch (err){alert ('MenuObj.setImageSize: '+err+': width: '+theWidth+', id: '+loadId);}
		}
		if (theHeight>0){
			try {$(loadId).style.height=theHeight;}
			catch (err){alert ('MenuObj.setImageSize: '+err+': height: '+theHeight+', id: '+loadId);}
		}
	},
//====================================
	loadMainPicture: function(jobParamsAry){
//- get all fields
		var menuName=jobParamsAry[0];
		var placeHolderElementNo=jobParamsAry[1];
		var containerId=jobParamsAry[2];
		var imageId=jobParamsAry[3];
		var formId=jobParamsAry[4];
		var titleElementNo=jobParamsAry[5];
		var captionElementNo=jobParamsAry[6];
		this.setMenuName(menuName);
//- get menuelementno
		var pageNo=this.getEtcValue('pageno');
		var pageSize=this.getEtcValue('maxpagesize');
		var menuElementNo=(Number(pageNo)-1)*Number(pageSize)+Number(placeHolderElementNo);
		//alert (pageNo+', '+pageSize+', '+menuElementNo);//xxxd
//- get image, title, caption
		var albumName=this.getEtcValue('albumname');
		var albumSource=albumName+'_src';
		var albumTitle=albumName+'_title';
		var albumCaption=albumName+'_text';
//
		var imageString=this.getEtcValue(albumSource);
		var imageStringAry=imageString.split('~');
		var imageSource=imageStringAry[menuElementNo];
//
		var titleString=this.getEtcValue(albumTitle);
		var titleStringAry=titleString.split('~');
		var theTitle=titleStringAry[menuElementNo];
//
		var captionString=this.getEtcValue(albumCaption);
		var captionStringAry=captionString.split('~');
		var theCaption=captionStringAry[menuElementNo];
//- update html fields
		try {$(imageId).src=imageSource;}
		catch (err){alert ('MenuObj.loadMainPicture: '+err+', imageid: '+imageId);}
		//alert ('titleid: '+titleId+', .value: '+$(titleId).value+', .innerHTML: '+$(titleId).innerHTML+', .type: '+$(titleId).type+', .stuff: '+$(titleId).value);//xxxd
		var testObj=$(formId);
		testObj.elements[titleElementNo].value=theTitle;
		testObj.elements[titleElementNo].disabled=true;
		testObj.elements[captionElementNo].value=theCaption;
		testObj.elements[captionElementNo].disabled=true;
		try {$(containerId).style.visibility='visible';}
		catch (err){alert ('MenuObj.loadMainPicture: '+err+', containerid: '+containerId);}
		//alert (containerId+', '+imageId+', '+nameId+', '+priceId);
	},
//====================================
	nextAlbumPage: function(menuName){
		this.setMenuName(menuName);
		this.initAlbum();
		var albumPictureCnt=this.getEtcValue('albumpicturecnt');
		var maxPageSize=this.getEtcValue('maxpagesize');
		var pageNo=this.getEtcValue('pageno');
		if (pageNo==undefined){pageNo=1;}
		pageNo++;
		var firstPictureDisplay=(pageNo-1) * maxPageSize;
		albumPictureCnt--;
		if (firstPictureDisplay>albumPictureCnt){pageNo=1;}
		this.setEtcValue('pageno',pageNo);
		this.displayAlbumPage();
	},
//====================================
	previousAlbumPage: function(menuName){
		this.setMenuName(menuName);
		this.initAlbum();
		var pageNo=this.getEtcValue('pageno');
		if (pageNo==undefined){pageNo=1;}
		pageNo--;
		if (pageNo<1){
			var albumName=this.getEtcValue('albumname');
			var albumCnt=this.menuHash[this.menuName]['albumshash'][albumName]['src'].length;
			var maxPageSize=this.getEtcValue('maxpagesize');
			pageNo=Math.round(albumCnt/maxPageSize);
		}
		this.setEtcValue('pageno',pageNo);
		this.displayAlbumPage();		
	},
//====================================
	initAlbum: function(){
		var albumName=this.getEtcValue('albumname');
		var tst=this.menuHash[this.menuName]['albumshash'];
		if (tst==undefined){this.menuHash[this.menuName]['albumshash']=new Hash();}
		//alert ('xxxd0: '+this.menuHash[this.menuName]['albumshash']);//xxxd
		var tst=this.menuHash[this.menuName]['albumshash'][albumName];
		if (tst==undefined){
//- init
			this.menuHash[this.menuName]['albumshash'][albumName]=new Hash();
			//alert ('xxxd1: '+this.menuHash[this.menuName]['albumshash'][albumName]);//xxxd
//- src
			//ContainerObj.displayAry(this.menuHash[this.menuName]['etchash']);//xxxd
			var albumNameSrc = albumName + '_src';
			//alert (albumNameSrc);//xxxd
			var theSrc=this.getEtcValue(albumNameSrc);
			var theSrcAry=theSrc.split('~');
			this.menuHash[this.menuName]['albumshash'][albumName]['src']=theSrcAry;
			var noPictures=theSrcAry.length;
			this.setEtcValue('albumpicturecnt', noPictures);
			//alert ('xxxd2: '+this.menuHash[this.menuName]['albumshash'][albumName]['src']);
//- title
			var albumNameTitle = albumName + '_title';
			var theTitle=this.getEtcValue(albumNameTitle);
			var theTitleAry=theTitle.split('~');
			this.menuHash[this.menuName]['albumshash'][albumName]['title']=theTitleAry;
//- text
			var albumNameText = albumName + '_text';
			var theText=this.getEtcValue(albumNameText);
			var theTextAry=theText.split('~');
			this.menuHash[this.menuName]['albumshash'][albumName]['text']=theTextAry;
			//alert ('xxxd9: '+this.menuHash[this.menuName]['albumshash'][albumName]['text']);//xxxd
		}
		//alert (this.menuHash['albumshash'][albumName]['src']);
	},
//====================================xxxd
	displayAlbumPage: function(){
		var menuId=this.getEtcValue('menuid');
		var maxPageNo=this.getEtcValue('maxpagesize');
		var pageNo=this.getEtcValue('pageno');
		var albumName=this.getEtcValue('albumname');
		var menuImageId=this.getEtcValue('menuimageid');
		var albumCnt=this.menuHash[this.menuName]['albumshash'][albumName]['src'].length;
		//alert ('pageno: '+pageNo);//xxxd
		var check=this.menuHash[this.menuName]['albumshash'][albumName]['src'];//xxxd
		//alert (check);//xxxd
		for (var lp=0; lp<maxPageNo; lp++){
			var pictureNo=((pageNo-1)*maxPageNo+lp);
			try {
				//alert ('pictureno: '+pictureNo+', pageno: '+pageNo+', albumcnt: '+albumCnt);//xxxd
				var newSrc=this.menuHash[this.menuName]['albumshash'][albumName]['src'][pictureNo];
				if (newSrc == undefined){newSrc='';}
				var updateId=menuImageId+'_'+lp;
				$(updateId).src=newSrc;
			}
			catch (err) {
				alert ('MenuObj.displayAlbumPage('+err+') imagemenuId: '+menuImageId+', updateid: '+updateId);
			}
			//alert (lp+': pictureno: '+pictureNo+', pageno: '+pageNo+', albumcnt: '+albumCnt);
		}
		//ContainerObj.displayAry(this.menuHash[this.menuName]['etchash']);//xxxd
	},
//==================================== picture paging 
	nextPicture: function(menuName){
		this.setMenuName(menuName);
		var pageNo=this.getEtcValue('pageno');
		var menuElementNo=this.getEtcValue('menuelementno');
		if (menuElementNo == undefined){menuElementNo=0;}
		try {
			var maxPageSize=this.menuHash[this.menuName]['elementsary'][menuElementNo].length;
		}
		catch (err){
			alert ('menuobj.nextpicture('+err+'), menuelementno: '+menuElementNo+', menuname: '+this.menuName);
		}
		pageNo++;
		//alert ('pageno: '+pageNo);//xxx
		if (pageNo>maxPageSize){pageNo=1;}
		this.setEtcValue('pageno',pageNo);
		//alert ('pageno: '+pageNo);//xxxd
		this.displayPictureMenu(menuName);
	},
	//================================= 
	previousPicture: function(menuName){
		this.setMenuName(menuName);
		var pageNo=this.getEtcValue('pageno');
		var menuElementNo=this.getEtcValue('menuelementno');
		if (menuElementNo==undefined){menuElementNo=0;}
		var maxPageSize=this.menuHash[this.menuName]['elementsary'][menuElementNo].length;
		pageNo--;
		if (pageNo<1){pageNo=maxPageSize;}
		this.setEtcValue('pageno',pageNo);
		this.displayPictureMenu(menuName);
	},
//==========================================================
	displayPictureMenu: function(menuName){
		this.setMenuName(menuName);
		var menuClass=this.getEtcValue('menuclass');
		var menuType=this.getEtcValue('menutype');
		var menuDisplayType=this.getEtcValue('menudisplaytype');
		var menuId=this.getEtcValue('menuid');
		var menuImageId=this.getEtcValue('menuimageid');
		var menuTextId=this.getEtcValue('menutextid');
		var pageNo=this.getEtcValue('pageno');
		var usePageNo=pageNo-1;
		//alert (pageNo+', '+usePageNo);//xxxd
		var menuElementNo=this.getEtcValue('menuelementno');
		if (menuElementNo == undefined){menuElementNo=0;}
		var newSource=this.menuHash[this.menuName]['elementsary'][menuElementNo][usePageNo];
		var menuTitleId=this.getEtcValue('menutitleid');
		if (menuType == 'rotate') {
//- rotate of pictures
			var menuTitle=this.menuHash[this.menuName]['titlesary'][menuElementNo][usePageNo];
			var menuText=this.menuHash[this.menuName]['textary'][menuElementNo][usePageNo];
			var newSource=this.menuHash[this.menuName]['elementsary'][menuElementNo][usePageNo];
			try {
				$(menuTitleId).innerHTML=menuTitle;
			}
			catch (err){
				alert ('MenuObj.displayPictureMenu('+err+') menutitleid: '+menuTitleId);
			}
			if (menuDisplayType == 'titlecaptionelsewhere' || menuDisplayType == 'titlecaption'){
				try {
					$(menuTextId).innerHTML=menuText;
				}
				catch (err){
					alert ('MenuObj.displayPictureMenu('+err+') menutextid: '+menuTextId);
				}
			}
		}
		else {
//- I dont know if this is needed
			var newSource=this.menuHash[menuName]['elementsary'][menuElementNo];
		}
		$(menuImageId).src=newSource;
	},
//==========================================================
	runOperation: function(jobParamsAry){
		UtilObj.writeLog('debug1id','!!MenuObj.runOperation!!');
		var jobName=jobParamsAry[0];
		var operationName=jobParamsAry[1];
		//alert ('run operation(rmo): '+jobName+', '+operationName);//xxxd
		var formName='';
		var dbTableName = '';
		var sendDataAry = new Array();
		var noJobParams = jobParamsAry.length;
		var nameFlg=true;
		var sendDataAry=new Array();
		var theName='initname';
		for (var lp=0;lp<noJobParams;lp++){
			if (nameFlg==true){var theName=jobParamsAry[lp];nameFlg=false;}
			else {
				var theValue=jobParamsAry[lp];
				if (theValue == 'uservalue'){
					theValue=UserObj.getEtcValue(theName);
				}
				sendDataAry[sendDataAry.length]=theName+'|'+theValue;
				nameFlg=true;
			}
		}
		AjaxObj.postAjaxSimple(formName,jobName,operationName,dbTableName,sendDataAry);
	},
//==========================================================
	runOperationV2: function(jobParamsAry){
		var jobName=jobParamsAry[0];
		var operationName=jobParamsAry[1];
		var formName='';
		var dbTableName='';
		var sendDataAry=new Array();
		var noJobParams=jobParamsAry.length;
		var nameFlg=true;
		var sendDataAry=new Array();
		var paramNames='';
		var paramValues='';
		var delim='';
		//ContainerObj.displayAry('jobp',jobParamsAry);//xxxf
		//xxxd22 - need to get sessionname and put in
		for (var lp=2;lp<noJobParams;lp++){
			if (nameFlg==true){var theName=jobParamsAry[lp];nameFlg=false;}
			else {
				var theValue=jobParamsAry[lp];
				if (theValue == 'uservalue'){
					theValue=UserObj.getEtcValue(theName);
				}
				//sendDataAry[sendDataAry.length]=theName+'|'+theValue;
				paramNames+=delim+theName;
				paramValues+=delim+theValue;
				delim='~';
				nameFlg=true;
			}
		}
		//alert ('paramnames: '+paramNames+', paramvalues: '+paramValues);//xxxf
		//alert ('senddataary: '+sendDataAry);
		sendDataAry[sendDataAry.length]='paramnames|'+paramNames;
		sendDataAry[sendDataAry.length]='paramvalues|'+paramValues;
		//alert ('xxxd0: MenuObj.runOperationV2 before postajaxsimple call');
		AjaxObj.postAjaxSimple(formName,jobName,operationName,dbTableName,sendDataAry);
	},
//===================================================
	toggleMenuDisplay: function(jobParamsAry){
		//- get the new name of the menu
		var menuWithTextName=jobParamsAry[0];
		var menuWithTextElNo=jobParamsAry[1];
		var menuWithTitleName=jobParamsAry[2];
		var titleId=jobParamsAry[3];
		var textId=jobParamsAry[4];
		this.menuName=menuWithTextName;
		var menuText=this.menuHash[this.menuName]['textary'][menuWithTextElNo][0];
		this.menuName=menuWithTitleName;
		var menuTitle=this.menuHash[this.menuName]['elementsary'][menuWithTextElNo];
		//- put title into its spot
		try {$(titleId).innerHTML=menuTitle;}
		catch (err){alert ('menuobj.togglemenudisplay: ('+err+') titleid: '+titleId);}
		//- put text into its spot
		try {$(textId).innerHTML=menuText;}
		catch (err){alert ('menuobj.togglemenudisplay: ('+err+') textid: '+textId);}
	},
//===================================================
	loadJson: function(menuName,jsonString){
		try {
			var jsonAry=jsonString.evalJSON(false);
		}
		catch (err){
			alert ('menuobj.loadjson('+err+') menu: '+menuName);
		}
		this.menuHash[menuName]=$H();
		this.menuHash[menuName]['titlesary']=$A(jsonAry['titlesary']);
		this.menuHash[menuName]['elementsary']=$A(jsonAry['elementsary']);
		this.menuHash[menuName]['textary']=$A(jsonAry['textary']);
		this.menuHash[menuName]['mediaary']=$A(jsonAry['mediaary']);
		this.menuHash[menuName]['videoary']=$A(jsonAry['videoary']);
		this.menuHash[menuName]['etchash']=$H(jsonAry['etchash']);
		//ContainerObj.displayHash('etc',this.menuHash[menuName]['etchash']);
	},
//=============================================================
	previousPageVM: function(jobParamsAry){
		var menuName = jobParamsAry[0];
		this.menuName=menuName;
		var usePageNo=this.getEtcValue('pageno');
		usePageNo--;
		if (usePageNo<1){usePageNo=1;}
		else {this.setEtcValue('lastid','none');}
		this.setEtcValue('pageno',usePageNo);
		this.displayPageVM(jobParamsAry);
	},
//================================
	nextPageVM: function(jobParamsAry){
		var menuName = jobParamsAry[0];
		this.menuName=menuName;
		var usePageNo=this.getEtcValue('pageno');
		usePageNo++;
		this.setEtcValue('lastid','none');
		this.setEtcValue('pageno',usePageNo);
		this.displayPageVM(jobParamsAry);
	},
//================================
	displayPageVM: function(jobParamsAry){
		var menuName=jobParamsAry[0];
		this.menuName=menuName;
		var usePageNo=this.getEtcValue('pageno');
		var usePageSize=this.getEtcValue('menumaxelements');
		var menuClass=this.getEtcValue('menuclass');
		var menuPagingClass=this.getEtcValue('pagingclass');
		var menuNextEvent=this.getEtcValue('menunextevent');
		var menuPreviousEvent=this.getEtcValue('menupreviousevent');
		//var elementsAry=useDataAry['elementsary'];
		//var tdElementsAry=useDataAry['tdelementsary'];
		var tableId=menuName;
		var noElements=this.menuHash[menuName]['elementsary'].length;
		//alert ('usepageno: '+usePageNo+', usepagesize: '+usePageSize+', noElements: '+noElements);//xxxd
		if (usePageSize<=0){usePageSize = 0;}
		if (usePageNo < 1){usePageNo=1;}
		var adj=0;
		var elementRowCtr;
		var elementCtr;
		var pageCtr=1;
		var pageLineCtr=1;
		var displayedPageLineCtr=1;
		var displayLine='';
		var saveDisplayLine='';
		var gotIt=false;
		var tdonclick='';
		if (usePageSize>0) {
			for (elementCtr=1;elementCtr<=noElements;elementCtr++){
				gotIt=false;
				lastOnPage=false;
	//- get value
				if (pageLineCtr==usePageSize){
					if (elementCtr == noElements){
						displayLine=elementsAry[elementCtr-1];
						gotIt=true;
						lastOnPage=true;
					}				
					else {
						//xxxd - need to fix the below
						displayLine='<a href="#" class="' + menuPagingClass + '" '+menuNextEvent+' >-more-</a>';
						gotIt=true;
						elementCtr--;
						lastOnPage=true;
					}
				}
				if (pageLineCtr==1 && pageCtr>1){
					//xxxd - need to fix the below
					displayLine='<a href="#" class="' + menuPagingClass + '" '+menuPreviousEvent+' >-previous-</a>';
					elementCtr--;
					gotIt=true;
				}
				if (!gotIt){
					displayLine=this.menuHash[menuName]['elementsary'][elementCtr-1];
				} else {gotIt=false;}
			
	//- print value
				if (pageCtr == usePageNo){
					var rowAccess=document.getElementById(tableId).rows[(pageLineCtr-1)].cells;
					rowAccess[0].innerHTML=displayLine;
					pageLineCtr++;
					printedPageLineCtr=pageLineCtr;
				} else {pageLineCtr++;}
				if (lastOnPage){
					pageCtr++;
					pageLineCtr=1;
				}
			}
			var eraseCtr;
			//- below changed usePageSize+1 to usePageSize xxxd ???
			for (eraseCtr=printedPageLineCtr;eraseCtr<(usePageSize);eraseCtr++){
				try {var rowAccess=document.getElementById(tableId).rows[eraseCtr-1].cells;}
				catch (err){
					var tst=document.getElementById(tableId).rows;
					var noRows=tst.length;
					alert ('general.displayPageV2 tableId: '+tableId+' is invalid, pplc: '+printedPageLineCtr+', norows: '+noRows+', usepagesize: '+usePageSize);
					break;
				}
				rowAccess[0].innerHTML='&nbsp;';
			}
		}		
	},
//===================================================
	setPictureDisplay: function(jobParamsAry){
		  //alert(menuName + ', ' + albumName + ', ' + pictureNo + ', ' + imageId + ', ' + imageTitleId +  ', ' + imageCaptionId);
		var pictureSource=albumsAry[albumName]['picturesrcary'][pictureNo];
		var pictureTitle=albumsAry[albumName]['picturetitlesary'][pictureNo];
		var pictureCaption=albumsAry[albumName]['picturecaptionsary'][pictureNo];
		elementObject=document.getElementById(imageId);
		elementObject.src=pictureSource;
		if (imageTitleId != ''){
			elementObject2=document.getElementById(imageTitleId);
			elementObject2.innerHTML=pictureTitle;
		}
		if (imageCaptionId != ''){
			elementObject3=document.getElementById(imageCaptionId);
			elementObject3.innerHTML=pictureCaption;
		}
	},
//========================================================xxxd22
	setPictureDisplayV2: function(jobParamsAry){
			//(albumName,pictureNo,allId,imageId,imageTitleId,imageCaptionId,menuName){
		//ContainerObj.displayAry(this.menuHash['servicesoffered']['etchash']);//xxxd
		var menuName=jobParamsAry[0];
		var pictureNo=jobParamsAry[1];
		MenuObj.setMenuName(menuName);
//- get image and other ids
		var menuId=MenuObj.getEtcValue('menuid');
		var menuImageId=MenuObj.getEtcValue('menuimageid');
		var menuImageIdDiv=menuImageId+'div';
		var menuTitleId=MenuObj.getEtcValue('menutitleid');
		var menuTextId=MenuObj.getEtcValue('menutextid');
//- get object ids
		//ContainerObj.displayAry(this.menuHash[this.menuName]['etchash']);//xxxd
		var MenuObjectId=MenuObj.getEtcValue('menuobjectid');
		var MenuObjectIdDiv=MenuObjectId+'div';
		var menuLocalObjectId=MenuObj.getEtcValue('menulocalobjectid');
		var menuLocalObjectIdDiv=menuLocalObjectId+'div';
		var menuParamId=MenuObj.getEtcValue('menuparamid');
		var menuLocalParamId=MenuObj.getEtcValue('menulocalparamid');
		var menuEmbedId=MenuObj.getEtcValue('menuembedid');
		var menuLocalEmbedId=MenuObj.getEtcValue('menulocalembedid');
//- get source, title, caption, mediatype
		var pictureChangeHash=MenuObj.getImageStuff(pictureNo);
		var mediaType=pictureChangeHash.get('mediatype');
		if (mediaType == ''){mediaType='image';}
		var videoId=pictureChangeHash.get('videoid');//new
		var imageSrc=pictureChangeHash.get('src');
		var imageTitle=pictureChangeHash.get('title');
		var imageCaption=pictureChangeHash.get('text');
		//- make the menu visible xxxd - not sure if we should do this
		//try {$(menuId).style.visibility='visible';}
		//catch (err){alert ('MenuObj.setPictureDisplayV2: ('+err+') '+menuId+' is an invalid id');}
		if (mediaType == 'image'){
//--------- image
//- hide other stuff
			try {$(MenuObjectIdDiv).style.visibility='hidden';}
			catch (err){alert ('MenuObj.setPictureDisplayV2 ('+err+') menuobjectiddiv: '+MenuObjectIdDiv);}
			try {$(menuLocalObjectIdDiv).style.visibility='hidden';}
			catch (err){alert ('MenuObj.setPictureDisplayV2 ('+err+') menulocalobjectiddiv: '+menuLocalObjectIdDiv);}
//- unhide picture
			try {$(menuImageIdDiv).style.visibility='visible';}
			catch (err){alert ('MenuObj.setPictureDisplayV2 ('+err+') menuImageIddiv: '+menuImageIdDiv);}
//- load in picture source xxxd
			try {$(menuImageId).src=imageSrc;}
			catch (err){alert ('MenuObj.setPictureDisplayV2: ('+err+') menuImageId: '+menuImageId);}
		}
		else if (mediaType == 'youtube') {
//--------- youtube
			try {$(MenuObjectIdDiv).style.visibility='visible';}
			catch (err){alert ('menuobjectidDiv: '+MenuObjectIdDiv+' is invalid');}
//- hide other stuff
			try {$(menuImageIdDiv).style.visibility='hidden';}
			catch (err) {alert (err);}
			try {$(menuLocalObjectIdDiv).style.visibility='hidden';}
			catch (err){alert ('MenuObj.setPictureDisplayV2 ('+err+') menulocalobjectiddiv: '+menuLocalObjectIdDiv);}
//- set url
			var videoWidth=this.getEtcValue('videowidth');
			var videoHeight=this.getEtcValue('videoheight');
			var urlLocation1='http://www.youtube.com/v/';
			var urlLocation2='?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=1&fs=1';
			var urlLocation=urlLocation1 + videoId + urlLocation2;
//- load in other stuff
			try {$(menuParamId).value=urlLocation;}
			catch (err){alert (err);}
			//- embed source
			try {$(menuEmbedId).src=urlLocation;}
			catch (err){alert (err);}
			//- embed width/height 
			try {$(menuEmbedId).style.width=videoWidth;}
			catch (err){alert (err);}
			try {$(menuEmbedId).style.height=videoHeight;}
			catch (err){alert (err);}
		} else if (mediaType == 'localvideo'){
//--------- local video xxxd22
//- hide other stuff
			//-xxxd below still takes up space that is unwanted
			try {$(menuImageIdDiv).style.visibility='hidden';}
			catch (err) {alert (err);}
			try {$(MenuObjectIdDiv).style.visibility='hidden';}
			catch (err) {alert (err);}
			try {$(menuLocalObjectIdDiv).style.visibility='visible';}
			catch (err){alert (err);}
			//try {$(menuLocalObjectId).style.visibility='visible';}
			//catch (err){alert (err);}
//- setup url
			var videoWidth=this.getEtcValue('videowidth');
			var videoHeight=this.getEtcValue('videoheight');
			var urlLocation=imageSrc;
//- load in object fields
			//alert ('menuLocalparamid.value: '+menuLocalParamId+'.value gets imagesrc: '+imageSrc);//xxxd
			try {$(menuLocalParamId).value=imageSrc;}
			catch (err){alert (err);}
			//- need to put in width/height for object
//- load in embed source
			//alert ('menuLocalembedid.src: '+menuLocalEmbedId+'.src gets imagesrc: '+imageSrc);//xxxd
			//xxxd - need to do below, but it blows up
			$(menuLocalEmbedId).Stop();
			try {$(menuLocalEmbedId).src=imageSrc;} catch (err){alert (err);}
			//- embed width/height 
			try {$(menuLocalEmbedId).width=videoWidth;}
			catch (err){alert (err);}
			try {$(menuLocalEmbedId).height=videoHeight;}
			catch (err){alert (err);}
			try {$(menuLocalEmbedId).Play();} catch (err){alert ('1494: '+err);}
			//xxxd-alert (menuLocalEmbedId.innerHTML);//xxxd
		} else {
			alert ('invalid mediaType: '+mediaType);
		}
		try {$(menuTitleId).innerHTML=imageTitle;}
		catch (err){alert (err);}
		try{$(menuTextId).innerHTML=imageCaption;}
		catch (err){alert (err);}
		},
//========================================================xxxd22
		setPictureDisplayV3: function(jobParamsAry){
			var menuName=jobParamsAry[0];
			var pictureNo=jobParamsAry[1];
			MenuObj.setMenuName(menuName);
//- get height/width
			var videoHeight=MenuObj.getEtcValue('videoheight');
			var videoWidth=MenuObj.getEtcValue('videowidth');
//- get main ids
			var menuId=MenuObj.getEtcValue('menuid');
			var menuTitleId=MenuObj.getEtcValue('menutitleid');
			var menuTextId=MenuObj.getEtcValue('menutextid');
//- get image id and class
			var menuImageClass=MenuObj.getEtcValue('menuimageclass');
			var menuImageId=MenuObj.getEtcValue('menuimageid');
//- get youtube ids/classes
			var MenuObjectId=MenuObj.getEtcValue('menuobjectid');
			var menuParamId=MenuObj.getEtcValue('menuparamid');
			var menuEmbedId=MenuObj.getEtcValue('menuembedid');
			var menuEmbedClass=MenuObj.getEtcValue('menuembedclass');
//- get local ids/classes
			var menuLocalObjectId=MenuObj.getEtcValue('menulocalobjectid');
			var menuLocalParamId=MenuObj.getEtcValue('menulocalparamid');
			var menuLocalEmbedId=MenuObj.getEtcValue('menulocalembedid');
			var menuLocalEmbedClass=MenuObj.getEtcValue('menulocalembedclass');
//- get division ids
			var menuImageIdDiv=menuImageId+'div';
			var MenuObjectIdDiv=MenuObjectId+'div';
			var menuLocalObjectIdDiv=menuLocalObjectId+'div';
//- get source, title, caption, mediatype
			var pictureChangeHash=MenuObj.getImageStuff(pictureNo);
			var mediaType=pictureChangeHash.get('mediatype');
			if (mediaType == ''){mediaType='image';}
			var videoId=pictureChangeHash.get('videoid');//new
			var imageSrc=pictureChangeHash.get('src');
			var imageTitle=pictureChangeHash.get('title');
			var imageCaption=pictureChangeHash.get('text');
			var htmlStrg='';
			if (mediaType == 'image'){
//--------- write in image html
			     var htmlStrg='<img src="'+imageSrc+'" class="'+menuImageClass+'" id="'+menuImageId+'">'; 
			}
			else if (mediaType == 'youtube') {
//--------- write in youtube html
				//xxxd ----- start
				//- set url
				var urlLocation1='http://www.youtube.com/v/';
				var urlLocation2='?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=1&fs=1';
				var urlLocation=urlLocation1 + videoId + urlLocation2;
				var htmlStrg='<object  id="'+MenuObjectId+'">'+"\n";
				htmlStrg+='<param name="movie" id="'+menuParamId+'" value="'+urlLocation+'"/>'+"\n";
				htmlStrg+='<embed src="'+urlLocation+'" height="'+videoHeight+'" width="'+videoWidth+'"/>'+"\n";
				htmlStrg+='</object>'+"\n";
			} else if (mediaType == 'localvideomov'){
//--------- write in local html
				var imageSrcLen=imageSrc.length;
				var posStart=imageSrcLen - 3;
				var suffixChk=imageSrc.substring(posStart,imageSrcLen);
				if (suffixChk == 'jpg' || suffixChk == 'png' || suffixChk == 'gif'){
					var imageSrcUse=imageSrc.substring(0,posStart);
					imageSrcUse+='mov';
				}
				else {imageSrcUse=imageSrc;}
			   var htmlStrg='<object width="'+videoWidth+'" height="'+videoHeight+'"'+"\n"; 
			   htmlStrg+='classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B"'+"\n"; 
			   htmlStrg+='codebase="http://www.apple.com/qtactivex/qtplugin.cab">'+"\n";
			   htmlStrg+='<param name="src" value="'+imageSrcUse+'">'+"\n";
			   htmlStrg+='<param name="autoplay" value="true">'+"\n";
			   htmlStrg+='<param name="controller" value="true">'+"\n";
			   htmlStrg+='<embed src="'+imageSrcUse+'" width="'+videoWidth+'" height="'+videoHeight+'" autoplay="true" controller="false"'+"\n";
			   htmlStrg+='pluginspage="http://www.apple.com/quicktime/download/">'+"\n"+'</embed>'+"\n"+'</object>'+"\n";
			   //alert (htmlStrg);//xxxd
			} else if (mediaType == 'localvideoavi'){
				var imageSrcLen=imageSrc.length;
				var posStart=imageSrcLen - 3;
				var suffixChk=imageSrc.substring(posStart,imageSrcLen);
				if (suffixChk == 'jpg' || suffixChk == 'png' || suffixChk == 'gif'){
					var imageSrcUse=imageSrc.substring(0,posStart);
					imageSrcUse+='avi';
				}
				else {imageSrcUse=imageSrc;}
				var htmlStrg='<object id="MediaPlayer1" CLASSID="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95"'+"\n";
				htmlStrg+=' codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"'+"\n";
				htmlStrg+=' standby="Loading Microsoft Windows� Media Player components..." type="application/x-oleobject" width="'+videoWidth+'" height="'+videoHeight+'">'+"\n";
				htmlStrg+='<param name="fileName" value="'+imageSrcUse+'">'+"\n";
				htmlStrg+='<param name="animationatStart" value="true">'+"\n";
				htmlStrg+='<param name="transparentatStart" value="true">'+"\n";
				htmlStrg+='<param name="autoStart" value="true">'+"\n";
				htmlStrg+='<param name="showControls" value="true">'+"\n";
				htmlStrg+='<param name="Volume" value="-450">'+"\n";
				htmlStrg+='<embed type="application/x-mplayer2" pluginspage="http://www.microsoft.com/Windows/MediaPlayer/"'+"\n";
				htmlStrg+=' src="'+imageSrcUse+'" name="MediaPlayer1" width= '+videoWidth+' height= '+videoHeight+' autostart=1 showcontrols=1 volume=-450>'+"\n";
				htmlStrg+='</object>'+"\n";
				//alert (htmlStrg);//xxxd
			} else {
				alert ('invalid mediaType: '+mediaType);
				exit();
			}
//--------- load in title/caption/video
			try {$(menuTitleId).innerHTML=imageTitle;}
			catch (err){alert (err);}
			try{$(menuTextId).innerHTML=imageCaption;}
			catch (err){alert (err);}
			//alert (htmlStrg);//xxxd
			try{$(menuImageIdDiv).innerHTML=htmlStrg;}
			catch (err){alert (err);}
			},
//===================================================xxxd22
	disableVideo: function(jobParamsAry){
			var menuName=jobParamsAry[0];
			MenuObj.setMenuName(menuName);
			var menuImageId=MenuObj.getEtcValue('menuimageid');
//------------------ disable youtube
			var MenuObjectId=MenuObj.getEtcValue('menuobjectid');
			var menuParamId=MenuObj.getEtcValue('menuparamid');
			var menuEmbedId=MenuObj.getEtcValue('menuembedid');
//- shutdown
			try {$(menuEmbedId).width=0;} catch (err) {alert (err);}
			try {$(menuEmbedId).height=0;} catch (err) {alert (err);}
			try {$(MenuObjectId).width=0;} catch (err) {alert (err);}
			try {$(MenuObjectId).height=0;} catch (err) {alert (err);}
//------------------ disable local
			var menuLocalObjectId=MenuObj.getEtcValue('menulocalobjectid');
			var menuLocalEmbedId=MenuObj.getEtcValue('menulocalembedid');
			var menuLocalParamId=MenuObj.getEtcValue('menulocalparamid');
//- embed shutdown
			try {$(menuLocalEmbedId).width=0;} catch (err) {alert (err);}
			try {$(menuLocalEmbedId).height=0;} catch (err) {alert (err);}
			try {$(menuLocalEmbedId).Stop();} catch (err){alert (err);}
//- object shutdown
			try {$(menuLocalObjectId).width=0;} catch (err) {alert (err);}
			try {$(menuLocalObjectId).height=0;} catch (err) {alert (err);}
//- hide stuff where visibility was screwed with in setPictureDisplayV2
			var MenuObjectIdDiv=MenuObjectId+'div';
			try {$(MenuObjectIdDiv).style.visibility='hidden';} catch (err) {alert (err);}
			//xxxd - below caused problems
			//try {$(menuLocalObjectId).style.visibility='hidden';} catch (err) {alert (err);}
			//try {$(menuLocalEmbedId).style.visibility='hidden';} catch (err) {alert (err);}
			//xxxd - the below I did just to see what would happen
			//try {$(menuImageId).style.visibility='hidden';} catch (err){alert (err);}
//- imvalid stuff
			//xxxd this method is only with embed: try {$(menuLocalObjectId).Stop();} catch (err){alert (err);}
			//xxxd you cant null this: try {$(menuLocalParamId).value='';} catch (err) {alert (err);}
			//xxxd you cant null this: try {$(menuLocalEmbedId).src='';} catch (err) {alert (err);}
			//xxxd - doesnt matter: try {$(menuLocalEmbedId).autoplay='false';} catch (err) {alert (err);}
			//xxxd - doesnt matter: try {$(menuLocalEmbedId).controller='false';} catch (err) {alert (err);}
//- test
			//try {$(MenuObjectId).style.visibility='hidden';} catch (err) {alert (err);}
		},
//===================================================//xxxf99
	getImageStuff: function(pictureNo){
			var theStuffHash=new Hash();
			pictureNo=Number(pictureNo);
			//alert ('menuname: '+this.menuName);//xxxd
			var errorStrg='';
			try {var imageSrc=this.menuHash[this.menuName]['elementsary'][0][pictureNo];}
			catch (err){errorStrg+='MenuObj.getImageStuff: '+err+"\n";}
			try {var imageTitle=this.menuHash[this.menuName]['titlesary'][0][pictureNo];}
			catch (err){errorStrg+='MenuObj.getImageStuff: '+err+"\n";}
			try {var imageCaption=this.menuHash[this.menuName]['textary'][0][pictureNo];}
			catch (err){errorStrg+='MenuObj.getImageStuff: '+err+"\n";}
			try {var mediaType=this.menuHash[this.menuName]['mediaary'][0][pictureNo];}
			catch (err){errorStrg+='MenuObj.getImageStuff: '+err+"\n";}
			try {var videoId=this.menuHash[this.menuName]['videoary'][0][pictureNo];}
			catch (err){errorStrg+='MenuObj.getImageStuff: '+err+"\n";}
			if (errorStrg.length>0){
				alert ('xxxf1');
				ContainerObj.displayHash('MenuObj.getImageStuff: menuname: '+this.menuName,this.menuHash[this.menuName]['etchash']);
				alert ('xxxf2');
				alert (errorStrg);
				this.stopBatch();
				exit();// temporary until stopBatch works
			}
			else {
				theStuffHash.set('src',imageSrc);
				theStuffHash.set('title',imageTitle);
				theStuffHash.set('text',imageCaption);
				theStuffHash.set('mediatype',mediaType);
				theStuffHash.set('videoid',videoId);
			}
			return theStuffHash;
		},
//===================================================
	writeToErr: function(messageNo,message){
		$('errormsgid').rows[messageNo].cells[0].innerHTML=message;
	},
//===================================================
	doAlert: function(dmyMsg){
		ContainerObj.jsDebug('');
		alert (dmyMsg);
	} 
});

//================================== 
				var myPairs = new Array();
//==================================
function testIt(one,two,three,four){
	alert ('testit');
}
//=========================================
function clearSelect(clearList) {
// this routine clears out a listbox or combo box
	for (var i = clearList.options.length; i >= 1; i--) {
		clearList.options[i] = null;
	}
	clearList.options[0] = null;
}
//==========================================
function addopt(selectList, nValue, sText) {
// this routine adds a new item to our listbox
	selectList.options[selectList.options.length] = new Option(sText, nValue);
}
//==========================================
function validateInput(validateName){
	var errorMsgName = validateName + '_errormsg';
	loopLength = validateArray.length;
	for (var ctr = 0; ctr < loopLength; ctr++){
		checkName=validateArray[ctr][1];
		if (checkName == validateName){
			regEx = validateArray[ctr][3];
			keyMap = validateArray[ctr][4];
//take off / ... / if there
			regExLastCh=regEx.substr(regEx.length-1,1);
			if (regExLastCh == '/'){
				regEx=regEx.substr(0,regEx.length-1);
			}
			if (regEx.substr(0,1) == '/'){
				regEx=regEx.substr(1,regEx.length-1);
			}
			regExErrorMsg=validateArray[ctr][5];
			validateTotalValue = document.getElementById(validateName).value;
			validateTotalValueLen=validateTotalValue.length;
			validateValue=validateTotalValue.substr(validateTotalValueLen-1,1);
			if (keyMap !== ''){
				var charPos = validateTotalValue.length;
				charPos--;
				if (charPos >= 0){
				var keyValue=keyMap.substr(charPos,1);
				}
				else {keyValue='x';}					
				var checkedIt = false;
				if (keyValue == 'n'){
					MyRegExp = new RegExp('^[0-9]*$','g');
					var regExResult = MyRegExp.test(validateValue);
					if (regExResult == false){
						validateValue=validateValue.substr(0,validateValue.length-1);
						document.getElementById(validateName).value=validateValue;
					}
					checkedIt = true;
				}
				if (keyValue == 'a'){
					MyRegExp = new RegExp('^[a-z,A-Z]*','g');
					var regExResult = MyRegExp.test(validateValue);
					if (regExResult == false){
						validateValue=validateValue.substr(0,validateValue.length-1);
						document.getElementById(validateName).value=validateValue;
					}
					checkedIt = true;
				}
				if (checkedIt == false){	
					if (validateValue != keyValue){
						validateValue=validateValue.substr(0,validateValue.length-1);
						document.getElementById(validateName).value=validateValue;
					}
				}
			}
			else {
			if (regEx !== ''){
				MyRegExp = new RegExp(regEx,'g');
				var regExResult = MyRegExp.test(validateValue);
				if (regExResult == false){
					validateValue=validateValue.substr(0,validateValue.length-1);
					document.getElementById(validateName).value=validateValue;
				}
			}
			}
		}
	}
}
//=================================================== old paging soon to be deprecated
//================================
function pagePrevious(){
	pageNo--;
	if (pageNo<1){pageNo=1;}
	displayPage(dataAry);
}
//================================
function pageNext(){
	pageNo++;
	//alert ('pageno: '+pageNo+', dataary: '+dataAry);//xxxf
	displayPage(dataAry);
}
//================================
function pageFirst(){
	pageNo=1;
	displayPage(dataAry);
}
//================================
function pageLast(){
	pageNo=Math.round(maxDataAry / pageSize)+2;
	displayPage(dataAry);
}
//================================
function displayPage(useDataAry){
	//alert ('pageno: '+ pageNo+', pagesize: '+pageSize);//xxxf
	if (pageNo < 1){pageNo=1;}
	var pageAdj=1;
	var startAryRow = (pageNo-1) * (pageSize)+pageAdj;
	//alert ('startaryrow: '+startAryRow+', pageno: '+pageNo+', pagesize: '+pageSize+', pageadj: '+pageAdj);//xxx
	if (startAryRow > maxDataAry){
		pageNo--;
		startAryRow = (pageNo-1) * (pageSize);
	}
	var rowCtr, columnCtr;
	var adjPageSize = pageSize+1;
	//alert ('column cnt: ' + columnCnt);//xxx
	maxDataAry=useDataAry.length;
	//alert ('125 startaryrow: '+startAryRow+', maxdataary: '+maxDataAry+', adjpagesize: '+adjPageSize);//xxxd
	//xxxd: why this???? -> if (maxDataAry<adjPageSize){adjPageSize=maxDataAry;}
	var chkStrg=startAryRow+': ';
	var rowStart=1;// leave heading where it was
	var debugStrg='';
	for (rowCtr=rowStart;rowCtr<adjPageSize;rowCtr++){
		var curAryRowCtr=startAryRow+(rowCtr-1);
		debugStrg+="row: rowCtr,";
		chkStrg+=curAryRowCtr+', ';
		//alert('curaryrowctr: ' + curAryRowCtr +', maxdataary: '+maxDataAry);
		if (curAryRowCtr < maxDataAry){
			//aborts below because tableid is null
			if (tableId == ''){document.write('null tableid: processing bypassed');}
			else {
				try {var rowAccess=document.getElementById(tableId).rows[rowCtr].cells;}
				catch (err){alert ('137 error invalid rowaccess, tableid: '+tableId+', rowctr: '+rowCtr);}
				for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
					var newData=useDataAry[curAryRowCtr][columnCtr];
					//rowAccess[columnCtr].innerHTML=rowCtr + ':' + curAryRowCtr + ':' + newData;
					rowAccess[columnCtr].innerHTML=newData;
				}
			}
		}
		else {
			//document.write('xxx1<br>tableid: '+tableId+', rowctr: '+rowCtr);
			try {var rowAccess=document.getElementById(tableId).rows[rowCtr].cells;}
			catch (err){ alert ('148 error invalid rowaccess, tableid: '+tableId+', rowctr: '+rowCtr);}
			//document.write('xxx2<br>');
			for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
				rowAccess[columnCtr].innerHTML='&nbsp;';
			}
			//document.write('xxx3<br>');
		}		
	}
	//alert (debugStrg);//xxxf
	//alert ('xxx9');
}
//================================xxxd - doubling up selects
function pageSelect(nameString){
	try {
		var selectString = document.getElementById(nameString).value;
	} catch (err){
		alert ('general.js:pageSelect nameString: '+nameString+' is invalid');
	}
	var selectString_lower = selectString.toLowerCase();
	var selectStringLen = selectString.length;
	var posCtr, posCtr2;
	var chkData, chkData_lower, chkChar, dataCtr, maxDataAryBak;
	var lineNo = 0;
	var reducedDataAry = new Array();
	maxDataAry=dataAry.length;
	if (selectString == ''){reducedDataAry=dataAry;}
	else {
		for (dataCtr=0;dataCtr<maxDataAry;dataCtr++){
			chkData=selectAry[dataCtr];
			chkData_lower=chkData.toLowerCase();
			posCtr=chkData_lower.indexOf(selectString_lower);
			if (posCtr>-1 || dataCtr == 0 ){
				reducedDataAry[reducedDataAry.length]=dataAry[dataCtr];
			}	
		}
	}
	lineNo=1;
	maxDataAry=reducedDataAry.length;
	//alert('red[0]: '+reducedDataAry[0]+"\n"+'red[1]: '+reducedDataAry[1]);//xxx
	pageNo=Math.round(lineNo / pageSize);
	displayPage(reducedDataAry);
}
//============================================================= generic paging (new)
function pagePreviousV2(menuName){
	var useDataAry = menuAry[menuName];
	var usePageNo=useDataAry['pageno'];
	usePageNo--;
	if (usePageNo<1){usePageNo=1;}
	else {menuAry[menuName]['lastid']='none';}
	useDataAry['pageno']=usePageNo;
	displayPageV2(menuName, useDataAry);
	return usePageNo;
}
//================================
function pageNextV2(menuName){
	try {
		var useDataAry = menuAry[menuName];
	}
	catch (err){
		alert ('general.pageNextV2: '+err+', menuName: '+menuName);
	}
	try {
		var usePageNo=useDataAry['pageno'];
	}
	catch (err){
		alert ('general.pageNextV2: '+err+', menuName: '+menuName);
	}
	usePageNo++;
	useDataAry['pageno']=usePageNo;
	displayPageV2(menuName, useDataAry);
	menuAry[menuName]['lastid']='none';
	return usePageNo;
}
//================================ error below!!!!
function pageFirstV2(menuName){
	var usePageNo=1;
	displayPageV2(menuName, useDataAry);
	return usePageNo;
}
//================================ error below!!!!
function pageLastV2(menuName){
	var pageSize=useDataAry['pagesize'];
	var maxUseDataAry=useDataAry.length;
	var usePageNo=Math.round(maxDataAry / pageSize)+1;
	displayPageV2(menuName,useDataAry);
}
//================================xxxf
function displayPageV2(menuName, useDataAry){
	var usePageNo=useDataAry['pageno'];
	var usePageSize=useDataAry['maxpagesize'];
	var menuClass=useDataAry['menuclass'];
	var menuPagingClass=useDataAry['menupagingclass'];
	var elementsAry=useDataAry['elementsary'];
	//alert (elementsAry);exit();//xxxf
	var tdElementsAry=useDataAry['tdelementsary'];
	var tableId=menuName;
	var noElements=elementsAry.length;
	//alert ('usepageno: '+usePageNo+', usepagesize: '+usePageSize+', noElements: '+noElements);//xxx
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
					displayLine='<a href="#" class="' + menuPagingClass + '"  onclick="pageNextV2(\'' + menuName + '\');">-more-</a>';
					gotIt=true;
					elementCtr--;
					lastOnPage=true;
				}
			}
			if (pageLineCtr==1 && pageCtr>1){
				displayLine='<a href="#" class="' + menuPagingClass + '" onclick="pagePreviousV2(\'' + menuName + '\');">-previous-</a>';
;
				elementCtr--;
				gotIt=true;
			}
			if (!gotIt){
				displayLine=elementsAry[elementCtr-1];
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
}
//==================================== picture paging 
function nextPicture(menuName){
	var usePageNo=menuAry[menuName]['pageno'];
	var menuElementNo=menuAry[menuName]['menuelementno'];
	var maxPageSize=menuAry[menuName]['etc'][menuElementNo]['maxpagesize'];
	usePageNo++;
	if (usePageNo>maxPageSize){usePageNo=1;}
	menuAry[menuName]['pageno']=usePageNo;
	usePageNo--;
	displayPictureMenu(menuName,menuElementNo,usePageNo);
}
//==================================== picture paging 
function nextPictureV2(menuName,menuTextId){
	var usePageNo=menuAry[menuName]['pageno'];
	var menuElementNo=menuAry[menuName]['menuelementno'];
	var maxPageSize=menuAry[menuName]['etc'][menuElementNo]['maxpagesize'];
	usePageNo++;
	if (usePageNo>maxPageSize){usePageNo=1;}
	menuAry[menuName]['pageno']=usePageNo;
	usePageNo--;
	displayPictureMenuV2(menuName,menuElementNo,usePageNo,menuTextId);
}
//================================= 
function previousPicture(menuName){
	var usePageNo=menuAry[menuName]['pageno'];
	var menuElementNo=menuAry[menuName]['menuelementno'];
	var maxPageSize=menuAry[menuName]['etc'][menuElementNo]['maxpagesize'];
	usePageNo--;
	if (usePageNo<1){usePageNo=maxPageSize;}
	menuAry[menuName]['pageno']=usePageNo;
	usePageNo--;
	displayPictureMenu(menuName,menuElementNo,usePageNo);
}
//================================= 
function previousPictureV2(menuName, menuTextId){
	var usePageNo=menuAry[menuName]['pageno'];
	var menuElementNo=menuAry[menuName]['menuelementno'];
	var maxPageSize=menuAry[menuName]['etc'][menuElementNo]['maxpagesize'];
	usePageNo--;
	if (usePageNo<1){usePageNo=maxPageSize;}
	menuAry[menuName]['pageno']=usePageNo;
	usePageNo--;
	displayPictureMenuV2(menuName,menuElementNo,usePageNo,menuTextId);
}
//================================= 
function displayPictureMenu(menuName, menuElementNo, usePageNo){
	var menuClass=menuAry[menuName]['menuclass'];
	var menuType=menuAry[menuName]['menutype'];
	var menuId=menuAry[menuName]['menuid'];
	var newSource=menuAry[menuName]['elementsary'][menuElementNo][usePageNo];
	var menuTitleId=menuAry[menuName]['menutitleid'];
	if (menuType == 'rotate') {
		var menuTitle=menuAry[menuName]['titlesary'][menuElementNo][usePageNo];
		var newSource=menuAry[menuName]['elementsary'][menuElementNo][usePageNo];
		if (menuTitleId != ''){
			var title=document.getElementById(menuTitleId);
			title.innerHTML=menuTitle;
		}
	}
	else {var newSource=menuAry[menuName]['elementsary'][menuElementNo];}
	document.getElementById(menuId).src=newSource;
}
//================================================ 
function displayPictureMenuV2(menuName, menuElementNo, usePageNo, menuTextId){
	var menuClass=menuAry[menuName]['menuclass'];
	var menuType=menuAry[menuName]['menutype'];
	var menuId=menuAry[menuName]['menuid'];
	var menuImageId=menuAry[menuName]['menuimageid'];
	//alert (menuName+', '+menuId);//xxxf
	var newSource=menuAry[menuName]['elementsary'][menuElementNo][usePageNo];
	var menuTitleId=menuAry[menuName]['menutitleid'];
	if (menuType == 'rotate') {
		var menuTitle=menuAry[menuName]['titlesary'][menuElementNo][usePageNo];
		var menuText=menuAry[menuName]['textary'][menuElementNo][usePageNo];
		//alert (menuText);//xxxf
		//alert (newSource);
		var newSource=menuAry[menuName]['elementsary'][menuElementNo][usePageNo];
		//var dmy=menuAry[menuName]['elementsary'][menuElementNo];
		//alert (dmy);
		//var dmy=menuAry[menuName]['elementsary'][menuElementNo][0];
		//alert ('pageno: ' + usePageNo + ', newsource: ' + newSource + ', dmy: ' + dmy);//xxx
		if (menuTitleId != ''){
			var title=document.getElementById(menuTitleId);
			title.innerHTML=menuTitle;
		}
//- below is plug which needs to be fixed 
		//menuTextId='clientsimagetext';
		//alert ('menutext: ' + menuText + ', menutextid: ' + menuTextId);
		if (menuText != '' && menuTextId != ''){
			//alert ('do update');//xxx
			try {
				var textObj=document.getElementById(menuTextId);
				textObj.innerHTML=menuText;
			}
			catch (err){
				//xxxf do nothing
			}
			//alert ('did update');
		}
	}
	else {var newSource=menuAry[menuName]['elementsary'][menuElementNo];}
	//alert (menuId + ', ' + newSource);//xxxf
	document.getElementById(menuImageId).src=newSource;
}
//================================================= 
function toggleMenuDisplay(callingMenuId,changingMenuIdTable,changingMenuIdTd,changingMenuName,changingMenuElementNo){
  newSource=menuAry[changingMenuName]['elementsary'][changingMenuElementNo];
  var rowAccess=document.getElementById(changingMenuIdTable).rows[0].cells;
  rowAccess[0].innerHTML=newSource;
  document.getElementById(callingMenuId).style.visibility='hidden';
  document.getElementById(changingMenuIdTable).style.visibility='visible';
}
//================================================ 
function toggleMenuDisplayV2(callingMenuId,changingMenuIdTable,changingMenuIdTd,changingMenuName,changingMenuElementNo){
  newSource=menuAry[changingMenuName]['elementsary'][changingMenuElementNo];
  var rowAccess=document.getElementById(changingMenuIdTable).rows[0].cells;
  rowAccess[0].innerHTML=newSource;
  document.getElementById(callingMenuId).style.visibility='hidden';
  document.getElementById(changingMenuIdTable).style.visibility='visible';
//xxx!!! below is a plug 
	menuTextId='clientsimagetext';
	menuNameWithText='clientimagedisplay';
//- end plugs
	var menuText=menuAry[menuNameWithText]['textary'][changingMenuElementNo][0];
	var textObj=document.getElementById(menuTextId);
	textObj.innerHTML=menuText;
}
//================================================
function displayMappedPictureMenu(menuName, useMapName, menuElementNo){
	var menuClass=menuAry[menuName]['menuclass'];
	var menuType=menuAry[menuName]['menutype'];
	var menuId=menuAry[menuName]['menuid'];
	var newSource=menuAry[menuName]['elementsary'][menuElementNo];
	var menuTitleId=menuAry[menuName]['menutitleid'];
	var menuTitle=menuAry[menuName]['titlesary'][menuElementNo];
	var newSource=menuAry[menuName]['elementsary'][menuElementNo];
	document.getElementById(menuId).src=newSource;
	//var oldMapName=document.getElementById(menuId).useMap;
	document.getElementById(menuId).useMap=useMapName;
}
//===============================================
function displaySquareRegion(tableName,formName){
//-
	var elementId='ax';
	var ax_raw=document.forms[formName].elements[elementId].value;
	var ax=parseInt(ax_raw);
//-
	var elementId='ay';
	var ay_raw=document.forms[formName].elements[elementId].value;
	var ay=parseInt(ay_raw);
//-
	elementId='bx';
	var bx_raw=document.forms[formName].elements[elementId].value;
	var bx=parseInt(bx_raw);
//-
	elementId='by';
	var by_raw=document.forms[formName].elements[elementId].value;
	var by=parseInt(by_raw);
//-
	var tableWidth=bx-ax;
	var tableLeft=ax+30;
	var tableTop=ay+30;
	var tableHeight=by-ay;
	var theTableObj=document.getElementById(tableName);
	theTableObj.style.width=tableWidth;
	theTableObj.style.left=tableLeft;
	theTableObj.style.top=tableTop;
	theTableObj.style.height=tableHeight;
	theTableObj.style.visibility='visible';
}
//===============================================
function hideSquareRegion(tableName){
	theTableObj=document.getElementById(tableName);
	theTableObj.style.visibility='hidden';
}
//===============================================
function changeSelections(menuName,newMenuId){
	var menuClass=menuAry[menuName]['menuclass'];
	var menuSelectedClass=menuAry[menuName]['menuselectedclass'];
//- unchange old to standard and record new menu as lastid
	var oldMenuId=menuAry[menuName]['lastid'];
	document.getElementById(oldMenuId).className=menuClass;
	menuAry[menuName]['lastid']=newMenuId;
//- change new to selected
	document.getElementById(newMenuId).className=menuSelectedClass;
}
//===============================================
function displayMappedPicture(menuName,titleId,menuElementPos,menuSubElementPos)
{
        var newSource=menuAry[menuName]['elementsary'][menuElementPos][menuSubElementPos];
        var newTitle=menuAry[menuName]['titlesary'][menuElementPos][menuSubElementPos];
        //oldSource=document.getElementById(menuName).src;
        document.getElementById(menuName).src=newSource;
        document.getElementById(titleId).innerHTML=newTitle;
}
//===============================================
function displayMappedPictureV2(menuName,titleId,textId,menuElementPos,menuSubElementPos)
{
	//alert ('xxxf');
	var newSource=menuAry[menuName]['elementsary'][menuElementPos][menuSubElementPos];
	var newTitle=menuAry[menuName]['titlesary'][menuElementPos][menuSubElementPos];
	var newText=menuAry[menuName]['textary'][menuElementPos][menuSubElementPos];
       //oldSource=document.getElementById(menuName).src;
	//xxxf - below should use an id shouldnt it?
	document.getElementById(menuName).src=newSource;
	document.getElementById(titleId).innerHTML=newTitle;
	document.getElementById(textId).innerHTML=newText;
}
//===============================================
function setMenuDisplay(menuName, menuElementNo, callingMenuName, callingId){
	menuAry[menuName]['menuelementno']=menuElementNo;
	menuAry[menuName]['pageno']=1;
	var callingMenuClass=menuAry[callingMenuName]['menuclass'];
	var lastId=menuAry[callingMenuName]['lastid'];
	if (lastId != '' && callingMenuClass != '' && lastId != 'none'){
		document.getElementById(lastId).className=callingMenuClass;
	}
	var callingMenuSelectedClass=menuAry[callingMenuName]['menuselectedclass'];
	document.getElementById(callingId).className=callingMenuSelectedClass;
	menuAry[callingMenuName]['lastid']=callingId;
	displayPictureMenu(menuName, menuElementNo,0);
}
//===============================================deprecated
function setMenuElementDisplayDeprecated(menuName, menuElementId, callingMenuName, callingMenuElementId){
//-	turn off calling menu element last selected
	var callingMenuClass=menuAry[callingMenuName]['menuclass'];
	var lastId=menuAry[callingMenuName]['lastid'];
	if (lastId != '' && callingMenuClass != '' && lastId != 'none'){
		document.getElementById(lastId).className=callingMenuClass;
	}
//- turn on calling menu element selected
	var callingMenuSelectedClass=menuAry[callingMenuName]['menuselectedclass'];
	document.getElementById(callingMenuElementId).className=callingMenuSelectedClass;
	menuAry[callingMenuName]['lastid']=callingMenuElementId;
//- hide menu element last selected
	var menuClass=menuAry[menuName]['menuclass'];
	var lastId=menuAry[menuName]['lastid'];
	if (lastId != '' && menuClass != '' && lastId != 'none'){
		document.getElementById(lastId).className=menuClass;
	}
//- show menu element selected
	var menuSelectedClass=menuAry[menuName]['menuselectedclass'];
	document.getElementById(menuElementId).className=menuSelectedClass;
	menuAry[callingMenuName]['lastid']=callingMenuElementId;
}
//==========================================
function toggleElementView(toHiddenElement,toViewElement){
	//- fill in
	document.getElementById(toHiddenElement).style.visibility="hidden";
	document.getElementById(toViewElement).style.visibility="visible";
}
//================================================
function toggleElementsVisibility(idToShow,idToHide){
        document.getElementById(idToShow).style.visibility='visible';
        document.getElementById(idToHide).style.visibility='hidden';
}
//=======================
function menuInit(){
	menu = document.getElementsByTagName("div");
}
//===================== showHide
function showHide(menuDivId,visibility){
	menu[menuDivId].style.visibility = visibility;
}
//===================== moveRight
function moveImagesRightCont(moveParSecs){
	var moveNo=1;
	var moveParSecs=5;
	var imageId;
	for (imageId in imgAry){
//- get image, movex/y settings
		var imageElement=imgAry[imageId];
		var moveX=imgSettingsAry[imageId]['movex'];
		var moveY=imgSettingsAry[imageId]['movey'];
		var xCtr=imgSettingsAry[imageId]['xctr'];
		if (xCtr == ''){xCtr=0;}
		var yCtr=imgSettingsAry[imageId]['yctr'];
		if (yCtr == ''){yCtr=0;}
		var xDirection = imgSettingsAry[imageId]['xdirection'];
		var yDirection = imgSettingsAry[imageId]['ydirection'];
		if (moveX<0){
			xDirection = xDirection * -1;
			moveX = moveX * -1;
		}
		if (moveY<0){
			yDirection = yDirection * -1;
			moveY = moveY * -1;
		}

//- get adjust x/y ctrs
		xCtr++;
		if (xCtr>moveX){xCtr=0;}
		imgSettingsAry[imageId]['xctr']=xCtr;
		yCtr++;
		if (yCtr>moveY){yCtr=0;}
		imgSettingsAry[imageId]['yctr']=yCtr;
//- set values added to leftpos, toppos
		var moveXDirection=0;
		var moveYDirection=0;
		if (xCtr==moveX & xCtr != 0){moveXDirection=1;}
		if (yCtr==moveY & yCtr != 0){moveYDirection=1;}

//- get left, top coords of ship
		var leftPos=parseInt(imgSettingsAry[imageId]['leftpos']);
		var topPos=parseInt(imgSettingsAry[imageId]['toppos']);
		//xxxf
		var imageElementLeftPos=parseInt(imageElement.style.left);
		var imageElementTopPos=parseInt(imageElement.style.top);
		if (imageElementLeftPos>1200){
			imageElementLeftPos=-300;
		}
		if (imageElementLeftPos<-300){
			imageElementLeftPos=1200;
		}
		if (imageElementTopPos>800){
			imageElementTopPos=-200;
		}
		if (imageElementTopPos<-200){
				imageElementTopPos=800;
		}
		var errorRate=imgSettingsAry[imageId]['errorrate'];
		var numberCheck=Math.random();
		var errorDirectionNo;
		if (numberCheck<.01){errorDirectionNo=errorRate * -1;}
		if (numberCheck>.01 && numberCheck<.99){errorDirectionNo=0;}
		if (numberCheck>.99){errorDirectionNo=errorRate;}
//- plug in new locations - problem is below
//- yDirection is unassigned above
		imageElementTopPos=imageElementTopPos+(moveYDirection*yDirection);
		imageElement.style.top=(imageElementTopPos+errorDirectionNo) + 'px';
		imageElementLeftPos=imageElementLeftPos+(moveXDirection * xDirection);
		imageElement.style.left=(imageElementLeftPos) + 'px';
		imgAry[imageId]=imageElement;
	}
	var t=setTimeout("moveImagesRightCont(" + moveParSecs + ")",moveParSecs);
}
function alterTitleSize(elementBase,elementSize){
  paraGraphs=elementBase.rows[0].cells[0].getElementsByTagName('p');
  paraGraphs[0].style.fontSize=elementSize;
}
function alterPictureSize(elementBase){
  elementBase.style.position="absolute";
  elementBase.style.left="170";
  elementBase.style.top="50";
  elementBase.style.width="300";
  elementBase.rows[0].cells[0].style.background="white";
  elementBase.rows[2].cells[0].style.background="white";
//-
  images=elementBase.rows[1].cells[0].getElementsByTagName('img');
  images[0].style.width=300;
//-
  paraGraphsTitle=elementBase.rows[0].cells[0].getElementsByTagName('p');
  paraGraphsTitle[0].style.visibility="visible";
  paraGraphsText[0].style.visibility="visible";
  paraGraphsText[0].style.fontSize="20";
}
//=============================================================
function toggleImageClass(elementBase,smallClass,largeClass){
  var checkClassName=elementBase.className;
  if (checkClassName == smallClass) {
    var useClass=largeClass;
  }
  else {
    var useClass=smallClass;
  }
//- do table class
  elementBase.className=useClass;
}
//=============================================================
function toggleAlbumPicture(elementBase,smallClass,largeClass){
  var smallClassTitle=smallClass+'title';
  var smallClassText=smallClass+'text';
  var largeClassTitle=largeClass+'title';
  var largeClassText=largeClass+'text';
//- which way do we go
  var checkClassName=elementBase.className;
  if (checkClassName == smallClass) {
    var useClassTitle=largeClassTitle;
    var useClassText=largeClassText;
    var useClass=largeClass;
    var imageBase=elementBase.getElementsByTagName('img')[0];
    var imagePath=imageBase.src;
    var newImagePath=imagePath.replace(/\/thumbnails/,"");
    imageBase.src=newImagePath;
  }
  else {
    var useClassTitle=smallClassTitle;
    var useClassText=smallClassText;
    var useClass=smallClass;
  }
//- do table class
  elementBase.className=useClass;
//- do title td className
  paraGraphsTitleTd=elementBase.rows[0].cells[0];
  paraGraphsTitleTd.className=useClassTitle;
//- do title p className
  paraGraphsTitle=elementBase.rows[0].cells[0].getElementsByTagName('p');
  paraGraphsTitle[0].className=useClassTitle;
//- do image className
  images=elementBase.rows[1].cells[0].getElementsByTagName('img');
  images[0].className=useClass;
//- do text p className
  paraGraphsText=elementBase.rows[2].cells[0].getElementsByTagName('p');
  paraGraphsText[0].className=useClassText;
}
//=============================================================
function togglePicture(elementBase,smallClass,largeClass){
//- which way do we go
	var checkClassName=elementBase.className;
//alert ('checkclassname: ' + checkClassName + ', small: ' + smallClass + ', large: ' + largeClass);
	var imageBase=elementBase.getElementsByTagName('img')[0];
	if (checkClassName == smallClass) {var useClass=largeClass;}
	else {var useClass=smallClass;}
//- do image className
	//images=elementBase.rows[1].cells[0].getElementsByTagName('img')
	elementBase.className=useClass;
}
//===============================================
function setCursorPointer(elementBase){
	elementBase.style.cursor='pointer';
}
//=============================================== 
function setMenuElementDisplay(menuName, callingMenuName, menuElementNo){
//- menu name and menu id have to be the same!!!
//- menu must be vertical, calling must be horizontal
//-----------------1) turn off calling menu element last selected
	var callingMenuClass=menuAry[callingMenuName]['menuclass'];
	var lastMenuElementNo=menuAry[callingMenuName]['lastmenuelementno'];
	var elementBase=document.getElementById(callingMenuName);
	if (callingMenuClass != ''){
		elementBase.rows[0].cells[lastMenuElementNo].getElementsByTagName('p')[0].className=callingMenuClass;
	}
//---------------- 2) turn on calling menu element selected
	var callingMenuSelectedClass=menuAry[callingMenuName]['menuselectedclass'];
	if (callingMenuSelectedClass != ''){
		elementBase.rows[0].cells[menuElementNo].getElementsByTagName('p')[0].className=callingMenuSelectedClass;
	}
	menuAry[callingMenuName]['lastmenuelementno']=menuElementNo;
//================ now show/hide menu of pictures
//---------------- 3) hide menu element last selected
	var menuNonSelectedClass=menuAry[menuName]['menunonselectedclass'];
	var elementBase=document.getElementById(menuName);
	if (menuNonSelectedClass != ''){
//var dmytest=elementBase.rows[lastMenuElementNo].innerHTML;
//alert (dmytest);
		elementBase.rows[lastMenuElementNo].getElementsByTagName('td')[0].className=menuNonSelectedClass;
//var dmytest=elementBase.rows[lastMenuElementNo].cells[0].innerHTML;
//alert (dmytest);
	}
//-----------------4) show menu element selected
	var menuSelectedClass=menuAry[menuName]['menuselectedclass'];
	elementBase.rows[menuElementNo].getElementsByTagName('td')[0].className='"'+menuSelectedClass+'"';
} 
//===================================================
function displayDayNote(base, calendarName){
	var title=base.innerHTML;
	var message=calendarAry[calendarName][title];
	alert (title + ': ' + message);
}
//===================================================xxxd
function setPictureDisplay(albumName,pictureNo,imageId,imageTitleId,imageCaptionId){
  //alert(albumName + ', ' + pictureNo + ', ' + imageId + ', ' + imageTitleId +  ', ' + imageCaptionId);
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
}
//===================================================xxxd
function setPictureDisplayV2(albumName,pictureNo,allId,imageId,imageTitleId,imageCaptionId,menuName){
  //alert(albumName + ', ' + pictureNo + ', ' + imageId + ', ' + imageTitleId + ', ' + imageCaptionId);
	//alert ('pictureno: '+pictureNo);//xxxd
	var mediaType=albumsAry[albumName]['mediatypeary'][pictureNo];
	//alert ('albumname: '+albumName+', mediatype: '+mediaType+', pictureno: '+pictureNo);//xxxd
	var MenuObjectId=menuAry[menuName]['menuobjectid'];
	var MenuObjectIdDiv=MenuObjectId+'div';
	var menuPictureId=menuAry[menuName]['menupictureid'];
	var menuPictureIdDiv=menuPictureId+'div';
	var menuParamId=menuAry[menuName]['menuparamid'];
	var menuEmbedId=menuAry[menuName]['menuembedid'];
	var menuId=menuAry[menuName]['menuid'];
	var menuTitleId=menuAry[menuName]['menutitleid'];
	var menuTextId=menuAry[menuName]['menutextid'];
	try {document.getElementById(menuId).style.visibility='visible';}
	catch (err){alert ('menid: '+menuId+' is an invalid id');}
	if (mediaType != 'youtube'){
		//- hide and blow away object
		try {document.getElementById(MenuObjectIdDiv).style.visibility='hidden';}
		catch (err){alert ('menuobjectid: '+MenuObjectIdDiv+' is an invalid id');}
		//- unhide picture
		try {document.getElementById(menuPictureIdDiv).style.visibility='visible';}
		catch (err){alert ('menupictureid: '+menuPictureIdDiv+' is an invalid id');}
//xxxd ??? - why do I have to make title and text visible?
		try {document.getElementById(menuTitleId).style.visibility='visible';}
		catch (err){alert ('menutitleid: '+menuTitleId+' is an invalid id');}
		try {document.getElementById(menuTextId).style.visibility='visible';}
		catch (err){alert ('menutextid: '+menuTextId+' is an invalid id');}
		//- load in picture source
		var pictureSource=albumsAry[albumName]['picturesrcary'][pictureNo];
		try {document.getElementById(menuPictureId).src=pictureSource;}
		catch (err){alert ('menupictureid: '+menuPictureId+' is invalid');}
	}
	else {
		try {document.getElementById(MenuObjectIdDiv).style.visibility='visible';}
		catch (err){alert ('menuobjectidDiv: '+MenuObjectIdDiv+' is invalid');}
		document.getElementById(menuPictureIdDiv).style.visibility='hidden';
		var videoId=albumsAry[albumName]['videoidary'][pictureNo];
		var videoWidth=menuAry[menuName]['videowidth'];
		var videoHeight=menuAry[menuName]['videoheight'];
		//alert ('videoid: '+videoId+', w: '+videoWidth+', h: '+videoHeight);
		var urlLocation1='http://www.youtube.com/v/';
		var urlLocation2='?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=1&fs=1';
		var urlLocation=urlLocation1 + videoId + urlLocation2;
		//- object param
		try {document.getElementById(menuParamId).value=urlLocation;}
		catch (err){alert ('menuary.menuparamid '+menuParamId+' is invalid');}
		//- embed source
		try {document.getElementById(menuEmbedId).src=urlLocation;}
		catch (err){alert ('menuary.menuembedid '+menuEmbedId+' is invalid');}
		//- embed width/height 
		try {document.getElementById(menuEmbedId).style.width=videoWidth;}
		catch (err){alert ('menuary.menuembedid '+menuEmbedId+' is invalid');}
		try {document.getElementById(menuEmbedId).style.height=videoHeight;}
		catch (err){alert ('menuary.menuembedid '+menuEmbedId+'is invalid');}
	}
	var pictureTitle=albumsAry[albumName]['picturetitlesary'][pictureNo];
	var pictureCaption=albumsAry[albumName]['picturecaptionsary'][pictureNo];
	//alert ('pctsrc: '+pictureSource);//xxxd
	var menuTitleId=menuAry[menuName]['menutitleid'];
	try {document.getElementById(menuTitleId).innerHTML=pictureTitle;}
	catch (err){alert ('menutitleid: '+menuTitleId+' is invalid');}
	var menuTextId=menuAry[menuName]['menutextid'];
	try{document.getElementById(menuTextId).innerHTML=pictureCaption;}
	catch (err){alert ('menuTextId: '+menuTextId+' is invalid');}
}
//=====================================================xxxd
function writeMenuToId(menuName,idName){
	var menuBody=wholeMenuAry[menuName];
	theLocation=document.getElementById(idName);
	theLocation.innerHTML=menuBody;
}
//=====================================================xxxd
function writeContainerToId(containerName,idName){
	var containerBody=containerAry[containerName];
	theLocation=document.getElementById(idName);
	theLocation.innerHTML=containerBody;
}
//========================================================
function runAjax(jobName,containerName,theMethod,idName){
//- if container[containername] exists, else get it through ajax connection
	//alert ('xxxcontainername: '+containerName);//xxxd
	var insertHtml=containerAry[containerName];
	//alert ('xxx2');
	if (!(insertHtml == undefined)){
	//--- put it in
		//alert ('just plug it in');
		$(idName).innerHTML=insertHtml;
	}
	else {
		//alert ('do ajax for container: '+containerName);
		doRunAjax(jobName,containerName,theMethod,idName);
	}
}
//========================================================
function doRunAjax(jobName,containerName,theMethod,idName){
	//alert ('call ajax: jobname: '+jobName+', containerName: '+containerName+', idname: '+idName);//xxxd
	var ajaxDelim='~';
	var noItems=0;
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
	var ctr=0;
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl+'/index.php?job='+jobName+'&container='+containerName+'&nowsecs='+secs;
	//old: var url='/index.php?job='+jobName+'&container='+containerName+'&nowsecs='+secs;
	var tst=0;
	//alert ('xxx1');
	//--- do ajax because null
	new Ajax.Request(url, {
	   method: 'get',
	   onSuccess: function(transport){
	   		//alert ('xxx0');
	   	  var doTableAryCreate=true;
   	   	  var response_raw = transport.responseText || "no response text";
   	   	  //alert ('dorunajax: response: '+response_raw);//xxxd
   	  	  var responseAry=response_raw.split(String.fromCharCode(10));
   	  	  var mainCnt=responseAry.length;
   	  	  //alert ('xxxmaincnt: ' + mainCnt);//xxx
  	   	  for (var mainLp=0;mainLp<mainCnt;mainLp++){
  	   	  	//document.write(mainLp);//xxx
  	   	  	responseLine=responseAry[mainLp];
  	   	  	//document.write(mainLp + ', ' + responseLine);//xxx
  	   	  	//alert (mainLp +') xxx1responseline: ' + responseLine);
  	   	  	subStr=responseLine.match('!!');
	   	  	if (subStr != null){
	   	  		atEnd=false;atMenus=false;atTables=false;atForms=false;atHtml=false;
	   	  		if (responseLine.match('!!table!!') != null){atTables=true;}
	   	  		else if (responseLine.match('!!form!!') != null){atForms=true;}
	   	  		else if (responseLine.match('!!menus!!') != null){atMenus=true;}
	   	  		else if (responseLine.match('!!wholemenu!!') != null){atWholeMenus=true;}
	   	  	}
	   	  	else {
	   	  		responseLineAry=responseLine.split('|');
	  			responseLineNo=responseLineAry.length;
	  			//alert ('xxx1.11');//last spot to see
	   	  		if (atHtml){insertHtml=insertHtml.concat(responseLine);}
//------- tables	   	
	   	  		else if (atTables){
	   	  			if (responseLineAry[0]=='tablename'){tableName=responseLineAry[1];}
	   	  			if (responseLineAry[0]=='tableAry'){
	   	  				tableAry[tableName]['displayary'][dataAry.length] = new Array(responseLineAry[1]);
	   	  			}
	   	  			if (responseLineAry[0]=='dataary'){
	   	  				tableAry[tableName]['dataary'][dataAry.length] = new Array(responseLineAry[1]);
	   	  			}
	   	  			else if (responseLineAry[0]=='pageNo'){tableAry[tableName]['etc']['pageno']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='columnCnt'){tableAry[tableName]['etc']['columncnt']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='pageSize'){tableAry[tableName]['etc']['pagesize']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='tableId'){tableAry[tableName]['etc']['tableid']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='maxDataAry'){tableAry[tableName]['etc']['maxdataary']=responseLineAry[1];}
	   	  			else {null;}
	   	  			//document.write('end all elses');//xxx
	   	  		}
	   	  		else if (atForms){atFormsAry.push(responseLine);}
	   	  		else if (atMenus){
	   	  			//xxxd
	   	  			//vl=prompt('dorunajax: '+responseLine,'x');if (vl=='x'){exit();}
					if (responseLineAry[0]=='init'){
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=Array();
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]][responseLineAry[2]]=Array();
						}
						if (responseLineNo==2){
							menuAry[responseLineAry[1]]=Array();
						}
					}
					if (responseLineAry[0]=='set'){
						//xxxf - in old stuff etchash is still etc
						if (responseLineAry[2]=='etchash'){responseLineAry[2]='etc';}
						if (responseLineNo==6){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]]=responseLineAry[5];
						}
						if (responseLineNo==5){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=responseLineAry[4];
						}
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]]=responseLineAry[3];
							//alert(responseLineAry[1]+'===='+responseLineAry[2]+'===='+responseLineAry[3]);//xxx
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]]=responseLineAry[2];
						}
					}
					if (responseLineAry[0]=='initset'){
						if (responseLineNo==6){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]]= Array();
							var workAry=responseLineAry[5].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==5){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=Array();
							var workAry=responseLineAry[4].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]]=Array();
							var workAry=responseLineAry[3].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]]=Array();
							var workAry=responseLineAry[2].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][lp]=workAry[lp];
							}
						}
					}
	   	  		}
	   	  		else if (atWholeMenus){atWholeMenusAry.push(responseLine);}
	   	  		else {alert ('no ifelse spot');};
		  	}
		 }
  	   	  alert ('idname: '+idName+' innerhtml: '+insertHtml);//xxxf
  	  	 $(idName).innerHTML=insertHtml;
   	  	 containerAry[containerName]=insertHtml;
 	   },
	   onFailure: function(){ alert('Something went wrong...') ;}
	});
}	
//========================================================
function postAjax(jobName,operationName,formId){
	var noItems=0;
	var responseLine = "";
	var responseLineNo = 0;
	var subStr = "";
	var insertHtml = "";
	var ctr=0;
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var url='/index.php?job='+jobName+'&container=none&nowsecs='+secs;
	new Ajax.Request(url, {
	   method: 'post',
	   parameters: $(formId).serialize(true),
	   onSuccess: function(transport){
   	   	  var response_raw = transport.responseText || "!!end!!";
   	   	  alert (response_raw);
   	   	  $(formId).reset();
 	   },
	   onFailure: function(){ alert('Something went wrong...'); }
	});
}	
//============================================================
function setSelectedClass(menuName,menuElementNo){
	//alert ('menuname: '+menuName+', menuelementno: '+menuElementNo);//xxxd
	var menuSelectedClass=menuAry[menuName]['menuselectedclass'];
	//alert ('sc: ' +menuSelectedClass+' for menu '+menuName);//xxx
	var menuNonSelectedClass=menuAry[menuName]['menuclass'];
	var lastMenuElementNo=menuAry[menuName]['lastmenuelementno'];
	if (lastMenuElementNo == undefined){lastMenuElementNo=0;}
	var menuId=menuAry[menuName]['menuid'];
	elementBase=$(menuId).getElementsByTagName('a')[menuElementNo];
	elementBase.className=menuSelectedClass;
	if (menuElementNo != lastMenuElementNo){
		//elementBase=$(menuId).rows[0].cells[lastMenuElementNo].getElementsByTagName('a')[0];
		elementBase=$(menuId).getElementsByTagName('a')[lastMenuElementNo];
		//elementBase.className=menuNonSelectedClass;
		//alert(elementBase.innerHTML);
		try {elementBase.className=menuNonSelectedClass;}
		catch (err){alert ('general.js.setSelectedClass: elementbase using menuid: '+menuId+', lastmenuelementno: '+lastMenuElementNo+' is invalid');}
	}
	menuAry[menuName]['lastmenuelementno']=menuElementNo;
}
//========================================================
function runAjaxV2(jobName,containerName,theMethod,idName){
//- if container[containername] exists, else get it through ajax connection
	var insertHtml=containerAry[containerName];
	//insertHtml=undefined;//xxxf
	if (!(insertHtml == undefined)){
	//--- put it in, but only if the spot is empty
		var tst=$(idName).innerHTML;
		var tstLen=tst.length;
//- even if it is null(emptied out) it still has a length of 4 and null or '' dont work?
		if (tstLen<10){
			$(idName).innerHTML=insertHtml;
		}
	}
	else {
		doRunAjaxV2(jobName,containerName,theMethod,idName);
	}
}
//========================================================
function doRunAjaxV2(jobName,containerName,theMethod,idName){
	//alert ('xxx1');
	var ajaxDelim='~';
	var noItems=0;
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
	var ctr=0;
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
	var baseUrlHost=location.hostname;
	var baseUrlPath=location.pathname;
	var baseUrl=baseUrlHost+baseUrlPath;
	var url='http://'+baseUrl+'/index.php?job='+jobName+'&container='+containerName+'&nowsecs='+secs;
	//alert (url);//xxxf
	var tst=0;
	new Ajax.Request(url, {
	   method: 'get',
	   onSuccess: function(transport){
	   	  var doTableAryCreate=true;
   	   	  var response_raw = transport.responseText || "no response text";
   	   	  //alert ('dorunajaxv2: response: '+response_raw);//xxxd
   	  	  var responseAry=response_raw.split(String.fromCharCode(10));
   	  	  var mainCnt=responseAry.length;
   	   	  for (var mainLp=0;mainLp<mainCnt;mainLp++){
    	   	  	responseLine=responseAry[mainLp];
   	   	  	subStr=responseLine.match('!!');
	   	  	if (subStr != null){
	   	  		atEnd=false;atMenus=false;atTables=false;atForms=false;atHtml=false;
	   	  		if (responseLine.match('!!table!!') != null){atTables=true;}
	   	  		else if (responseLine.match('!!form!!') != null){atForms=true;}
	   	  		else if (responseLine.match('!!menus!!') != null){atMenus=true;}
	   	  		else if (responseLine.match('!!wholemenu!!') != null){atWholeMenus=true;}
	   	  		else if (responseLine.match('!!html!!') != null){atHtml=true;}
	   	  	}
	   	  	else {
	   	  		responseLineAry=responseLine.split('|');
	  			responseLineNo=responseLineAry.length;
	  			//alert ('xxx1.11');//last spot to see
	  			//document.write(responseLine);//xxx
	   	  		if (atHtml){insertHtml=insertHtml.concat(responseLine);}
//------- tables	   	
	   	  		else if (atTables){
	   	  			//alert ('responseline: '+responseLine);//xxx
	   	  			if (responseLineAry[0]=='tablename'){tableName=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='dbtablename'){tableAry[tableName]['etc']['dbtablename']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='displayary'){
	   	  				var thisResponseLineAry=responseLineAry[1].split('~');
	   	  				tableAry[tableName]['displayary'][tableAry[tableName]['displayary'].length] = thisResponseLineAry;
	   	  			}
	   	  			else if (responseLineAry[0]=='selectary'){
	   	  				tableAry[tableName]['selectary'][tableAry[tableName]['selectary'].length] = responseLineAry[1];
	   	  			}
	   	  			else if (responseLineAry[0]=='dataary'){
	   	  				var thisResponseLineAry=responseLineAry[1].split('~');
	   	  				tableAry[tableName]['dataary'][tableAry[tableName]['dataary'].length] = thisResponseLineAry;
	   	  			}
	   	  			else if (responseLineAry[0]=='pageno'){tableAry[tableName]['etc']['pageno']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='columncnt'){tableAry[tableName]['etc']['columncnt']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='pagesize'){tableAry[tableName]['etc']['pagesize']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='tableid'){tableAry[tableName]['etc']['tableid']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='maxdataary'){tableAry[tableName]['etc']['maxdataary']=responseLineAry[1];}
	   	  			else if (responseLineAry[0]=='datadef'){
	   	  				tableAry[tableName]['etc']['datadef']=responseLineAry[1];
	   	  			}
	   	  			else if (responseLineAry[0]=='tabledef'){tableAry[tableName]['etc']['tabledef']=responseLineAry[1];}
	   	  		}
//-------- forms
	   	  		else if (atForms){atFormsAry.push(responseLine);}
//-------- menus	   	
	   	  		else if (atMenus){
	   	  			//xxxd
	   	  			//vl=prompt('dorunajaxv2: '+responseLine,'x');if (vl=='x'){exit();}
					if (responseLineAry[0]=='init'){
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=Array();
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]][responseLineAry[2]]=Array();
						}
						if (responseLineNo==2){
							menuAry[responseLineAry[1]]=Array();
						}
					}
					if (responseLineAry[0]=='set'){
						if (responseLineNo==6){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]]=responseLineAry[5];
						}
						if (responseLineNo==5){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=responseLineAry[4];
						}
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]]=responseLineAry[3];
							//alert(responseLineAry[1]+'===='+responseLineAry[2]+'===='+responseLineAry[3]);//xxx
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]]=responseLineAry[2];
						}
					}
					if (responseLineAry[0]=='initset'){
						if (responseLineNo==6){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]]= Array();
							var workAry=responseLineAry[5].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][responseLineAry[4]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==5){
							menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]]=Array();
							var workAry=responseLineAry[4].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][responseLineAry[3]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==4){
							menuAry[responseLineAry[1]][responseLineAry[2]]=Array();
							var workAry=responseLineAry[3].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][responseLineAry[2]][lp]=workAry[lp];
							}
						}
						if (responseLineNo==3){
							menuAry[responseLineAry[1]]=Array();
							var workAry=responseLineAry[2].split(ajaxDelim);
							var theCnt=workAry.length;
							for (var lp=0;lp<theCnt;lp++){
								menuAry[responseLineAry[1]][lp]=workAry[lp];
							}
						}
					}
	   	  		}
//------- whole menus	   	 
	   	  		else if (atWholeMenus){atWholeMenusAry.push(responseLine);}
	   	  		else {
	   	  			responseLine=responseLine.strip();
	   	  			if (responseLine != ''){alert ('no ifelse spot: line: _'+responseLine+'_');};
	   	  		}
		  	}
		 }
   	  	 $(idName).innerHTML=insertHtml;
   	  	 containerAry[containerName]=insertHtml;
   	   },
	   onFailure: function(){ alert('Something went wrong...'); }
	});
}	
//================================
function pagePreviousV3(tableName){
	var pageNo=tableAry[tableName]['etc']['pageno'];
	pageNo--;
	if (pageNo<1){pageNo=1;}
	tableAry[tableName]['etc']['pageno']=pageNo;
	displayPageV3(tableName);
}
//================================
function pageNextV3(tableName){
	var pageNo=tableAry[tableName]['etc']['pageno'];
	pageNo++;
	tableAry[tableName]['etc']['pageno']=pageNo;
	//alert ('pageno: '+pageNo);//xxx
	displayPageV3(tableName);
}
//================================
function pageFirstV3(tableName){
	var pageNo=1;
	tableAry[tableName]['etc']['pageno']=pageNo;
	displayPageV3(tableName);
}
//================================
function pageLastV3(tableName){
	var pageNo=Math.round(maxDataAry / pageSize)+2;
	tableAry[tableName]['etc']['pageno']=pageNo;
	displayPageV3(tableName);
}
//================================
function displayPageV3(tableName){
	var pageNo=Number(tableAry[tableName]['etc']['pageno']);
	var	pageSize=Number(tableAry[tableName]['etc']['pagesize']);
	var columnCnt=Number(tableAry[tableName]['etc']['columncnt']);
	var tableId=tableAry[tableName]['etc']['tableid'];
	//alert ('tablename: ' + tableName+', tableid: '+tableId+', pageno: '+pageNo);//xxx
	if (pageNo < 1){pageNo=1;}
	pageDmyAdj=pageNo-1;
	//- below concatenates, not adds
	pageSizeDmyAdj=pageSize+1;
	var startAryRow = (pageDmyAdj * pageSizeDmyAdj);
	//alert ('startaryrow: '+startAryRow+', pagedmyadj: '+pageDmyAdj+', pagesizedmyadj: '+pageSizeDmyAdj);
	if (startAryRow > maxDataAry){
		pageNo--;
		startAryRow = (pageNo-1) * (pageSize);
	}
	var rowCtr, columnCtr;
	//- why do we have to do the below? - it was blowing up on the extra row
	var adjPageSize = pageSize+1;
	var reducedAry=tableAry[tableName]['reducedary'];
	if (reducedAry==undefined || reducedAry==''){
		reducedAry=tableAry[tableName]['displayary'];
		tableAry[tableName]['reducedary']=reducedAry;
	}
	//useDataAry is incorrect
	maxDataAry=reducedAry.length;
	//alert ('adjpagesize: '+adjPageSize+', maxdataary: '+maxDataAry+', reducedary: '+reducedAry+', tablename: '+tableName);//xxx
	for (rowCtr=0;rowCtr<adjPageSize;rowCtr++){
		var curAryRowCtr=startAryRow+rowCtr;
		if (curAryRowCtr < maxDataAry){
			//aborts below because tableid is null
			if (tableId == ''){document.write('null tableid: processing bypassed');}
			else {
				//alert ('tableid: '+tableId+', rowctr: '+rowCtr);//xxx
				//alert ($(tableId));//xxx
				var rowAccess=$(tableId).rows[rowCtr].cells;
				for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
					var newData=reducedAry[curAryRowCtr][columnCtr];
					rowAccess[columnCtr].innerHTML=newData;
				}
			}
		}
		else {
		//error below
			var rowAccess=$(tableId).rows[rowCtr].cells;
			for (columnCtr = 0;columnCtr<columnCnt;columnCtr++){
				rowAccess[columnCtr].innerHTML='&nbsp;';
			}
		}		
	}
}
//================================
function pageSelectV3(tableName,nameString){
	var selectAry=tableAry[tableName]['selectary'];
	var selectString = $(nameString).value;
	var selectString_lower = selectString.toLowerCase();
	var selectStringLen = selectString.length;
	var posCtr, posCtr2;
	var chkData, chkData_lower, chkChar, dataCtr, maxDataAryBak;
	var lineNo = 0;
	var displayAry=tableAry[tableName]['displayary'];
	var reducedAry = new Array();
	var maxDataAry=dataAry.length;
	if (selectString == ''){reducedAry=displayAry;}
	else {
		for (dataCtr=0;dataCtr<maxDataAry;dataCtr++){
			chkData=selectAry[dataCtr];
			chkData_lower=chkData.toLowerCase();
			//vl=prompt(selectString_lower,'x');if (vl=='x'){exit();}
			posCtr=chkData_lower.indexOf(selectString_lower);
			if (posCtr>-1 || dataCtr == 0 ){
				reducedAry[reducedAry.length]=displayAry[dataCtr];
			}	
		}
	}
	lineNo=1;
	maxDataAry=reducedAry.length;
	pageNo=Math.round(lineNo / pageSize);
	tableAry[tableName]['reducedary']=reducedAry;
	displayPageV3(tableName);
}
//=================================
function fileForm(tableName,containerId,iconMenuId,iconMenuAlertClass){
//--- get datadefs
	var dataDef=tableAry[tableName]['etc']['datadef'];
	var dataDefAry=dataDef.split('~');
	//alert ('datadefary: '+dataDef);//xxx
//--- get tabledefs
	var tableDef=tableAry[tableName]['etc']['tabledef'];
	var tableDefAry=tableDef.split('~');
//--- get rowno
	var tableRowNo=tableAry[tableName]['etc']['tablerowno'];
//--- update dataary
	var dataCnt=dataDefAry.length;
	var dataRowAry=new Array();
	for (var lp=0;lp<dataCnt;lp++){
		var dataId=dataDefAry[lp];
		var dataValue=$(dataId).value;
		dataRowAry[dataRowAry.length]=dataValue;
	}
	tableAry[tableName]['dataary'][tableRowNo]=dataRowAry;
//--- update tableary
//- adjust rowno for the 1st line heading
	var tableRowAry=tableAry[tableName]['displayary'][tableRowNo+1];
	var oldDataRowAry=tableAry[tableName]['olddatarowary'];
	var tableCnt=tableDefAry.length;
	//alert ('xxx1 dataId: '+dataId);
	for (var lp=0;lp<tableCnt;lp++){
		var dataId=tableDefAry[lp];
		var dataValue=$(dataId).value;
		var oldDataValue=oldDataRowAry[dataId];
		if (oldDataValue==''){oldDataValue='&nbsp;';}
		tableRowAry[lp]=tableRowAry[lp].replace(oldDataValue,dataValue);
	}
	//alert ('xxx2')
//--- adjust rowno for the 1st row description
	tableAry[tableName]['displayary'][tableRowNo+1]=tableRowAry;
	displayPageV3(tableName);
//--- change class of menu icon
	$(iconMenuId).className=iconMenuAlertClass;
//--- mark datarow as being updated
	var dataUpdateAry=tableAry[tableName]['dataupdateary'];
	if (dataUpdateAry==undefined){dataUpdateAry=new Array();}
	dataUpdateAry[tableRowNo]=tableRowNo;
	alert ('xxx2.5');
	tableAry[tableName]['dataupdateary']=dataUpdateAry;
	tableAry[tableName]['etc']['writetoserver']=true;
//--- make form invisible
	$(containerId).style.visibility="hidden";
	alert ('xxx3');
}
//=================================
function setupForm(tableRowNo,tableName,containerId){
	//alert ('tablerowno: '+tableRowNo+', tablename: '+tableName+', containerId; '+containerId);
//- update tablerowno
	tableAry[tableName]['etc']['tablerowno']=tableRowNo;
//- get datadefs
	var dataDef=tableAry[tableName]['etc']['datadef'];
	//alert ('datadef: '+dataDef);
	var dataDefAry=dataDef.split('~');
//- get datarow
	var dataRowAry=tableAry[tableName]['dataary'][tableRowNo];
	var oldDataRowAry=new Array();
//- load datarow into datadefs
	var dataCnt=dataDefAry.length;
	for (var lp=0;lp<dataCnt;lp++){
		var dataId=dataDefAry[lp];
		var dataValue=dataRowAry[lp];
		//alert (lp+') dataid: '+dataId+', datavalue: '+dataValue);//xxx
		$(dataId).value=dataValue;
		//alert ('dataid: '+dataId+': '+$(dataId).value);//xxx
		oldDataRowAry[dataId]=dataValue;
	}
	var theLen=oldDataRowAry.length;
	tableAry[tableName]['olddatarowary']=oldDataRowAry;
	//alert ('unhide container: '+containerId);//xxx
	//alert ($(containerId).innerHTML);
	$(containerId).style.zIndex=0;
	$(containerId).style.visibility="visible";
}
//=================================
function exitForm(containerId){
	//alert ('hide container: '+containerId);//xxx
	$(containerId).style.visibility="hidden";
}//==================================
function clearId(containerId){
	$(containerId).innerHTML=null;
}
//===================================
function writeDbToServer(jobName,tableName,menuId,resetClassName){
	var operationName='write_db_from_ajax';
	var sendDataAry=new Array();
//--- get dbtablename
	var dbTableName=tableAry[tableName]['etc']['dbtablename'];
	sendDataAry[0]='dbtablename|'+dbTableName;
//--- get column titles
	var dataDef=tableAry[tableName]['etc']['datadef'];
	sendDataAry[1]='datadef|'+dataDef;
//--- get column data
	var dataUpdateAry=tableAry[tableName]['dataupdateary'];
	if (dataUpdateAry==undefined){dataUpdateAry=new Array();}
	dataUpdateAry.each(function(rowNo) {
		if (rowNo != undefined){
			var updateRowAry=tableAry[tableName]['dataary'][rowNo];
			updateRow=updateRowAry.join('~');
			sendDataAry[sendDataAry.length]='tabledata|'+updateRow;
		} 
	}); 
	//dataUpdateAry[tableRowNo]=true;
	//- put iconmenuid, inconmenualert, inconmenu into table/etc and use them
	doRunAjaxPost(jobName,operationName,tableName,menuId,resetClassName,sendDataAry);
}
//========================================================
function doRunAjaxPost(jobName,operationName,tableName,menuId,resetClassName,sendDataAry){
//--- init setup
	var ajaxFieldDelim='~';
	var ajaxLineDelim='`';
	var ajaxSubLineDelim='|';
	var url=serverUrl+'index.php';
	var containerName="none";
	var dateObj=new Date();
	var secs=dateObj.getSeconds();
//--- get data to send and make it a string
	var sendData=sendDataAry.join(ajaxLineDelim);
	//alert(sendData);//xxx
	new Ajax.Request(url, {
	   method: 'post',
	   onSuccess: function(transport){
	   	var response_raw = transport.responseText || "no response text";
	   	var responseAry=response_raw.split(ajaxSubLineDelim);
	   	var errorKey=responseAry[0];
	   	var errorMsg=responseAry[1];
	   	if (errorKey == 'ok'){
	   		//- erase update
	   		var dataUpdateAry=new Array();
			tableAry[tableName]['dataupdateary']=dataUpdateAry;
	   	}
	   	alert (errorMsg);
	   	this.className=resetClassName;
	   },
	   parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
	   onFailure: function(){ alert('Something went wrong...'); }
	});
}	
//========================================================
	function doSimpleAjaxPost(formName,jobName,operationName,tableName,sendDataAry){
//--- init setup
		var containerName='';
		var ajaxFieldDelim='~';
		var ajaxLineDelim='`';
		var ajaxSubLineDelim='|';
		var url=serverUrl+'/index.php';
		var containerName="none";
		var dateObj=new Date();
		var secs=dateObj.getSeconds();
//--- get data to send and make it a string
		var sendData=sendDataAry.join(ajaxLineDelim);
		//alert (sendData);
		new Ajax.Request(url, {
	   		method: 'post',
	   		onSuccess: function(transport){
	   			var response_raw = transport.responseText || "no response text";
	   			var responseAry=response_raw.split(ajaxSubLineDelim);
	   			var errorKey=responseAry[0];
	   			var errorMsg=responseAry[1];
	   			alert (errorKey+', '+errorMsg);
					if (errorKey=='ok'){alert ('-message received-');}
					//- need to clear out form fields here
					FormObj.clearFormFields(formName);
	   		},
	   		parameters: {'job': jobName, 'operation': operationName, 'container': containerName, 'senddata': sendData},
	   		onFailure: function(){ alert('Something went wrong...'); }
		});
	}

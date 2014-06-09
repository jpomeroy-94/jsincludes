var FormObject = Class.create({
//--- initialize
	initialize: function() {
		this.formFragmentAry = new Array();
		this.formAry = new Array();
	},
//--------------------------------------------------
	addFragment: function(fragName,formFragment){
		this.formMenuObjFragmentAry[fragName]=formFragment;
	},
//--------------------------------------------------
	setOptionXrefForm: function(formName){
		if (this.formAry[formName]==undefined){this.formAry[formName]=new Array();}
		this.formAry[formName]['formoptionxrefary']=new Array();
	},
//------------------------------------------------
	addOptionXref: function(formName,optionValue,formXrefValue){
		this.formAry[formName]['formoptionxrefary'][optionValue]=formXrefValue;
	},
//--------------------------------------------------
	loadFragment: function(theValue,formName,containerId) {
		base=$(containerId);
		var fragName=this.formAry[formName]['formoptionxrefary'][theValue];
		if (fragName != undefined){
			var formFragment=this.formFragmentAry[fragName];
			if (formFragment != undefined){
				var testStuff=base.innerHTML;
				base.innerHTML=formFragment;
			}
			else {alert ('form fragment: '+fragName+' is not on file, but xref is from '+theValue);}
		}
		else {alert ('fragment xref value for '+theValue+' is not on file!');}
	},
//-------------------------------------------------
	loadFormSetups: function(formName,dataDefs,displayDefs){
		if (this.formAry[formName]==undefined){this.formAry[formName]=new Array();}
		if (this.formAry[formName]['etc']==undefined){this.formAry[formName]['etc']=new Array();}
		this.formAry[formName]['etc']['datadefs']=dataDefs;
		this.formAry[formName]['etc']['displaydefs']=displayDefs;
		this.formAry[formName]['etc']['sendtoserver']=false;
		if (this.formAry[formName]['formdataary']==undefined){this.formAry[formName]['formdataary']=new Array();}	
		if (this.formAry[formName]['sendtoserverary']==undefined){this.formAry[formName]['sendtoserverary']=new Array();}	
	},
//-------------------------------------------------
	startForm: function(formName,dataPairs){
		var dataDefPairsAry=dataPairs.split('~');
		var dataCnt=dataDefPairsAry.length;
		var dataRowAry=new Array();
		for (var lp=0;lp<dataCnt;lp++){
			var dataId=dataDefAry[lp];
			var dataValue=$(dataId).value;
			dataRowAry[dataRowAry.length]=dataValue;
		}
	},
//-------------------------------------------------below is not workable - not being run
//- displayName - calendarName, tableName
	fileForm: function(formName,displayType,containerId,iconMenuId,iconMenuAlertClass){
		//--- get datadefs
		var dataDef=this.formGeneralAry[formName]['etc']['datadef'];
		var dataDefAry=dataDef.split('~');
	//--- get tabledefs
		var displayDef=this.formGeneralAry[formName]['etc']['displaydef'];
		var displayDefAry=displayDef.split('~');
	//--- update dataary
		var dataCnt=dataDefAry.length;
		var dataRowAry=new Array();
		for (var lp=0;lp<dataCnt;lp++){
			var dataId=dataDefAry[lp];
			var dataValue=$(dataId).value;
			dataRowAry[dataRowAry.length]=dataValue;
		}
		if (displayType=='table'){
			TableObj.updateRow(dataRowAry);
		}
		else if (displayType=='calendar'){
			CalendarObj.updateDay(dataRowAry);
		}
	},
	//----------------------------------
	setupValidations: function(formName, colName, dbTableMetaNotNull, validateRegEx, validateKeyMap, validateErrorMsg){
		var tst=this.formAry[formName];
			if (tst==undefined){
				this.formAry[formName]=new Array();
				this.formAry[formName]['validateary']=new Array();
			}
			this.formAry[formName]['validateary'][colName]=new Array(dbTableMetaNotNull, validateRegEx, validateKeyMap, validateErrorMsg);
			var cnt=this.formAry[formName]['validateary'].length;
	},
	//--------------------------------- needs to be redone 
	validateInput: function(formName,validateName){
		var errorMsgName = validateName + '_errormsg';
		var loopLength = this.formAry[formName]['validateary'].length;
		for (var ctr = 0; ctr < loopLength; ctr++){
			checkName=this.formAry[formName]['validateary'][ctr][1];
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
	},
//--- test alert
	doAlert: function(dmyMsg){
		tst=this.formAry['basicform']['validateary'][dmyMsg][3];
		alert (tst);
	} 
}); 

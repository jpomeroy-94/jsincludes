var formObject = Class.create({
// 042813 writeForToServer writes dataIdSuffix to etc for validateForm to use
// 050513 runOperationV2 change formid|form name to formname|form name, same for jobname, operationname
//--- data structures
//this.formName
//this.formHash[this.formName]['etc']['dbtablename']    ... <database table name>
//									['dbcolumnnames']  ... col1~col2~col3
//									['dbcolumnids']    ... colid1~colid2~clid3
//									['regexs']		   ... regex1~regex2~regex3
//									['keymaps']        ... keymap1~keymap2~keymap3
//									['errormsgs']      ... errormsg1~errormsg2~errormsg3
//									['formcontainerid']... <form container id>
//									['html'] ... form html code
//									['datatypes'] ... datatype~datatype~datatype
// 							 ['formfields'][<columnname>]['regexs'] 	 ... regex
// 															['keymaps'] 	 ... keymap
//															['errormsgs'] ... errormsg
//															['id']		 ... id field
//															['value']	 ... value from table
//							 ['datatypesary']
//							 ['formerrormsgsary']
//							 ['formkeymapsary']
//							 ['formregexsary']
//							 ['validateHash']
//
//==============================================================
	initialize: function() {
		this.formFragmentAry = new Hash();
		this.formHash = new Hash();
	},
//==============================================================
	setFormName: function(formName){
		containerObj.jsDebug('formObj.setFormName('+formName+')');
		//alert ('set formname: '+formName);//xxx
		this.formName=formName;
		tst=this.formHash[this.formName];
		if (tst==undefined){
			this.formHash[this.formName]=new Hash();
		}
		tst=this.formHash[this.formName]['etc'];
		if (tst==undefined){
			this.formHash[this.formName]['etc']=new Hash();
		}
	},
//==============================================================
	setName: function(formName){this.setFormName(formName);},
//==============================================================
	loadEtc: function(etcName,etcValue){
		containerObj.jsDebug('formObj.loadEtc('+etcName+')');
		this.formHash[this.formName]['etc'].set(etcName,etcValue);
		//left off here
		//alert (etcName+': '+etcValue);//xxx
	},
//==============================================================
	setEtcValue: function(etcName,etcValue){
		containerObj.jsDebug('formObj.loadEtc('+etcName+')');
		this.formHash[this.formName]['etc'].set(etcName,etcValue);
		//left off here
		//alert (etcName+': '+etcValue);//xxx
	},
//=============================================================
	addFormHtml: function(tableId,tableRowNo,buttonValue){
		var formHtml=this.getEtcValue('html');
		var formHtml=formHtml.replace(/BUTTONVALUE/g,buttonValue);
		var formHtml=formHtml.replace(/NN/g,tableRowNo);
		$(tableId).rows[tableRowNo].insertCell(0).innerHTML=formHtml;
	},
//=============================================================
	addFormData: function(tableId,tableRowNo,formData){
		containerObj.jsDebug('formObj.addFormData(tableId,tableRowNo,dataHash');
		formName=this.formName;
		var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
		var formIdAry=formIdStrg.split('~');
		var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
		var formNameAry=formNameStrg.split('~');
//?		this.formHash[this.formName].unset('formfields');
//--- get validation
		var formRegExsAry = this.formHash[formName]['formregexsary'];
		if (formRegExsAry==undefined){
			var formRegExsStrg=this.formHash[this.formName]['etc'].get('regexs');
			var formRegExsAry=formRegExsStrg.split('~');
			this.formHash[formName]['formregexsary']=formRegExsAry;
		}
		var formKeyMapsAry=this.formHash[formName]['formkeymapsary'];
		if (formKeyMapsAry==undefined){
			var formKeyMapsStrg=this.formHash[this.formName]['etc'].get('keymaps');
			var formKeyMapsAry=formKeyMapsStrg.split('~');
			this.formHash[formName]['formkeymapsary']=formKeyMapsAry;
		}
		var formErrorMsgsAry=this.formHash[formName]['formerrormsgsary'];
		if (formErrorMsgsAry==undefined){
			var formErrorMsgsStrg=this.formHash[this.formName]['etc'].get('errormsgs');
			var formErrorMsgsAry=formErrorMsgsStrg.split('~');
			this.formHash[formName]['formerrormsgsary']=formErrorMsgsAry;
		}
		var dataTypesAry=this.formHash[formName]['datatypesary'];
		if (dataTypesAry==undefined){
			var dataTypesStrg=this.formHash[this.formName]['etc'].get('datatypes');
			var dataTypesAry=dataTypesStrg.split('~');
			this.formHash[formName]['datatypesary']=dataTypesAry;
		}
		var formFields=new Hash();
		var noCols=formIdAry.length;
		for (var lp=0;lp<noCols;lp++){
			var useId=formIdAry[lp].replace('NN',tableRowNo);
			var useName=formNameAry[lp];
			var useValue=formData.get(useName);
			if (useValue == undefined){useValue='';}
			var theBase=$(useId);
			if (theBase != null){
				var dataType=dataTypesAry[lp];
				if (dataType=='date' && useValue != ''){
					useValue=utilObj.convertDate(useValue,'dateconv1');
				}
				//- update the form dom
				theBase.value=useValue;
				var regEx=formRegExsAry[lp];
				var keyMap=formKeyMapsAry[lp];
				var errorMsg=formErrorMsgsAry[lp];
				formFields[useName]=new Hash();
				formFields[useName].set('regex',regEx);
				formFields[useName].set('keymap',keyMap);
				formFields[useName].set('errormsg',errorMsg);
				formFields[useName].set('id',useId);
				formFields[useName].set('value',useValue);
			}
		}
		//- save form fields
		this.formHash[this.formName]['formfields']=formFields;
	},
//=============================================================
	addFragment: function(fragName,formFragment){
		containerObj.jsDebug('formObj.addFragment('+fragName+',*formFragment*)');
		this.formFragmentAry.set(fragName,formFragment);
	},
//==============================================================
	setOptionXrefForm: function(formName){
		containerObj.jsDebug('formObj.setOptionXrefForm('+formName+')');
		if (this.formHash[formName]==undefined){this.formHash[formName]=new Hash();}
		this.formHash[formName]['formoptionxrefary']=new Array();
	},
//==============================================================
	addOptionXref: function(formName,optionValue,formXrefValue){
		containerObj.jsDebug('formObj.addOptionXref('+formName+','+optionValue+','+formXrefValue+')');
		this.formHash[formName]['formoptionxrefary'][optionValue]=formXrefValue;
	},
//==============================================================
	updateEtc: function(formName,etcName,etcValue){
		containerObj.jsDebug('formObj.updateEtc('+etcName+','+etcValue+')');
		if (this.formHash[formName]==undefined){this.formHash[formName]=new Hash();}
		if (this.formHash[formName]['etc']==undefined){this.formHash[formName]['etc']=new Hash();}
		this.formHash[formName]['etc'].set(etcName,etcValue);
	},
//==============================================================
	loadFragment: function(theValue,formName,containerId) {
		containerObj.jsDebug('formObj.loadFragment('+theValue+','+formName+','+containerId+')');
		base=$(containerId);
		var fragName=this.formHash[formName]['formoptionxrefary'][theValue];
		if (fragName != undefined){
			var formFragment=this.formFragmentAry.get(fragName);
			if (formFragment != undefined){
				var testStuff=base.innerHTML;
				base.innerHTML=formFragment;
			}
			else {alert ('form fragment: '+fragName+' is not on file, but xref is from '+theValue);}
		}
		else {alert ('fragment xref value for '+theValue+' is not on file!');}
	},
//==============================================================
	loadFormSetups: function(formName,dataDefs,displayDefs){
		containerObj.jsDebug('formObj.loadFOrmSetups('+formName+',*datadefs*,*displaydefs*)');
		if (this.formHash[formName]==undefined){this.formHash[formName]=new Hash();}
		if (this.formHash[formName]['etc']==undefined){this.formHash[formName]['etc']=new Hash();}
		this.formHash[formName]['etc'].set('datadefs',dataDefs);
		this.formHash[formName]['etc'].set('displaydefs',displayDefs);
		//alert (dataDefs+', '+displayDefs);
		this.formHash[formName]['etc'].set('sendtoserver',false);
		if (this.formHash[formName]['formdata']==undefined){this.formHash[formName]['formdata']=new Hash();}	
		if (this.formHash[formName]['sendtoserverary']==undefined){this.formHash[formName]['sendtoserverary']=new Array();}	
	},
//==============================================================
	loadFormSetupsV2deprecated: function(formName,dataDefNames,dataDefIds){
		containerObj.jsDebug('formObj.loadFOrmSetupsV2');
		if (this.formHash[formName]==undefined){this.formHash[formName]=new Hash();}
		if (this.formHash[formName]['etc']==undefined){this.formHash[formName]['etc']=new Hash();}
		this.formHash[formName]['etc'].set('datadefnames',dataDefNames);
		this.formHash[formName]['etc'].set('datadefids',dataDefIds);
		//alert ('did setup v2');//xxx
	},
//==============================================================
	openForm: function(formData){
		containerObj.jsDebug('formObj.openForm(*formData*');
		formName=this.formName;
		if (formData == undefined){var formData = new Hash();}
		//containerObj.displayAry(this.formHash[this.formName]['etc']);//xxx
		var containerId=this.formHash[this.formName]['etc'].get('formcontainerid');
		var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
		var formIdAry=formIdStrg.split('~');
		var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
		var formNameAry=formNameStrg.split('~');
		this.formHash[this.formName].unset('formfields');
//--- get validation
		var formRegExsAry = this.formHash[formName]['formregexsary'];
		if (formRegExsAry==undefined){
			var formRegExsStrg=this.formHash[this.formName]['etc'].get('regexs');
			var formRegExsAry=formRegExsStrg.split('~');
			this.formHash[formName]['formregexsary']=formRegExsAry;
		}
		var formKeyMapsAry=this.formHash[formName]['formkeymapsary'];
		if (formKeyMapsAry==undefined){
			var formKeyMapsStrg=this.formHash[this.formName]['etc'].get('keymaps');
			var formKeyMapsAry=formKeyMapsStrg.split('~');
			this.formHash[formName]['formkeymapsary']=formKeyMapsAry;
		}
		var formErrorMsgsAry=this.formHash[formName]['formerrormsgsary'];
		if (formErrorMsgsAry==undefined){
			var formErrorMsgsStrg=this.formHash[this.formName]['etc'].get('errormsgs');
			var formErrorMsgsAry=formErrorMsgsStrg.split('~');
			this.formHash[formName]['formerrormsgsary']=formErrorMsgsAry;
		}
		var formFields=new Hash();
		var noCols=formIdAry.length;
		for (var lp=0;lp<noCols;lp++){
			var useId=formIdAry[lp];
			var useName=formNameAry[lp];
			//xxx - below is undefined
			var useValue=formData.get(useName);
			if (useValue == undefined){useValue='';}
		//-xxx below only works on input text, what about select
			try {
				$(useId).value=useValue;
			}
			catch (err){
				alert ('formObj.openForm invalid useid: '+useId+', usename: '+useName+', formname: '+formName);
				exit();
			}
			var regEx=formRegExsAry[lp];
			var keyMap=formKeyMapsAry[lp];
			var errorMsg=formErrorMsgsAry[lp];
			formFields[useName]=new Hash();
			formFields[useName].set('regex',regEx);
			formFields[useName].set('keymap',keyMap);
			formFields[useName].set('errormsg',errorMsg);
			formFields[useName].set('id',useId);
			formFields[useName].set('value',useValue);
		}
		this.formHash[this.formName]['formfields']=formFields;
		try {
			$(containerId).style.visibility='visible';
		}
		catch (err){
			alert ('formObj.opernform invalid containerid: '+containerId+', formname: '+formName);
		}
	},
//==============================================================
	buildFormValidationFields: function(){
		containerObj.jsDebug('formObj.buildFormValidationFields()');
		formName=this.formName;
//- get ids
		var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
		var formIdAry=formIdStrg.split('~');
//- get names
		var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
		var formNameAry=formNameStrg.split('~');
		//
		this.formHash[this.formName].unset('formfields');
//--- get validation
		var formRegExsAry = this.formHash[formName]['formregexsary'];
		if (formRegExsAry==undefined){
			var formRegExsStrg=this.formHash[this.formName]['etc'].get('regexs');
			var formRegExsAry=formRegExsStrg.split('~');
			this.formHash[formName]['formregexsary']=formRegExsAry;
		}
		var formKeyMapsAry=this.formHash[formName]['formkeymapsary'];
		if (formKeyMapsAry==undefined){
			var formKeyMapsStrg=this.formHash[this.formName]['etc'].get('keymaps');
			var formKeyMapsAry=formKeyMapsStrg.split('~');
			this.formHash[formName]['formkeymapsary']=formKeyMapsAry;
		}
		var formErrorMsgsAry=this.formHash[formName]['formerrormsgsary'];
		if (formErrorMsgsAry==undefined){
			var formErrorMsgsStrg=this.formHash[this.formName]['etc'].get('errormsgs');
			var formErrorMsgsAry=formErrorMsgsStrg.split('~');
			this.formHash[formName]['formerrormsgsary']=formErrorMsgsAry;
		}
		var formFields=new Hash();
		var noCols=formIdAry.length;
		for (var lp=0;lp<noCols;lp++){
			var useName=formNameAry[lp];
			var regEx=formRegExsAry[lp];
			var keyMap=formKeyMapsAry[lp];
			var errorMsg=formErrorMsgsAry[lp];
			var useId=formIdAry[lp];
			formFields[useName]=new Hash();
			formFields[useName].set('regex',regEx);
			formFields[useName].set('keymap',keyMap);
			formFields[useName].set('errormsg',errorMsg);
			formFields[useName].set('id',useId);
			//formFields[useName].set('value',useValue);
		}
		this.formHash[this.formName]['formfields']=formFields;
	},
//==============================================================
	fileForm: function(){
		containerObj.jsDebug('formObj.fileForm()');
		var fatalError=this.validateForm();
		//alert ('fatal error: '+fatalError);//xxx
		if (!fatalError){
			var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
			var formIdAry=formIdStrg.split('~');
			var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
			var formNameAry=formNameStrg.split('~');
			var noCols=formIdAry.length;
			var formData=new Hash();
			for (var lp=0;lp<noCols;lp++){
				var useId=formIdAry[lp];
				var useName=formNameAry[lp];
				var useValue = $(useId).value;
				formData.set(useName,useValue);
			}
			tableObj.fileUpdate(formData);
			var containerId=this.formHash[this.formName]['etc'].get('formcontainerid');
			if (containerId != undefined){$(containerId).style.visibility='hidden';}
			//containerObj.displayAry(this.formHash[this.formName]['etc']);//xxx
		}
	},
//=============================================================
	getFormData: function(formName){
		userObj.doLog('init','in formobj.getformdata form('+formName+')');
		var test=this.formHash[formName];
		if (test != undefined){
			this.setFormName(formName);
			var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
			//userObj.doLog('x',formIdStrg);
			var formIdAry=formIdStrg.split('~');
			var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
			//userObj.doLog('x',formNameStrg);
			var formNameAry=formNameStrg.split('~');
			//alert ('formidstrg: '+formIdStrg+', formnamestrg: '+formNameStrg);//xxxf
			var noCols=formIdAry.length;
			var formData=new Hash();
			for (var lp=0;lp<noCols;lp++){
				var useId=formIdAry[lp];
				var useName=formNameAry[lp];
				var useValue = $(useId).value;
				userObj.doLog('x','name: '+useName+', useid: '+useId+' usevalue: '+useValue);
				formData.set(useName,useValue);
			}
		}
		else {
			var formData = new Array();
		}
		//containerObj.displayHash('formobj.getformdata',formData);//xxxf
		//userObj.displayLog('formObj.getFormData at end');
		return formData;
	},
//==============================================================
	fileFormV2: function(rowNo){
		containerObj.jsDebug('formObj.fileFormV2(rowNo)');
		var fatalError=formObj.validateForm();
		//alert ('fatal error: '+fatalError);//xxx
		if (!fatalError){
			var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
			var formIdAry=formIdStrg.split('~');
			var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
			var formNameAry=formNameStrg.split('~');
			var noCols=formIdAry.length;
			var formData=new Hash();
			for (var lp=0;lp<noCols;lp++){
				var useId=formIdAry[lp];
				try {
					useId=useId.replace(/NN/,rowNo);
				} catch (err){
					alert ('formObj.fileFormV2: '+err+' useid: '+useId);
				}
				var useName=formNameAry[lp];
				try {
					var theDataType=this.formHash[this.formName]['datatypesary'][lp];
				} catch (err){
					alert ('formObj.fileFormV2: '+err+', formname: '+formName+', lp: '+lp);
				}
				try {
					var useValue = $(useId).value;
				} catch (err){
					alert ('formObj.fileFormV2: '+err+' useid: '+useId);
				}
				if (theDataType=='date'){
					useValue=utilObj.convertDate(useValue,'date1');
				}
				formData.set(useName,useValue);
			}
			//xxxd - last left off
			tableObj.setCurrentRow(formData);
			tableObj.fileUpdate(formData);
/*
// dont want to hide it since it is a menu
			var containerId=this.getEtcValue('formcontainerid');
			if (containerId != undefined){
				try{$(containerId).style.visibility='hidden'}
				catch (err){
					alert ('form '+formName+' has a bad containerid: '+containerId);
				}
			}
			//containerObj.displayAry(this.formHash[this.formName]['etc']);//xxx
*/
		}
	},
//==============================================================
	validateForm: function(){
		userObj.unRestrictHide();//xxxf ????
		var fatalError=false;
		try {
			var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
			var formNameAry=formNameStrg.split('~');
		} catch (e){
			alert ('formObj.validateForm: formname: '+formName+', dbcolumnnames is null');
			exit();
		}
		var formErrorReportType=this.getEtcValue('formerrorreporttype');
		var formErrorReportId=this.getEtcValue('formerrorreportid');
		if (formErrorReportId != ''){$(formErrorReportId).innerHTML='';}
		var theCnt=formNameAry.length;
		for (var checkLp=0;checkLp<theCnt;checkLp++){
			var dbColumnName=formNameAry[checkLp];
			try {
				var fieldHash=this.formHash[this.formName]['formfields'][dbColumnName];
			}
			catch (e){
				this.buildFormValidationFields();
				var fieldHash=this.formHash[this.formName]['formfields'][dbColumnName];
			}
			regEx=fieldHash.get('regex');
			errorMsg=fieldHash.get('errormsg');
			theId=fieldHash.get('id');
			theErrId=dbColumnName+'_errormsgid';
			var dataIdSuffix=this.getEtcValue('dataidsuffix');
			if (dataIdSuffix == undefined){dataIdSuffix='';}
			if (theId != '' && theId != undefined){
				var useTheId=theId+dataIdSuffix;
				try {
					validateValue=$(useTheId).value;
				}
				catch (e){
					vl=1;
					//alert ('formObj.validateForm: '+e+', theId: '+theId+', form: '+this.formName);
				}
			if (regEx != ''){
				regExLastCh=regEx.substr(regEx.length-1,1);
				if (regExLastCh == '/'){regEx=regEx.substr(0,regEx.length-1);}
				if (regEx.substr(0,1) == '/'){regEx=regEx.substr(1,regEx.length-1);}
				MyRegExp = new RegExp(regEx,'g');
				if (validateValue != ''){
					var regExResult = MyRegExp.test(validateValue);
				}
				else {
					var regExResult = true;
				}
				if (regExResult === false){
					switch (formErrorReportType){
					case 'concattoid':
						$(theErrId).innerHTML=checkLp;
						var oldErrorMsg=$(formErrorReportId).innerHTML;
						if (oldErrorMsg != ''){oldErrorMsgInsert=oldErrorMsg+'<br/>';}
						else {oldErrorMsgInsert='';}
						var updErrorMsg=oldErrorMsgInsert+checkLp+' '+errorMsg;
						$(formErrorReportId).innerHTML=updErrorMsg;
						break;
						
					default:
						try {
							$(theErrId).innerHTML=errorMsg;
						} catch (e){
							alert ('formObj.validateForm: '+dbColumnName+' '+errorMsg );
							exit();
						}
					}
					fatalError=true;
				}
				else {
					try {
						$(theErrId).innerHTML='';
					}
					catch (e){
						//no
					}
				}
			}
			}
			else {alert (dbColumnName+' does not have an id field!!!');}
		}	
		if (fatalError===true){
			userObj.restrictHide();
		}
		return fatalError;
	},
//==============================================================
	validateInput: function(fieldName){
		containerObj.jsDebug('formObj.validateInput('+fieldName+')');
		try {
			var fieldHash=this.formHash[this.formName]['formfields'][fieldName];
			//containerObj.displayHash('formObj.validateInput formfields formname: '+this.formName,this.formHash[this.formName]['formfields']);//xxxd
		}
		catch (err){
			this.buildFormValidationFields();
			var fieldHash=this.formHash[this.formName]['formfields'][fieldName];
		}
		var regEx=fieldHash.get('regex');
		regExLastCh=regEx.substr(regEx.length-1,1);
		if (regExLastCh == '/'){regEx=regEx.substr(0,regEx.length-1);}
		if (regEx.substr(0,1) == '/'){regEx=regEx.substr(1,regEx.length-1);}
		var keyMap=fieldHash.get('keymap');
		var errorMsg=fieldHash.get('errormsg');
		var id=fieldHash.get('id');
		//- make below be id+'_errormsg'
		var errId=fieldName+'_errormsg';
		var validateValue=$(id).value;
		if (keyMap !== '' && keyMap !== 'reg'){
			//alert (keyMap+': '+validateValue);//xxx
			var charPos = validateValue.length;
			charPos--;
			var keyValue='';
			var chValue='';
			if (charPos >= 0){
				var keyValue=keyMap.substr(charPos,1);
				var chValue=validateValue.substr(charPos,1);
			}
			var checkedIt = false;
			if (keyValue == 'n'){
				MyRegExp = new RegExp('^[0-9]*$','g');
				var regExResult = MyRegExp.test(chValue);
				if (regExResult === false){
					var newValue=validateValue.substr(0,validateValue.length-1);
					$(id).value=newValue;
				}
				checkedIt = true;
			}
			if (keyValue == 'a'){
				MyRegExp = new RegExp('^[a-z,A-Z]*','g');
				var regExResult = MyRegExp.test(chValue);
				if (regExResult === false){
					newValue=validateValue.substr(0,validateValue.length-1);
					$(id).value=newValue;
				}
				checkedIt = true;
			}
			if (checkedIt === false){	
				if (chValue != keyValue){
					validateValue=validateValue.substr(0,validateValue.length-1);
					$(id).value=validateValue;
				}
			}
		}
		else if (regEx !== '' && keyMap == 'reg'){
			MyRegExp = new RegExp(regEx,'g');
			var regExResult = MyRegExp.test(validateValue);
			//alert ('xxx: regex: '+regEx+', validateValue: '+validateValue+', regexresult: '+regExResult);
			if (regExResult === false){
				newValue=validateValue.substr(0,validateValue.length-1);
				$(id).value=newValue;
				$(errId).value=errorMsg;
			}
		}
	},
//==============================================================
	setupValidations: function(formName, colName, dbTableMetaNotNull, validateRegEx, validateKeyMap, validateErrorMsg){
		containerObj.jsDebug('formObj.setupValidations('+formName+','+colName+','+dbTableMetaNotNull+','+validateRegEx+','+validateKeyMap+','+validateErrorMsg+')');
		var tst=this.formHash[formName];
			if (tst==undefined){
				this.formHash[formName]=new Hash();
				this.formHash[formName]['validatehash']=new Hash();
			}
			this.formHash[formName]['validatehash'][colName]=new Array(dbTableMetaNotNull, validateRegEx, validateKeyMap, validateErrorMsg);
			var cnt=this.formHash[formName]['validatehash'].length;
	},
//==============================================================
	writeFormToServer: function(formName,jobName){
		containerObj.jsDebug('formObj.writeFormToServer('+formName+','+jobName+')');
		this.setFormName(formName);
		var operationName='insert_db_from_ajax';
		var sendDataAry=new Array();
		var valueDelim='~';
//--- get dbtablename
		var dbTableName=this.getEtcValue('dbtablename');
		sendDataAry[0]='dbtablename|'+dbTableName;
//--- get column titles
		var dbColumnNames=this.getEtcValue('dbcolumnnames');
		var dbColumnIds=this.getEtcValue('dbcolumnids');
		//alert ('formname: '+this.formName+', formname: '+formName);//xxxd
		//containerObj.displayAry(this.formHash[this.formName]['etc']);//xxxd
		sendDataAry[1]='datadef|'+dbColumnNames;
//--- get form data
		var dbColumnIdsAry=dbColumnIds.split('~');
		var dataSendValues='';
		var theNo=dbColumnIdsAry.length;
		var lp=0;
		var useDelim='';
		for (lp=0;lp<theNo;lp++){
			dataId=dbColumnIdsAry[lp];
		//- below has no id field for hidden element
		//- how do I get a selected list which is options[selectedindex]
			if (dataId != ''){
				try {dataValue=$(dataId).value;}
				catch (err){alert ('formObj.writeFormToServer: '+err+' dataid: '+dataId);}
			}
			else {dataValue='';}
			dataSendValues+=useDelim+dataValue;
			useDelim=valueDelim;
		}
		sendDataAry[2]='tabledata|'+dataSendValues;
		sendDataAry[3]='formname|'+formName;
		var sessionName=this.getEtcValue('sessionname');
		sendDataAry[0]='sessionname|'+sessionName;
		ajaxObj.postAjaxSimple(formName,jobName,operationName,dbTableName,sendDataAry);
},
//============================================================== xxxf
	writeFormToServerV2: function(jobParamsAry){
		jobName=jobParamsAry[0];
		formName=jobParamsAry[1];
		formNo=jobParamsAry[2];
		var dataIdSuffix='';
		if (formNo != undefined && formNo != ''){
			var dataIdSuffix='_'+formNo;
		}
		this.setFormName(formName);
		this.setEtcValue('dataidsuffix',dataIdSuffix);
		var operationName=this.getEtcValue('formoperation');
		var errorRtn=this.validateForm();
		if (!errorRtn){
			var sendDataAry=new Array();
			var valueDelim='~';
//			--- get dbtablename
			var dbTableName=this.getEtcValue('dbtablename');
			sendDataAry[0]='dbtablename|'+dbTableName;
//			--- get column titles
			var dbColumnNames=this.getEtcValue('dbcolumnnames');
			var dbColumnIds=this.getEtcValue('dbcolumnids');
			sendDataAry[1]='datadef|'+dbColumnNames;
//			--- get form data
			try {
				var dbColumnIdsAry=dbColumnIds.split('~');
			}
			catch (err) {
				alert ('formobj.writeformtoserverv2('+err+'): dbcolumnids: '+dbColumnIds+' formname: '+formName);
				containerObj.displayHash('etc',this.formHash[this.formName]);//xxxf
			}
			var dataSendValues='';
			var theNo=dbColumnIdsAry.length;
			var lp=0;
			var useDelim='';
			for (lp=0;lp<theNo;lp++){
				dataId=dbColumnIdsAry[lp];
				//- below has no id field for hidden element
				//- how do I get a selected list which is options[selectedindex]
				if (dataId != ''){
					var useDataId=dataId+dataIdSuffix;
					try {dataValue=$(useDataId).value;}
					catch (err){alert ('formObj.writeFormToServerv2: '+err+' dataid: '+useDataId);}
				}
				else {dataValue='';}
				//xxxf - below may not always be a string
				dataValue=utilObj.cleanString(dataValue);
				dataSendValues+=useDelim+dataValue;
				useDelim=valueDelim;
			}
			sendDataAry[2]='tabledata|'+dataSendValues;
			sendDataAry[3]='formname|'+formName;
//			- get stuff to put into paramsAry
			var paramNamesAry = new Array();
			paramNamesAry[paramNamesAry.length]='sessionname';
//			- generic loop for paramsAry
			var theLen=paramNamesAry.length;
			var sendDataParamNames = '';
			var sendDataParamValues = '';
			var useDelim='';
			for (var lp=0;lp<theLen;lp++){
				var theName=paramNamesAry[lp];
				var theValue=this.getEtcValue(theName);
				if (theValue != undefined){
					sendDataParamNames+=useDelim+theName;
					sendDataParamValues+=useDelim+theValue;
					var useDelim='~';
				}
			}
//			- stick it into senddataary
			sendDataAry[4]='paramnames|'+sendDataParamNames;
			sendDataAry[5]='paramvalues|'+sendDataParamValues;
			ajaxObj.postAjaxSimple(formName,jobName,operationName,dbTableName,sendDataAry);
		}
	},
//==============================================================
	retrieveFormDbFromServer: function(jobName,formName,keyId){
		this.setFormName(formName);
		var sessionName=this.getEtcValue('sessionname');
		//alert ('formname: '+formName);//xxxd
		//containerObj.displayAry(formObj.formHash['metaprofileform']['etc']);//xxxd
		sendDataAry=new Array();
		var operationName='retrieve_form_db_from_ajax';
		var dbTableName=this.getEtcValue('dbtablename');
		sendDataAry[0]='formname|'+formName;
		sendDataAry[1]='dbtablename|'+dbTableName;
		sendDataAry[2]='dbkeyid|'+keyId;
		sendDataAry[3]='paramnames|sessionname';
		sendDataAry[4]='paramvalues|'+sessionName;
		//alert (jobName+', '+operationName+', '+sendDataAry);//xxxd
		ajaxObj.getFormDbViaAjax(jobName,operationName,sendDataAry);
		//alert ('done');//xxxd
	},
//==============================================================
// xxxf! don't clear out hidden fields
	clearFormFields: function(formName){
		containerObj.jsDebug('formObj.clearFormFields('+formName+')');
		var dbColumnIds=this.formHash[formName]['etc'].get('dbcolumnids');
		//alert ('clearformfields for '+formName+' dbcolumnids: '+dbColumnIds);//xxxf
		var dbColumnIdsAry=dbColumnIds.split('~');
		var dbDontClear=this.getEtcValue('dontcleardata');
		var dbDontClearAry=dbDontClear.split('~');
		var theNo=dbColumnIdsAry.length;
		var lp=0;
		for (lp=0;lp<theNo;lp++){
			var dataId=dbColumnIdsAry[lp];
			var dontClear=dbDontClearAry[lp];
			if (dataId != ''){
				if (dontClear=='false'){
					try {
						$(dataId).value='';
					}
					catch (err){alert ('formObj.clearformfields ('+err+') formname: '+formName+', dataid: '+dataId);}
				}
			}
		}
		//alert ('xxxf10: done with clearing');//xxxf
	},
//==============================================================
	loadFormFields: function(formName,dbColumnFedNames,dbColumnValues){
		this.setFormName(formName);
		var dbColumnIds=this.getEtcValue('dbcolumnids');
		var dbColumnIdsAry=dbColumnIds.split('~');
		var dbColumnNames=this.getEtcValue('dbcolumnnames');
		var dbColumnNamesAry=dbColumnNames.split('~');
		var dbColumnFedNamesAry=dbColumnFedNames.split('~');
		var dbColumnValuesAry=dbColumnValues.split('~');
		var workHash = new Hash();
		var noColumns=dbColumnFedNamesAry.length;
		for (var lp=0;lp<noColumns;lp++){
			var dbColumnFedName=dbColumnFedNamesAry[lp];
			var dbColumnValue=dbColumnValuesAry[lp];
			workHash.set(dbColumnFedName,dbColumnValue);
		}
		//alert (dbColumnNames);//xxxd
		var noColumns=dbColumnNamesAry.length;
		for (var lp=0;lp<noColumns;lp++){
			var dbColumnName=dbColumnNamesAry[lp];
			var dbColumnId=dbColumnIdsAry[lp];
			var dbColumnValue=workHash.get(dbColumnName);
			//xxxf - below should not be run if this is used for
			//       setup fields where %br%, etc. are left untouched
			dbColumnValue=utilObj.convertString(dbColumnValue);
			//alert (dbColumnId+': '+dbColumnValue);//xxxd
			try {$(dbColumnId).value=dbColumnValue;}
			catch (err){alert ('formObj.loadFormFields: '+err+' dbcolumnid: '+dbColumnId);}
		}
	},
//==============================================================
	deleteEntry: function(keyName){
		containerObj.jsDebug('formObj.validateForm()');
		var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
		var formIdAry=formIdStrg.split('~');
		var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
		var formNameAry=formNameStrg.split('~');
		var theCnt=formIdAry.length;
		var keyValue='';
		for (var theLp=0;theLp<theCnt;theLp++){
			var colName=formNameAry[theLp];
			if (keyName==colName){
				var keyId=formIdAry[theLp];
				keyValue=$(keyId).value;
				theLp=theCnt;
			}
		}
		if (keyValue != ''){
			tableObj.deleteEntry(keyValue);
			this.exitForm();
		}
		return keyValue;
	},
//==============================================================
	deleteEntryV2: function(keyName,dateName,menuRowNo){
		containerObj.jsDebug('formObj.validateForm()');
		var formIdStrg=this.formHash[this.formName]['etc'].get('dbcolumnids');
		var formIdAry=formIdStrg.split('~');
		var formNameStrg=this.formHash[this.formName]['etc'].get('dbcolumnnames');
		var formNameAry=formNameStrg.split('~');
		var theCnt=formIdAry.length;
		var ctr=0;
		for (var theLp=0;theLp<theCnt;theLp++){
			var colName=formNameAry[theLp];
			if (keyName==colName){
				var keyId=formIdAry[theLp];
				var useId=keyId.replace(/NN/,menuRowNo);
				var keyValue=$(useId).value;
				ctr++;
			}
			else if (dateName==colName){
				var dateId=formIdAry[theLp];
				var useId=dateId.replace(/NN/,menuRowNo);
				var dateValue=$(useId).value;
				ctr++;	
			}
				if (ctr>1){theLp=theCnt;}
		}
		tableObj.deleteEntry(keyValue);
		//xxxd: was aborting: this.exitForm();
		var returnHash=new Hash();
		returnHash['datevalue']=dateValue;
		returnHash['keyvalue']=keyValue;
		return returnHash;
	},
//==============================================================
	exitForm: function(){
		this.clearFormFields(this.formName);
		var formContainerId=this.formHash[this.formName]['etc'].get('formcontainerid');
		$(formContainerId).style.visibility='hidden';
	},
//==============================================================
	getEtcValue: function(etcName){
		var etcValue=this.formHash[this.formName]['etc'].get(etcName);
		return etcValue;
	},
//=============================================================
	runOperation: function(jobName,formName){
// --- sends data as columnid => column value
		this.setFormName(formName);
		var sendDataAry=new Array();
		var valueDelim='~';
//--- get column titles
		var dbColumnIds=this.getEtcValue('dbcolumnids');
//--- get fixed definition form data
		var operationName=this.getEtcValue('formoperation');
		var companyProfileId=userObj.getEtcValue('companyprofileid');
		var jobName=$('jobid').value;
		var dbTableName=this.getEtcValue('dbtablename');
		sendDataAry[sendDataAry.length]='dbtablename|'+dbTableName;
		sendDataAry[sendDataAry.length]='formid|'+formName;
		sendDataAry[sendDataAry.length]='operationid|'+operationName;
		sendDataAry[sendDataAry.length]='jobid|'+jobName;
		sendDataAry[sendDataAry.length]='companyprofileid|'+companyProfileId;
//--- get variable form information
		var dbColumnIdsAry=dbColumnIds.split('~');
		var dataSendValues='';
		var theNo=dbColumnIdsAry.length;
		var lp=0;
		for (lp=0;lp<theNo;lp++){
			dataId=dbColumnIdsAry[lp];
			if (dataId != ''){
				try {dataValue=$(dataId).value;}
				catch (err){alert ('formObj.writeFormToServer: '+err+' dataid: '+dataId);}
			}
			else {dataValue='';}
			sendDataAry[sendDataAry.length]=dataId+'|'+dataValue;
		}
		ajaxObj.postFormDataAjax(jobName,operationName,sendDataAry);
},
//=============================================================
	runOperationV2: function(jobName,formName){
//		sends data as column name => column value
		this.setFormName(formName);
		var sendDataAry=new Array();
		var valueDelim='~';
//		--- get column titles
		var dbColumnIds=this.getEtcValue('dbcolumnids');
		var dbColumnNames=this.getEtcValue('dbcolumnnames');
//		--- get fixed definition form data
		var operationName=this.getEtcValue('formoperation');
		var companyProfileId=userObj.getEtcValue('companyprofileid');
		var jobName=$('jobid').value;
		var dbTableName=this.getEtcValue('dbtablename');
		sendDataAry[sendDataAry.length]='dbtablename|'+dbTableName;
		sendDataAry[sendDataAry.length]='formname|'+formName;
		sendDataAry[sendDataAry.length]='operationname|'+operationName;
		sendDataAry[sendDataAry.length]='jobname|'+jobName;
		sendDataAry[sendDataAry.length]='companyprofileid|'+companyProfileId;
//		--- get variable form information
		var dbColumnIdsAry=dbColumnIds.split('~');
		var dbColumnNamesAry=dbColumnNames.split('~');
		var dataSendValues='';
		var theNo=dbColumnIdsAry.length;
		var lp=0;
		for (lp=0;lp<theNo;lp++){
			dataId=dbColumnIdsAry[lp];
			dataName=dbColumnNamesAry[lp];
			if (dataId != ''){
				try {dataValue=$(dataId).value;}
				catch (err){alert ('formObj.writeFormToServer: '+err+' dataid: '+dataId);}
			}
			else {dataValue='';}
			sendDataAry[sendDataAry.length]=dataName+'|'+dataValue;
		}
		ajaxObj.postFormDataAjax(jobName,operationName,sendDataAry);
	},
//==============================================================
	writeMultFormsToServer: function(jobParamsAry){
		jobName=jobParamsAry[0];
		formName=jobParamsAry[1];
		containerObj.jsDebug('formObj.writeFormToServer('+formName+','+jobName+')');
		this.setFormName(formName);
		var operationName=this.getEtcValue('formoperation');
		var sendDataAry=new Array();
		var valueDelim='~';
	//--- get dbtablename
		var dbTableName=this.getEtcValue('dbtablename');
		sendDataAry[0]='dbtablename|'+dbTableName;
	//--- get column titles
		var dbColumnNames=this.getEtcValue('dbcolumnnames');
		var dbColumnIds=this.getEtcValue('dbcolumnids');
		var formCount=this.getEtcValue('formcount');
		if (formCount == undefined){formCount=0;}
		//alert ('formname: '+formName+', formCount: '+formCount);//xxxf
		//containerObj.displayHash(formName,this.formHash[this.formName]['etc']);//xxxf
		sendDataAry[1]='datadef|'+dbColumnNames;
		var dbColumnIdsAry=dbColumnIds.split('~');
		var theNo=dbColumnIdsAry.length;
		var dataSendValuesMultiple='';
		var multDelim='';
		for (var formLp=0; formLp<=formCount; formLp++){
			//???- if (formCount>0){var dataIdSuffix='_'+formLp;}
			//???- else {var dataIdSuffix='';}
			var dataIdSuffix='_'+formLp;
			//alert (formLp+'/'+formCount+', dataidsuffix: '+dataIdSuffix);//xxxf
	//--- get form data
			var dataSendValues='';
			var lp=0;
			var useDelim='';
			var transmitForm=0;
			for (lp=0;lp<theNo;lp++){
				dataId=dbColumnIdsAry[lp];
		//- below has no id field for hidden element
		//- how do I get a selected list which is options[selectedindex]
				if (dataId != ''){
					var useDataId=dataId+dataIdSuffix;
					try {dataValue=$(useDataId).value;}
					catch (err){
						alert ('formObj.writeMultiFormsToServer('+formLp+'): '+err+' dataid: '+useDataId);
						exit();
					}
				}
				else {dataValue='';}
				//- datavalue must be numeric to use the below
				if (lp==0){
					dataValue_num=new Number(dataValue);
					if (dataValue_num>0){
						transmitForm=1;
						//var vl=prompt('set transmit form, datavalue_num: '+dataValue_num,'x');if (vl=='x'){exit();}
					}
				}
				dataSendValues+=useDelim+dataValue;
				useDelim=valueDelim;
			}
			if (transmitForm>0){
				//var vl=prompt('transmitform: '+transmitForm,'x');if (vl=='x'){exit();}
				dataSendValuesMultiple+=multDelim+dataSendValues;
				multDelim='~newform~';
			}
		}
		sendDataAry[2]='tabledata|'+dataSendValuesMultiple;
		sendDataAry[3]='formname|'+formName;
	//- get stuff to put into paramsAry
		var paramNamesAry = new Array();
		paramNamesAry[paramNamesAry.length]='sessionname';
	//- generic loop for paramsAry
		var theLen=paramNamesAry.length;
		var sendDataParamNames = '';
		var sendDataParamValues = '';
		var useDelim='';
		for (var lp=0;lp<theLen;lp++){
			var theName=paramNamesAry[lp];
			var theValue=this.getEtcValue(theName);
			if (theValue != undefined){
				sendDataParamNames+=useDelim+theName;
				sendDataParamValues+=useDelim+theValue;
				var useDelim='~';
			}
		}
	//- stick it into senddataary
		sendDataAry[4]='paramnames|'+sendDataParamNames;
		sendDataAry[5]='paramvalues|'+sendDataParamValues;
		var theLen=sendDataAry.length;
		//alert ('formname: '+formName+', jobname: '+jobName+', operationName: '+operationName+', senddataary[0]: '+sendDataAry[0]+"\n"+', senddataary[1]: '+sendDataAry[1]+"\n"+', senddataary[2]: '+sendDataAry[2]);//xxxf
		ajaxObj.postAjaxSimple(formName,jobName,operationName,dbTableName,sendDataAry);
	},
//==============================================================
	convertField: function(jobParamsAry){
		var fieldToConvert=jobParamsAry[0];
		var fieldValue=$(fieldToConvert).value;
		fieldValue=utilObj.convertString(fieldValue);
		$(fieldToConvert).value=fieldValue;
	},
//==============================================================
	doAlert: function(dmyMsg){
		tst=this.formHash['basicform']['validatehash'][dmyMsg][3];
		alert (tst);
	} 
}); 

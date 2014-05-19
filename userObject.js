var userObject = Class.create({
//--- data structures
//this.userHash['etchash']['username']    ... <database table name>
//									['userpassword']  ... col1~col2~col3
//									['companyprofileid']    ... colid1~colid2~clid3
//									['accessallcompanies']		   ... regex1~regex2~regex3
//									['userfirstname']        ... keymap1~keymap2~keymap3
//									['usermiddlename']      ... errormsg1~errormsg2~errormsg3
//									['userlastname']... <form container id>
//									['html'] ... form html code
//									['datatypes'] ... datatype~datatype~datatype
//									['donthide'] ... true/false
//				['nameshash'][savename] ... name1~name2~name3
//				['log']
//						0 ... log line
//						1 ... log line
//==============================================================
	initialize: function() {
		this.userHash = new Hash();
		this.userHash['etchash'] = new Hash();
		this.userHash['nameshash'] = new Hash();
		this.userHash['log']= new Array();
		this.userHash['namestrings']=new Hash();
	},
//==============================================================
	doLog: function(theCode, theLog){
		if (theCode=='init'){
			this.userHash['log']=new Array();
		}
		this.userHash['log'][this.userHash['log'].length]=theLog;
	},
//==============================================================
	displayLog: function(theTitle){
		var theLen=this.userHash['log'].length;
		theLogStrg='*****'+theTitle+'*****\n';
		for (var lp=0;lp<theLen;lp++){
			theLogStrg+=this.userHash['log'][lp]+"\n";
		}
		alert (theLogStrg);
	},
//==============================================================
	restrictHide: function(){
		this.setEtcValue('restricthide',true);
	},
//==============================================================
	unRestrictHide: function(){
		this.setEtcValue('restricthide',false);
	},
//==============================================================
	doIHide: function(){
		var hideValue=this.getEtcValue('restricthide');
		if (hideValue == undefined){hideValue=false;}
		this.setEtcValue('restricthide',false);
		return hideValue;
	},
//==============================================================
	setEtcValue: function(etcName,etcValue){
		this.userHash['etchash'].set(etcName,etcValue);
	},
//==============================================================
	getEtcValue: function(etcName){
		var etcValue=this.userHash['etchash'].get(etcName);
		return etcValue;
	},
//==============================================================
	displayUser: function(){
		containerObj.displayHash('userobj etc',this.userHash['etchash']);
	},
//==============================================================
	loadUserValue: function(jobParamsAry){
		var theLen=jobParamsAry.length;
		for (var lp=0; lp<theLen; lp++){
			var theName=jobParamsAry[lp];
			var theNameId=theName+'id';
			var theValue=this.getEtcValue(theName);
			//alert ('name: '+theName+', thevalue: '+theValue);
			//containerObj.displayAry(this.userHash['etchash']);//xxxf
			try {$(theNameId).innerHTML=theValue;}
			catch (err){alert ('userobj.loaduservalue '+err+' thename: '+theName+', thevalue: '+theValue);}
		}
	},
//==============================================================
	loadUserValueToId: function(jobParamsAry){
		var theLen=jobParamsAry.length;
		for (var lp=0;lp<theLen; lp=lp+2){
			var pos=lp;
			var theName=jobParamsAry[pos];
			pos++;
			var theNameId=jobParamsAry[pos];
			var theValue=this.getEtcValue(theName);
			try {$(theNameId).innerHTML=theValue;}
			catch (err){alert ('userobj.loaduservaluetoid '+err+' thename: '+theName+', thenameid: '+theNameId+', thevalue: '+theValue);}
		}
	},
//==============================================================
	saveUserValue: function(jobParamsAry){
		var theLen=jobParamsAry.length;
		for (var lp=0;lp<theLen; lp=lp+2){
			var pos=lp;
			var theName=jobParamsAry[pos];
			pos++;
			var theValue=jobParamsAry[pos];
			this.setEtcValue(theName,theValue);
			//alert ('set '+theName+' to '+theValue+' in userobj/etc');//xxxf
		}
	},
//==============================================================
	saveNamedString: function(theName,theString){
		this.userHash['namestrings'].set(theName,theString);
	},
//==============================================================
	getNamedString: function(theName){
		var theString=this.userHash['namestrings'].get(theName);
		return theString;
	},
//==============================================================
	doAlert: function(dmyMsg){
		tst='error: '+dmyMsg;
		alert (tst);
	} 
}); 

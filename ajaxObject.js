var AjaxObject = Class.create({
//--- this object is non functional
//--- initialize
	initialize: function() {
		var ajaxAry = new Array();
	},
//========================================================
	doRunAjaxPost: function(jobName,operationName,sendDataAry){
//--- init setup
		var ajaxFieldDelim='~';
		var ajaxLineDelim='`';
		var ajaxSubLineDelim='|';
		var url="http://lindy/index.php";
		var containerName="none";
		var dateObj=new Date();
		//if (operationName == 'getjobobjects'){alert ('xxxf3');}
		var secs=dateObj.getSeconds();
//--- get data to send and make it a string
		var sendData=sendDataAry.join(ajaxLineDelim);
		new Ajax.Request(url, {
	   		method: 'post',
	   		onSuccess: function(transport){
	   			var response_raw = transport.responseText || "no response text";
	   			var responseAry=response_raw.split(ajaxSubLineDelim);
	   			var errorKey=responseAry[0];
	   			var errorMsg=responseAry[1];
	   			if (errorKey == 'ok'){
					tableObj.clearUpdateFlags();
	   			}
	   		},
		});
	},
//--- test alert
	doAlert: function(dmyMsg){
		alert (dmyMsg);
	} 
}); 
var ImageObject = Class.create({
//- data structures
//- this.imageHash[<imagename>]
//						['etchash']
//							[<imageprofile name>]=][<imageprofile values>]
//                [<rotateName>]
//						['etchash'];
//						['type']='rotate';
//======================================================
	initialize: function() {
		this.imageHash = new Hash();
	},
	doAlert: function(theMsg){
		//alert ('ImageObj: '+theMsg);
	},
//======================================================
	loadImageData: function(jobParamsAry){
//- init
		//alert ('jobparamsary: '+jobParamsAry);//xxxd
		var imageName=jobParamsAry[0];
		this.setImageName(imageName);
		var imageId=this.getEtcValue('imageid');
		var imgFieldCnt=jobParamsAry.length;
//- get codes/id lists
		var imageIdList=this.getEtcValue('imageidlist');
		try {var imageIdListAry=imageIdList.split('_');}
		catch (err){alert ('ImageObj.loadImagedata ('+err+') imagename: '+imageName);exit();}
		var imageCodeList=this.getEtcValue('imagecodelist');
		var imageCodeListAry=imageCodeList.split('_');
		var imageNameList=this.getEtcValue('imagenamelist');
		var imageNameListAry=imageNameList.split('_');
		var theLen=imageCodeListAry.length;
//- loop through jobparams to get each image update session
		for (var fldLp=1;fldLp<imgFieldCnt;fldLp=fldLp+2){
			var theCode=jobParamsAry[fldLp];
			var nextFld=fldLp+1;
			var theValue=jobParamsAry[nextFld];
			var theValueAry=theValue.split('?');
			var theValue=theValueAry[0];
			var theIdFeed=theValueAry[1];
			var pos=imageCodeListAry.indexOf(theCode);
			try {var theName=imageNameListAry[pos];}
			catch (err){alert ('ImageObj.loadImagedata: ('+err+') imageName: '+imageName);exit();}
			try {var theNameAry=theName.split('!');}
			catch (err){alert ('ImageObj.loadImagedata: ('+err+') imageName: '+imageName+', thecode: '+theCode+', pos: '+pos+', imagecodelist: '+imageCodeList);exit();}
			var theNameFunction=theNameAry[1];
			theName=theNameAry[0];
			if (theValue=='file'){theValue=this.getEtcValue(theName);}
			//alert ('thename: '+theName+', thevalue: '+theValue+', thenamefunction: '+theNameFunction+', thecode: '+theCode+', theidfeed: '+theIdFeed);//xxxd
			if (theNameFunction != undefined){
			switch (theNameFunction){
			case 'dirpath':
				var theOldValue=theValue;
				var theValueAry=theValue.split('/');
				theValueAry.pop();
				theValue=theValueAry.join('/');
				//alert ('old: '+theOldValue+', new: '+theValue);//xxxd
				break;
			default:
			}
			}
			if (pos>-1){
				var theIds=imageIdListAry[pos];
				//alert (theCode+': id: '+theId+', value: '+theValue);
				if (theName != 'none'){
					this.setEtcValue(theName,theValue);
				}
//- loop through multiple ids and update them
				var theIdsAry=theIds.split(':');
				var theIdsLen=theIdsAry.length;
				for (var doLp=0;doLp<theIdsLen;doLp++){
					theIdGroup=theIdsAry[doLp];
					var theIdGroupAry=theIdGroup.split('!');
					var theId=theIdGroupAry[0];
					//- take input for theId
					if (theId=='usethefeed'){
						theId=theIdFeed;
					}
					var theType=theIdGroupAry[1];
					switch (theType){
					case 'src':
						try {$(theId).src=theValue;}
						catch (err){alert ('ImageObj.showImage: '+err+', thecode: '+theCode+', nameid: '+theId+', thevalue: '+theValue);}
						break;
					case 'dsrc':
						var theValueAry=theValue.split('/');
						var fileName=theValueAry.pop();
						var theValue=theValue.join('/');
						try {$(theId).src=theValue;}
						catch (err){alert ('ImageObj.showImage: '+err+', thecode: '+theCode+', nameid: '+theId+', thevalue: '+theValue);}
						break;
					case 'i':
						try {$(theId).innerHTML=theValue;}
						catch (err){alert ('ImageObj.showImage: '+err+', thecode: '+theCode+', nameid: '+theId+', thevalue: '+theValue);}
						break;
					case 'v':
						//if (flg==1){alert ('xxxd0');}
						try {$(theId).value=theValue;}
						catch (err){alert ('ImageObj.showImage: '+err+', thecode: '+theCode+', nameid: '+theId+', thevalue: '+theValue);}
						break;
					case 'a':
//- analyze window size and reduce if needed
						//xxxf - below is from a field that can be redefined - not always 'w'
						var imageId=this.getEtcValue('imageid');
						var imagePercent=100;
						//alert ('pct: '+imagePercent+', irw: '+imageRawWidth+', irh: '+imageRawHeight);//xxxd
						var imageWidth=this.getEtcValue('imagewidth');
						var imageHeight=this.getEtcValue('imageheight');
						if (imageWidth>700 || imageHeight>500){
							newImageWidth=imageWidth;
							newImageHeight=imageHeight;
							if (imageWidth>700){
								newImageWidth=700;
								newImageHeight=Math.round(imageHeight*(newImageWidth/imageWidth));
							}
							if (newImageHeight>500) {
								newImageHeight=500;
								newImageWidth=Math.round(imageWidth*(newImageHeight/imageHeight));
							}
							try {$(imageId).width=newImageWidth;}
							catch (err){alert ('ImageObj: '+err);}
							this.setEtcValue('currentimagewidth',newImageWidth);
							this.setEtcValue('currentimageheight',newImageHeight);
							var imagePercent=Math.round((newImageWidth/imageWidth)*100);
							this.setEtcValue('imagepercent',imagePercent);
						}
						else {
							this.setEtcValue('imagepercent',imagePercent);
							this.setEtcValue('currentimagewidth',imageWidth);
							this.setEtcValue('currentimageheight',imageHeight);
							try {$(imageId).width=imageWidth;}
							catch (err){alert ('ImageObj: '+err);}
						}
						//alert ('window width: '+windowWidth);//xxxd
						break;
					case 'pctset':
//- calc width/height based upon percent
						var imageHeight=this.getEtcValue('imageheight');
						var imageWidth=this.getEtcValue('imagewidth');
						var pct=this.getEtcValue('imagepercent');
						var oldCurrentImageHeight=this.getEtcValue('currentimageheight');
						if (oldCurrentImageHeight == undefined){oldCurrentImageHeight=imageHeight;}
						var currentImageHeight=Math.round(imageHeight * pct/100);
						var currentImageWidth=Math.round(imageWidth * currentImageHeight/imageHeight);
						this.setEtcValue('currentimageheight',currentImageHeight);
						this.setEtcValue('currentimagewidth',currentImageWidth);
						var imageId=this.getEtcValue('imageid');
						try {$(imageId).width=currentImageWidth;}
						catch (err){alert ('ImageObj: '+err);}
						var containerId=this.getEtcValue('imagecontainerid');
						var heightDiff=oldCurrentImageHeight-currentImageHeight;
						var widthDiff=imageWidth-currentImageWidth;
						var curTop=$(containerId).style.top;
						curTop=curTop.replace(/px/g,'');
						var newCurTop=Number(curTop)+heightDiff;
						try {$(containerId).style.top=newCurTop;}
						catch (err){alert ('error in ImageObj Line130 '+err);}
						break;
					default:
						alert ('error in type: '+theType);
					}
				}
			}
			else {alert ('error for code: '+theCode);}
		}	
	},
//=====================================================
	changeImagePercent: function(jobParamsAry){
		//alert ('xxxd1');
		var imageName=jobParamsAry[0];
		this.setImageName(imageName);
		var changeType=jobParamsAry[1];
		var changeId=jobParamsAry[2];
		try {var newValue=$(changeId).value;}
		catch (err){alert ('ImageObj L139: '+err);}
		if (changeType == 'w'){
			var imageWidth=this.getEtcValue('imagewidth');
			var thePct=Math.round((newValue/imageWidth)*100);
		}
		else {
			var imageHeight=this.getEtcValue('imageheight');
			var thePct=Math.round((newValue/imageHeight)*100);
		}
		this.setEtcValue('imagepercent',thePct);
	},
//=====================================================
	showImage: function(jobParamsAry){
		imageName=jobParamsAry[0];
		this.setImageName(imageName);
		var imageContainerId=this.getEtcValue('imagecontainerid');
		//alert ('set '+imageContainerId+' to visible');
		//this.displayStorage(imageName);//xxxd
		try {$(imageContainerId).style.visibility='visible';}
		catch (err){alert ('imageobj.showimage: '+err+' imagesource: '+imageSource);}
},
//======================================================
	displayStorage: function(imageName){
		try {
			var strg=this.imageHash[imageName]['etchash'].inspect();
			alert (strg);
		}
		catch (err){
			alert (imageName+': is not on file');
		}
	},
//=====================================================
	setImageName: function(imageName){
		this.imageName=imageName;
		var dmy=this.imageHash[imageName];
		if (dmy==undefined){
			//alert ('create image directory: '+imageName);//xxxd
			this.imageHash[imageName]=new Hash();
			this.imageHash[imageName]['etchash']=new Hash();
		}
	},
//=====================================================
	setEtcValue: function(etcName,etcValue){
		//alert ('imagename: '+this.imageName+', etcName: '+etcName+', etcvalue: '+etcValue);//xxxd
		var imageName=this.imageName;
		this.imageHash[imageName]['etchash'].set(etcName,etcValue);
	},
//=====================================================
	getEtcValue: function(etcName){
		var imageName=this.imageName;
		var etcValue=this.imageHash[imageName]['etchash'].get(etcName);
		return etcValue;
	},
//=====================================================
	deleteEtcValue: function(etcName){
		this.imageHash[this.imageName]['etchash'].unset(etcName);
	},
//=====================================================
	getEtcValueNumeric: function(etcName){
		var etcValue=this.getEtcValue(etcName);
		if (etcValue == undefined){etcValue=0;}
		etcValue = new Number(etcValue);
		return etcValue;
	},
//=====================================================
	loadImageSource: function(jobParamsAry){
		var imageName=jobParamsAry[0];
		//this.displayStorage(imageName);//xxxd
		var theId=this.getEtcValue('imageid');
		var theValue=jobParamsAry[1];
		this.setEtcValue('imagesrc', theValue);
		try {$(theId).src=theValue;}
		catch (err){
			alert ('runbatch(lvid): '+err+' theid: '+theId+', value: '+theValue);
			//alert ($('maindisplayimageid').innerHTML);//xxxd
		}
		//alert ('loaded value: '+theValue+' into '+theId);//xxxd
	},
//=====================================================
	StoreImageDetail: function(jobParamsAry){
		var imgName=jobParamsAry[0];
		var imgSrc=jobParamsAry[1];
		var imgWidth=jobParamsAry[2];
		var imgHeight=jobParamsAry[3];
		var imgRWidth=jobParamsAry[4];
		var imgRHeight=jobParamsAry[5];
		this.imageName=imgName;
		this.setEtcValue('imagename',imgName);
		this.setEtcValue('src',imgSrc);
		this.setEtcValue('width',imgWidth);
		this.setEtcValue('height',imgHeight);
		this.setEtcValue('rwidth',imgRWidth);
		this.setEtcValue('rheight',imgRHeight);
	},
//=====================================================
	loadImageId: function(jobParamsAry){
		var imgName=jobParamsAry[0];
		var maxLp=jobParamsAry.length;
		maxLp--;
		for (var lp=1; lp<maxLp; lp=lp+2){
			var imgId=jobParamsAry[lp];
			var imgName=jobParamsAry[lp+1];
			var imgValue=this.getEtcValue(imgName);
			//- sometimes below may be id or value
			try {$(imgId).value=imgValue;}
			catch (err){
				alert ('imgObj.loadImageId: '+err+', invalid id: '+imgId);
			}
		}
	},
//===========================================
	toggleImageClass: function(elementBase,smallClass,largeClass){
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
//===================================================
	displayEtc: function(){
		ContainerObj.displayAry(this.imageHash[this.imageName]['etchash']);
	},
//===================================================
	moveImages: function(imagesStrg){
		var imagesAry=imagesStrg.split('!');
		var moveParSecs=5;
		var tst=this.test;
		if (tst == undefined){tst=0;}
		tst++;
		this.test=tst;
		var imageCnt=imagesAry.length;
		for (var imageLp=0;imageLp<imageCnt;imageLp++){
			var imageName=imagesAry[imageLp];
			this.imageName=imageName;
			var imageId=this.getEtcValue('imageid');
//- get numeric fields
			var moveX=this.getEtcValueNumeric('movex');
			var moveY=this.getEtcValueNumeric('movey');
			var xDirection = this.getEtcValueNumeric('xdirection');
			if (xDirection==0){xDirection=1;}
			var yDirection = this.getEtcValueNumeric('ydirection');
			if (yDirection==0){yDirection=1;}
//- get left position - should be in etc from getimageforajax
			var leftPos=this.getEtcValueNumeric('left');
			if (leftPos>150){
				xDirection = new Number(-1);
				this.setEtcValue('xdirection',xDirection);
			}
			if (leftPos<50){
				xDirection = new Number(1);
				this.setEtcValue('xdirection',xDirection);
			}
//- get top position - should be in etc from getimageforajax
			var topPos=this.getEtcValueNumeric('top');
//- set error rate
			var errorRate=this.getEtcValue('errorrate');
			errorRate = new Number(errorRate);
			var numberCheck=Math.random();
			var errorDirectionNo;
			if (numberCheck<.01){errorDirectionNo=errorRate * -1;}
			if (numberCheck>.01 && numberCheck<.99){errorDirectionNo=0;}
			if (numberCheck>.99){errorDirectionNo=errorRate;}
//- plug in new locations
			topPos+=(moveY * yDirection)+Number(errorDirectionNo);
			this.setEtcValue('top',topPos);
			leftPos+=(moveX * xDirection);
			//vl=prompt ('leftpos: '+leftPos+', movex: '+moveX+', xdirection '+xDirection,'x');if (vl=='x'){exit();}
			//leftPos += errorDirectionNo;
			//vl=prompt('leftpos: '+leftPos+', movex: '+moveX+', xdirection'+xDirection+', errordirectionno: '+errorDirectionNo,'x');if (vl=='x'){exit();}
			this.setEtcValue('left',leftPos);
			$(imageId).style.left=leftPos + 'px';
			$(imageId).style.top=topPos + 'px';
			if (this.test<500){
				var runStrg="ImageObj.moveImages('"+imagesStrg+"')";
				var t=setTimeout(runStrg,150);
			}
			else {
				vl=prompt('all done','x');if (vl=='x'){imageLp=5;exit();}
			}
		}
	},
//=====================================================
	changeSource: function(jobParamsAry){
		//ContainerObj.displayAry('jobparams',jobParamsAry);
		var noParams=jobParamsAry.length;
		//alert (noParams);
		for (var lp=0;lp<noParams;lp=lp+2){
			var theCode=jobParamsAry[lp];
			var theImage=jobParamsAry[lp+1];
			var theImageAry=theImage.split('?D');
			var theImageLoc=theImageAry[1];
			if (theImageLoc != undefined){
				theImage=UserObj.getEtcValue(theImageLoc);
			}
			if (theImage != undefined){
				UtilObj.writeLog('doalert','theCode: '+theCode+', theImage: '+theImage);
				//alert ('xxxf2 changesrc');
				//ContainerObj.displayHash(theImage,this.imageHash[theImage]['etchash']);
				this.setImageName(theImage);
				var theId=this.getEtcValue('imageid');
				var buttonError=false;
				switch (theCode){
				case 'reg':
					var imageSetting=this.getEtcValue('imagesetting');
					if (imageSetting == undefined){imageSetting='reg';}
					var imageError=this.getEtcValue('imageerror');
					if (imageError != undefined){
						if (imageError == 'alreadybusy'){
							buttonError=true;
							this.deleteEtcValue('imageerror');
							//alert ('xxxf: error out because found alreadybusy in '+this.imageName);
							//imageError=this.getEtcValue('imageerror');
						}
					}
					UtilObj.writeLog('doalert','set to reg: buttonerror: '+buttonError+', imageError: '+imageError+', imagesetting: '+imageSetting);
					if (!buttonError){
						var theSrc=this.getEtcValue('imagesource');
						this.setEtcValue('imagesetting','reg');
					}
					var newImageError=this.getEtcValue('imageerror');
					var testImageName=this.imageName;
					//alert('reg: theimage: '+theImage+',testimagename: '+testImageName+', theid: '+theId+',imagesetting: '+imageSetting+', buttonerror: '+buttonError+', imageError: '+imageError+', newimageerror: '+newImageError);//xxxf
					break;
				case 'busy':
					var imageSetting=this.getEtcValue('imagesetting');
					if (imageSetting == undefined){imageSetting='reg';}
					UtilObj.writeLog('doalert','set to busy: imageSetting: '+imageSetting);
					var imageError=this.getEtcValue('imageerror');
					if (imageSetting=='busy'){
						//alert ('set imageerror to: alreadybusy');
						UtilObj.writeLog('doalert','set imageerror to: alreadybusy');
						//alert ('xxxf: set alreadybusy for '+this.imageName);
						this.setEtcValue('imageerror','alreadybusy');
						var newImageError='alreadybusy';
					}
					this.setEtcValue('imagesetting','busy');
					var theSrc=this.getEtcValue('imagesourcebusy');
					var testImageName=this.imageName;
					//alert ('busy: theimage: '+theImage+',testname: '+testImageName+', theid: '+theId+',imageSetting: '+imageSetting+', buttonerror: '+buttonError+', imageError: '+imageError+', newimageerror: '+newImageError);//xxxf
					break;
				case 'regbusy':
					var imageSetting=this.getEtcValue('imagesetting');
					if (imageSetting == undefined){var imageSetting='reg';}
					if (imageSetting == 'reg'){
						var theSrc=this.getEtcValue('imagesourcebusy');
						this.setEtcValue('imagesetting','busy');
					}
					else {
						var theSrc=this.getEtcValue('imagesource');
						this.setEtcValue('imagesetting','reg');
					}
				}
				UtilObj.writeLog ('doalert','imagesetting: '+imageSetting+', thesrc: '+theSrc);
				if (!buttonError){
					try {$(theId).src=theSrc;}
					catch (err){alert ('ImageObj.changeSource('+err+')  imagename: '+theImage+', thecode: '+theCode+', theSrc: '+theSrc);}
				}
				//alert ('thcode: '+theCode+', theImage: '+theImage+', imageobj: '+this.imageHash[theImage]['etchash']+', thesrc: '+theSrc+', theid: '+theId);
			}
		}
	}
});

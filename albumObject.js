var AlbumObject = Class.create({
//- data structures
//this.albumName
//this.albumHash[<albumName>]['etchash']['albumprofileid']		... id
//								 		['albumname']	...
//			 				['src']	
//							['title']
//							['captions']
//							['videoids']
//
//==============================================================================
	initialize: function() {
		this.albumHash = new Hash();
	},
//==============================================================================
	setName: function(albumName){
		this.albumName=albumName;
		this.setupDirs(albumName);
	},
	//=====================================================
	setEtcValue: function(etcName,etcValue){
		//alert ('imagename: '+this.imageName+', etcName: '+etcName+', etcvalue: '+etcValue);//xxxd
		var albumName=this.albumName;
		this.albumHash[albumName]['etchash'].set(etcName,etcValue);
	},
//=====================================================
	getEtcValue: function(etcName){
		var albumName=this.albumName;
		var etcValue=this.albumHash[albumName]['etchash'].get(etcName);
		return etcValue;
	},
//==============================================================================
	setupDirs: function(albumName){
		var tst=this.albumHash;
		if (tst==undefined){this.albumHash=new Hash();}
		var tst=this.albumHash[albumName];
		if (tst==undefined){this.albumHash[albumName]=new Hash();}
		var tst=this.albumHash[albumName]['etchash'];
		if (tst==undefined){this.albumHash[albumName]['etchash']=new Hash();}
	},
//=============================================================================
	loadInfo: function(code,dataStrg){
		var dataAry = dataStrg.split('~');
		//alert (dataAry);//xxxf
		switch (code){
		case 'src':
			this.albumHash[this.albumName]['src']=dataAry;
			break;
		case 'titles':
			this.albumHash[this.albumName]['titles']=dataAry;
			break;
		case 'captions':
			this.albumHash[this.albumName]['captions']=dataAry;
			break;
		case 'videoids':
			this.albumHash[this.albumName]['videoids']=dataAry;
			break;
		default:
			alert ('albumobj.loadinfo invalid code: '+code);
		}
	},
//===============================================================================
	setPictureDisplay: function(jobParamsAry){
		var albumName=jobParamsAry[0];
		this.setName(albumName);
		var pictureNo=jobParamsAry[1];
		var imageId=jobParamsAry[2];
		var imageTitleId=jobParamsAry[3];
		var imageCaptionId=jobParamsAry[4];
	  //alert(albumName + ', ' + pictureNo + ', ' + imageId + ', ' + imageTitleId +  ', ' + imageCaptionId);
		var pictureSource=this.albumHash[this.albumName]['src'][pictureNo];
		var pictureTitle=this.albumHash[this.albumName]['titles'][pictureNo];
		var pictureCaption=this.albumHash[this.albumName]['captions'][pictureNo];
		var elementObject=$(imageId);
		try {
			elementObject.src=pictureSource;
		} catch (err){alert ('albumobj.setpicturedisplay: ('+err+') imageid: '+imageId);}
		if (imageTitleId != ''){
			var elementObject2=$(imageTitleId);
			elementObject2.innerHTML=pictureTitle;
		}
		if (imageCaptionId != ''){
			var elementObject3=$(imageCaptionId);
			elementObject3.innerHTML=pictureCaption;
		}
	},
	//=====================================================
	autoRotate: function(albumName){
		this.setName(albumName);
		this.setEtcValue('type','autorotate');
		this.setEtcValue('pictureno',0);
		this.setEtcValue('exitautoforever',false);
		this.displayNextImageForever();
	},
//====================================================
	displayNextImageForever: function(){
		UtilObj.writeLog('debugsalesid','--AlbumObj.displayNextImageForever--');
		var checkFadeInDone=this.getEtcValue('fadeindone');
		var checkFadeOutDone=this.getEtcValue('fadeoutdone');
		if (checkFadeInDone == undefined){var fadeInDone=true;}
		else {var fadeInDone=checkFadeInDone;}
		if (checkFadeOutDone == undefined){var fadeOutDone=true;}
		else {var fadeOutDone=checkFadeOutDone;}
		if (fadeInDone == false || fadeOutDone == false){var dontDoIt=true;}
		else {var dontDoIt=false;}
// - go/no go
		if (dontDoIt){
			UtilObj.writeLog('debugsalesid','dont do it! dontdoit: '+dontDoIt+', fadeindone: '+checkFadeInDone+', fadeoutdone: '+checkFadeOutDone);
			var sessionId=setTimeout("AlbumObj.displayNextImageForever()",sleepTime);
		}
		else {
			UtilObj.writeLog('debugsalesid','do it! dontdoit: '+dontDoIt+', fadeindone: '+checkFadeInDone+', fadeoutdone: '+checkFadeOutDone);	
			var albumPos1Id=this.getEtcValue('albumpos1');
			var albumPos2Id=this.getEtcValue('albumpos2');
			var nextCurrentId=this.getEtcValue('albumposnext');
			if (nextCurrentId == undefined){
				var nextCurrentId='albumpos2';
				this.setEtcValue('albumposnext','albumpos2');
			}
//--- nextimageno, src, maximageno
			var nextImageNo=this.getEtcValue('nextimageno');
			var maxImageNo=this.getEtcValue('maximageno');
			if (maxImageNo == undefined){
				var maxImageNo=this.albumHash[this.albumName]['src'].length;
				this.setEtcValue('maximageno',maxImageNo);
			}
			if (nextImageNo == undefined){
				var nextImageNo=1;
				this.setEtcValue('nextimageno',1);
			}
			if (nextImageNo>=maxImageNo){nextImageNo=0;}
			var theSrc=this.albumHash[this.albumName]['src'][nextImageNo];
			nextImageNo=Number(nextImageNo);
			nextImageNo++;
			this.setEtcValue('nextimageno',nextImageNo);
//--- fadetime
			var fadeTime=this.getEtcValue('albumimagefadetime');
			if (fadeTime == undefined || fadeTime == ''){fadeTime=9999;}
			fadeTime=Number(fadeTime);
//--- sleeptime
			var sleepTime=this.getEtcValue('albumimagesleeptime');
			if (sleepTime == undefined || sleepTime == ''){sleepTime=9999;}
			sleepTime=Number(sleepTime);
			UtilObj.writeLog('debugsalesid','get src: '+theSrc+' from image no nextimageno: '+nextImageNo);
// - do it
			if (nextCurrentId=='albumpos1'){
				UtilObj.writeLog('debugsalesid','nextcurrentid is albumpos1 so'+albumPos1Id+' gets src: '+theSrc);
				$(albumPos1Id).src=theSrc;
				this.setEtcValue('albumposnext','albumpos2');
				UtilObj.writeLog('debugsalesid','set fadeoutdone to false');
				this.setEtcValue('fadeoutdone',false);
				UtilObj.writeLog('debugsalesid','set fadeindone to false');
				this.setEtcValue('fadeindone',false);
				var useId='#'+albumPos2Id;
				var that=this;
				UtilObj.writeLog('debugsalesid','fadeout: '+useId);
				jQuery(useId).fadeOut(fadeTime, 'linear', function() {
					AlbumObj.setEtcValue('fadeoutdone',true);
				});
				var useId2='#'+albumPos1Id;
				jQuery(useId2).css("visibility","visible");
				jQuery(useId2).hide();
				UtilObj.writeLog('debugsalesid','fadein: '+useId2);
				jQuery(useId2).fadeIn(fadeTime, 'linear', function() {
					AlbumObj.setEtcValue('fadeindone',true);
					UtilObj.writeLog('debugsalesid','fadein done');
				});
			}
			else {
				UtilObj.writeLog('debugsalesid','nextcurrentid is albumpos2 so '+albumPos2Id+' gets src: '+theSrc);
				//alert ('xxxf1');
				$(albumPos2Id).src=theSrc;
				//alert ('xxxf2');
				this.setEtcValue('albumposnext','albumpos1');
				var useId='#'+albumPos1Id;
				UtilObj.writeLog('debugsalesid','do fadeout for albumpos1: '+albumPos1Id);
				this.setEtcValue('fadeoutdone',false);
				//alert ('xxxf3');
				jQuery(useId).fadeOut(fadeTime, 'linear', function() {
					AlbumObj.setEtcValue('fadeoutdone',true);
					UtilObj.writeLog('debugsalesid','fadeout is done so set fadeoutdone=true');
				});
				//alert ('xxxf4');
				var useId2='#'+albumPos2Id;
				UtilObj.writeLog('debugsalesid','do fadein for albumpos2: '+albumPos2Id);
				jQuery(useId2).css("visibility","visible");
				jQuery(useId2).hide();
				this.setEtcValue('fadeindone',false);
				jQuery(useId2).fadeIn(fadeTime, 'linear', function() {
					AlbumObj.setEtcValue('fadeindone',true);
					UtilObj.writeLog('debugsalesid','fadein is done so set fadeindone=true');
				});
			}
//--- exitautoforever or settimeoout
			var exitAutoForever=this.getEtcValue('exitautoforever');
			if (exitAutoForever == undefined){
				exitAutoForever=false;
				this.setEtcValue('exitautoforever',exitAutoForever);
			}
			if (exitAutoForever==false){
				UtilObj.writeLog('debugsalesid','set next session since exitautoforever is false');
				var sessionId=setTimeout("AlbumObj.displayNextImageForever()",sleepTime);
			}
			else {
				UtilObj.writeLog('debugsalesid','exit out since exitautoforever is true');
			}
		}
	},
//==============================================================================
	stopDisplayNextImageForever: function(albumName){
		UtilObj.writeLog('debugsalesid','set exitautoforever to true for album: '+albumName);
		this.setName(albumName);
		this.setEtcValue('exitautoforever',true);
	},
//============================================================================== 
	doAlert: function(alertMsg){
		alert (alertMsg);
	} 
}); 

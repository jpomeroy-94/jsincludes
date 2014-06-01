var YuiObject = Class.create({
	setupDrag: function(idName){
		//xxxf666
		//UtilObj.writeLog('debug9id','yuidrag');
		var dmy=1;
		dmy=2;
		YUI({combine: true, timeout: 10000}).use('dd-drag', function(Y) {
			if (this.theId == undefined){var doit=true;}
			else if (this.theId != idName){var doit=true;}
			else {var doit=false;}
			if (doit){
				var useId = '#'+idName;
				this.theId = idName;
				var dd = new Y.DD.Drag({
					//Selector of the node to make draggable
					node: useId
				});
			}
		});
	}
});

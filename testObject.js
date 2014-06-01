var TestObject = Class.create({
//  
	initialize: function() {
		//alert ('init of testObj');
	},
//-================================
	runTest: function(){
//----------------------------------- Hash with array in it
		var theArray = new Hash();
		theArray.set(0,'zero');
		theArray.set(1,'one');
		theArray.set(2,'two');
		theArray.set(4,'four');
		theArray[5]=new Array();
		theArray[5][0]='zero_2';
		theArray[5][1]='one_2';
		alert ('alert hash main: '+theArray);
		theArray.each(function(pair){
			vl=prompt('each hash main: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> each hash main: 0: zero
			//-> each hash main: 1: one
			//-> each hash main: 2: two
			//-> each hash main: 4: four
		});	
		alert ('alert array sub: '+theArray[5]);
			//-> 	alert array subdir: zero_2,one_2
		theArray[5].each(function(pair){
			vl=prompt('each array sub: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> each array sub: undefined: undefined
			//-> each array sub: undefined: undefined
		});	
/*
		var theArray2 = new Hash();
		theArray2[0]='zero';
		theArray2[1]='one';
		theArray2.each(function(pair){
			//vl=prompt('main: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> nothing
		});			
		var theArray3 = new Hash();
		theArray3.set(0,'zero');
		theArray3.set(1,'one');
		theArray3.each(function(pair){
			//vl=prompt('main: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> perfect 
		});
		theArray3[2]=new Array();
		theArray3.each(function(pair){
			//vl=prompt('main: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> shows only the first two not this directory
		});
		theArray3[2][0]='subzero';
		theArray3[2][1]='subone';
		//alert (theArray3[2]);
			//-> subzero,subone
		theArray3[2][2]=new Hash();
		theArray3[2][2].set(0,'subsubzero');
		theArray3[2][2].set(1,'subsubone');
		theArray3[2][2].each(function(pair){
			//vl=prompt('main: '+pair.key+': '+pair.value,'exit');if (vl=='exit'){exit();}
			//-> perfect
		var tst=theArray3[2].get(0);
		//alert (tst);
*/
/*
//----------------------------------- Hash
		var theArray4 = new Hash();
		theArray4.set(0,'zero');
		theArray4.set(1,'one');
		theArray4.set(2,'two');
		alert (theArray4);
			//-> [object][Object]
		theArray4.each(function(items){
			alert (items.key+': '+items.value);
			//-> 0: zero
			//-> 1: one
			//-> 2: two
		});
//----------------------------------- Array
		var theArray4 = new Array();
		theArray4[0]='zero';
		theArray4[1]='one';
		theArray4[2]='two';
		alert (theArray4);
			//-> zero,one,two
		theArray4.each(function(items){
			alert (items.key+': '+items.value);
			//-> undefined: undefined
			//-> undefined: undefined
			//-> undefined: undefined
		});
*/
	}
});

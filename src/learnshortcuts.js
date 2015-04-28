var $ =require('jquery');
var _ =require('underscore');
var ck =require('combokeys');
ck = new ck(document.documentElement);
var speak = require("node-speak");
  
var timer=require('./timer');
var op = require('./options');
var f2j =  require('./fileFormat2Json');
var angular = require('angular');



$(function(){
    
if(op.debug)
{
	$('body').bind('keypress', function(e) {
		console.dir(e);
		console.dir(_.pick(e, 'key', 'ctrlKey',
		'altKey', 'shiftKey', 'metaKey'));
	});
}

$.get("shortcuts/"+op.testFile, function(data){
	setTitle(op.testFile);
	var chapters=f2j.parse(data, op);
	
	testExcerzise(chapters, 0);

	function testExcerzise(chapters, i)
	{	
		if(op.AutoRepeat&&!isFirst()&&this.RepeatMode){
			
			//repeat and return.
			repeat();
			return;
		} 
		
		this.RepeatMode=false;
		
		if(chapters.length>1)
		{
			print("Test chapter '"+chapters[i].title+
			"'? ( y[es], n[ext], r[epeate last] or q[uit] )");
		}
		else{
			print("Try '"+chapters[i].title+
			"'? ( y[es] or q[uit] )");
		}
		
		ck.bind(['y', 'enter'], function(event){ 
			event.preventDefault();
			ck.reset();
			
			this.RepeatMode = true; 
			testChapter(chapters[i], function(){
				testExcerzise(chapters, next(i))
			});
		});
		
		ck.bind('n', function(event){ 
			event.preventDefault();
			ck.reset();
			testExcerzise(chapters, next(i));
		});
		
		ck.bind('r', function(event){
			event.preventDefault();
			ck.reset();
			repeat();
		});
		ck.bind('q', function(event){ 
			event.preventDefault();
			ck.reset();
			print('Excerzise done');
		});		
		function next(i){ 
			return (i+1)%chapters.length;
		}
		function prev(i){
			var x=(i-1)%chapters.length;
			if(x<0) x=chapters.length+x;
			return x;
		}
		
		function repeat(){ 
		
			this.RepeatMode = true;
			testChapter(chapters[prev(i)], function(){
				testExcerzise(chapters, i)
			});
		}
		
		function isFirst(){
			if(this.undefinedIfFirstCall===undefined){ 
				this.undefinedIfFirstCall={}; 
				return true;
			}
			return false;
		}
	}
	
	function testChapter(chapter, callback)
	{
		print("Chapter: "+chapter.title);
		timer.time();
		testKeyMaps(chapter, callback);
	}
	function toCombokeysFormat(keys){
		return keys.toLowerCase()
		.replace(/c[-+]/g,"ctrl+")
		.replace(/m[-+]/g,"alt+")
		.replace(/shft[-+]/g,"shift+")
		.replace(/s[-+]/g,"shift+")
		//On windows: goes to ctrl unfortunately
		.replace(/w[-+]/g,"mod+")
		.replace(/spc/g,"space")
	    //some horrible hacks
		.replace(/%/g,"shift+5")
		.split(", ");
	}
	
	function testKeyMaps(data, callback){
	    
		var current = _.sample(data.lines);
		if(timer.timeShow()<op.time)
		{
			if(op.learnMode) 
				print(current.message+' [ '+current.keys+' ]');
			else print(current.message);

		    if(op.speak) speak(current.message);

			if(op.debug) 
				console.log(toCombokeysFormat(current.keys));
			var combo=toCombokeysFormat(current.keys);
			timer.time(combo);
			ck.bind(combo, function(event){ 
				event.preventDefault();
				printSuccess(current.keys+'( '+formatTime(timer.timeEnd(combo))+' )');
				ck.reset();
				testKeyMaps(data, callback);
			});
						
			ck.bind('enter', function(event){ 
				event.preventDefault();
				printFail(current.keys);
				ck.reset();
				testKeyMaps(data, callback);
			});
		}
		else
		{
			print("'"+data.title+"' finished in "+
				formatTime(timer.timeEnd()));
			if(callback)	
			{
				callback();
			}
		}
	}
	
	function setTitle(title){
		$('title').html(title);
	}
	function print(message){
		$('.main .lines')
		.prepend("<div class='line'>"+message+"</div>");
		$('.main .line:gt('+op.maxLines+')').remove();
	}
	
	function printFail(message){
		$( ".main .line" ).first().addClass( "fail" ).html(message);
	}
	
	function printSuccess(message){
		$( ".main .line" ).first().addClass( "success" ).html(message);
	}
	
	function formatTime(time){
		return time?
			"<span class='time'>"+(time/1000).toFixed(1)+
			"sec</span>":
			"";
	}
});
});

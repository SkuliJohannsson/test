var qs=require('qs');
var timer=require('./timer');
var speak = require("node-speak");

$(function(){
var op=qs.parse(location.search.substr(1));
op.testFile = op.f||'resharpervs';
op.maxLines = op.ml||16;
op.learnMode = (_.has(op, 'lm'))||false;
op.debug = (_.has(op, 'd'))||false;
op.ShortDescriptions=(_.has(op, 'sd'))||false;
op.AutoRepeat=(_.has(op, 'ar'))||false;
op.speak=(_.has(op, 'a'))||false;
op.autoRepeatWait=(_.has(op, 'arw'))||0;

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
	var chapters=_.chain(data.split(/\r?\n\s*\r?\n/))
	.map(function(chapter){ 
		var arr=chapter.split(/\r?\n/);
		if(/^[ \t]*#/.test(arr[0]))
		{
			return {
				title: arr[0],
				lines: _.rest(arr)
			};
		}
		else{
			return {
				title: op.testFile,
				lines: arr
			};
		}
	})
	.value();
	
	testExcerzise(chapters, 0);

	function testExcerzise(chapters, i)
	{	
		if(op.AutoRepeat&&!isFirst()&&this.RepeatMode){
			
			//repeat and return. Give us some time to see the results
			setTimeout(repeat, op.autoRepeatWait);
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
		
		Mousetrap.bind(['y', 'enter'], function(event){ 
			event.preventDefault();
			Mousetrap.reset();
			
			this.RepeatMode = true;
			testChapter(chapters[i], function(){
				testExcerzise(chapters, next(i))
			});
		});
		
		Mousetrap.bind('n', function(event){ 
			event.preventDefault();
			Mousetrap.reset();
			testExcerzise(chapters, next(i));
		});
		
		Mousetrap.bind('r', function(event){
			event.preventDefault();
			Mousetrap.reset();
			repeat();
		});
		Mousetrap.bind('q', function(event){ 
			event.preventDefault();
			Mousetrap.reset();
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
		
		data={};
		data.lines = _.chain(chapter.lines)
		.filter(function(line){ return !/^[ \t]*#/.test(line);})
		.map(function(line){ 
			var pars = line.split(/\t+/);	
			var messageIndex=pars.length-1;
			if(!op.ShortDescriptions) 
				messageIndex=Math.min(messageIndex, 1);
			
			return {
				keys:pars[0], 
				message:pars[messageIndex].trim()
			}; 
		})
		.shuffle()
		.value();
		
		data.title=chapter.title;
		timer.time(data.title);
		testKeyMaps(data, callback);
	}
	function toMousetrapFormat(keys){
		return keys.toLowerCase()
		.replace(/c[-+]/g,"ctrl+")
		.replace(/m[-+]/g,"alt+")
		.replace(/shft[-+]/g,"shift+")
		.replace(/s[-+]/g,"shift+")
		//On windows: goes to ctrl unfortunately
		.replace(/w[-+]/g,"mod+")
		.replace(/spc/g,"space")
		.split(", ");
	}
	
	function testKeyMaps(data, callback){
		var current = data.lines.pop();
		if(current)
		{
			if(op.learnMode) 
				print(current.message+' [ '+current.keys+' ]');
			else print(current.message);

		    if(op.speak) speak(current.message);

			if(op.debug) 
				console.log(toMousetrapFormat(current.keys));
			var combo=toMousetrapFormat(current.keys);
			timer.time(combo);
			Mousetrap.bind(combo, function(event){ 
				event.preventDefault();
				printSuccess(current.keys+'( '+formatTime(timer.timeEnd(combo))+' )');
				Mousetrap.reset();
				testKeyMaps(data, callback);
			});
						
			Mousetrap.bind('enter', function(event){ 
				event.preventDefault();
				printFail(current.keys);
				Mousetrap.reset();
				testKeyMaps(data, callback);
			});
		}
		else
		{
			print("'"+data.title+"' finished in "+
				formatTime(timer.timeEnd(data.title)));
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

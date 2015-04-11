$(function(){

$.get("shortcuts/Emacs", function(data){
    data = _.chain(data.split(/\r?\n/))
	.filter(function(line){ return !/^[ \t]*#/.test(line);})
	.map(function(line){ 
		var pars = line.split(/\t+/); 
		return {keys:pars[0], message:pars[1].trim()}; 
	})
	.value();
	
	testKeyMap(data);
	
	function toMousetrapFormat(keys){
		return keys.toLowerCase()
		.replace(/c[-+]/g,"ctrl+")
		.replace(/m[-+]/g,"alt+")
		.replace(/s[-+]/g,"shift+")
		.replace(/spc/g,"space")
		.split(", ");
	}
	
	function testKeyMap(data){
		var current = data.pop();
		if(current)
		{
			print(current.message);
			
			Mousetrap.bind(toMousetrapFormat(current.keys), function(event, combo){ 
				printSuccess(current.keys);
				event.preventDefault();
				Mousetrap.reset();
				testKeyMap(data);
			});
						
			Mousetrap.bind('enter', function(event){ 
				event.preventDefault();
				printFail(current.keys);
				Mousetrap.reset();
				testKeyMap(data);
			});
		}
		else
		{
			print("done");
		}
	}
	
	function print(message){
		$('.main').prepend("<div class='line'>"+message+"</div>");
	}
	
	function printFail(message){
		$( ".main .line" ).first().addClass( "fail" ).text(message);
	}
	
	function printSuccess(message){
		$( ".main .line" ).first().addClass( "success" ).text(message);
	}
});
});
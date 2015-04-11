$(function(){

$.get("shortcuts/Emacs", function(data){
    data = _.chain(data.split(/\r?\n/))
	
	.filter(function(line){ return !/^[ \t]*#/.test(line);})
	.map(function(line){ 
		var pars = line.split(/\t+/); 
		return {keys:pars[0], message:pars[1].trim()}; 
	})
	.value();
    console.log(data);
	
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
			console.log(current.message+'('+toMousetrapFormat(current.keys+')'));
			
			Mousetrap.bind(toMousetrapFormat(current.keys), function(event, combo){ 
				console.log(combo);
				event.preventDefault();
				Mousetrap.reset();
				testKeyMap(data);
			});
						
			Mousetrap.bind('enter', function(event){ 
				event.preventDefault();
				console.log("Fail!!!!!!!!!!!!!");
				Mousetrap.reset();
				testKeyMap(data);
			});
		}
		else
		{
			console.log("done");
		}
	}
});
});
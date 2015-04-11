$(function(){

$.get("shortcuts/browse", function(data){
    data = _.chain(data.split(/\r?\n/))
	
	.filter(function(line){ return !/^[ \t]*#/.test(line);})
	.map(function(line){ 
		var pars = line.split(/\t+/); 
		return {keys:toCorrectKeys(pars[0]), message:pars[1].trim()}; 
	})
	.value();
    console.log(data);
	
	testKeyMap(data);
	
	function toCorrectKeys(keys){
		return keys.toLowerCase().split(", ");
	}
	
	function testKeyMap(data){
		var current = data.pop();
		if(current)
		{
			console.log(current.message+'('+current.keys+')');
			
			Mousetrap.bind(current.keys, function(event){ 
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

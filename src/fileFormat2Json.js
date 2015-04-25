var _ =require('underscore');
var _op;

exports.parse=function(data, op){
    _op=op;//p||{};
    var chapters =_.chain(data.split(/\r?\n\s*\r?\n/))
	.map(function(chapter){ 
	    var arr=chapter.split(/\r?\n/);
	    if(/^[ \t]*#/.test(arr[0]))
	    {
		return {
		    title: arr[0],
		    lines: _parseLines(_.rest(arr))
		};
	    }
	    else{
		return {
		    title: _op.testFile,
		    lines: _parseLines(arr)
		};
	    }
	})
	.value();
    return chapters;
}

function _parseLines(lines){

    return _.chain(lines)
	.filter(function(line){ return !/^[ \t]*#/.test(line);})
	.map(function(line){ 
	    var pars = line.split(/\t+/);	
	    var messageIndex=pars.length-1;
	    if(!_op.ShortDescriptions) 
		messageIndex=Math.min(messageIndex, 1);
		
	    return {
		keys:pars[0], 
		message:pars[messageIndex].trim()
	    }; 
	})
	.value();
}

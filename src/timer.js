var _times={};

exports.time =  function(label) {
	_times[label] = Date.now();
};

exports.timeEnd = function(label) {
	var duration = Date.now() - _times[label];
	_times[label] = undefined;
	return duration;
};
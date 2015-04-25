var _times={};
var _unique='````someUniqueKeyNooneWouldEverUse````'

exports.time =  function(label) {
    label=label||_unique;
	_times[label] = Date.now();
};

exports.timeEnd = function(label) {
    label=label||_unique;
	var duration = exports.timeShow(label);
	_times[label] = undefined;
	return duration;
};

exports.timeShow = function(label) {
    label=label||_unique;
	return Date.now() - _times[label];
};

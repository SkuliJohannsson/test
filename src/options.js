var qs=require('qs');
var _ =require('underscore');

var _op=qs.parse(location.search.substr(1));
_op.testFile = _op.f||'resharpervs';
_op.maxLines = _op.ml||16;
_op.learnMode = (_.has(_op, 'lm'))||false;
_op.debug = (_.has(_op, 'd'))||false;
_op.ShortDescriptions=(_.has(_op, 'sd'))||false;
_op.AutoRepeat=(_.has(_op, 'ar'))||false;
_op.speak=(_.has(_op, 'speak'))||false;
_op.time=_op.t||60000;

module.exports=_op;

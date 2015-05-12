var _t;

exports.test= function(text){
  _t=text;
};

exports.write=function(e){
  if(typeof e == 'string') e={key:e};
  e.ctrlKey=!!e.ctrlKey;
  e.altKey=!!e.altKey;
  e.shiftKey=!!e.shiftKey;

  return match(nextKeyChord(), e);
};

exports.completed=function(){
  return _t == "";
}

var match=function(a, b){
  return a.key==b.key
    &&a.ctrlKey==b.ctrlKey
    &&a.altKey==b.altKey
    &&a.shiftKey==b.shiftKey;
};

function nextKeyChord(){
  var oldText;
  var ret = {};
  var metaKeyFound;
  do{
    metaKeyFound=false;
    oldText=_t;
    _t=_t.replace(/^ *ctrl\+ */, '');
    ret.ctrlKey=ret.ctrlKey||oldText!=_t;
    metaKeyFound=metaKeyFound||oldText!=_t;

    oldText=_t;
    _t=_t.replace(/^ *alt\+ */, '');
    ret.altKey= ret.altKey||oldText!=_t;
    metaKeyFound=metaKeyFound||oldText!=_t;

    oldText=_t;
    _t=_t.replace(/^ *shift\+ */, '');
    ret.shiftKey=ret.shiftKey||oldText!=_t;
    metaKeyFound=metaKeyFound||oldText!=_t;
  }
  while(metaKeyFound)

  ret.key=_t.slice(0,1);
  _t=_t.slice(1);

  return ret;
}

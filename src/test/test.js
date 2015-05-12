var assert = require("assert");
var tt = require("../textTester");
describe('textTester', function(){
  it('Should return true on a correct try', function(){
    tt.test('a');
    assert(tt.write('a'));
  });

  it('Should return false on a wrong try', function(){
    tt.test('a');
    assert(!tt.write('b'));
  });
  it('Should evaluate each input of a sequence correctly.', function(){
    tt.test('aa');
    assert(tt.write('a'));
    assert(!tt.write('b'));
  });
  it('Should know if the whole sequence has been written correctly.', function(){
    tt.test('ab');
    tt.write('a');
    assert(!tt.completed());
    tt.write('b');
    assert(tt.completed());

    tt.test('ab');
    tt.write('a');
    tt.write('a');
    tt.write('b');
    assert(!tt.completed());
  });
  it('Should return true on a correctly typed key chord', function(){
    tt.test('ctrl+a');
    assert(tt.write({ctrlKey: true, key: "a"}));

    tt.test('alt+a');
    assert(tt.write({altKey: true, key: "a"}));


    tt.test('shift+a');
    assert(tt.write({shiftKey: true, key: "a"}));

    tt.test('alt+ctrl+shift+a');
    assert(tt.write({ctrlKey: true, altKey:true, shiftKey:true,  key: "a"}));
  });

  it('Should return false on a wrongly typed key chord', function(){
    tt.test('ctrl+a');
    assert(!tt.write({altKey: true,  key: "a"}));

    tt.test('alt+a');
    assert(!tt.write({ctrlKey: true, altKey: true, key: "a"}));

    tt.test('ctrl+alt+a');
    assert(!tt.write({ctrlKey: true, key: "a"}));
  });

  it('Should evaluate each input of a sequence correctly.', function(){
    tt.test('ctrl+a ctrl+b');
    assert(tt.write({ctrlKey: true, key: 'a'}));
    assert(tt.write({ctrlKey: true, key: 'b'}));
  });
});

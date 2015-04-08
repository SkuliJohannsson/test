$(function(){

$.get("shortcuts/browse", function(data){
    data = _.chain(data.split(/\r?\n/))
	.map(function(line){ return line.split(/\t+/); })
	.value();
    console.log(data.value());
})
    // single keys 
    Mousetrap.bind('4', function() { console.log('4'); });
    Mousetrap.bind("?", function() { console.log('show shortcuts!'); });
    Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');
 
    // combinations 
    Mousetrap.bind('command+shift+k', function() { console.log('command shift k'); return false;});
 
    // map multiple combinations to the same callback 
    Mousetrap.bind(['command+k', 'ctrl+k'], function() {
        console.log('command k or control k');
 
        // return false to prevent default browser behavior 
        // and stop event from bubbling 
        return false;
    });
 
    // gmail style sequences 
    Mousetrap.bind('g i', function() { console.log('go to inbox'); });
    Mousetrap.bind('* a', function() { console.log('select all'); });
 
    // konami code! 
    Mousetrap.bind('up up down down left right left right b a enter', function() {
        console.log('konami code');
    });



});

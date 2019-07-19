// 普通构造函数的写法
function Fn() {  
}
Fn.prototype.init = function(){
};
Fn.prototype.say = function(){}

var f = new Fn();

// jQuery的写法
function jQuery() {  
    return new Fn.prototype.init();
}
Fn.prototype.init = function(){
};
Fn.prototype.say = function(){}

Fn.prototype.init.prototype = jQuery.prototype;

// 就可以直接调用
jQuery().say();

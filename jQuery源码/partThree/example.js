// 普通构造函数的写法
// function Fn() {  
// }
// Fn.prototype.init = function(){
// };
// Fn.prototype.say = function(){}

// var f = new Fn();

// // jQuery的写法
// function jQuery() {  
//     return new Fn.prototype.init();
// }
// Fn.prototype.init = function(){
// };
// Fn.prototype.say = function(){}

// Fn.prototype.init.prototype = jQuery.prototype;

// // 就可以直接调用
// jQuery().say();

// $.extend({  // 扩展工具方法
//     fn1: function() {
//         console.log(1);
//     },
//     fn2: function() {
//         console.log(2);
//     }
// });
// // 调用
// $.fn1();
// $.fn2();

// $.fn.extend({  // 扩展实例方法
//     fn1: function() {
//         console.log(1);
//     },
//     fn2: function() {
//         console.log(2);
//     }
// })
// // 调用
// $('body').fn1();
// $('body').fn2();



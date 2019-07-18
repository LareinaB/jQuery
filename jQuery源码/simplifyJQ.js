(function () {
    
    // 21-94 定义一些变量核函数

    jQuery = function() {};
    //.....

    // 96-283  在JQ原型上添加一些方法和属性
    jQuery.fn = jQuery.prototype = {};
    //.....

    // 285-347  extend:将方法扩展到JQ原型上供实例使用
    jQuery.extend = jQuery.fn.extend = function() {};
    //.....

    // 349-817  jQuery.extend():扩展工具的方法
    jQuery.extend({});
    //.....

    // 887-2856 Sizzle CSS Selector 复杂选择器的实现
    (function( window, undefined ) {})(
        function Sizzle( selector, context, results, seed ) {}
        //.....
    );
    
    // 2880-3042 JQ的回调对象处理，通过回调对象管理函数 对函数的统一管理
    jQuery.Callbacks = function( options ){};
    //.....

    // 3043-3183 延迟对象 对异步的统一管理
    jQuery.extend({
        Deferred : function(){}
        //.....
    }); 
    
    // 3184-3295 功能检测 检测新老版本浏览器的一些默认值之类的
    jQuery.support = (function( support ) {})();
    //.....

    // 3308-3652  数据缓存
    function Data(){}
    Data.prototype = function (param) {};
    //.....

    // 3653-3797 队列管理
    jQuery.extend({
        queue: function(){},
        dequeue: function(){}
        //.....
    });

    // 3803-4299 对元素属性的操作
    jQuery.fn.extend({
        attr: function () {},
        prop: function(){},
        addClass: function(){},
        // ........
    })

    // 4300-5128 事件操作
    jQuery.fn.extend({
        on: function(){},
        trigger: function(){},
        // .....
    })

    // 5140-6057 DOM操作 增删改查 包装 筛选等等
    jQuery.fn.extend({
        parent: function(){},
        sibling: function(){},
        append: function(){},
        filter: function(){},
        // .....
    })

    // 6058-6620  对元素样式的操作
    jQuery.fn.extend({
        css: function(){}
        // .....
    })

    // 6621-7854 提交的数据和AJAX的操作
    jQuery.fn.load = function(){}
    jQuery.extend({
        ajax: function(){},
        getJSON: function(){},
        getScript: function(){}
    })
    //.....

    // 7855-8584  JS动画以及运动形式效果等
    function Animation(){}
    //.....

    // 8585-8792 元素位置和尺寸
    jQuery.fn.offset = function(){}
    //.....

    // 8804-8821 JQ 支持模块化的模式
    module.exports = jQuery;
    //.....

    // 8822-8826 对外提供使用jQuery的接口
    window.$ = window.jQuery = jQuery;
})();

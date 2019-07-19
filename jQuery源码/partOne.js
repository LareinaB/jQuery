// 将window作为参数传进来，查找速度快，
// 与外界的window隔离，压缩的时候有用
// undefined在有的浏览器下可以被改变，为了防止
(function( window, undefined ) {
    var
        rootjQuery, // root jQuery(document)
        readyList, // DOM操作用的
        // 处理兼容 typeof undefined得到一个字符串'undefined' 
        core_strundefined = typeof undefined, 

        // 用变量存储
        location = window.location,
	    document = window.document,
        docElem = document.documentElement,
        
        // 防止命名冲突
	    _jQuery = window.jQuery,
        _$ = window.$,
        
        // 类型对应 {'[object String]': 'string', '[object Array]': 'array', ....}
        class2type = {},

        // 数据缓存有关
        core_deletedIds = [],

        // 版本信息
        core_version = "2.0.3",

        // 用变量存储后面常用的方法，属性等
        core_concat = core_deletedIds.concat,
	    core_push = core_deletedIds.push,
	    core_slice = core_deletedIds.slice,
	    core_indexOf = core_deletedIds.indexOf,
	    core_toString = class2type.toString,
	    core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,
        
        // jQuery(), $()都是在执行这个函数 
        // 返回一个实例对象，这个对象的原型=JQ原型
        // 返回一个jQuery.fn.init的实例对象就相当于返回了jQuery的实例对象
        // 因此可以直接jQuery().xxx()调用方法
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context, rootjQuery );
        };

        jQuery.fn = jQuery.prototype = {};

        jQuery.fn.init.prototype = jQuery.fn;


})( window );
// extend扩展到jQuery方法上 jQuery.fn是jQuery原型，实例方法
// $.extend() -> this -> $ -> this.fn -> $.fn()
// $.fn.extend() -> this -> $.fn  -> this.fn -> $().fn()
// 借助this可以用同样的方法实现
jQuery.extend = jQuery.fn.extend = function() {
    // 定义一些变量
    var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

    // Handle a deep copy situation 判断是否是深拷贝的情况
    // $.extend(true, c, b) 若第一个是true的时候，目标元素下标就从1开始
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

    // 深拷贝情况下判断target的类型 参数是否正确
	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

    // 判断是否是插件 即只有一个参数传进来 就是扩展插件的方法
    // extend jQuery itself if only one argument is passed
    // 此时的target就是当前this（$和$.fn两种情况）
	if ( length === i ) {
		target = this;
		--i;
	}

    // 可能传入多个对象的情况，把后面的对象扩展到第一个上面
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

                // 防止循环引用 处理以下情况
                // var name = {}
                // $.extend(name, {name: name});
				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

                // 深拷贝 判断要扩展的是不是对象或数组  拷贝继承
				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

                    // 利用递归 层层赋值
					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

                // 浅拷贝 就直接赋值
				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
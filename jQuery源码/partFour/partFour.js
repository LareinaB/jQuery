// 349-817  jQuery.extend():扩展工具的方法 通过扩展插件的形式 只传递第一个参数
jQuery.extend({
    // Unique for each copy of jQuery on the page
    // 生成唯一字符串（内部）
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

    // 防止冲突，冲突的话就交出$，jQuery的使用权
    // 返回jQuery，外面用一个变量来接，他就代表jQuery
    // 参数为true表示jQuery使用权也放弃
    _jQuery = window.jQuery,
    _$ = window.$,
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

    // Is the DOM ready to be used? Set to true once it occurs.
    // DOM是否加载完毕 （内部）
	isReady: false,

	// A counter to track how many items to wait for before
    // the ready event fires. See #6781
    // 等待文件的计数器（内部）
	readyWait: 1,

    // Hold (or release) the ready event
	// 推迟DOM的触发
	// hold为true时要jQuery.readyWait++
    // 释放延迟的时候就会--，为0的时候就到ready里面执行
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

    // Handle when the DOM is ready
    // 准备DOM触发

    // 最终调用的就是$.ready()
    // readyList.resolveWith( document, [ jQuery ] );
    // this是document， args是jQuery这个函数
    // $(function(args){
    //     alert(this);
    //     alert(args);
    // })

    // DOM触发的三种情况
    // $(function(){});
    // $(document).ready(function(){});
    // $(document).on('ready', function(){});
    // 前两种对应readyList.resolveWith( document, [ jQuery ] );
    // 第三中对应jQuery( document ).trigger("ready").off("ready");
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		// DOM准备完毕再进来就直接return 保证只触发一次
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

        // document就是jQuery.ready.promise().done(fn)中
        // fn的指向，jQuery就是fn的参数
		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

        // Trigger any bound ready events
        // $(document).on('ready', function(){});
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    // 判断内容是否是函数 不兼容alert以及DOM的一些方法
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

    // 是否维数组
	isArray: Array.isArray,

    // 是否为window window全局对象/窗口两种
	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

    // 是否为数字 typeof NaN = true
	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	// 判断数据类型
	// Object.toString.call() class2type的值['object' 'type']格式的
	// jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), 
	// function(i, name) {
	// 	class2type[ "[object " + name + "]" ] = name.toLowerCase();
	// });

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

    // 是否为纯粹的对象 指该对象是否是通过"{}"或"new Object"创建的
	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		// 只有Object.prototype才有isPrototypeOf这个方法
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

    // 是否为空对象
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

    // 抛出异常
	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    // HTML解析节点
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		// 第二个参数是布尔类型就表示保不保存script标签
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		// 匹配单标签rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		// 多个标签  创建文档碎片的形式 核心
		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	// 解析JSON
	// parseJSON: JSON.stringify()，JSON转字符串,
	parseJSON: JSON.parse,

    // Cross-browser xml parsing
    // 解析XML
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

    // 空函数 写组件插件的时候
	noop: function() {},

    // Evaluates a script in a global context
	// 全局解析JS
	// 将function内部的变量解析为全局变量
	// function test() {
	// 	jQuery.globalEval("var newVar = true;");
	// }
	// test();
	// console.log(newVar);
	// eval既是一个关键字也是window下的一个方法，直接用eval调用会当关键字处理
	// 可正确使用的两种方式:window.eval();用window下的一个变量来存储再调用
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    // js中不能接受横杠，就要把CSS中的这种样式转为驼峰的形式(内部)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	// 是否为指定节点名(内部)
	// $.nodeName(document.documentElement, 'html'); true
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	// 遍历集合 数组类数组对象都可遍历
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		// this指当前操作项， 后面分别是键和值
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// 去掉前后空格 原生使用str.trim()
	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	// 类数组转为真数组 内部使用要两个参数(对象必须有个length属性),外部使用一个参数 
	// init 返回的就是makeArray后的结果
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	// 数组版indexOf
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	// 合并数组 **常用**
	// 对外针对数组 对内转为需要的json格式
	// if->$.merge(['a','b'], ['c','d']) 
	// else -> $.merge(['a','b'], {'0':'c','1':'d'})   
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	// 过滤数组 
	// 第三个参数不写或false，回调函数中为真的过滤出来
	// 第三个参数true，回调函数中为假的过滤出来
	// 秒哇，十分节约代码量了可以说
	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	// 映射新数组(内部) 内部使用要有arg参数
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays 数组扁平化
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	// 改变this指向
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		// $.proxy(document, 'show'); 支持简化写法
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		// 前两个一个是方法，一个是新的this指向
		// 参数从第三个开始 
		args = core_slice.call( arguments, 2 );
		// 后面执行的方法，把前面括号里的参数跟后面的合并
		// 传参的三种方式
		// $.proxy(show, document, 3)(4);
        // $.proxy(show, document, 3, 4)();
        // $.proxy(show, document)(3, 4);
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	// 多功能值操作(内部)
	// 每个参数代表什么意思
	// elems元素(集合) fn回调函数(css,attr) key样式属性(width)  value样式值(10px)
	// chainabletrue设置false获取 emptyGet raw为真的时候value是字符串,假的时候是方法
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		// 设置很多属性值的时候利用递归完成
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		// 设置一个值
		} else if ( value !== undefined ) {
			chainable = true;

			// value传一个方法的情况
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			// key为空的时候
			if ( bulk ) {
				// Bulk operations run against the entire set
				// key 空 value 字符串
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		// 获取 有值的话返回的是第一个
		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	// CSS交换(内部) 举例：
	// js原生的offsetWidth不能获取到display:none
	// jQuery的处理办法，先把原来的display:none保存到一个集合中，
	// 用新的display:block;visibility:hidden;position:absolute;替换
	// 获取到值之后再把原来的换回去
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	// 元素节点集合
	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	// 如果不加===0那一步判断 对于不传参时的argumentslength-1是-1肯定返回false
	// 因此加上这一步判断对于这种情况才能返回正确的值
	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}
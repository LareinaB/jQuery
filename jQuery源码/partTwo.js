// 添加属性和方法
jQuery.fn = jQuery.prototype = {
    jquery: core_version, // 版本
    constructor : jQuery, // 修改构造函数问题
    
    /**
     * selector 选择器 context相当于选择器的上下文
     * 允许传三种不同类型的: 字符串("li", ".box")，DOM元素(document)，function
     */

    // 初始化和参数管理
    init :  function( selector, context, rootjQuery ){
        // 传入的selector类型是string
        if ( typeof selector === "string" ) {
            // $('<li>1</li>')
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];
			} else {
                // 匹配到这两种 $('#box') $('<li>hello')
                // rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
                match = rquickExpr.exec( selector );
                // match = [null, '<li>', null] 创建标签
                // match = ['#box', null, 'box']
            }  
            // 创建标签或者匹配id的情况 $('<li>') 和 $('#box')
            if ( match && (match[1] || !context) ) {

                // 进一步判断 创建标签，$('<li>')
				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {

                    // 指定不同的环境的根节点 在什么环境下创建元素，默认是document
					context = context instanceof jQuery ? context[0] : context;

                    // scripts is true for back-compat
                    // match[1]存在，jquery通过parseHTML（将html字符串转换为dom）
                    // 和merge（把第二个数组merge到第一个数组）方法，将HTML标记转化为由jQuery对象包装的DOM元素，并返回
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

                // HANDLE: $(#id)
                // match = ['#box', null, 'box']
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

            // HANDLE: $(expr, $(...))
            // 处理两种情况
            // $('ul', $(document)).find('li') $('ul').find('li')  if => jQuery(document).find('li')
            // $('ul', document).find('li')  else  => jQuery(document).find('li')
			} else if ( !context || context.jquery ) {
                // rootjQuery $(document) 
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
            }
        // HANDLE: $(DOMElement)
        // selector是节点 $(div) 节点才有nodeType
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
        // Shortcut for document ready
        // 文档加载
        // $(document).ready(function(){}) === $(function(){})
        // 后者返回的就是前者执行后的结果
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

        // 传的是一个JQ对象 处理情况
        // $($('#box')) -> $('#box')
		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

        // makeArray: 把类数组转为数组，this参数表示再把结果转为JQ对象
		return jQuery.makeArray( selector, this );
    },

    selector: "", // 存储选择字符串 默认空
    length: 0, //this对象的长度 默认0
    
     // 转数组 只能给JQ实例使用
     // $('div').toArray() -> [div, div, div...]
    toArray: function() {
        // [].call($());
		return core_slice.call( this );
	},
    
   // 把JQ对象转原生集合，有num就转第几个对象，没有就转全部
   // $('div').get(1).innerHTML = '22222';
   // $('div').get().innerHTML = '44444';
    get: function( num ) {
		return num == null ?
			// Return a 'clean' array
			this.toArray() :
			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
    }, 
    
    // JQ对象入栈 内部使用
    // $('div').pushStack( $('span') ).css('background', 'red')
    // $('div')先入栈$('span')后入，所以样式会添加在$('span')上面
    pushStack: function( elems ) {
		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );
		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;
		// Return the newly-formed element set
		return ret;
    },
    
    // 遍历集合 内部使用 调用工具方法实现的
    each: function( callback, args ) {
		return jQuery.each( this, callback, args );
    },
    
    // DOM加载的接口  调用工具方法实现的
    ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

    // 假设有4个div
    // $('div').slice(1,3).css('background', 'red')
    // .end().css('color', 'blue')
    // 第二三个div背景色是红的
    // 内部使用了入栈操作，将传入参数选中的div依次入栈
    // end 回到上一层，所以四个div颜色都变成蓝色
	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

    // 集合当中的指定项  也是用pushStack实现
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

    // 对集合进行的二次处理
    // 集合映射  调用工具方法map
	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

    // 回到上一层
    // $('div').pushStack( $('span') ).css('background', 'red')
    // .end().css('background', 'yellow')
    // red是给span加的背景色，yellow就是给div加的
	end: function() {
		return this.prevObject || this.constructor(null);
    },
    
    // 内部使用 都用的是数组的方法
    push: core_push,
	sort: [].sort,
	splice: [].splice

}


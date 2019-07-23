// 功能检测 检测新老版本浏览器的一些默认值之类的
// support 检测出哪些选项不兼容 propHooks来处理不兼容的问题
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

    // Finish early in limited environments
    // 后续版本中已经删除 input.type默认值是text 所以这句没意义
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
    // Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
    // 老版本的webkit下checkOn的值为false 其余都是true
    support.checkOn = input.value !== "";
    
    // 4291行对checkOn做的处理
    // if ( !jQuery.support.checkOn ) {
	// 	jQuery.valHooks[ this ].get = function( elem ) {
	// 		// Support: Webkit
	// 		// "" is returned instead of "on" if a value isn't specified
	// 		return elem.getAttribute("value") === null ? "on" : elem.value;
	// 	};
	// }

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
    support.optSelected = opt.selected;
    // 4255 默认下拉列表第一项选中
    // if ( !jQuery.support.optSelected ) {
    //     jQuery.propHooks.selected = {
    //         get: function( elem ) {
    //             var parent = elem.parentNode;
    //             if ( parent && parent.parentNode ) {
    //                 parent.parentNode.selectedIndex;
    //             }
    //             return null;
    //         }
    //     };
    // }

    // Will be defined later
    // 这些值是要对DOM节点进行样式操作，因此得等到CSS样式加载完成才能处理
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
    // Support: IE9, IE10
    // 复制的下拉框是否跟以前的有同样的默认选中
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    // 下拉框禁止选择 列表禁止与否
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
    // Support: IE9, IE10 默认是on
    // 先设置value再设置type
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
    // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
    // 检测onfocusin事件是否可以冒泡（IE下支持，其余不） onfocus没有冒泡 
	support.focusinBubbles = "onfocusin" in window;

    // 检测绘图区背景的克隆改变，原来的会不会跟着改变 
    // IE下会影响 其余基本不会
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
            // 除了Safari其他浏览器都会把百分比自动转为像素
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
            // IE在怪异模式下会减掉padding border当做实际可用width的宽度
            support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );
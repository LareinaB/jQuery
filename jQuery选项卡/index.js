var tabRender = ( function (){
    var $tabBox = $( '#tabBox' ),
        $tabList = $tabBox.find( '.tab>li' ),
        $conList = $tabBox.children( '.con' );

    // 给所有li绑定点击事件
    // function bindEvent() {
    //   $tabList.on( 'click', function () {
    //       // 避免重复执行$(this) 因为他会创建jQuery实例
    //       const $this = $( this ),
    //       _index = $this.index();
    //       // this:当前点击的这个li
    //       $this.addClass( 'select' )
    //           .siblings().removeClass( 'select' );
    //       $conList.each( function ( index, item ) {
    //           // this:item
    //           var $item = $(item);
    //           if( _index === index ){
    //               // 对应
    //               $item.addClass( 'select' );
    //           } else {
    //               $item.removeClass( 'select' );
    //           }
    //       } );
    //   })
    // }

    function bindEvent() {
        $tabList.on( _default.eventType, function () {
            // 避免重复执行$(this) 因为他会创建jQuery实例
            const $this = $( this ),
                _index = $this.index();
            // this:当前点击的这个li
            $this.addClass( 'select' )
                .siblings().removeClass( 'select' );
            $conList.eq(_index).addClass('select')
                .siblings().removeClass('select');
        })
    }

    let _default = {
        initIndex: 0,
        eventType: 'click'
    };

    function initDefault() {
        $tabList.eq(_default.initIndex).addClass( 'select' )
            .siblings().removeClass('select');
        $conList.eq(_default.initIndex).addClass( 'select' )
            .siblings().removeClass('select');
    }

    return {
        init: function ( options ) {
            // init parameters
            if( typeof options !== 'undefined' ) {
                $.each( options, function ( key, value ) {
                    if( options.hasOwnProperty(key) ) {
                        _default[ key ] = value;
                    }
                } )
            }
            initDefault();
            bindEvent();
        }
    }
} )();

tabRender.init({
    initIndex: 1,
    eventType: 'mouseover'
});
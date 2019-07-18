~function ( $ ) {
    // 这个私有变量$肯定是jQuery，防止$被转让
   function TabPlugin ( options ) {
       // this: 操作这个插件的实例
       let $tabBox = this,
           $tabList = $tabBox.find( '.tab>li' ),
           $conList = $tabBox.children( '.con' );
       
       let _default = {
           initIndex: 0,
           eventType: 'click'
       };
       
       options && $.each( options, function ( key, item ) {
           if( options.hasOwnProperty( key ) ) {
               _default[ key ] = value;
           }
       } );

       // showDefault
       change(_default.initIndex);

       
       // bind event
       $tabList.on( _default.eventType, 
          function () {
              var $this = $( this ),
                  index = $this.index();
              change(index);
          } );

       function change(index) {
           $tabList.eq(index).addClass( 'select' )
               .siblings().removeClass( 'select' );
           $conList.eq(index).addClass( 'select' )
               .siblings().removeClass( 'select' );
       }

   }

   $.fn.extend( {
       TabPlugin: TabPlugin
   } );


}( jQuery );

// $('#tabBox').TabPlugin();


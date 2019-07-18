~function ($) {
    function  pluginBanner(options) {
        var $container = this,
            $wrapper = $container.children('.wrapper'),
            $focusBox = $container.children('.focusBox'),
            $arrowLeft = $container.children('.left'),
            $arrowRight = $container.children('.right');
        var $slideList = null,
            $imgList = null,
            $focusList = null,
            bannerData = null;

        // =>initParameter
        var _default = {
            initIndex: 0,
            // 切换一次的间隔
            autoInterval: 5000,
            needFocus: true,
            showFocus: true,
            eventFocus: 'mouseenter',
            showArrow: true,
            eventArrow: 'click',
            needAuto: true,
            url: null
        };
        options && $.each(options, function (key, value) {
            if(options.hasOwnProperty(key)){
                _default[key] = options[key];
            }
        });
        var initIndex = _default.initIndex,
            autoInterval = _default.autoInterval,
            showFocus = _default.showFocus,
            needFocus = _default.needFocus,
            eventFocus = _default.eventFocus,
            showArrow = _default.showArrow,
            eventArrow = _default.eventArrow,
            needAuto = _default.needAuto;

        // => getData && bindData
        ~function () {
            $.ajax({
                url: _default.url,
                method: 'get',
                dataType: 'json',
                async: false,
                success: function (result) {
                    bannerData = result;
                }
            });

            var str = ``,
                strFoucs = ``;
            $.each(bannerData, function (index, item) {
                str += `<li class="slide">
                    <img src="" data-img="${item.img}" alt="">
                    </li>`;
                if(showFocus){
                    strFoucs += `<li class="${index === bannerData.length - 1 ? 'last' : ''}"></li>`
                }

            });
            $wrapper.html(str);
            showFocus ? $focusBox.html(strFoucs) : null;

            // getElement
            $slideList = $wrapper.children();
            $imgList = $wrapper.find('img');
            showFocus ? $focusList = $focusBox.children() : null;
        }();

        // => initShow
        ~function () {
            $slideList.css({
                opacity: 0,
                zIndex: 0
            }).eq(initIndex).css({
                opacity: 1,
                zIndex: 1
            });
            if(showFocus){
                $focusList.removeClass('select').eq(initIndex).addClass('select');
            }
        }();

        // => Lazy img
        $(window).on('load', function () {
            $imgList.each(function (index, item) {
                var tempImg = new Image;
                tempImg.onload = function () {
                    item.src = this.src;
                    item.style.display = 'block';
                    tempImg = null;
                };
                tempImg.src = $(item).data('img');
                console.log(tempImg.src);
            })
        });

        // => change banner
        // 自动切换的定时器
        var autoTimer = null,
            // 轮播次数
            count = bannerData.length;
        needAuto ? autoTimer = setInterval(autoMove, autoInterval) : null;
        function autoMove() {
            initIndex ++;
            initIndex >= count ? initIndex = 0 : null;
            change();
        }

        // => 鼠标滑过暂停和开始动画
        $container.on('mouseenter', function () {
            needAuto ? clearInterval(autoTimer) : null;
            if(showArrow){
                $arrowLeft.css('display', 'inline-block');
                $arrowRight.css('display', 'inline-block');
            }

        }).on('mouseleave', function () {
            needAuto ? autoTimer = setInterval(autoMove, autoInterval) : null;
            if(showArrow){
                $arrowLeft.css('display', 'none');
                $arrowRight.css('display', 'none');
            }

        });

        // => 左右箭头切换
        if(showArrow){
            $arrowRight.on(eventArrow, function () {
                initIndex ++;
                initIndex >= count ? initIndex = 0 : null;
                change();
            });
            $arrowLeft.on(eventArrow, function () {
                initIndex --;
                initIndex === -1 ? initIndex = count - 1 : null;
                change();
            });
        }

        if(showFocus && needFocus){
            // => 鼠标滑过焦点
            $focusList.on(eventFocus, function () {
                initIndex = $(this).index();
                change();
            });
        }


        // => change
        function change() {
            var $curSlide = $slideList.eq(initIndex);
            $curSlide.css({zIndex: 1})
                .siblings().css({zIndex: 0});
            $curSlide.stop().animate({opacity: 1}, 200, function () {
                $curSlide.siblings().css({opacity: 0});
            });

            if(showFocus){
                // -> focus
                $focusList.eq(initIndex).addClass('select')
                    .siblings().removeClass('select');
            }
        }

    }
    $.fn.extend({
        pluginBanner: pluginBanner
    });
}(jQuery);


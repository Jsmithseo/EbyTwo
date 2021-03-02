(function($) {
    $.fn.Popup = function(options) {
        var defaults = $.extend({
            centerPopup: true,
            open: function() {},
            closed: function() {}
        }, options);

        /******************************
        Private Variables
        *******************************/

        var object = $(this);
        var settings = $.extend(defaults, options);

        /******************************
        Public Methods
        *******************************/

        var methods = {
            init: function() {
                return this.each(function() {
                    methods.appendHTML();
                    methods.setEventHandlers();
                    methods.showPopup();
                });
            },

            /******************************
            Append HTML
            *******************************/

            appendHTML: function() {

                // if this has already been added we don't need to add it again
                if ($('.PopupBackground').length === 0) {
                    var background = '<div class="PopupBackground"></div>';
                    $('body').prepend(background);
                }

                if (object.find('.PopupClose').length === 0) {
                    var close = '<div class="PopupClose">X</div>';
                    object.prepend(close);
                }
            },

            /******************************
            Set Event Handlers
            *******************************/

            setEventHandlers: function() {
                $(".PopupClose, .PopupBackground").on("click", function(event) {
                    methods.hidePopup();
                });
                $(window).on("resize", function(event) {
                    if (settings.centerPopup) {
                        methods.positionPopup();
                    }
                });

            },

            removeEventListners: function() {
                $(".PopupClose, .PopupBackground").off("click");
            },

            showPopup: function() {
                $(".PopupBackground").css({
                    "opacity": "0.7"
                });
                $(".PopupBackground").fadeIn("fast");
                object.fadeIn("slow", function() {
                    settings.open();
                });
                if (settings.centerPopup) {
                    methods.positionPopup();
                }
            },
            hidePopup: function() {
                $(".PopupBackground").fadeOut("fast");
                object.fadeOut("fast", function() {
                    methods.removeEventListners();
                    settings.closed();
                });
            },

            positionPopup: function() {
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var popupWidth = object.width();
                var popupHeight = object.height();

                var topPos = (windowHeight / 2) - (popupHeight / 2);
                var leftPos = (windowWidth / 2) - (popupWidth / 2);
                if (windowWidth < 1025) {
                    var leftPos = (windowWidth / 2) - (popupWidth / 1.9);
                }
                if (windowWidth < 767) {
                    var leftPos = (windowWidth / 2) - (popupWidth / 1.7);
                }
                if (topPos < 30) topPos = 30;

                object.css({
                    "position": "absolute",
                    "top": topPos,
                    "left": leftPos
                });
            },

        };

        if (methods[options]) { // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) { // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);
        } else {
            $.error('Method "' + method + '" does not exist in popup plugin!');
        }
    };

})(jQuery);
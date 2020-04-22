/*
jQuery操作dom的时候, $()后就是一个juqeury对象
*/
(function (window) {
  var jQuery = function (selector, context) {
    return new jQuery.fn.init(selector, context);
  };
  jQuery.fn = jQuery.prototype = {
    init: function (selector, context) {},
  };
  jQuery.fn.init.prototype = jQuery.fn;
  jQuery.extend = jQuery.fn.extend = function () {};
  window.$ = window.jQuery = jQuery;
})(window);

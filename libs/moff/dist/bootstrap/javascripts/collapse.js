!function(l){"use strict";var o=function(t,e){this.$element=l(t),this.options=l.extend({},o.DEFAULTS,e),this.$trigger=l('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};function i(t){var e,a=t.attr("data-target")||(e=t.attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"");return l(a)}function r(s){return this.each(function(){var t=l(this),e=t.data("bs.collapse"),a=l.extend({},o.DEFAULTS,t.data(),"object"==typeof s&&s);!e&&a.toggle&&/show|hide/.test(s)&&(a.toggle=!1),e||t.data("bs.collapse",e=new o(this,a)),"string"==typeof s&&e[s]()})}o.VERSION="3.3.5",o.TRANSITION_DURATION=350,o.DEFAULTS={toggle:!0},o.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},o.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var t,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(t=e.data("bs.collapse"))&&t.transitioning)){var a=l.Event("show.bs.collapse");if(this.$element.trigger(a),!a.isDefaultPrevented()){e&&e.length&&(r.call(e,"hide"),t||e.data("bs.collapse",null));var s=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var i=function(){this.$element.removeClass("collapsing").addClass("collapse in")[s](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!l.support.transition)return i.call(this);var n=l.camelCase(["scroll",s].join("-"));this.$element.one("bsTransitionEnd",l.proxy(i,this)).emulateTransitionEnd(o.TRANSITION_DURATION)[s](this.$element[0][n])}}}},o.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var t=l.Event("hide.bs.collapse");if(this.$element.trigger(t),!t.isDefaultPrevented()){var e=this.dimension();this.$element[e](this.$element[e]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var a=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};if(!l.support.transition)return a.call(this);this.$element[e](0).one("bsTransitionEnd",l.proxy(a,this)).emulateTransitionEnd(o.TRANSITION_DURATION)}}},o.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},o.prototype.getParent=function(){return l(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(l.proxy(function(t,e){var a=l(e);this.addAriaAndCollapsedClass(i(a),a)},this)).end()},o.prototype.addAriaAndCollapsedClass=function(t,e){var a=t.hasClass("in");t.attr("aria-expanded",a),e.toggleClass("collapsed",!a).attr("aria-expanded",a)};var t=l.fn.collapse;l.fn.collapse=r,l.fn.collapse.Constructor=o,l.fn.collapse.noConflict=function(){return l.fn.collapse=t,this},l(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(t){var e=l(this);e.attr("data-target")||t.preventDefault();var a=i(e),s=a.data("bs.collapse")?"toggle":e.data();r.call(a,s)})}(jQuery);
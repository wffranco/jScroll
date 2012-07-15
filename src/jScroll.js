/**
* jScroll - A jQuery iScroll plugin.
*
* So what makes jScroll different?  If you have iOS5, it will use native scrolling.  That, and
* you don't need to have an id on your element.  If one is there, jScroll will use it.  If there
* isn't one there, jScroll will create an id (uuid) for it and use that.
*
* It works like this:
*
*	$("div").jScroll();  //Done like this, it uses the default options.
*	$("div").jScroll({	 //Done like this, only those options are overridden.
*		lockDirection : false,
*		fadeScrollbar : true,
*		forceIscroll : false
*	});
*	$("div").jScroll("remove");  //Removes iScroll from all elements in this set.
*	$("div").jScroll({ //Adds pinch to zoom functionality on this div.
*		zoom : true
*	});
*	$("div").jScroll("refresh");  //Refresh iScroll in all elements
*	$("div").jScroll("force",options); //Force iScrool
*	$("div").jScroll("rebuild",options); //Destroy the actual scroll (if exists) and create a new one
*	//You can run a function using the iScrool
*	$("div").jScroll("run",function(iScroll){
*		--do something with the iScroll--
*	}
*
* Note:  If you're using iOS5, the only valid options are vScroll & hScroll, unless you use zoom or force it.
*
* It's not 100% fool-proof though.  It still relies on you knowing how to use iScroll.  If
* you have questions about that, or about possible options, check out: http://cubiq.org/iscroll-4
*
* @author Jack Slingerland (jacks@teamddm.com)
* @link http://www.teamddm.com
* @version 1.4.1
*/
(function($) {

	$.fn.jScroll = function() {
		var customOptions = {},
			action = "scroll";

		//Determine what action we should be taking.
		if(typeof arguments[0] === "string") {
			action = arguments[0];
			customOptions = arguments[1];
		} else {
			customOptions = arguments[0];
		}

		var options = $.extend($.fn.jScroll.defaultOptions, customOptions);
		return this.each(function() {
			var scroll=$(this).data('iscroll');
			if(scroll){//If the iScroll already created, check the action
				if(action === "rebuild") {
					remove_scroller(this);
					add_scroller(this, options);
				}
				if(action === "refresh"){
					scroll.refresh();
				}
				if(action === "remove" || options.remove === true) {
					remove_scroller(this);
				}
				if(action === "run" && typeof arguments[1] === "function"){
					arguments[1](scroll);
				}
			} else if(is_ios_5() && !options.zoom && !options.forceIscroll && action !== "force" ) {
				//We can use native scrolling if we're on iOS 5, unless we force it or need zoom
				var type = "";
				if(options.hScroll && !options.vScroll) {
					type = "horizontal";
				} else if(!options.hScroll && options.vScroll) {
					type = "vertical";
				} else {
					type = "both";
				}

				if(action === "remove" || options.remove === true) {
					remove_native_scroller(this, type);
				} else {
					add_native_scroller(this, type);
				}
			} else if( action === "scroll" || action === "force" || action == "rebuild" ) {
				//if not scroll, create one.
				add_scroller(this, options);
			}
		});
	};

	/* Default options - The same as creating an iScroll object with no parameters */
	$.fn.jScroll.defaultOptions = {
		hScroll : true,
		vScroll : true,
		hScrollbar : true,
		vScrollbar : true,
		fixedScrollbar : false,
		fadeScrollbar : true,
		hideScrollbar : true,
		bounce : true,
		momentum : true,
		lockDirection : false,
		forceIscroll : false,
		zoom : false, //Pinch to zoom.
		useTransition : false,  //Performance mode!
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType !== 1) {
				target = target.parentNode;
			}

			if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
				e.preventDefault();
			}
		},
		remove : false
	};

	/* Private functions */

	function add_native_scroller(that, type) {
		$el = $(that);
		if(type === "horizontal") {
			$el.css("overflow-x", "scroll");
		} else if(type === "vertical") {
			$el.css("overflow-y", "scroll");
		} else {
			$el.css("overflow", "scroll");
		}

		$el.css("-webkit-overflow-scrolling", "touch");
	}

	function add_scroller(that, options) {
		var scroll;
		//setTimeout(function() {
			scroll = new iScroll(that, options);
			$(that).data('iscroll',scroll);
		//},100);
	}

	function is_ios_5() {
		return navigator.userAgent.match(/OS 5_[0-9_]+ like Mac OS X/i) != null;
	}

	function remove_native_scroller(that, type) {
		$el = $(that);
		if(type === "horizontal") {
			$el.css("overflow-x", "");
		} else if(type === "vertical") {
			$el.css("overflow-y", "");
		} else {
			$el.css("overflow", "");
		}
		$el.css("-webkit-overflow-scrolling", "");
	}

	function remove_scroller(that) {
		var scroll = $(that).data('iscroll');
		if(scroll){
			scroll.destroy();
			$(that).data('iscroll',null);
		}
	}

})(jQuery);
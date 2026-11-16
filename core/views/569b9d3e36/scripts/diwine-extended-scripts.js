/**
* SVG replacer. Replaces <img src=svg/> into SVG element.
*
* Credits: How to change color of SVG image using CSS (jQuery SVG image replacement)?, http://stackoverflow.com/q/11978995
*/
jQuery(function(){
	"use strict";
	try {
		jQuery('img.svg,.wpb_single_image.svg>figure>div>img').each(function(){
			var $img = jQuery(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			jQuery.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = jQuery(data).find('svg');

				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}

				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');

				// Check if the viewport is set, else we gonna set it if we can.
				if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
					$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
				}

				// Replace image with new SVG
				$img.replaceWith($svg);

			}, 'xml');

		});
	}catch(x) {}
});

//Request animation frame polyfill
!function(){"use strict";for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b){var d=(new Date).getTime(),e=Math.max(0,16-(d-a)),f=window.setTimeout(function(){b(d+e)},e);return a=d+e,f}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}();

// http://codepen.io/Lewitje/pen/YybQEP original copy from Lewi Hussay updated to work with multiple divs
// Equal height - by Burfield www.burfield.co.uk
// 2016-30-03 - Changed - Refactored from jQuery to vanilla JS (@jacobwarduk http://www.jacobward.co.uk)
// Example usage use data-match-height="groupName" on anything!!!

var matchHeight = {

  match: function() {
	"use strict";
    var groupName = Array.prototype.slice.call(document.querySelectorAll("[data-match-height]"));
    var groupHeights = {};

    for (var item of groupName) {

      var data = item.getAttribute("data-match-height");

      item.style.minHeight = "auto";

      if (groupHeights.hasOwnProperty(data)) {
        Object.defineProperty(groupHeights, data, {
          value: Math.max(groupHeights[data], item.offsetHeight),
          configurable: true,
          writable: true,
          enumerable: true
        });
      } else {
        groupHeights[data] = item.offsetHeight;
      }
    }

    var groupHeightsMax = groupHeights;

    Object.getOwnPropertyNames(groupHeightsMax).forEach(function(value) {

      var elementsToChange = document.querySelectorAll("[data-match-height='" + value + "']");

      for (var i = 0; i < elementsToChange.length; i++) {
        elementsToChange[i].style.height = Object.getOwnPropertyDescriptor(groupHeightsMax, value).value + "px";
      }
    });
  },

  eventListeners: function() {
	"use strict";
    window.addEventListener("resize", function() {
			matchHeight.match();
		});
  },

  init: function() {
	"use strict";
    this.eventListeners();
    this.match();
  }
};

// Initialising on DOM load
document.addEventListener("DOMContentLoaded", function() {
	"use strict";
	matchHeight.init();
});


/**
* timeline
* original source: https://codepen.io/knyttneve/pen/bgvmma
*/
(function ($) {
	"use strict";
	$.fn.timeline = function () {
		var selectors = {
			id: $(this),
			item: $(this).find(".timeline-item"),
			activeClass: "timeline-item--active",
			img: ".timeline__img"
		};
		selectors.item.eq(0).addClass(selectors.activeClass);
		selectors.id.css(
			"background-image",
			"url(" +
			selectors.item
			.first()
			.find(selectors.img)
			.attr("src") +
			")"
		);
		var itemLength = selectors.item.length;
		$(window).scroll(function () {
			var max, min;
			var pos = $(this).scrollTop();
			selectors.item.each(function (i) {
				/*min = $(this).offset().top;
				max = $(this).height() + $(this).offset().top;*/
				min = $(this).offset().top - 300;
				max = $(this).height() + $(this).offset().top - 300;				
				//var that = $(this);
				if (i === itemLength - 2 && pos > min + $(this).height() / 2) {
					selectors.item.removeClass(selectors.activeClass);
					selectors.id.css(
						"background-image",
						"url(" +
						selectors.item
						.last()
						.find(selectors.img)
						.attr("src") +
						")"
					);
					selectors.item.last().addClass(selectors.activeClass);
				} else if (pos <= max - 40 && pos >= min) {
					selectors.id.css(
						"background-image",
						"url(" +
						$(this)
						.find(selectors.img)
						.attr("src") +
						")"
					);
					selectors.item.removeClass(selectors.activeClass);
					$(this).addClass(selectors.activeClass);
				}
			});
		});
	};
})(jQuery);

// This jQuery plugin implements the $.fn.highlightText method
// making it easy to highlight text within an element by wrapping
// it in a span with a given class.
//
// To use this plugin, first select the element that contains the text
// that you want to replace, then call .highlightText() on it.
// the plugin has one required parameter and two optional parameters.
//
// The plugin is always called in the same way:
// $(sel).highlightText(<parameters>);
// It accepts three parameters.
//
// The first parameter decides what text will be matched. It can be a
// string, a regular expression in string format, a regular expression
// object, or an array of words.
//
// The second parameter is the class that will be added to the matched
// text. it is optional and can be a space delimited list of classes to
// add to the element that wraps the matched text. It is set to "highlight"
// by default.
//
// The third parameter lets you decide whether or not the plugin should
// only match full matches. It is defaulted to false, meaning it will
// match partial matches. However, this third parameter is ignored if
// the first parameter is a regular expression object.
(function($){

	$.fn.highlightText = function () {
		// handler first parameter
		// is the first parameter a regexp?
		var re,
			hClass,
			reStr,
			argType = $.type(arguments[0]),
			defaultTagName = $.fn.highlightText.defaultTagName;
		//console.log(arguments);
		if ( argType === "regexp" ) {
			// first argument is a regular expression
			re = arguments[0];
		}
		// is the first parameter an array?
		else if ( argType === "array" ) {
			// first argument is an array, generate
			// regular expression string for later use
			reStr = arguments[0].join("|");
		}
		// is the first parameter a string?
		else if ( argType === "string" ) {
			// store string in regular expression string
			// for later use
			reStr = arguments[0];
		}
		// else, return out and do nothing because this
		// argument is required.
		else {
			return;
		}
		//console.log(argType)
		// the second parameter is optional, however,
		// it must be a string or boolean value. If it is
		// a string, it will be used as the highlight class.
		// If it is a boolean value and equal to true, it
		// will be used as the third parameter and the highlight
		// class will default to "highlight". If it is undefined,
		// the highlight class will default to "highlight" and
		// the third parameter will default to false, allowing
		// the plugin to match partial matches.
		// ** The exception is if the first parameter is a regular
		// expression, the third parameter will be ignored.
		argType = $.type(arguments[1]);

        if ( argType === "string" ) {
			hClass = arguments[1];
		}
		else if ( argType === "boolean" ) {
			hClass = "highlight";
			if ( reStr && $.type(reStr) !== "regexp" ) {
				reStr = "\\b" + reStr + "\\b";
			}
		}
		else {
			hClass = "highlight";
		}

		if ( arguments[2] && reStr ) {
			reStr = reStr = "\\b" + reStr + "\\b";
		}

		// if re is not defined ( which means either an array or
		// string was passed as the first parameter ) create the
		// regular expression.
		if (!re) {
			re = new RegExp( "(" + reStr + ")", "ig" );
		}

	    // iterate through each matched element
	    return this.each( function() {
	        // select all contents of this element
	        $( this ).find( "*" ).addBack().contents()

	        // filter to only text nodes that aren't already highlighted
	        .filter( function () {
				return this.nodeType === 3 && $( this ).closest( "." + hClass ).length === 0;
			})

			// loop through each text node
			.each( function () {
	            var output;
	            output = this.nodeValue
	                .replace( re, "<" + defaultTagName + " class='" + hClass + "'>$1</" + defaultTagName +">" );
	            if ( output !== this.nodeValue ) {
	                $( this ).wrap( "<p></p>" ).parent()
	                    .html( output ).contents().unwrap();
	            }
	        });
	    });
	};

	$.fn.highlightText.defaultTagName = "span";
})( jQuery );

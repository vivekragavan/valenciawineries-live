/*jslint browser: true*/
/*jslint white: true */
/*global $,jQuery,ozy_headerType,alert,ozy_Animsition,TweenMax,Power1,ozy_facebookWidget, Flickity, wc_add_to_cart_params*/

/* Diwine WordPress Theme Main JS File */

/**
* Read cookie
*
* @key - Cookie key
*/
function getCookieValue(key) {
	"use strict";
    var currentcookie = document.cookie, firstidx, lastidx;
    if (currentcookie.length > 0)
    {
        firstidx = currentcookie.indexOf(key + "=");
        if (firstidx !== -1)
        {
            firstidx = firstidx + key.length + 1;
            lastidx = currentcookie.indexOf(";", firstidx);
            if (lastidx === -1)
            {
                lastidx = currentcookie.length;
            }
            return decodeURIComponent(currentcookie.substring(firstidx, lastidx));
        }
    }
    return "";
}

/**
* Cookie Notice Banner
*/
function ozy_cookie_notice_banner() {
	"use strict";
	if(getCookieValue( "diwine_cookie_banner" ) != '1') {
		jQuery('#ozy-cookie_notice_banner').addClass('show');

		jQuery('#ozy-cookie_notice_banner a.generic-button').on("click", function(e){
			e.preventDefault();

			var now = new Date();
			now.setMonth( now.getYear() + 1 );
			document.cookie="diwine_cookie_banner=" + "1; expires=" + now.toGMTString() + "; path=/; ";
			jQuery('#ozy-cookie_notice_banner').removeClass('show');

			return false;
		});
	}
}

/**
* Load more button handler
*
* @order
* @orderby
* @item_count
* @category_name
* @offset
* @found
* @e
* @layout_type
*/
function ozy_ajax_load_more_blog(order, orderby, item_count, category_name, offset, found, e) {
	"use strict";
	jQuery.ajax({
		url: ozy_headerType.$OZY_WP_AJAX_URL,
		data: { action: 'diwine_ajax_load_more', p_order : order, p_orderby : orderby, p_item_count : item_count, p_category_name : category_name, p_offset : offset},
		cache: false,
		success: function(data) {

			jQuery('.isotope.blog-listing-masonry, .isotope.blog-listing-mosaic').append(data);

			ozy_page_template_page_blog_init();

			jQuery(e).css('opacity', '1').attr('disabled', false);

			if((item_count + offset) >= found) {
				jQuery(e).hide();
			}

			var load_more_button_top_pos = e.position();
			jQuery('html, body').animate({scrollTop: load_more_button_top_pos.top }, 'slow');

		},
		error: function(MLHttpRequest, textStatus, errorThrown){
			alert(errorThrown);
		}
	});

}

function ozy_ajax_load_more_blog_action() {
	"use strict";
	jQuery(".load_more_blog").on("click", function(e) {

		e.preventDefault();

		jQuery(this).css('opacity', '.3').attr('disabled', 'disabled');

		var order 			= jQuery(this).data("order");
		var orderby 		= jQuery(this).data("orderby");
		var item_count 		= jQuery(this).data("item_count");
		var category_name 	= jQuery(this).data("category_name");
		var offset 			= jQuery(this).data("offset");
		var found 			= jQuery(this).data("found");

		offset = offset + item_count;
		ozy_ajax_load_more_blog(order, orderby, item_count, category_name, offset, found, jQuery(this));
		jQuery(this).data("offset", offset);

		return false;

	});
}

function ozy_page_template_page_blog_init() {
	"use strict";
	var $container_portfolio;
	jQuery('.isotope.blog-listing-masonry,.isotope.blog-listing-mosaic').each(function() {
		var $that = jQuery(this);
		$that.imagesLoaded( function() {
			var conf_arr = {
				filter:  '',
				itemSelector: '.post-single-masonry',
				layoutMode: 'masonry',
				masonry: {
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer'
				}
			};
			jQuery('.isotope.loaded-already').isotope('destroy');
			$container_portfolio = $that.addClass('loaded-already').isotope(conf_arr);

			ozy_init_waypoint();
		});
	});
}

function ozy_ajax_age_restriction_acceptance() {
	"use strict";
	if(ozy_headerType.age_restriction == '1') {
		if(getCookieValue( "diwine_age_restriction_check" ) != '1') {
			jQuery.ajax({
				url: ozy_headerType.$OZY_WP_AJAX_URL,
				data: {
					action: 'diwine_ajax_age_restriction_layer',
					pid: ozy_headerType.post_id,
					cul: ozy_headerType.current_lang
				},
				cache: false,
				type: "POST",
				success: function(data) {
					jQuery('body').append(data);
					jQuery('.accept-age-restriction').on('click', function(e){
						e.preventDefault();
						var now = new Date();
						now.setMonth( now.getYear() + 1 );
						document.cookie="diwine_age_restriction_check=" + "1; expires=" + now.toGMTString() + "; path=/; ";
						jQuery('#age-restriction-info-layer').fadeOut(200, function(){ jQuery(this).remove(); });
						return false;
					});
				},
				error: function(MLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}
	}
}

/**
* Popup window launcher
*
* @url - Url address for the popup window
* @title - Popup window title
* @w - Width of the window
* @h - Height of the window
*/
function ozyPopupWindow(url, title, w, h) {
	"use strict";
	var left = (screen.width/2)-(w/2), top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}

/**
* To check iOS devices and versions
*/
function ozyCheckIsMobile() {
	"use strict";
	return (/Mobi/.test(navigator.userAgent));
}

function ozyCheckIs479el() {
	"use strict";
	return jQuery(window).width()<=479 ? true : false;
}

function ozyCheckIs768el() {
	"use strict";
	return jQuery(window).width()<=768 ? true : false;
}

function ozyCheckIs1024el() {
	"use strict";
	return jQuery(window).width()<=1024 ? true : false;
}

function ozyCheckIs1440el() {
	"use strict";
	return jQuery(window).width()<=1440 ? true : false;
}

function ozyCheckMac(){
	"use strict";
	var isMac = /(mac)/.exec( window.navigator.userAgent.toLowerCase() );
	return ( isMac != null && isMac.length );
}

function ozyCheckFirefox() {
	"use strict";
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
		 return true;
	}
	return false;
}

function ozyCheckChrome() {
	"use strict";
	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	return isChrome || isSafari;
}

/**
* ozy_generic_element_fix
*
* Set sections to document height which matches with selector
*/
function ozy_generic_element_fix() {
	"use strict";
	/* Countdown Page */
	if(jQuery('body.page-template-page-revo-full').length) {
		jQuery('#content').height(jQuery(window).height());
	}
}

function ozy_share_button() {
	"use strict";
	jQuery(document).on('click', 'a.footer-share-buttons, body.single .post-submeta>a:not(.blog-like-link)', function(e) {
		e.preventDefault();
		ozyPopupWindow(jQuery(this).attr('href'), 'Share', 640, 440);
	});
}

/**
* ozy_hash_scroll_fix
*
* Check if there is a hash and scrolls to there, onload
*/
function ozy_hash_scroll_fix() {
	"use strict";
	setTimeout(function(){
	if(window.location.hash) {
		var hash = window.location.hash;
		if(jQuery(hash).length) {
			jQuery('html,body').animate({scrollTop: jQuery(hash).offset().top - jQuery('.nav-container').height()}, 1600, 'easeInOutExpo');
		}
	}}, 200);
}

function ozy_custom_map_mobile_full_height_fix() {
	"use strict";
	/* Google Map */
	if ('undefined' !== typeof jQuery.fn.prettyMaps) {
		if(jQuery(window).width() <= 479) {
			jQuery('.ozy-google-map:not(.init-later)').each(function() {
				if(jQuery(this).data('height').toString().indexOf('%') !== -1) {
					jQuery(this).height('400px');
				}
			});
		}else{
			jQuery('.ozy-google-map:not(.init-later)').each(function() {
				if(jQuery(this).data('height').toString().indexOf('%') !== -1) {
					jQuery(this).height(jQuery(this).data('height'));
				}
			});
		}
	}
}

function ozy_mobile_maybe() {
	"use strict";
	//if(jQuery(window).width() < 1280) {
	if(window.innerWidth < 1280) {
		jQuery('body').addClass('mobile-maybe');
	}else{
		jQuery('body').removeClass('mobile-maybe');
	}
}

/* Resets windows scroll position if there is a hash to make it work smooth scroll*/
var windowScrollTop = jQuery(window).scrollTop();
window.scrollTo(0, 0);
setTimeout(function() {
	"use strict";
	window.scrollTo(0, windowScrollTop);
}, 1);

function ozy_custom_heading_mobile_fix() {
	"use strict";
	if(jQuery(window).width() <= 479) {
		jQuery('.vc_custom_heading').each(function(index, element){
			if(parseInt(jQuery(element).css('margin-top'))> 10 ) {
				jQuery(element).addClass('modified');
			}
			if(parseInt(jQuery(element).css('margin-bottom')) > 10 ) {
				jQuery(element).addClass('modified-b');
			}
		});
		jQuery('.vc_empty_space').each(function(index, element){
			if(parseInt(jQuery(element).css('height'))> 20 ) {
				jQuery(element).addClass('modified').data('h', jQuery(element).css('height')).css('height', '20px');
			}
		});
	}else{
		jQuery('.vc_custom_heading.modified').each(function(index, element){
			jQuery(element).removeClass('modified').removeClass('modified-b');
		});
		jQuery('.vc_empty_space.modified').each(function(index, element){
			jQuery(element).removeClass('modified').css('height', jQuery(element).data('h'));
		});
	}
}

function ozy_init_waypoint() {
	"use strict";
	if ('undefined' !== typeof jQuery.fn.waypoint) {
		/* fading background color */
	    jQuery('.vc_row.fading-bg-color').waypoint(function(direction) {
			var _row_bg = jQuery(this.element).find('.vc_row-fading-bg-color'), _color1 = _row_bg.data('bgcolor1'), _color2 = _row_bg.data('bgcolor2');
			if (direction === 'down') {
				if(!_row_bg.hasClass('apply-to-body')) {
					_row_bg.stop().animate({backgroundColor: _color2}, 700, 'easeInOutExpo');
				}else{
					jQuery('body').stop().animate({backgroundColor: _color2}, 700, 'easeInOutExpo');
				}
				if(!_row_bg.hasClass('no-affect-font-color')) {
					jQuery(this.element).find('*:not(.vc_row-fading-bg-color)').stop().animate({color: _color1}, 500, 'easeInOutExpo');
				}
			}else{
				if(!_row_bg.hasClass('apply-to-body')) {
					_row_bg.stop().animate({backgroundColor: _color1}, 700, 'easeInOutExpo');
				}else{
					jQuery('body').stop().animate({backgroundColor: _color1}, 700, 'easeInOutExpo');
				}
				if(!_row_bg.hasClass('no-affect-font-color')) {
					jQuery(this.element).find('*:not(.vc_row-fading-bg-color)').stop().animate({color: _color2}, 500, 'easeInOutExpo');
				}
			}
		},{
			offset: '50%'
		});

		/* generic waypoint appear effect */
	    jQuery('.ozy-waypoint-animate').waypoint(function(direction) {
			if (direction === 'down') {
				jQuery(this.element).removeClass('hiding').addClass('ozy-start-animation');
			}else{
				jQuery(this.element).removeClass('ozy-start-animation').addClass('hiding');
			}
		},{
			offset: '85%'
		});
	}else{
		jQuery('.ozy-waypoint-animate').removeClass('ozy-waypoint-animate');
	}
}

var has_body_use_transparent = false; //just in case if user try to resize window to test responsive mode

function ozy_mobile_menu_header_style_check() {
	"use strict";
	if(jQuery(window).width() <= 768) {
		jQuery('#wpadminbar').css('position', 'fixed');

		has_body_use_transparent = jQuery('body').hasClass('use-transparent-menu') || jQuery('body').hasClass('page-template-page-transparent-menu');
		jQuery('body').removeClass('use-transparent-menu').addClass('ozy-alternate-menu');
	}else{
		if(has_body_use_transparent) {
			jQuery('body').addClass('use-transparent-menu');
			if(jQuery(window).scrollTop() <= 150) {
				jQuery('body').removeClass('ozy-alternate-menu');
			}
		}
	}
}

var mobileMenuFilled = false;
function ozy_mobile_menu_builder() {
	"use strict";
	if(ozyCheckIs768el() && !mobileMenuFilled) {
		jQuery('.diwine-primary-nav:not(.mobile-only)').each(function(){
			jQuery(this).children().clone(true, true).appendTo('.diwine-primary-nav.mobile-only');
		});
		mobileMenuFilled = true;
	}
}

jQuery(window).resize(function() {
	"use strict";
	ozy_generic_element_fix();
	ozy_custom_map_mobile_full_height_fix();
	ozy_custom_heading_mobile_fix();
	ozy_mobile_maybe();
	ozy_mobile_menu_header_style_check();
	ozy_mobile_menu_builder();
});

var revealImages = function() {
	"use strict";
	jQuery('body:not(.single) .img-wrapper:not(.img-loaded):not(.in-animation)').each(function(){
		var el = this;
		jQuery(el).find('span').css('background-image', 'url(' + jQuery(el).find('img').attr('src') + ')');
		if(jQuery(el).offset().top < jQuery(window).scrollTop() + (jQuery(window).height() / 10)*8 ) {
			jQuery(el).addClass('img-loaded');
		}
	});
};

/* Row Reveal Slider */
function ozy_reveal_image_animations() {
	"use strict";
	requestAnimationFrame(revealImages);
	jQuery(window).on('scroll', function(){
		requestAnimationFrame(revealImages);
	});
}

jQuery(window).on('load', function(){
	"use strict";

	ozy_mobile_maybe();

	ozy_mobile_menu_builder();

	/* Search page */
	if (jQuery().masonry) {
		if(jQuery('body.search-results').length) {
			jQuery('body.search-results .post-content>div').imagesLoaded( function(){
				jQuery('body.search-results .post-content>div').masonry({
					itemSelector : 'article.result',
					gutter : 20
				});
			});
		}
	}

	/* WooCommerce Category & Product Pages */
	if (jQuery().isotope) {
    	//if(window.innerWidth > 480) {
            if(jQuery('.woocommerce ul.products').length) {
                jQuery('.woocommerce ul.products').imagesLoaded( function(){
                    jQuery('.woocommerce ul.products').isotope({
                        layoutMode: 'fitRows',
                        itemSelector: 'li.product',
                        isAnimated: true,
                        fitRows: {
                            gutter: '.woo-gutter-spacer'
                        }
                    });
                });
            }
    	//}
	}

	jQuery('.ozy-row_bubbles').each(function(){
		var randomN = function(start, end){
			return Math.random()*end+start;
		},
		$this = jQuery(this),
		i = 0,
		generateBubble = function(){
			if(i < 20){
				var size = randomN(5, 10);
				$this.append('<div style="width:'+ size +'px;height:'+ size +'px;left:'+ randomN(1, $this.outerWidth() - (size+4) ) +'px;"></div>');
				i++;
			} else {
				clearInterval(inter);
			}
		};

		generateBubble();

		var inter = setInterval(generateBubble, 500);
	});

	/* Testimonial Slider Bullet Fix */
	jQuery('div.flickity-carousel').find('.testimonial').each(function() {
		jQuery(this).parents('div.flickity-carousel').find('ol.flickity-page-dots').css('bottom', '25px');
		return;
	});

	ozy_reveal_image_animations();

	/* Stellar.js Parallax */
	if(!ozyCheckIs768el()) {
		jQuery('.ozy-image_with_featured_content.stellar,.wpb_single_image.stellar').each(function(){
			jQuery(this).stellar();
			jQuery(function(){
				jQuery.stellar({ positionProperty: 'transform', parallaxBackgrounds: false, responsive: true, horizontalScrolling: false, hideDistantElements: false });
			});
		});
	}

	/* Row Background Slider */
	if(jQuery('.ozy-background-cycler').length>0) {
		jQuery('.ozy-background-cycler').each(function(index, elm){
			jQuery(elm).fadeIn(1500); //fade the background back in once all the images are loaded
			setInterval( function(){ ozy_cycle_images(elm); }, 5000);	// run every 5s
		});
	}

	if(jQuery('body.page-template-page-masonry-blog,body.page-template-page-mosaic-blog').length>0) {
		ozy_page_template_page_blog_init();
	}

	/* Layz Load */
	jQuery('div[data-bgsrc]').each(function(){
		jQuery(this).css('background-image', 'url('+ jQuery(this).data('bgsrc') +')');
	});

	/* Add Class to Page Title Wrapper to start animation when page loaded */
	jQuery('#page-title-wrapper').addClass('show-me');
});

/**
*
* Original Idea: Simon Battersby @ http://goo.gl/CsWVJL
*/
function ozy_cycle_images(elm){
	"use strict";
	var $active = jQuery(elm).find('div.active');
	var $next = (jQuery(elm).find('div.active').next().length > 0) ? jQuery(elm).find('div.active').next() : jQuery(elm).find('div:first');
	$next.css('z-index',2);//move the next image up the pile
	$active.fadeOut(1500,function(){//fade out the top image
		$active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
		$next.css('z-index',3).addClass('active');//make the next image the top one
	});
}

function diwine_ozy_menu_bg_color_fixer() {
	"use strict";
	var do_time = 0;
	var headerMenuFixed = false;
	jQuery.doTimeout('scroll', do_time, function(){
		if(jQuery('body').hasClass('use-transparent-menu')) {
			if(jQuery(window).scrollTop() >= 150) {
				if(!headerMenuFixed) {
					jQuery('body').addClass('ozy-alternate-menu');
					jQuery('#ozy-cookie_notice_banner').addClass('in-viewport');
				}
			} else {
				jQuery('body').removeClass('ozy-alternate-menu');
				headerMenuFixed = false;
			}
		}

		/* Cookie Notice Banner Visibility */
		if(jQuery('#ozy-cookie_notice_banner').length) {
			if(jQuery(window).scrollTop() >= 150) {
				jQuery('#ozy-cookie_notice_banner').addClass('in-viewport');
			}else{
				jQuery('#ozy-cookie_notice_banner').removeClass('in-viewport');
			}
		}
	});
}

/* Inline Link Handler */

function ozy_click_hash_check($this) {
	"use strict";
	if (location.pathname.replace(/^\//,'') == $this.pathname.replace(/^\//,'')
		|| location.hostname == $this.hostname) {

		var target = jQuery($this.hash);
		target = target.length ? target : jQuery('[name=' + $this.hash.slice(1) +']');
		if (target.length) {
			jQuery('html,body').animate({
				 scrollTop: target.offset().top - jQuery('.nav-container').height()
			}, 1600, 'easeInOutExpo');

			history.replaceState(undefined, undefined, "#" + $this.hash.slice(1));

			return false;
		}
	}
	return true;
}

function diwine_ozy_inline_link_handler() {
	"use strict";
	jQuery('.reveal-slider-caption a[href*="#"], #content a.ozy-custom_button[href*="#"],#content a.vc_btn3[href*="#"],.widget ul.menu li>a[href*="#"],.widget ul.ozy-custom_menu_widget li>a[href*="#"], #content a.ozy-btn_underline[href*="#"], .ozy-service_box a[href*="#"], .carousel-cell a[href*="#"]').on("click", function(e) {
		var pattern = /^((http|https|ftp):\/\/)/;
		if(pattern.test(this.href)) {
			e.preventDefault();
			if(ozy_click_hash_check(this)) {
				if(ozy_Animsition.is_active) {
					jQuery('.animsition').animsition('out', jQuery(e.target), ozy_headerType.$OZY_WP_HOME_URL + this.hash);
				}else{
					window.location = ozy_headerType.$OZY_WP_HOME_URL + this.hash;
				}
			}
		}else if (/#/.test(this.href)) {
			e.preventDefault();
			if(ozy_click_hash_check(this)) {
				if(ozy_Animsition.is_active) {
					jQuery('.animsition').animsition('out', jQuery(e.target), ozy_headerType.$OZY_WP_HOME_URL + jQuery(this).attr('href'));
				}else{
					window.location = ozy_headerType.$OZY_WP_HOME_URL + $(this).attr('href');
				}
			}
		}else{
			if(ozy_Animsition.is_active) {
				e.preventDefault();
				jQuery('.animsition').animsition('out', jQuery(e.target), $(this).attr('href'));
			}
		}
	});
}

jQuery(window).scroll(function() {
	"use strict";
	diwine_ozy_menu_bg_color_fixer();
});

jQuery(document).ready(function($) {
	"use strict";

	/* Age Restriction */
	ozy_ajax_age_restriction_acceptance();

	jQuery(window).scroll(); //init logo switch for first time

	ozy_share_button();

	ozy_generic_element_fix();

	ozy_ajax_load_more_blog_action();

	ozy_hash_scroll_fix();

	ozy_custom_heading_mobile_fix();

	ozy_mobile_menu_header_style_check();

	ozy_cookie_notice_banner();

	/* Primary Menu Hover Handler */
	$(".diwine-primary-nav li.dropdown").hoverIntent({
		over: function(){
			$(this).addClass('active-hover');
			var $that = $(this).first('ul:not(.pos-fix)'),
			menuRight = $that.find('ul').offset().left + $that.find('ul').innerWidth(),
			windowWidth = $(window).width();
			if(menuRight > windowWidth) {
				//$that.find('ul').css('left', -$that.find('ul').innerWidth() + 'px');
				$that.parents('ul:not(.diwine-primary-nav):not(.pos-fix)').addClass('pos-fix').css('margin-left', '-' + (menuRight - windowWidth) + 'px');
			}
		},
		out: function(){
			$(this).removeClass('active-hover');
		},
		sensitivity: 5,
		timeout: 300
	});

	/* Mobile Menu Handler */
	$('.diwine-primary-nav li>a.dropdown-toggle').on("click", function(e){
		/*if($(window).width() < 768) {*/
		/*if($(window).width() < 1025) {*/
		if($(window).width() < 1171) {
			var $that = $(this).parent('li');

			if($that.hasClass('open')) {
				$that.removeClass('open');
			}else{
				if(!$that.hasClass('dropdown-submenu')) {
					$('ul.diwine-primary-nav li').removeClass('open');
				}
				$that.addClass('open');
			}

			e.preventDefault();
			return false;
		}
	});

	/* Switch Menu Overlay */
	var menu_hover_alternate = false;
	$(".nav-container").hoverIntent({
		over: function(){
			if(!$('body').hasClass('ozy-alternate-menu')) {
				$('body').addClass('ozy-alternate-menu');
				menu_hover_alternate = true;
			}
			if(!$('body').hasClass('mobile-maybe')) {
				if(!$('body').hasClass('ozy-menu-jsaction')) {
					$('body').addClass('ozy-menu-jsaction');
				}
			}
		},
		out: function(){
			if(menu_hover_alternate) {
				$('body').removeClass('ozy-alternate-menu');
				menu_hover_alternate = false;
			}
			$('body').removeClass('ozy-menu-jsaction');
		},
		sensitivity: 20,
		timeout: 300
	});


	/* Mobile Menu Hamburger Handler */
	$('#responsive_menu').change(function() {
		$('.hamburger-menu').toggleClass('animate');
    	if ($(this).is(':checked')) {
			$('body').addClass('ozy-menu-jsaction');
    	} else {
			$('body').removeClass('ozy-menu-jsaction');
    	}
	});


	/* Adds CSS class name to body if there is 6 widget in footer */
	$('.footer-widget-bar:not(#footer) .widget:nth-child(3n)').after('<hr>');

	/* Product page Qantity Form */
	$('body.single .quantity').parents('form').find('.button').each(function(){
		$(this).height($(this).parents('form').find('input.qty').outerHeight());
		$(this).css('line-height', $(this).height() + 'px');
	});

	function customQtyButtons(){
		$('.quantity').off('click', '.qty-plus').on('click', '.qty-plus', function() {
			var _field = $(this).parents('.quantity').find('input.qty');
			var _new_val = parseFloat(_field.val()) + 1; var _max = parseFloat(_field.attr('max'));
			_field.val( _new_val <= _max ?  _new_val : parseFloat(_field.val()) ).change();
		});

		$('.quantity').off('click', '.qty-minus').on('click', '.qty-minus', function() {
			var _field = $(this).parents('.quantity').find('input.qty');
			var _new_val = parseFloat(_field.val()) - 1;  var _min = parseFloat(_field.attr('min'));
			_field.val( _new_val >= _min ? _new_val : parseFloat(_field.val()) ).change();
		});
	}

	jQuery(document).ajaxComplete(function() {
		customQtyButtons();
	});

	customQtyButtons();

	/* Add Case (6 product) to cart */
	$('.input-text.qty.text').on('change', function(){
        var aCase = $('a.single_add_case_to_cart_button').attr('data-quantity-fixed');
		var newQty = $(this).val() * aCase;
		$('a.single_add_case_to_cart_button').attr('data-quantity', newQty).attr('href', function(i,a){
    		return a.replace(/(quantity=)[^\&]+/, '$1' + newQty);
  		});
		$('a.single_add_case_to_cart_button>span').html('('+ $(this).val() +' x '+ aCase +')');
	});
	$('.input-text.qty.text').change();

	/* WooCommerce Basket */
	function woocommerce_mini_cart() {
		if($('a.cart-contents').length && $('#woocommerce-cart-wrapper').length) {
			$('a.cart-contents,#woocommerce-cart-wrapper>h3>.fa.fa-chevron-circle-right').unbind('click').on('click', function(e){
				e.preventDefault();
				$('body').toggleClass('cart-open');
				return false;
			});
			jQuery(document).on("click", function(e) {
				var basket_div = jQuery('body.cart-open #woocommerce-cart-wrapper');
				if (!basket_div.is(e.target) && !basket_div.has(e.target).length && basket_div.is(':visible') && !jQuery(e.target).hasClass('ajax-basket')) {
					$('body').toggleClass('cart-open');
				}
			});
		}
	}    
	if(ozy_headerType.woocommerce_active) {
		var woo_cart_init_count = 0;

		$('.cart_list.product_list_widget').niceScroll({scrollbarid:"mini-cart-scrollbar", autohidemode:"false", cursorwidth: "6px", cursorcolor: "rgba(33,30,31,.5)", cursorborder: "none"});

		jQuery(window).on('load', function(){
			woocommerce_mini_cart();
		});

		jQuery(document).ajaxComplete(function() {
			woocommerce_mini_cart();
			if(woo_cart_init_count>1) { $('#mini-cart-scrollbar, #mini-cart-scrollbar-hr').remove(); }
			$('.cart_list.product_list_widget').niceScroll({scrollbarid:"mini-cart-scrollbar", autohidemode:"false", cursorwidth: "6px", cursorcolor: "rgba(33,30,31,.5)", cursorborder: "none"});
			woo_cart_init_count++;
		});

		// WooCommerce Ajax delete product in the cart
		$(document).on('click', '.mini_cart_item a.remove', function (e) {
			e.preventDefault();

			var product_id = $(this).attr("data-product_id"),
				cart_item_key = $(this).attr("data-cart_item_key"),
				product_container = $(this).parents('.mini_cart_item');

			// Add loader
			product_container.block({
				message: null,
				overlayCSS: {
					cursor: 'none'
				}
			});

			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: wc_add_to_cart_params.ajax_url,
				data: {
					action: "product_remove",
					product_id: product_id,
					cart_item_key: cart_item_key
				},
				success: function(response) {
					if ( ! response || response.error ) {
						return;
					}

					var fragments = response.fragments;

					// Replace fragments
					if ( fragments ) {
						$.each( fragments, function( key, value ) {
							$( key ).replaceWith( value );
						});
					}
				}
			});
		});
	}

	/* Animsition */
	if(ozy_Animsition.is_active) {
		$(".animsition").animsition({
			inClass: 'fade-in',
			outClass: 'fade-out',
			inDuration: 800,
			outDuration: 400,
			linkElement: '.diwine-primary-nav li>a:not([target="_blank"]):not([href^="#"]):not([href*="#"]), a.book-your-stay, a.menu-logo, .mobile-book-your-stay>a',
			loading: true,
			loadingParentElement: 'body',
			loadingClass: 'loader-container',
			loadingInner: '<div id="loader-container"><div class="loader-ring"><div class="loader-ring-light"></div><div class="loader-ring-track"></div></div><div class="chalice"><div class="liquid red-wine"></div></div></div>',
			timeout: true,
			timeoutCountdown: 500,
			onLoadEvent: true,
			browser: [ 'animation-duration', '-webkit-animation-duration'],
			overlay : false,
			overlayClass : 'animsition-overlay-slide',
			overlayParentElement : 'body',
			transition: function(url){ window.location.href = url; }
		});

		$('.animsition').on('animsition.outStart', function(){
			$('#ozy-cookie_notice_banner').css('opacity', 0);
		});
	}

	diwine_ozy_inline_link_handler();

	/* Search Button & Stuff */
	$(document).on('touchstart, click', '#close-search-overlay,a.menu-search', function(e) {
		e.preventDefault();
		$('body').toggleClass('search-overlay-open');$('#search-overlay #search').focus();
	});
	$(document).keyup(function(e) {
		if (e.which === 27) {
			$('body').removeClass('search-overlay-open');
		}
		e.preventDefault();
    });

	/* Language Switcher */
	$('.lang-switcher').on("click", function(e) {
		$('body').toggleClass('lang-switcher-open');
        e.preventDefault();
    });
	$(document).on("click", function(e) {
		if($('body').hasClass('lang-switcher-open')) {
			var lang_switcher_div = $('.lang-switcher,.lang-switcher-dropdown');
			//$('.lang-switcher-dropdown').css({"left": ($('.menu-lang').offset().left - 20), "top": $('.menu-lang').offset().top + $('.menu-lang').outerHeight() - (ozyCheckIs768el() ? 0 : 0) });
			$('.lang-switcher-dropdown').css({"left": ($('.menu-lang').offset().left - 20), "top": $('.menu-lang').outerHeight() + ($('#wpadminbar').length>0?$('#wpadminbar').outerHeight():0)});
			if (!lang_switcher_div.is(e.target) && !lang_switcher_div.has(e.target).length && lang_switcher_div.is(':visible') && !$(e.target).hasClass('lang-switcher-dropdown')) {
				$('body').toggleClass('lang-switcher-open');
			}
		}
	});

	function ozy_visual_stuff() {
		/* Overlapped Images */
		$('.ozy-overlapped_images>div').on('mousemove', function(){
			$(this).css('z-index', '3').siblings('div').css('z-index', '1');
		});

		/* Back to Event List Page*/
		$('#back-to-events').on('click', function(e){
			e.preventDefault();
			window.history.back(-1);
			return false;
		});

		/* Tooltip plugin init */
		$(function(){
			$('.tooltip-top, abbr[title]').tooltipsy({className:'tooltipsy white', offset: [0, 20]});
			$('.tooltip').tooltipsy();
		});

		/* Timeline */
		$('.timeline-container').each(function(){
			$(this).timeline();
		});

		/* YouTube Embed */
		$('.oytb-videoWrapper').each(function() {
			var $poster = $(this);
			var $wrapper = $poster.closest(this);
			var $iframe = '';

			$(this).on("click", function(ev){
				ev.preventDefault();
				videoPlay($wrapper);
			});

			function videoPlay($wrapper) {
				var $iframe = $wrapper.find('.oytb-js-videoIframe');
				var src = $iframe.data('src');
				$wrapper.addClass('oytb-videoWrapperActive');
				$poster.parent('div').find('.oytb-video-StopButton').show(100, 'easeInOutExpo');
				$iframe.attr('src',src);
			}

			$('.oytb-video-StopButton').on("click", function(){
				videoStop($wrapper);
			});

			function videoStop($wrapper) {
				if (!$wrapper) {
					$wrapper = $('.oytb-js-videoWrapper');
					$iframe = $('.oytb-js-videoIframe');
				} else {
					$iframe = $wrapper.find('.oytb-js-videoIframe');
				}
				$wrapper.removeClass('oytb-videoWrapperActive');
				$poster.parent('div').find('.oytb-video-StopButton').hide(100, 'easeInOutExpo');
				$iframe.attr('src','');
			}
        });

		/* Counter */
		if ('undefined' !== typeof jQuery.fn.waypoint) {
			jQuery('.ozy-counter>.timer').waypoint(function() {
				if(!$(this.element).hasClass('ran')) {
					$(this.element).addClass('ran').countTo({
						from: $(this.element).data('from'),
						to: $(this.element).data('to'),
						speed: 5000,
						refreshInterval: 25,
						sign: $(this.element).data('sign'),
						signpos: $(this.element).data('signpos')
					});
				}
			},{
				offset: '85%'
			});
		}

		/* Flickity Tilt Slider */
		if($('.ozy-tilt_product_slider').length) {
			$('.ozy-tilt_product_slider .carousel-cell .tilt-box').tilt({
				reset: true,
				glare: true,
				maxGlare: 0.25,
				scale: 1,
				perspective: 1000,
				maxTilt: 30,
			});
		}

		/* Flickity Hero Slider */
		$('.ozy-hero-slider').each(function(){
			var options = {
				accessibility: true,
				wrapAround: false,
				prevNextButtons: $(this).data('navigationarrows'),
				pageDots: $(this).data('navigationdots'),
				autoPlay: $(this).data('autoplay'),
				setGallerySize: false,
				selectedAttraction: 0.02,
				friction: 0.4,
				pauseAutoPlayOnHover: true,
				arrowShape: {
					x0: 10,
					x1: 60,
					y1: 50,
					x2: 60,
					y2: 45,
					x3: 15
				}
			};

			var $that = $(this);
			var carousel = $(this).get(0);
			var slides = carousel.getElementsByClassName('carousel-cell');
			var flkty = new Flickity(carousel, options);

			flkty.on('scroll', function () {
				flkty.slides.forEach(function (slide, i) {
					var image = slides[i];
					var x = (slide.target + flkty.x) * -1/3;
					image.style.backgroundPosition = x + 'px center';
				});
			});

			// Bullet Images
			/*flkty.slides.forEach(function (slide, i) {
				var image = slides[i];
				$that.find('.flickity-page-dots>.dot:nth-child('+ (i+1) +')').css('background-image', image.style.backgroundImage);
			});*/

			// Progress Bar
			var duration = parseInt($(this).data('autoplay')) - (ozyCheckFirefox() ? 1000 : 100);
			var interval = 10;
			var isPaused = false;

			var percentTime,
				step,
				tick;

			var progressBar = $that.parents('div.ozy-hero-slider-wrapper').find('.carousel-progress>.progress');

			function startProgressbar() {
				resetProgressbar();
				percentTime = 0;
				isPaused = true;
				tick = window.setInterval(increase, interval);
			}

			function increase() {
				if (!isPaused) {
					step = duration / interval;
					percentTime += 100 / step;
					progressBar.css('width', percentTime + '%');

					if (percentTime >= 100) {
						startProgressbar();
					}
					isPaused = flkty.player.state === 'stopped' ? true : false;
				}else{
					clearInterval(tick);
					progressBar.parent().fadeOut(500);
				}
			}

			function resetProgressbar() {
				progressBar.css('width', 0 + '%');
				clearTimeout(tick);
			}

			startProgressbar();

		});

		//jQuery(window).on('load', function(){
		setTimeout(function() {
			jQuery('.ozy-tilt_product_slider').each(function(index, element){
				var options = {
					wrapAround: false,
					percentPosition: true,
					prevNextButtons: true,
					pageDots: true,
					autoPlay: false,
					adaptiveHeight: false,
					groupCells: "90%",
					cellAlign: "center"
				};

				var carousel = $(this).get(0);
				var flkty = new Flickity(carousel, options);

				if($(this).data('backtext') && $(this).data('backtextcolor')) {
					$(carousel).find('.flickity-viewport').prepend('<div class="flickity-big-text" style="color:'+ $(this).data('backtextcolor') +';">'+ $(this).data('backtext') +'</div>');

					function scroll_text() {
						flkty.slides.forEach(function (slide, i) {
							$('.flickity-big-text').css('left', ((slide.target/2) + flkty.x) * 0.6);
						});
					}
					flkty.on('scroll', function () {
						scroll_text();
					});
					scroll_text();
				}
			});
		});
		//});


		/* Flickity See All switch button */
		$('.flickity-carousel-wrapper>.flickity-carousel.carousel').each(function() {
			var $carousel = $(this);
			var isFlickity = true;
			// toggle Flickity on/off
			$('.flickity-see-all').on( 'click', function() {
				//switch button label
				var button_label = $(this).toggleClass('grid-open').data('label');$(this).data('label', $(this).html());$(this).html(button_label);

				if ( isFlickity ) {
					//setup isotope
					var conf_arr = {
						layoutMode: 'packery',
						itemSelector: '.carousel-cell'
					};
					$carousel.toggleClass('flickity-carousel-grid').flickity('destroy').isotope(conf_arr);

					//isotope animation
					var anim_timing = 0.25;
					$carousel.find('.carousel-cell').each(function() {
						$(this).css({'-webkit-transform' : 'translateX(200%)', 'transform' : 'translateX(200%)', '-webkit-animation' : 'comeFromRight '+anim_timing+'s ease-in-out forwards', 'animation' : 'comeFromRight '+anim_timing+'s ease-in-out forwards'});
						anim_timing = anim_timing + 0.10;
                    });

				} else {
					//init new Flickity
					var data_flickity_str = $carousel.attr('data-flickity');
					$carousel.isotope('destroy').toggleClass('flickity-carousel-grid').flickity(JSON.parse(data_flickity_str));
				}
				isFlickity = !isFlickity;
				return false;
			});
		});

		/* Flickity News Carousel */
		$('.explore-news').each(function(index, element) {
			$(element).flickity({
				// options
				lazyLoad: true,
				contain: true,
				accessibility: true,
				imagesLoaded: true,
				percentPosition: false,
				prevNextButtons: false, //custom option used
				pageDots: true,
				groupCells: ozyCheckIs768el() ? 1 : 2,
				cellAlign: 'left'
			});
			//Custon Arrows
			var $programs = $(element).flickity({
				prevNextButtons: false,
				pageDots: false
			});

			// previous
			$('.button--previous').on( 'click', function() {
				$programs.flickity('previous');
			});
			// next
			$('.button--next').on( 'click', function() {
				$programs.flickity('next');
			});
        });

		/* Custom Buttons */
		$('.ozy-custom_button.ocbtn-6')
		.on('mouseenter', function(e) {
				var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
				$(this).find('span').css({top:relY, left:relX});
		})
		.on('mouseout', function(e) {
				var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
			$(this).find('span').css({top:relY, left:relX});
		});

		/* Tabbed Service Slider Arrow Shape */
		jQuery('.carousel.tabbed_service-nav').each(function(index, element){
			jQuery(element).flickity({
				"contain" : true,
				"pageDots": false,
				"asNavFor": jQuery(element).data('asnavfor')

			});
		});

		/* Tabbed Call To Action Slider Arrow Shape */
		jQuery('.tabbed_call_to_action-bottom').each(function(index, element){
			jQuery(element).flickity({
				"imagesLoaded" : true,
				"pageDots": false,
				"wrapAround": true,
				"autoPlay": 6000,
				"pauseAutoPlayOnHover": true,
				"prevNextButtons": true
			});
		});

		/* Mosaic Gallery */
		if($('ul.ozy-mosaic_gallery').length) {
			//var $container_portfolio;
			jQuery('ul.ozy-mosaic_gallery').each(function() {
				var $that = jQuery(this);
				$that.imagesLoaded( function() {
					var conf_arr = {
						filter:  '',
						itemSelector: '.gallery-item',
						layoutMode: 'masonry',
						masonry: {columnWidth: 100}
					};
					conf_arr['masonry'] = {
						columnWidth: '.grid-sizer',
						gutter: '.gutter-sizer'
					};
					$that.isotope(conf_arr);
				});
			});

			$('ul.ozy-mosaic_gallery').photobox('a',{ time:0 });
		}

		/* Regular Blog */
		$('body.post-template-default.single.single-post #content p:has(>img)').each(function(){
			if($(this).parents('.comment-body').length <= 0) {
				$(this).addClass(($(this).find('img').hasClass('narrow-p') ? '' : 'image-p')  + ' ' + $(this).find('img').attr('class'));
			}
		});
		$('body.post-template-default.single.single-post #content p:has(>iframe)').addClass('iframe-p');

		/* Single Post Gallery and Image operations */
		if($('body').hasClass('single single-post')) {
			/* Blog Content Image Wrapper */
			$('body.single-post .post-content img:not(.no-wrap):not([class^="attachment"])').each(function(){
				$(this).wrap('<div class="img-wrapper '+ $(this).attr('class') + '"/>');
				$(this).parents('.img-wrapper').append('<span class="'+ $(this).attr('class') + '"></span>');
			});

			/* Convert Gallery into flickity slider on post */
			$('.gallery').each(function(){
				var flickity_images_output = '';
				$(this).find('img').each(function(){
					flickity_images_output += '<div class="carousel-cell">' + $(this).get(0).outerHTML + '</div>';
				});

				$(this).html(flickity_images_output);

				$(this).addClass('post-classic-gallery').flickity({
					cellSelector: '.carousel-cell',
					contain: true,
					pageDots: true,
					navArrows: true,
					wrapAround: true,
					adaptiveHeight: true,
					setGallerySize: true,
					lazyLoad: false
				});
			});

			/* Fix flickity height issue on FF and IE */
			jQuery(window).on('load', function() {
				window.dispatchEvent(new Event('resize'));
			});

		}

		/* Comment Form is Field Empty Check */
		$('#commentform input, #commentform textarea').on('blur', function(){
			if($(this).val() === '') {
				$(this).addClass('empty');$(this).removeClass('not-empty');
			} else {
				$(this).addClass('not-empty');$(this).removeClass('empty');
			}
		});
	}

	ozy_visual_stuff();

	/* Waypoint animations */
	ozy_init_waypoint();

	function ozy_vc_components() {

		/* Google Map */
		if ('undefined' !== typeof jQuery.fn.prettyMaps) {
			$('.ozy-google-map:not(.init-later)').each(function() {
				if($(this).data('height').toString().indexOf('%') !== -1) {
					$(this).parent('div.wpb_wrapper').css('height', '100%');
				}
				$(this).parent().append(
					$('<div class="gmaps-cover"></div>').on("click", function(){ $(this).remove(); })
				);
				var disable_ui = (typeof $(this).data('disableui') !== 'undefined' ? false:true);
				$(this).prettyMaps({
					address: $(this).data('address'),
					zoom: $(this).data('zoom'),
					panControl: disable_ui,
					zoomControl: disable_ui,
					mapTypeControl: disable_ui,
					scaleControl: disable_ui,
					streetViewControl: disable_ui,
					overviewMapControl: disable_ui,
					scrollwheel: true,
					image: $(this).data('icon'),
					hue: $(this).data('hue'),
					saturation: $(this).data('saturation'),
					lightness: $(this).data('lightness')
				});
			});
			ozy_custom_map_mobile_full_height_fix();
		}

		/* Multi Google Map */
		if ('undefined' !== typeof jQuery.fn.ozyGmap) {
			$('.ozy-multi-google-map').each(function() {
				$(this).parent().append(
					$('<div class="gmaps-cover"></div>').on("click", function(){ $(this).remove(); })
				);
				$(this).ozyGmap({
					dataPath: $(this).data('path'),
					zoom: $(this).data('zoom'),
					panControl: true,
					zoomControl: true,
					mapTypeControl: true,
					scaleControl: true,
					streetViewControl: true,
					overviewMapControl: true,
					scrollwheel: true,
					image: $(this).data('icon'),
					hue: $(this).data('hue'),
					saturation: $(this).data('saturation'),
					lightness: $(this).data('lightness')
				});
			});
		}

		/* Blog Hero */
		$(window).scroll(function(){
			parallax();
		});

		function parallax() {
			var scrolled = $(window).scrollTop();

			if(window.TweenMax && window.CSSPlugin){
				TweenMax.to('#page-title-wrapper>span', 0.1, {top: -(scrolled*0.1)+'px'});
				TweenMax.to('#page-title-wrapper>div', 0.2, {'top':50+(scrolled*0.02)+'%', 'opacity': 1-(scrolled*0.01)/10});
			}else{
				$('#page-title-wrapper>span').css('top',-(scrolled*0.1)+'px');
				$('#page-title-wrapper>div').css({'top':50+(scrolled*0.02)+'%', 'opacity': 1-(scrolled*0.01)/10});
			}
		}

		/* New Instagram Feed */
		$('.ozy-instagram-gallery.new').each(function(index, element) {
			var accesstoken = $(this).data('accesstoken'),
				userid = $(this).data('userid'),
				title = $(this).data('title'),
				num_photos = $(this).data('numitems');
			if(accesstoken && userid && title && num_photos) {
				jQuery.ajax({
					url: ozy_headerType.$OZY_WP_AJAX_URL,
					data: { action: 'diwine_ajax_instagram', request_user_id : userid, request_access_token : accesstoken, request_title : title, request_num_photos : num_photos},
					cache: false,
					success: function(data) {
						$(element).append(data);
					},
					error: function(MLHttpRequest, textStatus, errorThrown){
						alert(errorThrown);
					}
				});
			}
		});

		/* Fancy Blog List */
		$('.ozy-fancyaccordion-feed tr.title').on("click", function(e){
			e.preventDefault();
			if($(this).hasClass('open')) {
				$(this).next('tr.excerpt').find('td>div').hide(200, function() {
					$(this).parent().slideUp(100);
				});
			}else{
				$(this).next('tr.excerpt').find('td').show(200, function() {
					$(this).find('div').slideDown(100);
				});
			}
			$(this).toggleClass('open');
		});

		/* Weather Widget */
		if ($('.weather-widget').length) {
			function titleCase(str) {
				return str.split(' ').map(function (word) {
					return word[0].toUpperCase() + word.substring(1);
				}).join(' ');
			}

			function fullDay(str) {
				switch (str) {
					case 'Tue':
						return 'Tuesday';
					case 'Wed':
						return 'Wednesday';
					case 'Thu':
						return 'Thursday';
					case 'Sat':
						return 'Saturday';
					default:
						return str + 'day';
				}
			}

			$(function () {
				var $wrapper = $('.weather-widget'),
					$request_city = $wrapper.data('city'),
					$city = $wrapper.find('#city'),
					$loading = $wrapper.find('.loading'),
					$weather = $wrapper.find('.weather'),
					$group = $wrapper.find('.group'),
					$dt = $group.find('#dt'),
					$description = $group.find('#description'),
					$wind = $group.find('#wind'),
					$humidity = $group.find('#humidity'),
					$temperature = $weather.find('#temperature'),
					$temp = $temperature.find('#temp'),
					$icon = $temp.find('#condition'),
					$tempNumber = $temp.find('#num'),
					$celsius = $temp.find('#celsius'),
					$fahrenheit = $temp.find('#fahrenheit'),
					$forecast = $weather.find('#forecast');

				function getWeather() {

					var requestWeather = $.ajax({
						dataType: 'json',
						url: ozy_headerType.$OZY_WP_AJAX_URL,
						data: {
							action: 'diwine_ajax_weather',
							request_city: $request_city,
							request_type: '1'
						}
					});

					var requestForecast = $.ajax({
						dataType: 'json',
						url: ozy_headerType.$OZY_WP_AJAX_URL,
						data: {
							action: 'diwine_ajax_weather',
							request_city: $request_city,
							request_type: '2'
						}
					});

					$fahrenheit.addClass('active').removeAttr('href');
					$celsius.removeClass('active').attr("href", '#');
					$icon.removeClass();

					requestWeather.done(function (data) {

						var dt = new Date(data.dt * 1000).toString().split(' ');

						var title = data.sys.country ?
							data.name + ', ' + data.sys.country :
							data.name;

						$city.html(title);
						$tempNumber.html(Math.round(data.main.temp));
						$description.html(titleCase(data.weather[0].description));
						$wind.html('Wind: ' + data.wind.speed + ' mph');
						$humidity.html('Humidity ' + data.main.humidity + '%');
						$dt.html(fullDay(dt[0]) + ' ' + dt[4].substring(0, 5));

						$celsius.on('click', toCelsius).click();
						$fahrenheit.on('click', toFahrenheit);

						function toCelsius() {
							$(this).addClass('active').removeAttr('href');
							$fahrenheit.removeClass('active').attr('href', '#');
							$tempNumber.html(Math.round((data.main.temp - 32) * (5 / 9)));
							$wind.html('Wind: ' + (data.wind.speed / 0.62137119223733).toFixed(2) + ' km/h');
						}

						function toFahrenheit() {
							$(this).addClass('active').removeAttr('href');
							$celsius.removeClass('active').attr("href", '#');
							$tempNumber.html(Math.round(data.main.temp));
							$wind.html('Wind: ' + data.wind.speed + ' mph');
						}

						switch (data.weather[0].icon) {
							case '01d':
								$icon.addClass('wi wi-day-sunny');
								break;
							case '02d':
								$icon.addClass('wi wi-day-sunny-overcast');
								break;
							case '01n':
								$icon.addClass('wi wi-night-clear');
								break;
							case '02n':
								$icon.addClass('wi wi-night-partly-cloudy');
								break;
						}

						switch (data.weather[0].icon.substr(0, 2)) {
							case '03':
								$icon.addClass('wi wi-cloud');
								break;
							case '04':
								$icon.addClass('wi wi-cloudy');
								break;
							case '09':
								$icon.addClass('wi wi-showers');
								break;
							case '10':
								$icon.addClass('wi wi-rain');
								break;
							case '11':
								$icon.addClass('wi wi-thunderstorm');
								break;
							case '13':
								$icon.addClass('wi wi-snow');
								break;
							case '50':
								$icon.addClass('wi wi-fog');
								break;
						}
					});

					requestForecast.done(function (data) {
						$loading.remove();

						$celsius.on('click', toCelsius);
						$fahrenheit.on('click', toFahrenheit);

						var forecast = [];
						var length = data.list.length;
						for (var i = 1; i < length; i++) {
							forecast.push({
								date: new Date(data.list[i].dt * 1000).toString().split(' ')[0],
								fahrenheit: {
									high: Math.round(data.list[i].temp.max),
									low: Math.round(data.list[i].temp.min),
								},
								celsius: {
									high: Math.round((data.list[i].temp.max - 32) * (5 / 9)),
									low: Math.round((data.list[i].temp.min - 32) * (5 / 9))
								}
							});
						}

						function toCelsius() {
							doForecast('celsius');
						}

						function toFahrenheit() {
							doForecast('fahrenheit');
						}

						function doForecast(unit) {
							var arr = [];
							var length = forecast.length;
							for (var i = 0; i < length; i++) {
								arr[i] = ("<div class='block'><span class='secondary'>" + forecast[i].date + "</span><span class='high'>" + forecast[i][unit].high + "</span><span class='secondary'>" + forecast[i][unit].low + "</span></div>");
							}
							$forecast.html(arr.join(''));
						}

						doForecast('celsius');
					});
				}
				getWeather();

			});
		}
	}

	ozy_vc_components();

	/* FancyBox initialization */
	$(".wp-caption>p").on('click', function(){ jQuery(this).prev('a').attr('title', jQuery(this).text()).click(); } ); //WordPress captioned image fix
	$(".fancybox, .wp-caption>a, .single-image-fancybox a").fancybox({
		beforeLoad: function() {
		},
		padding : 0,
		helpers		: {
			title	: { type : 'inside' },
			buttons	: {}
		}
	});
	$('.fancybox-media, .fancybox-media-button a').fancybox({openEffect  : 'none',closeEffect : 'none',autoCenter: false,helpers : {title	: { type : 'inside' }, media : {}, overlay: { locked: false }}});
	/* Back to top button */
	var pxScrolled = 200;
	var duration = 500;

	$(window).scroll(function() {
		$('.diwine-btt-container').show();
		if ($(this).scrollTop() > pxScrolled) {
			$('.diwine-btt-container').css({'bottom': '20px', 'transition': '.3s'});
		} else {
			$('.diwine-btt-container').css({'bottom': '-100px'});
		}
	});

	$('.top').on("click", function() {
		$('body,html').animate({scrollTop: 0}, duration);
	});

	/* Menu Card */
	if($('.ozy-menu-item-card[data-popimg]').length) {
		$('.ozy-menu-item-card[data-popimg]>div').on("click", function(e) {
			e.preventDefault();

			var $this = $(this).parents('div.ozy-menu-item-card');

			if($this.data('popimg')) {
				var downloadingImage = new Image();
				downloadingImage.onload = function(){
					$.fancybox({
						maxWidth:940,
						padding:0,
						scrolling:'no',
						'content' : '<div id="ozy-menu-card-popup" class="content-font"><div>' + '<img src="' + this.src + '"/>' + '<h2 class="heading-font">' + $this.find('.item-name').html() + '</h2>' + $this.find('.item-popup-content').html() + '</div></div>',
						afterShow: function() {
							if(!ozyCheckFirefox()) {
								$('#ozy-menu-card-popup>div').niceScroll({autohidemode:"false", cursorwidth: "5px", cursorcolor: jQuery('.menu-circle').css('border-color'), cursorborder: "none"});
							}else{
								$('#ozy-menu-card-popup>div').css('overflow-y', 'scroll');
							}
							$('#ozy-menu-card-popup>div').scrollLock();
						}
					});
				};

				downloadingImage.src = $this.data('popimg');
			}else{

				$.fancybox({
					maxWidth:940,
					//maxHeight:640,
					padding:0,
					scrolling:'no',
					'content' : '<div id="ozy-menu-card-popup" class="content-font"><div><h2 class="heading-font">' + $this.find('.item-name').html() + '</h2>' + $this.find('.item-popup-content').html() + '</div></div>',
					afterShow: function() {
						if(!ozyCheckFirefox()) {
							$('#ozy-menu-card-popup>div').niceScroll({autohidemode:"false", cursorwidth: "5px", cursorcolor: jQuery('.menu-circle').css('border-color'), cursorborder: "none"});
						}else{
							$('#ozy-menu-card-popup>div').css('overflow-y', 'scroll');
						}
						$('#ozy-menu-card-popup>div').scrollLock();
					}
				});

			}

			return false;
		});
	}
});

/* Drop Caps */
jQuery(window).on('load', function(){
	"use strict";
    if(ozy_headerType.disable_dropcaps != '1') {
        var elements = document.getElementsByClassName("heading-font");
        for (var i=0; i<elements.length; i++) {
            elements[i].innerHTML = elements[i].innerHTML.replace(/\\b([a-z])([a-z]+)?\\b/gim, "<span class='first-letter'>$1</span>$2");
        }
    }
});
jQuery(document).ready(function($) {
	"use strict";
    if(ozy_headerType.disable_dropcaps != '1') {
        jQuery(".ozy-drop_caps, .diwine-primary-nav > li:not(.logo) > a").highlightText(/\b([a-z]+)\b/ig,"fl");
        $('.ozy-drop_caps .fl, .diwine-primary-nav > li:not(.logo) > a .fl').html(function (i, html) {
            return '<i>' + html.slice(0, 1) + '</i>' + html.slice(1);
        });
    }
});

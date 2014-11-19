(function($) {
	"use strict";
	window.onload = function(){	
		DoBibtex();	
		// Variables
		var leftSection		= $("#leftSection");
		var rightSection	= $("#rightSection");
		var loadingPage		= $("#loading_page");
		var bio			= $("#bio");
		var social		= $("#social");
		var top			= $("#top");
		var nav			= $("#nav");
		var page		= $("#page");
		var copyright		= $("#copyright");
		var timeFade		= 600;
		var local		= window.location;
		var localString		= local.toString();
		var localPage		= localString.split('/');
		var thePage		= localPage[(localPage.length-1)];
	
		// Change Menu / Load a new page
		var open = 'no';
		function Menu(newmenu) {
			if (open == 'no') {
				open = 'yes';
				var actMenu	= nav.find('li a.active');
				var idMenu	= actMenu.attr('href');
				if (newmenu == 0) {
					if ( (thePage != '') && (thePage != '#') && (thePage != 'index.html') && (thePage != 'index.html#') ) {
						// url page
						idMenu = thePage; newmenu = thePage;
					} else {
						// profile page
						idMenu = '#profile'; newmenu = '#profile';
					}
				}
				// Remove all active classes from menu (block other clicks)
				nav.find('li a').removeClass('menu').removeClass('active');
				idMenu = newmenu;
				// If page post (inside blog page)
				if ( newmenu.indexOf("#post-") != -1 ) { newmenu = '#blog'; }
				// Add active class for the selected menu
				$(newmenu).addClass('active');
				// Hide page w/ fadeOut effect
				page.find('.content').fadeOut( timeFade );

				// Reset page functions
				resetFunctions();			
				// Wait (page is hidden)
				setTimeout( function() {
					// Show selected page w/ fadeIn effect
					page.find(idMenu+'-page').fadeIn( timeFade );					
					// Wait some seconds and load all page functions
					setTimeout(function() { loadFunctions(); }, timeFade);
					// Set open = 'no' again
					open = 'no';
				}, timeFade);
			} else {
				//alert('Ops, wait a moment! Other page is loading right now. Sorry! =)');
			}
		}
		
		// Control the page scroll
		function scrollto( horizontal, vertical ) {
			var pane = $('.scroll-pane');
			var api = pane.data('jsp');
			api.scrollTo( parseInt(horizontal), parseInt(vertical) );
			$('html, body').animate({ scrollTop: 0 }, timeFade);
			return false;
		}

		// Reset all functions before change pages
		function resetFunctions() {
			setTimeout( function() {
				// Profile Page - Progress Bars
				$('.progress span').css('width', '0px').removeClass('paddingProgress');

				// Portfolio Page - Categories
				$('#portfolio-page .groups').removeClass('active');
				$('#portfolio-page #allgroups').addClass('active');
				$('#portfolio-thumbs li').fadeIn(100);
				$('#lightbox').remove();

				// Blog Page - Empty Error Div
				$('#errordiv').html('');
			}, timeFade);
		}

		// Open external links
		var times = 0;
		function openExternal(url) {
			console.log('openExternal');
			if (times == 0) {
				console.log('times 0 = nao abriu');
				times = 1;
				// no yet, wait
			} else {
				console.log('times 1 = abriu! =)');
				window.open(url, '_blank');
				times = 0;
				// to open on same page
				// window.location=url;
			}				
		}

		// Load all functions after change pages
		var functionsReady = 0;
		function loadFunctions() {
			// Add class "menu" for menu items (after load the new page)
			// menu items without "menu" class, can't load pages
			nav.find('li a').addClass('menu');

			// Profile Page - Progress Bar
			$('.progress span').each(function() {
				var sizeProgress = $(this).attr('data-size');
				$(this).css('width', sizeProgress);
				$(this).addClass('paddingProgress');
			});

			// Portfolio Page - Lightbox
			// Create lightbox for "All Groups"
			$('#portfolio-thumbs a.group').lightbox();
			
			// Portfolio Page - Choose Categories
			$('#portfolio-page .groups').unbind("click").click(function(){
				var idButton = $(this).attr('id');
				$('#portfolio-page .groups').removeClass('active');
				$(this).addClass('active');
				$('#portfolio-thumbs li').fadeOut(timeFade/4);
				setTimeout(function(){
					$('#portfolio-thumbs li a').each(function(){
						var elemGroup = $(this).attr('data-group');
						var buttonGroup = idButton;
						if ( idButton != 'allgroups' ) {
							if ( buttonGroup == elemGroup ) {
								$(this).parent().fadeIn(timeFade);
							}
						} else {
							$(this).parent().fadeIn(timeFade);
						}
					});
				}, timeFade);					
				// Close lightbox to open again (with the category selected or all)
				$('#lightbox').remove();
				// Dinamic Group
				if ( idButton == 'allgroups' ) {
					// Create lightbox for "All Groups"
					$('#portfolio-thumbs a.group').lightbox();
				} else {
					// Create lightbox for "Selected Group"
					$('#portfolio-thumbs a[data-group="'+idButton+'"').lightbox();
				}
			});

			// Open external link / See the project
			$('#portfolio-page span.external').bind('click', function(){
				var data_url = $(this).attr('data-url');
				openExternal(data_url);
				return false;
			});

			// Verify the device to load Scroll Pane or not
			if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i)) ) {
				// NO jquery scrollpane
			} else {
				// Scroll Pane - jQuery Plugin
				var pane = $('.scroll-pane');
				pane.jScrollPane({
					// showArrows: true,
					autoReinitialise: true,
					mouseWheelSpeed: 60,
					animateScroll: true,
					maintainPosition:true
				});
			}			
			
			if ( functionsReady == 0 ) {
				// Profile Page - Basic jQuery Slider
				$('#image-rotator').bjqs({
					// w + h to enforce consistency
					width:			400,	// image width
					height:			450,		// image height
					// transition valuess
					animtype:		'fade',		// accepts 'fade' or 'slide'
					animduration:	900,		// length of transition
					animspeed:		7000,		// delay between transitions
					automatic:		true,		// enable/disable automatic slide rotation
					// control and marker configuration
					showcontrols:	true,		// enable/disable next + previous UI elements
					centercontrols:	true,		// vertically center controls
					nexttext:		'<i class="fa fa-arrow-right"></i>',		// text/html inside next UI element
					prevtext:		'<i class="fa fa-arrow-left"></i>',		// text/html inside previous UI element
					showmarkers:	false,		// enable/disable individual slide UI markers
					centermarkers:	true,		// horizontally center markers
					// interaction values
					keyboardnav:	true,		// enable/disable keyboard navigation
					hoverpause:		true,		// enable/disable pause slides on hover
					// presentational options
					usecaptions:	true,		// enable/disable captions using img title attribute
					randomstart:	false,		// start from a random slide
					responsive:		true		// enable responsive behaviour
				});
			}
			functionsReady = 1;

			// Contact Page - Maps
			var pathMap = $('.Flexible-container').html();
			$('.Flexible-container').hide().html('');
			setTimeout( function() {
				$('.Flexible-container').html(pathMap).fadeIn(300);
			}, 300);
		}

		// Page Transition
		$('.menu, article a').click(function(){
			var pagina = $(this).attr('href');
			// If href is diferent than #, there is a link to other page
			if ( pagina != "#" ) { Menu( pagina ); }
		});

		// Height Settings
		var windowWidth		= $(window).width();
		var windowHeight	= $(window).height();
		var defaultPadding	= 30;
		
		// Define Left Section Height
		leftSection.animate({ height: windowHeight }, 300, function(){
			// Hide Loading Image
			loadingPage.fadeOut(timeFade);
			// Show Right Section
			rightSection.animate({ height: windowHeight }, 300, function() {
				// Show Top Section
				top.find('.content').fadeIn( timeFade );
				if ( windowWidth < 960 ) { defaultPadding = 20; }
				var contentHeight	= (windowHeight - top.height() - (defaultPadding*2) );
				// Page height and fadeIn()
				page.css('height', ''+contentHeight+'px');
				setTimeout(function(){
					page.fadeIn(timeFade*2);
					copyright.animate({ opacity: 1 }, timeFade);
				}, timeFade);
				// Number of Menus
				var sizeMenu = nav.find('ul li').size();
				var xMenu = 0;
				while (xMenu < sizeMenu) {
					nav.find('ul li a').eq( xMenu ).addClass('marginTop');
					xMenu++;
				}
				Menu(0); // 0 - Initial menu
			});
			// Show Left Section
			leftSection.find('.content').fadeIn(timeFade, function(){
				// Show Social Profiles
				social.animate({ opacity: 1 }, timeFade).addClass('bottom');
			});
		});
		
		// When Window was Resized
		var resizing = 'no';
		function resizeWindow(){
			if (resizing == 'no') {
				if ( windowWidth >= 768 ) { page.css('height', '360px'); }
				resizing = 'yes';
				setTimeout(function(){
					// Size Settings
					var WidthWindow		= $(window).width();
					var HeightWindow	= $(window).height();
					if ( WidthWindow < 960 ) { defaultPadding = 20; } else { defaultPadding = 30; }
					var HeightPage		= (HeightWindow - top.height() - (defaultPadding*2) );					
					if ( $(window).width() >= 768 ) {
						leftSection.css('height', HeightWindow);
						page.css('height', HeightPage);
						rightSection.css('height', HeightWindow);
					} else {
						page.css('height', 'auto');
						rightSection.css('height', 'auto');
					}
					setTimeout(function(){
						resizing = 'no';
					}, timeFade);
				}, timeFade);
			}
		}
		
		// Contact Page - jQuery Validate (Form)
		// validate signup form on keyup and submit
		$("#contactForm").validate({
			rules: {
				name: {
					required: true,
					minlength: 3
				},
				email: {
					required: true,
					email: true
				},	
				subject: "required",
				message: "required"
			},
			messages: {
				name: {
					required: "Please enter your name",
					minlength: "Please enter 3 or more characters"
				},
				email: "Please enter a valid email address",
				subject: "Please enter a valid subject",
				message: "Please enter your message"
			},
			submitHandler: function (form) {
				$.ajax({
					type:	"POST",
					url:	"mail.php",
					data:	$(form).serialize(),
					success: function (data) {
						$(form).html("<div id='message'></div>");
						$('#message').html( data )
						.hide().fadeIn(1500);
					},
					error: function () {
						$(form).html("<div id='message'></div>");
						$('#message').html('<h5>Sorry...</h5><p>Your browser can\'t called email function!</p>')
						.hide().fadeIn(1500);
					}
				});
				return false; // required to block normal submit since you used ajax
			},
			errorPlacement: function(error, element) {
				error.appendTo('#errordiv');
			}
		});
		
		// Go to top after button clicked
		$('.to-top').click(function() { scrollto(0, 0); });
		
		// Replace the non-retina images to retina images
		if (window.devicePixelRatio > 9999) {
			var lowresImages = $('img');
			lowresImages.each(function(i) {
				var lowres = $(this).attr('src');
				var highres = lowres.replace(".", "@2X.");
				$(this).attr('src', highres);
			});
		}
		
		// When window was resized
		$(window).resize(function() {
			// Call resizeWindow Function
			resizeWindow();
		});
	}
})(jQuery);

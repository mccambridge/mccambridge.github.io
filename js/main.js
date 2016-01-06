/* whew, this is old school!
 * it's time for an update. until then, enjoy the classic!
 * cobbler's children's shoes and all
 */

(function($) {
	var Sean = {
		// properties
		widthRatio: 1384,
		currentPhoto: -1, // intro slide
		photoTransitionTime: 400,
		currentSlogan: 0,
		blogSlogans: [
			'To blog, or not to blog: that is the question.',
			'That which doesn\'t blog you makes you stronger.',
			'You miss 100 percent of the blogs you never take.',
			'Don\'t blog because it\'s over. Blog because it happened.',
			'You must be the blog you wish to see in the world.',
			'One small step for man, one giant blog for mankind.',
			'Once blog becomes toast, it can never be blog again.',
			'Insanity: blogging the same thing over and over expecting different results.',
			'We blogged with a blog that was more than blog.',
			'All you need is blog.',
			'There are blogs, damned blogs and bloggy blogs.'
		],
		blogSlogansInterval: 8000,

		// methods
		bodyFont: function() {
			if ($('#post').length || $('#listing').length) return false; // no proportional layout on blog
			$('body').css({'font-size': (($(document).width() / this.widthRatio) * 100) + '%'});
		},

		hoverParallax: function(e) {
			return false;
			var $this = $(this);
			// get mouse position relative to pavement div, create y value
			var yProp = e.pageY / $this.height(); // y proportion
			var yVal = 52 + (12 * yProp); // min 54, max 60
			//if (yProp < .5) yVal = 57;
			requestAnimationFrame($this.css({'background-position': '0 ' + yVal + '%'})); // apply to background position
		},

		workThumbs: function($this) {
			var theTarget = $this.attr('href');
			$(theTarget).siblings().removeClass('active').end().addClass('active');
		},

		advancePhotos: function(dir) {
			// dir is int, either -1 or 1
			var $slides = $('#photos').find('li'),
				totalSlides = $slides.length;
			if (this.currentPhoto === -1) { // intro slide, just kill it and show first slide
				$('#photos-content').addClass('complete'); // kill intro
				$('#photos').find('nav').removeClass('hidden'); // cue prev/next nav
				$('#photo-count').html('1 of ' + totalSlides).css({'color': '#' + $slides.eq(0).data('color')});
				this.currentPhoto++; // increment count
				return true;
			}
			if ((this.currentPhoto === 0 && dir === -1) || (this.currentPhoto + dir === totalSlides)) { // at slide 0, back to intro
				$('#photos-content').removeClass('complete'); // intro comes back on stage
				$slides.removeClass('complete').addClass('queued'); // back to starting point
				$slides.eq(0).removeClass('queued'); // except you, slide 0
				$('#photos').find('nav').addClass('hidden'); // kill prev/next nav
				this.currentPhoto = -1; // reset count
				return true;
			}
			// all other cases handle middle slides
			if (this.currentPhoto % 2 === 0) { // even (gets covered over)
				$slides.eq(this.currentPhoto + dir).removeClass('queued complete').css({'z-index': 100}); // push prev/next right or left atop our current slide
				$slides.eq(this.currentPhoto + 1 + dir).removeClass('queued complete').css({'z-index': 99}); // push prev/next right or left atop our current slide
			} else { // odd (now uncovers to reveal slide underneath)
				if (dir < 0) {
					$slides.eq(this.currentPhoto).addClass('queued');
					$slides.eq(this.currentPhoto + 1).addClass('queued');
				} else {
					$slides.eq(this.currentPhoto).addClass('complete');
				}
			}
			$('#photo-count').html((this.currentPhoto + dir + 1) + ' of ' + totalSlides).css({'color': '#' + $slides.eq(this.currentPhoto + dir).data('color')});
			this.currentPhoto = this.currentPhoto + dir;
			return true;
		},

		handlePhotoWaypoint: function(dir) {
			if (dir === 'up') {
				$('#photos').find('nav').css({'position': 'absolute'});
			} else {
				$('#photos').find('nav').css({'position': 'fixed'});
			}
		},

		handleBlogWaypoint: function(dir) {
			if (dir === 'up') {
				$('#photos').find('nav').fadeIn();
			} else {
				$('#photos').find('nav').fadeOut();
			}
		},

		setRandomBlogSlogan: function() {
			Sean.currentSlogan = Math.floor(Math.random() * Sean.blogSlogans.length);
			$('#blog').find('h2').html(Sean.blogSlogans[Sean.currentSlogan]);
		},

		cycleBlogSlogans: function() {
			setInterval(function() {
				Sean.currentSlogan++;
				if (Sean.currentSlogan >= Sean.blogSlogans.length) { Sean.currentSlogan = 0; }
				$('#blog').find('h2').html(Sean.blogSlogans[Sean.currentSlogan]);
			}, Sean.blogSlogansInterval);
		},

		events: function() {
			$(window).on('resize', function() {
				Sean.bodyFont();
			});
			$('#compass').on('click', function() {
				$('#blog-sidebar, #compass').toggleClass('open');
			});
			$('#pavement-ends').on('mouseenter', function() {
				$(this).on('mousemove.hoverParallax', throttle(Sean.hoverParallax, 5)); // add mousemove event and handler
			}).on('mouseleave', function() {
				$(this).off('mousemove.hoverParallax');
			});
			$('#local-photos, #local-work, #local-blog').on('click', function(e) {
				e.preventDefault();
				var href = $(this).attr('href');
				$.scrollTo(href, 800, {easing: 'easeInOutQuart'});
			});
			$('#work-list').find('a').on('click', function(e) {
				Sean.workThumbs($(this));
				e.preventDefault();
			});
			// $('#photos').find('.button').on('click', function(e) {
			// 	var dir = $(this).data('dir') || 1;
			// 	Sean.advancePhotos(dir);
			// 	e.preventDefault();
			// }).end().waypoint(function(dir) {
			// 	Sean.handlePhotoWaypoint(dir);
			// });
			$('#photos').waypoint(function(dir) {
				Sean.handlePhotoWaypoint(dir);
			});
			$('#blog').waypoint(function(dir) {
				Sean.handleBlogWaypoint(dir);
			}, {offset: 200});
		},

		init: function() {
			// reset font size relative to dev frame
			this.bodyFont();
			this.events();

			//this.cycleBlogSlogans();
			//this.setRandomBlogSlogan();
			setTimeout(function() { Sean.bodyFont() }, 0);
		}
	}
	$(document).ready(function() {
		Sean.init();		
	});
})(jQuery);

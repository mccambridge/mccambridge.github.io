---
layout: blog_entry
title: Proportional Web Design
description: Proportional layouts scale like no other. Images, text, html, positioning can resize and fit perfectly. Am I onto something new?
---
 This website is deceptively awesome.  Now that <a href="/">SeanMcCambridge.com</a> cir. 2013 is up and a blog running, I get to talk a little bit about the construction of the site.  And I'm excited to share.

I've never seen this technique used before (though I imagine it's out there somewhere).  At the very least, it's new to me, and I think it will be useful for any kind of layout.

 I found a way to create a scalable/proportional layout by heavy use of absolute positioning (yeah, that scared me at first), percentages and `ems`.  Since percentage `widths` and `lefts` are elastic, every horizontal element moves and scales proportionally to the width of the browser. By writing a little JavaScript to update the base `em` value used for vertical elements based on the screen width, the entire site &mdash; images, text and all &mdash; scales proportionally in the browser window.

Bear with me.

Basically, the idea is that everything on the page scales fully according to the width of the browser window.  _Everything_.  We were already able to stretch backgrounds as non-repeating images spanning the full width of a block element, first with JavaScript and later with `background-size`.  Nothing new there.  The fun part with this new technique is that position, width, height, images all scale so we can combine absolute positioning with fluid layout with near-pixel-perfect precision.

It's as if we're laying out a design on an x/y grid, and everything goes where we want.

Without this technique, we could specify a `left` value as a percentage, and that element would have a fluid position left and right on the page.  But how could we specify a fluid `top` value?  Percentages don't work vertically.  Given an `em` value for the body tag and a little JavaScript that updates that value as a function of the window width, we can now reliably use `ems` as a unit for `height` and `top` values.  When the browser width changes, our percentages handle `width` and `left` values as they always had.  But now the `em` value changes proportionally with that percentage value.  Everything on the page scales up or down together.

If I'm not making sense, check out my <a href="/">home page</a> and mess with the width of your browser.

So how does it work?
--------------------

In order to scale proportionally, specify `width` and `left` values as a percentage (`%`).  Specify all `height`, `top`, `font-size`, etc. as `em` values.  This takes some tweaking and feel.  I spent a lot of time with my friends trial and error while building my home page.  We can even use `em` values for `border`, `box-shadow`, really any value we want to scale.  But the most noticable will be the size and positional values.  Ems can be tricky since they multiply when the values cascade so be careful when setting font sizes deeper in your markup.

This would be easy if all browsers were the same.  If everyone had the same window width as the developer, everyone would see your layout in good ol' absolute-positioned glory.  In that case, we could have used `px` values since there would be no need for proportional scaling.

Let's write a little JavaScript to keep our `body` tag's `font-size` value relative to the browser width as I described above.  I use jQuery, which I'll assume you have some experience with.

    $('body').css({'font-size': (($(document).width() / 1260) * 100) + '%'}); // 1260 was my window width during initial development

Alright, we simply set the body font size to the currnent width divided by a constant.  Execute this code after the document ready event and set up a resize event listener to fire the same code if the user resizes their browser window.

With our events in place, it looks more like this:

	var resetBodyFontSize = function() {
		$('body').css({'font-size': (($(document).width() / 1260) * 100) + '%'});
	}

    $(document).ready(function() {
    	resetBodyFontSize(); // initial call at document ready

    	$(window).on('resize', resetBodyFontSize); // resize handler
    });

It probably makes things easier to set up this JavaScript before we begin laying things out, but it doesn't matter.  When we do wait it's important that we're sure to check our current width and use that as the constant.

Now the browser adjusts the body font size proportionally on load and when the browser is resized.  If we set up our CSS properly, every element on the page will scale proportionally and maintain relative width and height.  Cool, right?

Yeah, it's pretty cool.  What's the catch?
------------------------------------------

For now, it isn't perfect.  For one, the technique breaks the browser's zoom functionality since whenever the browser zooms in, the width goes down and the content scales down with it.  I implemented a `min-width` on the body tag on my site which keeps the page from scaling below 768px.  After a few taps on `CMD+` the page does finally zoom.  But this isn't a great user experience for our visually impaired visitors who might not figure out that they need to zoom multiple times for the site to finally respond.

Another issue was pretty clear when I first viewed the site in my iPhone.  Needless to say, the text size was miniscule.  I'm looking forward to implementing responsive design which will kill the proportional layout entirely and render the content as a simple one-column mobile layout.

Well, isn't this responsive design?
-----------------------------------

Nope, not at all.  Responsive design is responsive in a different way and does so by utilizing media queries.  Proportional design is a riff on fluid layout &mdash; maybe I should be calling it proportional layout? &mdash; and can sit happily within a responsive design implementation.  In fact, I should be busy making my site responsive.  Why am I writing this blog post?

Please, if you have any thoughts, see any issues, thought of it first, whatever &mdash; let me know.
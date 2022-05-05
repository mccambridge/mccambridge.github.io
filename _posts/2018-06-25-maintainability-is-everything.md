---
layout: blog_entry
title: Maintainability is everything
description: It's been a long time since I updated my personal site. Here's what the pain taught me.
---
In 2013, I had a cool idea. Anyway, it was a cool idea for 2013. I tested the idea on my personal website, the site that has now become my <a href="/about">About Page</a>.

I found a way to scale web pages so everything _kind of_ scaled proportionally: fonts, widths, images, etc. The webpage behaved sort of like a poster. It worked for the most part. Everything was set in `ems` and fed off of a master font size set by JavaScript. When the page resized, so did everything else.

Fast-forward to today. It's Summer 2018. Five years later. It was about time to make this site look halfway decent on mobile devices. Even though I build responsive sites in my sleep, this one never got the responsive makeover.

Today was the day to make it happen. Ouch.

## Looking back

Have you ever combed through any of your old projects to see how you did things, say, five years ago? I just did. And I'd rather scrub a bilge than go through my old code ever again. Luckily, I do things better now. But look at what I was doing five years ago.

`#photos #photos-content {`
`  ...`
`}`

Check out that double-ID!

Since then, I've been writing CSS very, _very_ differently. I went down the <a href="http://getbem.com/" target="_blank">BEM</a> road for a while before jumping on the <a href="https://github.com/css-modules/css-modules" target="_blank">CSS Modules</a> train. I am definitely not writing the old, awful, unmaintainable CSS spaghetti I used to.

## The dull, dry edge

I am not of of those bleeding-edge programmers who wants to convert your entire stack to the latest framework. I'm not a Luddite, either. I like to watch new technologies play out. Today, I learned why 1. having a consistent methodology pays off, and 2. why sometimes newer ideas really are better.

I spent an entire evening battling CSS specificity. Let's never do that again. Following a pattern that takes specificity out of the game makes your CSS code maintainable. Simple as that.

If you don't already, write some kind of namespaced CSS. When you go back months or years later, instead of worrying about the consequences of your update and what you might be breaking, just write a little more code the first time around so you can be sure you know what you're targeting.

A huge stylesheet will never outweigh even a small image. You can minify and compress it. You'll be okay.

When you open that file five years later, you'll thank yourself.
---
layout: blog_entry
title: Jekyll vs. WordPress
description: As a web developer, Jekyll seemed like a great way to get me blogging again. It's a great tool ... if you use it.
---

I was just lamenting how silly it is that I have a six-month-old blog with exactly three posts. I want to write. I like to write. I have [12 thoughts per second bouncing around my skull like pinballs](http://vimeo.com/67917666). So why am I not I writing, damnit?

I rebuilt this site over the winter using [Jekyll](http://jekyllrb.com/). It was my first try at Jekyll for anything at all. It's so simple. Jekyll isn't really a CMS so much as a HTML generator (a "static site generator", as it's billed). There is no database. There is no server-side code. All the magic happens on your development machine.

For years, my go-to blog/CMS for small-scale sites has been [WordPress](http://wordpress.org/). And I will still come back to WP when it seems like the right tool for the job. But one thing is clear: Jekyll and WordPress operate under completely different philosophies.

Unlike WordPress, there is no [bloat](http://www.noupe.com/wordpress/i-love-you-wordpress-but-73974.html) in Jekyll whatsoever. There are no database queries. Jekyll pages are by their very nature 'cached'. Jekyll isn't attempting to be everything to everyone.

On the other hand, there is no dynamic content, and that can be an issue. Users cannot submit comments to the site through Jekyll (you _can_ make it work using a client-side/JavaScript method as I do via [Disqus](http://disqus.com/), but [that has a number of disadvantages](http://bit.ly/10qyHQG) to consider). Jekyll doesn't even exist on the server -- how could it handle dynamic features? If you want dynamic content (e.g. you want a contact form that allows your visitors to send you an email), you build it using a server-side language like PHP, Ruby, Python, etc, working side-by-side with Jekyll.

## So why use Jekyll then?

Besides wanting to learn something new, I picked up Jekyll because I heard [from some developers I respect](http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/) that it's light and easy to use. It's true. Building this site in Jekyll took an ounce more effort than building my static templates in HTML/CSS/JS. And look at me now. I'm writing this post in my code editor in Markdown. Easy, right?

A WordPress site would have taken much longer to build and configure. It has much louder and fancier bells and whistles, [which come at a cost -- do you really want to deal with 18 steps to boost performance?](http://www.wpbeginner.com/wp-tutorials/18-useful-tricks-to-speed-up-wordpress-boost-performance/) As long as you're getting the features you need, it's better to be performant out of the box. Beyond build time and performance, there is just something about the WordPress editor that feels ... I don't know ... unclean.  Compared to my code editor, there is a lot of clutter that has an impact on my desire to use it.

To write a post in Jekyll I open Terminal, go to my site directory and `touch` a new file with a timestamp and title. This post's filename is `2013-06-28-jekyll-vs-wordpress.md`. Then I open the file in my code editor and blast out some Markdown. That's it. Post written. (Well, almost.)

Compare that to the hassle of going to your WP site, logging in, going to Posts and creating a new post. Okay, it's not that bad, is it? Eh, there's just something about it...

If light is okay for you, then nimble is what you get with Jekyll.

## Publishing

In WordPress, you click Publish in the editor and WordPress does its magic and publishes your new post to the site.

It's not that magical in Jekyll. But Jekyll still makes it easy.  From Terminal, you simply fire up Jekyll's server to proof your work: `jekyll --server`.

Head over to [the Jekyll documentation](http://jekyllrb.com/docs/configuration/) for detailed instructions.

When you run `jekyll build` from your site's root directory, the HTML and supporting files are created in `_site`. From there, you can FTP the contents to your server. You can even set things up to publish via Git and Capistrano or scp/rsync. That's easy!

Sure, your client isn't going to use Jekyll. No chance. But if you're comforatable with the tools, it feels good to use Jekyll.

## Okay, but how come this is only your fourth post in half a year?

Great question. In the end, blogging -- writing, musing, publishing, whatever you want to call it -- takes effort. It has to [become a habit](http://blogs.ucl.ac.uk/hbrc/2012/06/29/busting-the-21-days-habit-formation-myth/). The tools you use have only a minor effect on how prolific you manage to become. Whether or not you write depends upon your willingness to take the time and write. Period.

I'm writing this post for myself. 'Why am I not blogging?' is the question I sought to answer. Tapping out this .md file, my mind wandered over to Jekyll vs. WordPress. I wasn't planning on writing about Jekyll vs. WordPress.  Often, that's what writing is for me: an exploration. The human brain is a strange lump. [Ideas have a way of sifting themselves out](http://www.npr.org/2011/06/29/137503808/from-muses-to-music-where-ideas-come-from). Sometimes, switching between media changes my thinking: reading to brainstorming, brainstorming to sketching, skethching to writing, writing to typing...

I might argue against myself on this point. If this is stream of consciousness writing, then what am I doing publishing my first draft straight to my blog? I'll read this post in a minute or two for copy edits and readability. I suppose I'll be back the rest of the day to make more significant edits. [I believe strongly in drafts](https://en.wikipedia.org/wiki/War_and_Peace) and taking the time to polish the words I send into the world. But at this point, it's about getting something published. Anything at all.

Maybe Jekyll does make writing easier. If the barriers to getting started come down, then maybe I'm more likely to get going and let my thoughts find their way out.

We shall see.
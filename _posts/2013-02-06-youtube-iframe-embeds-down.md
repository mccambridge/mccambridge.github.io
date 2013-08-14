---
layout: blog_entry
title: YouTube iframe embeds are not working. Twitter is awesome for real-time information
description: I thought I had done something wrong with my code until I checked Twitter to see I wasn't the only one with this issue.
---
I was working on a client project.  Her site has a couple of YouTube embeds, which were working fine this morning.  Suddenly, as I sit down after dinner to work on her project, there are blank spaces where the videos should be.

I inspect the iframe in Firebug, and the iframes are there.  But they're empty.  The &lt;head&gt; and &lt;body&gt; tags inside the iframes are void of content.

My iPhone debugger took it a step further and read `JavaScript: Error on Line 1` `Refused to display document because display forbidden by X-Frame-Options`.  I had never seen this error before, so I got to Googling.

I found a whole bunch of reasons people have seen that error in the past, and none of them were helping me.  So I went to the one place I know that can tell you what is going on at any moment: <a href="http://search.twitter.com">search.twitter.com</a>.

Instantly, I knew I was not alone.  I stopped anxiously blaming myself.  I realized I would actually get some work done tonight (unless I decided later to write a blog post about my experience).

A friend of mine told me the other day that Twitter was useless &mdash; right before he found out he could vet a potential roommate by Twitter-stalking him.

But Twitter has always been good for seeing if some tweet-worthy event is being experienced at any moment by more than a couple people.
Title: Djangular Docker Part I
Author: Josh Finnie
Date: 2014-12-08
Tags: Docker, Django, Angular
Slug: djangular-docker-part-i

I have been a huge fan of the [Djangular](http://mattcamilli.com/talks/djangular/) framework for a while and am lucky enough to use it daily at [TrackMaven](http://trackmaven.com). Lately I have been thinking about how I can make it better. Currently the best practice is to have the Angular app rendered through Django, but Django's template rendering is not the best and there's no real need for this limitation. My idea to improve the current setup norm was to dockerize it; [Docker](https://www.docker.com/) is a great tool where you can have complete seperation of aspects of you application and lends itself perfectly with Djangular. 

Setting up Djangular to work with Docker is not that much trouble. This series is going to walk us through how to set up a robust djangular app from scratch. This blog post will just go through the basic setup of the Decker containers for both Angular and Django.

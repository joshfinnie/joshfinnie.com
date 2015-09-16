Title: React.js Tutorial Part 4
Author: Josh Finnie
Date: 2015-09-16
Tags: tutorial, react.js, javascript, node.js, express.js

Welcome to part 4 of my React.js/Express.js app tutorial. In this blog post, we are going to create the necessary Express routes to serve `json` code to our React.js frontend application. We are also going to very rudimentarily hook up these calls to our server it our React.js component so that the `json` can be rendered.

## Express Routes

The first thing we want to do is to create an Express.js route that will serve a `json` response when a certain URL is hit. This is actually very easy to accomplish within the Express.js framework. The setup of the Express.js website, which was auto-generated for us in [Part 1 of this tutorial](/blog/reactjs-tutorial-part-1/) does a good job of getting us started, but to continue, we want to add some more files to help keep things organized for us. 

So before anything else we want to create another file to keep our API routes. This file will be called `routes/api.js` simply enough. Then we have to edit `app.js` a bit to make sure we can use this new file. In `app.js` we want to modify `var routes = require('./routes/index');` to be something a little more useful to us: `var index = require('./routes/index');`. Then directly below that we want to add our new API routes: `var api = require('./routes/api');`. Lastly, we want to add these to our `app` by adding: `app.use('/api/', api);`. Our `app.js` file should, partially, look like this:

```javascript
...

var index = require('./routes/index');
var api = require('./routes/api');

...

app.use('/', index);
app.use('/api/', api);

...
```

Now we can add a `jobs` route to our `routes/api.js` and start serving `json` through our Express.js app.

### API Routes

There are a lot of resources out there about "Restful" API structure, but [Tuts+](http://code.tutsplus.com/tutorials/a-beginners-guide-to-http-and-rest--net-16340) does a pretty good job and I don't want to dedicate too much time to it; this part of the tutorial does not really need a lot of REST endpoints.

But let's write our first `GET` endpoint which will list out all the jobs we have available. First, we want to steal the `jobs` object from our React.js code and move it into `routes/api.js` then we want an endpoint that will return that object is `json` form. This is done by the following code:

```javascript
var express = require('express');
var router = express.Router();

var jobs = {
    jobs: [
        {
            job_id: 1,
            company: 'TrackMaven',
            position: 'Software Maven',
            local: 'Washington, DC, USA',
            lookingFor: 'Angular.js, Django, ElasticSearch',
            postedDate: '4 April 2015',
            description: '',
            category: 'Engineering'
        },
        {
            job_id: 2,
            company: 'TrackMaven',
            position: 'Junior Software Maven',
            local: 'Washington, DC, USA',
            lookingFor: 'Javascript, Python',
            postedDate: '4 April 2015',
            description: '',
            category: 'Engineering'
        }
    ]
}

router.get('/jobs', function(req, res) {
    res.json({data: jobs});
});

module.exports = router;
```

The object is almost a direct copy that we had hardcoded within our React.js app, with a few modifications. Most importantly, we added the `job_id` variable. This will allow us to use our REST endpoints to return only one job posting, if we want to... which of course we do.

To do that, it's actually pretty simple. Using Express.js's ability to know what URL parameters hit each endpoint, we can add an endpoint that looks like `/api/jobs/1` and our router will know that we want the job with `job_id == 1`. To do this, add the following to `routes/api.js`:

```javascript
router.get('/jobs/:job_id', function(req, res) {
    var job_id = req.params.job_id;
    for (i = 0, len = data.jobs.length; i < len; i++) {
        if (data.jobs[i].job_id === parseInt(job_id)) {
            res.json({data: job});
        }
    }
    res.json({data: "No job found..."});
});
```

**Please Note**: This is not ideal, nor really even practical. In the real world, we would be searching for the `job_id` in a database, not this silly `for -> if` statement we are doing here. But that's for a later tutorial!

With these two routes, we should be able to `curl` these two endpoints and get the following results:

```bash
$ curl localhost:3000/api/jobs
{"data":{"jobs":[{"job_id":1,"company":"TrackMaven","position":"Software Maven","local":"Washington, DC, USA","lookingFor":"Angular.js, Django, ElasticSearch","postedDate":"4 April 2015","description":"","category":"Engineering"},{"job_id":2,"company":"TrackMaven","position":"Junior Software Maven","local":"Washington, DC, USA","lookingFor":"Javascript, Python","postedDate":"4 April 2015","description":"","category":"Engineering"}]}}

$ curl localhost:3000/api/jobs/1
{"data":{"job_id":1,"company":"TrackMaven","position":"Software Maven","local":"Washington, DC, USA","lookingFor":"Angular.js, Django, ElasticSearch","postedDate":"4 April 2015","description":"","category":"Engineering"}}

$ curl localhost:3000/api/jobs/2
{"data":{"job_id":2,"company":"TrackMaven","position":"Junior Software Maven","local":"Washington, DC, USA","lookingFor":"Javascript, Python","postedDate":"4 April 2015","description":"","category":"Engineering"}}
```

That's it! We have a very basic API that we can now have our React.js code talk to.

## React.js and APIs

When first interacting with APIs using React.js, I recommend just using the `request` packages. We will need to add this to our application, but that's as easy as running `npm install request --save`.

Once we have the `request` library installed, we need to do some modification to our `public/javascripts/scr/Jobs.jsx` file to get the data from our API. To do this, we need to slightly modify the `getInitialState` function and add the `componentDidMount` function. We no longer have an full initial state (just a skeleton of what we want our API to look like) since we want to get the data from the API once the component mounts to our application. Our entire `public/javascripts/scr/Jobs.jsx` now looks like this:

```jsx
var React = require('react');
var request = require('request');

var Job = require('./Job.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {jobs: []}
    },

    componentDidMount: function() {
        request('http://localhost:3000/api/jobs/', function(error, response, body) {
            var result = JSON.parse(body);
            if (this.isMounted()) {
                this.setState(result.data);
            }
        }.bind(this));
    },

    render: function(){
        return (
            <div className="list-group">
                {this.state.jobs.map(function(job){
                    return (
                        <Job
                            key={job.job_id}
                            company={job.company}
                            position={job.position}
                            local={job.local}
                            lookingFor={job.lookingFor}
                            postedDate={job.postedDate}
                            description={job.description}
                            category={job.category}
                        />
                    )
                })}
            </div>
        );
    }
});
```

In the file above, you can see how we are using the `request` library to reach out to our newly created API and populate the `state` with the response. You can also see the modifications we made to `render` to allow for us to use the API. And that's it, we should still have a working website that renders these two jobs, but now we are getting data from an API versus hardcoding it within our React.js component (even though we are still just hardcoding it within our API).

## Conclusion

With this part of our tutorial, we have our app now using the API to populate its data. We have a long road ahead before this actually becomes useful, but it's a great start. Next time we will be introducing a way of routing in React.js so that we can not only see all the job posts, but we can drill down to each specific job post. We also need to hook up a database and start collecting data from React too. Please stay tuned!
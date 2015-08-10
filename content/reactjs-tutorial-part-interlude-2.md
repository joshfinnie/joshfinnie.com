Title: React.js Tutorial Part (Interlude 2)
Author: Josh Finnie
Date: 2015-03-08
Tags: tutorial, react.js, javascript, node.js, express.js

Welcome to part (Interlude 2) of my React.js/Express.js app tutorial. This is going to be an article about upgrading a [React.js](http://facebook.github.io/react/) application after coming back to a project after a while. Hopefully this will spur me to continue these tutorials as it has been too long since I have posted one.

## Reviewing Your Application

Since this is a Javascript application, we have the extreme benefit of having our package versions laid out within `package.json`. If we take a look at what is there currently, we'd see:

```javascript
{
  "name": "jobs.nodedc.com",
  "version": "0.1.0",
  "description": "A job board for the NodeDC meetup group.",
  "private": true,
  "scripts": {
        "start": "node ./bin/www",
        "postinstall": "node node_modules/bower/bin/bower install"
  },
  "dependencies": {
        "body-parser": "~1.10.1",
        "cookie-parser": "~1.3.3",
        "debug": "~2.1.1",
        "express": "~4.10.6",
        "jade": "~1.8.2",
        "morgan": "~1.5.1",
        "serve-favicon": "~2.2.0"
  },
  "devDependencies": {
        "bower": "^1.3.12",
        "browserify": "^8.1.3",
        "gulp": "^3.8.10",
        "gulp-nodemon": "^2.0.3",
        "gulp-sass": "^1.3.3",
        "gulp-sourcemaps": "^1.5.2",
        "react": "^0.12.2",
        "reactify": "^1.0.0",
        "vinyl-source-stream": "^1.0.0"
  }
}
```

Here, we have the list of `dependencies` and `dev-dependencies` for our application. To see what needs to be upgraded, we can use a super-handly Node.js module called [npm-check-updates](https://www.npmjs.com/package/npm-check-updates). Using this application is easy; first, install it globally (I recommend installing it globally, since you should be using this for all your projects which rely on NPM!) by running `npm install -g npm-check-updates`, and second, run `ncu` within the `jobs.nodedc.com` directory.

What this application will do is go to NPM and check to see if there's an update to your required packages (regardless of whether or not you have pinned your versions in `package.json`) and return with a nice list of what needs to be upgraded. When we run this application for `jobs.nodedc.com` we get the following list:

```bash
 $ ncu

 body-parser    ~1.10.1  →  ~1.13.3
 debug           ~2.1.1  →   ~2.2.0
 express        ~4.10.6  →  ~4.13.3
 jade            ~1.8.2  →  ~1.11.0
 morgan          ~1.5.1  →   ~1.6.1
 serve-favicon   ~2.2.0  →   ~2.3.0
 browserify      ^8.1.3  →  ^11.0.1
 gulp-sass       ^1.3.3  →   ^2.0.4
 react          ^0.12.2  →  ^0.13.3

Run with -u to upgrade your package.json
```

The `npm-check-updates` application gives you a nice flag, `-u`, to automatically update your `package.json` which is a nice feature and the main reason I prefer this app over just using `npm outdated`, but, FYI, it can be dangerous if you have major version jumps like we do here. Looking at the list above, we see two important upgrades which we will be handling in this blog post. First, `browserify` has gone from `8.1.3` to `11.0.1` and second, `react` has gone from `0.12.2` to `0.13.3`.

For the record, this is what `npm outdated` looks like:

```bash
$ npm outdated
Package        Current  Wanted  Latest  Location
debug            2.1.3   2.1.3   2.2.0  debug
react           0.12.2  0.12.2  0.13.3  react
jade             1.8.2   1.8.2  1.11.0  jade
body-parser     1.10.2  1.10.2  1.13.3  body-parser
morgan           1.5.3   1.5.3   1.6.1  morgan
serve-favicon    2.2.1   2.2.1   2.3.0  serve-favicon
gulp-sass        1.3.3   1.3.3   2.0.4  gulp-sass
express         4.10.8  4.10.8  4.13.3  express
browserify       8.1.3   8.1.3  11.0.1  browserify
```

You can use this if you'd like and save the global download!

## Upgrading a Package

There are a few steps you want to take when upgrading a package that you rely on for your application. The first thing I do in read the release notes for each of the releases between where I am currently and where `npm-check-updates` wants me to be. Let's take a look at [React.js's release notes](https://github.com/facebook/react/blob/master/CHANGELOG.md). I am chosing to review React's changelog here since it is a shorter upgrade path than `browserify`'s...

When we take a look at the `changelog` we see it broken down into a few categories; "Breaking Changes", "New Features", and "Deprecations". I have to say that the React.js `changelog` is one of the nicer ones out there and with other projects you might not be so lucky. Anyways, we want to read through all the changes taking special care with the "Breaking Changes" and "Deprecations" sections as this is what is likely going to break our app when we upgrade. Do make sure to read the "New Features" section too so we know what cool things we can add to our app as well!

_I'll wait..._

Now that we have read React's `changelog` we can comfortably move forward with upgrading. At this point in time, if there was any breaking changes that would affect our app, we'd want to take note to make sure we revisit that section of code after the upgrade. 

__Note__: This is where having good tests would really come in handy. You should have a level of test coverage that makes you comfortable with doing upgrades like this. Any breaking change to your app should be caught by a test and not by your walk-through of the site in a browser. Unfortunately, we do not have any tests yet for this application.

Upgrading a NPM package is really simple. First you want to update your `package.json` file to represent the version of the package you want to upgrade:

```javascript
		 ...
        "react": "^0.13.3",
        ...
```

Then you need to run `npm upgrade` which will upgrade all the packages to the latest version found in `package.json`. The output looks like this:

```bash
$ npm upgrade
react@0.13.3 node_modules/react
└── envify@3.4.0 (through@2.3.8, jstransform@10.1.0)
```

That's it. We have successfully upgraded a NPM module. Now let's see if our application is still working!

## Conclusion

Lucky for us our app worked just fine after the upgrade. I was not too surprised since we are still at a very basic level with our application. If the upgrade was not as successful, we'd have to go through and make some changes to make sure our app is back in working order. This is where reading the `changelog` really comes in handy.

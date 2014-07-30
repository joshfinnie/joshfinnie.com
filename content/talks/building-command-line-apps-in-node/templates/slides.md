!slide

# Building a Node.js Command Line App

Josh Finnie

!slide

# Who Am I?

* Josh Finnie
* Software Maven @ [TrackMaven](http://trackmaven.com)
* Purveyor of @NodeDC Hack Nights / Office Hours

!slide

# Why a Node.js CLA?

* I tried to write Bash
* I was terrible at it
* Then this happened:

!slide

![Bad Bash](assets/images/bash-example.png)

###### [source: Optimizing with Bash!](http://hugogiraudel.com/2013/07/29/optimizing-with-bash/)

!slide

![Rage](assets/images/rage-guy.jpg)

!slide

# And

![We know Node...](assets/images/node-clingy-gf.jpg)

!slide

# So how?

* Write in node.js
* ...
* Profit?

!slide

# Setup

* Tell the app you're using node.js

```
#!/usr/bin/env node

console.log("Hello World!")
```

* Make it executable

```
$ chmod u+x myCLA
```

* Run it

```
$ ./myCLA
Hello World!
```

!slide

# Example 1

ex1
```
#!/usr/bin/env node

var userArgs = process.argv.slice(2);
var name = userArgs[0];

console.log("Hello " + name + "!");
```

output
```
$ ./ex1 Josh
Hello Josh!
```

!slide

# Running a CLA

* Run using the `node` interpreter:

```
$ node bin/myCLA
```

* Making it executible:

```
$ ./bin/myCLA
```

* Install globally:

```
$ myCLA
```


!slide

# Making this better

* Let's find a library to handle arg parsing for us...
    * [Commander.js](https://github.com/visionmedia/commander.js)
    * [Optimist](https://github.com/substack/node-optimist) (Being replaced with [Minimist](https://github.com/substack/minimist))
    * [Nopt](https://github.com/npm/nopt)
* Since this is not pretty:

```
var userArgs = process.argv.slice(2);
var name = userArgs[0];
```

!slide

# Example 2

## Using Optimist 

(Pushfile as an example...)

```
#!/usr/bin/env node

var argv = optimist
  .usage('Pushes file to S3 using a shortened name.\n\nVersion: ' + version + '\n\nUsage: $0 [options] <file>')
  .boolean('u')
  .alias('u', 'unique')
  .describe('u', 'Gives a unique, timestamped hash for uploaded filename.')
  .boolean('c')
  .alias('c', 'configure')
  .describe('c', 'Create a configuration file.')
  .string('h')
  .alias('h', 'help')
  .describe('h', 'Print usage info')
  .argv;
```

!slide

# Ouput of Optimist

```
╭ ▶ joshfinnie@trackmaven  ~
╰ ▶ $ pushfile -h
Pushes file to S3 using a shortened name.

Version: 0.1.3

Usage: /usr/local/bin/pushfile [options] <file>

Options:
  -u, --unique     Gives a unique, timestamped hash for uploaded filename.
  -c, --configure  Create a configuration file.
  -h, --help       Print usage info
```

!slide

# Testing your CLA

* It's `Node.js`!

![Node Testing Options](assets/images/node-testing-options.png)

([source](https://github.com/joyent/node/wiki/modules#testing))

!slide

# Releasing your CLA

* Update your `package.json`
    * Set `preferGlobal` to `true`
    * Set location of executible using `bin`

```
    "preferGlobal": true,
    "bin": {"app": "bin/app"}
```

!slide

# Setting up NPM

* Create a user on [NPM](https://www.npmjs.org/signup)
* Run `npm adduser` in your terminal

```
$ npm adduser
Username: joshfinnie
Password:
Email: (this IS public) josh@jfin.us
npm http PUT https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie
npm http 409 https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie
npm http GET https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie?write=true
npm http 200 https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie?write=true
npm http PUT https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie/-rev/3-5cbc34433444234f5e75d385d5ffe960
npm http 201 https://registry.npmjs.org/-/user/org.couchdb.user:joshfinnie/-rev/3-5cbc34433444234f5e75d385d5ffe960
```

!slide

# Publish to NPM

* cd into your CLA directory
* Run the following command:
```
npm publish .
```
* Yes, it is that easy...

!slide

# Conclusion

That's a super high-level talk about writing a command-line application in Node.js

* Remember:
    * It's just Node.js
    * Arg parsing is a pain
    * Test your app
    * Publish often!

!slide

# Connect with me!

* [@joshfinnie](https://twitter.com/joshfinnie) on Twitter
* [joshfinnie](https://github.com/joshfinnie) on Github
* [My Website](http://www.joshfinnie.com)
    * [Tonight's slides](http://www.joshfinnie.com/talks/05-22-2014-nodedc-command-line-apps-in-node/)

!slide

# We're Hiring

* Come work for [TrackMaven](http://trackmaven.com)
* Angular.js & Django
* Corgis ([@MavenTheCorgi](https://twitter.com/MavenTheCorgi))

![Twerking Maven](assets/images/twerkmaven.gif)

!slide

# Questions
# ?

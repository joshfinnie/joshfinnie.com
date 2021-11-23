---

title: "Using WebAssembly (created in Rust) for Fast React Components"
date: "2021-11-22"
tags:
  - "rust"
  - "react"
  - "wasm"
  - "tutorial"
  - "javascript"
layout: '../../layouts/BlogPost.astro'
heroImage: "/assets/blog/cabin.jpg"
unsplash: "Lili Kovac"
unsplashURL: "@lilschk"
description: "this is a dummy description!"

---

With the [recent update](https://blog.rust-lang.org/2021/10/21/Rust-1.56.0.html) to [Rust](https://www.rust-lang.org/), it is time to relook at using Rust and [React](https://reactjs.org/) together. I have a new found love for Rust and everything it can do as a language. One of its more impressive features is its ability to write [WebAssembly(Wasm)](https://webassembly.org/) without much overhead. I have explored how to use Rust to write Wasm [before](https://www.npmjs.com/package/wasm-frontmatter) (Blog post coming soon!). But I wanted to see how easy it would be to integrate it into a standard React workflow.

## Introduction to Wasm

> WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

WebAssembly is a low-level assembly-like programming language that can run in most modern browsers. It has a compact binary format that gives us near-native performance on the web. As it becomes more popular, many languages have written bindings to compile into web assembly. It's a tool that I have fallen for and am excited to share how we can use it in our React workflow.

![webAssembly browser support](/assets/blog/web-assembly-support.png)

Developing a program from scratch in Wasm is not ideal, almost impossible. If you ever had the pleasure of coding in Assembly during university, you'd understand why. Luckily, there are some languages that can compile down to Wasm without much effort. This is possible in a large range of languages (C, Go, C#, Kotlin), but for this example we'll be using Rust.

<!-- As we can see below, creating a simple "Hello World" WebAssembly application in Rust is straight forward: -->

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}
```

## The Tutorial

_**NOTE**: This tutorial assumes you have both [Node](https://nodejs.org/en/download/) and [Rust](https://www.rust-lang.org/tools/install) already installed on your machine. Follow those links to help you out if you don't already._

The first step is to set up a React application. There are tools out there that help us with this; like [Vite](https://vitejs.dev/) or [create-react-app](https://create-react-app.dev/). But in this tutorial, we will be customizing our React buildout. It's easier do everything from scratch using [Webpack](https://webpack.js.org/). Let's initialize our `package.json` by running the following command:

```bash
$ npm init -y
```

The above command will give us a default `package.json` ready to install the packages we'll need. I am going to use the most current packages that are available to me at the time of writing this post, but do watch out. These packages update often, and there might be some changes within the APIs I use below. To follow this tutorial, try to install the same versions of the packages I use. 

We want to install React, Babel, Webpack, and some nice-to-have packages. This will allow us to start coding!

```bash
$ npm i react react-dom
$ npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin 
$ npm i -D babel-core babel-loader @babel/preset-env @babel/preset-react
```

Let's build out our folder structure for our React app. I did write about this in much more depth [here](/blog/my-2020-react-startup-process). Let's create the folders `src`, `public`, `build`, and `dist`. After we create those folders, let's introduce our first piece of React code. Open a file called `index.jsx` in the `src` folder and add the following code:

```jsx
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<h1>Hello, world!</h1>, document.getElementById("root"));
```

Now, to get this running as a web application, we need to set up our babel and webpack configs. To do this, create two files: `.babelrc` and `webpack.config.js` and add code to each, respectfully:

```js
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[hash].js"
  },
  devServer: {
    compress: true,
    port: 8080,
    hot: true,
    static: './dist',
    historyApiFallback: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/public/index.html",
      filename: "index.html"
    }),
  ],
  mode: "development",
  devtool: 'inline-source-map',
};
```

We also need to add our default HTML, create `public/index.html` and add the following code:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rusty React</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
```

We now need to update our `package.json` to take advantage of these updates to our code. To do that, update the file to read as the following:

```js
{
  "name": "rusty-react",
  "version": "1.0.0",
  "description": "A skeleton app showing how to use Rust to leverage Wasm in your React app.",
  "main": "src/index.jsx",
  "scripts": {
    "dev": "webpack server"
  },
  "keywords": [],
  "author": "Josh Finnie <josh@jfin.us",
  "license": "MIT",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.16.4",
    "@babel/preset-react": "^7.16.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^8.2.3",
    "html-webpack-plugin": "^5.5.0",
    "webpack": "^5.64.2",
    "webpack-cli": "^4.9.1",
    "webpack-dev-server": "^4.5.0"
  }
}
```

Above is my whole `package.json`, let's use this as a time capsule of package versions. With everything above coded locally, we should be able to run `npm run dev` and see our wonderful basic React app running!

![basic hello world React app](/assets/blog/hello-world-react.png)

### Getting Rusty

Now that we have a wonderful React app up-and-running let's jump into the Rust component of this exercise. First step is we'll need to create the Rust application. We can do that by running `cargo init --lib .` (_Don't forget the period at the end of that command, it's important!_) This will create a `Cargo.toml` and a `src/lib.rc` file. To get the Rust application ready to convert they code to Wasm, we'll need an important package called `wasm-bindgen`. We'll also need to tell our compiler that this package is a `cdylib`. To do this, we'll need to modify our `Cargo.toml` file:

```toml
[package]
name = "rusty-react"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

We should be able to build our Rust application without any errors, let's give it a test:

```bash
$ cargo build
    Updating crates.io index
   Compiling proc-macro2 v1.0.32
   Compiling unicode-xid v0.2.2
   Compiling wasm-bindgen-shared v0.2.78
   Compiling log v0.4.14
   Compiling syn v1.0.81
   Compiling cfg-if v1.0.0
   Compiling bumpalo v3.8.0
   Compiling lazy_static v1.4.0
   Compiling wasm-bindgen v0.2.78
   Compiling quote v1.0.10
   Compiling wasm-bindgen-backend v0.2.78
   Compiling wasm-bindgen-macro-support v0.2.78
   Compiling wasm-bindgen-macro v0.2.78
   Compiling rusty-react v0.1.0 (./rusty-react)
    Finished dev [unoptimized + debuginfo] target(s) in 11.10s

```

This build in-itself did not do much for us, we'll need to add a useful taraget for our builds. To add a new target for Rust, we can run the following command:

```bash
$ rustup target add wasm32-unknown-unknown
```

This will give us the appropriate target for our compiled Rust code, allowing us to add it to our React application. Let's update our `src/lib.rs` file to be more helpful as well. Update the existing code to the following:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn big_computation() {
    alert("Big computation in Rust");
}

#[wasm_bindgen]
pub fn welcome(name: &str) {
   alert(&format!("Hello {}, from Rust!", name));
}
```

This will give us two functions we can use in our React application a "big computation" function and a "welcome" function that requires a name variable.

Again, let's make sure our Rust application works, but this time let's use the appropriate target:

```bash
$ cargo build --target wasm32-unknown-unknown
```

Let's install the `wasm-bindgen-cli` command-line application so we can leverage the WebAssembly code we created:

```bash
$ cargo install -f wasm-bindgen-cli
```

Once installed, we can take our WebAssembly code generated by Rust and create a wrapping around it for our React code:

```bash
$ wasm-bindgen target/wasm32-unknown-unknown/debug/rusty_react.wasm --out-dir build
```

This will dump the Javascript wrapping and optimized Wasm code into our `build` directory ready to be used by React. And that's what we'll do next!

### React and Wasm

The next step in our tutorial is to use the above Wasm code in our React app. To do this, we'll need to add some of the above scripts to our `package.json`. I find it easier to run an NPM command versus remembering how to build the Rust application from memory. Add the following three lines to the `scripts` section of the `package.json` file:

```json
  "build:wasm": "cargo build --target wasm32-unknown-unknown",
  "build:bindgen": "wasm-bindgen target/wasm32-unknown-unknown/debug/rusty_react.wasm --out-dir build",
  "build": "npm run build:wasm && npm run build:bindgen && npx webpack",
```

This will allow us to run `npm run build` and get everything packaged up neatly! Very cool!

There is another NPM package we should install as well to help us develop using Wasm. Let's add this to our dev dependencies:

```bash
$ npm i -D @wasm-tool/wasm-pack-plugin
```

Once installed, we'll update our `webpack.config.js` file to leverage the new package. Add the following bit of code to our webpack config:

```js
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

  ...

  plugins: [
    ...
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, ".")
    }),
  ],
  ...
  experiments: {
    asyncWebAssembly: true
  }
```

Let's test what we have... we should be able to run `npm run build:wasm`, `npm run build:bindgen` and `npm run build` without error.

My output from `npm run build` looks like this:

```bash
$ npm run build

> rusty-react@1.0.0 build
> npm run build:wasm && npm run build:bindgen && npx webpack
> rusty-react@1.0.0 build:wasm
> cargo build --target wasm32-unknown-unknown
    Finished dev [unoptimized + debuginfo] target(s) in 0.03s
> rusty-react@1.0.0 build:bindgen
> wasm-bindgen target/wasm32-unknown-unknown/debug/rusty_react.wasm --out-dir build

🧐  Checking for wasm-pack...
✅  wasm-pack is installed at ./wasm-pack.
ℹ️  Compiling your crate in development mode...

[INFO]: 🎯  Checking for the Wasm target...
[INFO]: 🌀  Compiling to Wasm...
    Finished dev [unoptimized + debuginfo] target(s) in 0.02s
[WARN]: ⚠️   origin crate has no README
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: ✨   Done in 1.70s
[INFO]: 📦   Your wasm pkg is ready to publish at ./rusty-react/pkg.
✅  Your crate has been correctly compiled

(node:74213) [DEP_WEBPACK_TEMPLATE_PATH_PLUGIN_REPLACE_PATH_VARIABLES_HASH] DeprecationWarning: [hash] is now [fullhash] (also consider using [chunkhash] or [contenthash], see documentation for details)
(Use `node --trace-deprecation ...` to show where the warning was created)
asset bundle.aceab52ec75422b0a9df.js 2.45 MiB [emitted] [immutable] (name: main)
asset index.html 300 bytes [emitted]
runtime modules 274 bytes 1 module
modules by path ./node_modules/ 974 KiB
  modules by path ./node_modules/scheduler/ 26.3 KiB
    modules by path ./node_modules/scheduler/*.js 412 bytes 2 modules
    modules by path ./node_modules/scheduler/cjs/*.js 25.9 KiB
      ./node_modules/scheduler/cjs/scheduler.development.js 17.2 KiB [built] [code generated]
      ./node_modules/scheduler/cjs/scheduler-tracing.development.js 8.79 KiB [built] [code generated]
  modules by path ./node_modules/react/ 70.6 KiB
    ./node_modules/react/index.js 190 bytes [built] [code generated]
    ./node_modules/react/cjs/react.development.js 70.5 KiB [built] [code generated]
  modules by path ./node_modules/react-dom/ 875 KiB
    ./node_modules/react-dom/index.js 1.33 KiB [built] [code generated]
    ./node_modules/react-dom/cjs/react-dom.development.js 874 KiB [built] [code generated]
  ./node_modules/object-assign/index.js 2.06 KiB [built] [code generated]
./src/index.jsx 174 bytes [built] [code generated]
webpack 5.64.2 compiled successfully in 3359 ms
```

We are building out Wasm, and having Webpack load it. Next step is to add the WebAssembly code to our React component. Let's update `src/index.jsx` to import our Wasm code and execute it!

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const wasm = import("../build/rusty_react");

wasm.then(m => {
  const App = () => {
    const [name, setName] = useState("");
    const handleChange = (e) => {
      setName(e.target.value);
    }
    const handleClick = () => {
      m.welcome(name);
    }

    return (
      <>
        <div>
          <h1>Hi there</h1>
          <button onClick={m.big_computation}>Run Computation</button>
        </div>
        <div>
          <input type="text" onChange={handleChange} />
          <button onClick={handleClick}>Say hello!</button>
        </div>
      </>
    );
  };

  ReactDOM.render(<App />, document.getElementById("root"));
});
```

When we run `npm run dev` we should see a webpage with a button and a form. Try them out! We're interacting with the Wasm code that's written in Rust.

![Rusty React running "big computation"](/assets/blog/rusty-react-hello-name.png)

![Rusty React running "hello name"](/assets/blog/rusty-react-big-comp.png)

## Conclusion

That's it! We should have WebAssembly (written in Rust) running in our React application. There is much more we can do besides this short tutorial, but I hope this gets we started. As always, feel free to reach out to me [on twitter](https://twitter.com/joshfinnie) if we have any comments and concerns. Good luck with building something with Wasm.

For the complete code we went through this tutorial, check out [my github repo](https://github.com/joshfinnie/rusty-react). Give it a ⭐️!

---
title: "My 2020 React.js Start-up Process"
date: "2020-07-08"
tags:
  - "javascript"
  - "react.js"
  - "tutorial"
slug: "my-2020-react-startup-process"
heroImage: "/assets/blog/typewriter.jpg"
expires: true
unsplash: "RetroSuppy"
unsplashURL: "retrosupply"
---

Over the past couple of years I have narrowed my frontend workflow to React with Typescript. There are a lot of frameworks that are fighting for the top spot of one's frontend workflow. In the end, I am most comfortable with React for rapid development so it is the one I will focus on here. In this blog post I will walk through my 2020 React workflow. This post will help you get up and running with the same setup that I am currently using.

## Installing React with Typescript

First, we want to create a project using the `create-react-app` command-line application. A semi-recent addition to the Node ecosystem is an alternative to NPM called NPX. NPX is a command-line application that comes with NPM. It will allow you to run NPM packages without going through the process of installing it. This allows you to run `create-react-app` without the hassle of building a `package.json` file. It is also a good way of keeping these one-off tools up-to-date. The following NPX command is all we need to do to set up our boilerplate React app with Typescript. Let’s run the following commands:

```bash
$ npx create-react-app my-project --template typescript
$ cd my-project
$ npm start
```

This is a screenshot of what see with when we visit http://localhost:3000 after running the above commands.

<img width="100%" loading='lazy' src='/assets/blog/hello-world.png' alt="React's Hello World!" />

## Installing ESLint/Prettier

The next bit of tech that I always use is Prettier and ESLint. I am notorious at writing bad code so having these two packages keep a watch on me is crucial. Below are the steps I use to install Prettier and ESLint:

```bash
$ npm install --save-dev eslint prettier
$ ./node_modules/eslint/bin/eslint.js --init
```

```
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Does your project use TypeScript? Yes
? Where does your code run? Browser
? How would you like to define a style for your project? Use a popular style guide
? Which style guide do you want to follow? Airbnb: https://github.com/airbnb/javascript
? What format do you want your config file to be in? JavaScript
? Would you like to install them now with npm? Yes
```

After running the ESLint init, I get the following configuration:

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {},
};
```

There are some things that I add to my `.eslintrc.json` file to make it work with my Vim setup. Not sure if it's needed everywhere, but I felt like I should share:

```diff
...
+ settings: {
+   "import/resolver": {
+     "node": {
+       "extensions": [".js", ".jsx", ".ts", ".tsx"]
+     }
+   }
+ },
  extends: [
+   'plugin:import/typescript',
    'plugin:react/recommended',
...
  rules: {
+   "react/jsx-filename-extension": [1, {"extensions": [".tsx", ".jsx"]}],
+   "import/extensions": ["error", "ignorePackages", {
+     "ts": "never",
+     "tsx": "never",
+     "js": "never",
+     "jsx": "never",
+     "mjs": "never"
    }]
...
```

## Component Layout

The last major change I make is that I update the file structure of the `src` directory. I find that making a few changes helps me collect my thoughts and lets me write cleaner React code. Below is the structure of the `src` file generated with the `create-react-app` script:

```bash
src
├── App.css
├── App.test.tsx
├── App.tsx
├── index.css
├── index.tsx
├── logo.svg
├── react-app-env.d.ts
├── serviceWorker.ts
└── setupTests.ts
```

I find it very beneficial to have a separate `components` folder. The separate folder lets me isolate my components with the rest of my javascript. After moving around the components and getting more of the application developed this is what my folder structure looks like:

```bash
$ tree src
src
├── utilities
│   └── fetch.ts
├── components
│   ├── app
│   │   ├── app.css
│   │   ├── app.tsx
│   │   ├── app.test.tsx
│   │   ├── index.tsx
│   │   └── logo.svg
│   └── loginForm
│       ├── Form.css
│       ├── Form.tsx
│       ├── index.ts
│       ├── submitForm.ts
│       ├── submitForm.test.ts
│       ├── useForm.ts
│       ├── useForm.test.ts
│       ├── validateForm.ts
│       └── validateForm.test.ts
├── index.css
├── index.tsx
├── react-app-env.d.ts
├── serviceWorker.ts
└── setupTests.ts
```

## Conclusion

This was a quick overview on what I do to setup a React application from scratch in 2020. Does this match your workflow? What could I be doing to make this better? If you have any comments or suggestions, feel free to find me on [Twitter](https://twitter.com/joshfinnie)!

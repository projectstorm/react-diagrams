# STORM React Diagrams

__PSA 2018__: React Diagrams ~is currently~ was getting a bit of a rewrite to enable much more advanced features. To see the new foundation WIP visit [https://github.com/projectstorm/react-canvas](https://github.com/projectstorm/react-canvas).

__PSA 2019__: I still want to jump onto the rewrite, but it is a much larger project than anticipated, so going to try maintain this one in the mean time.

---

**DEMO**: [http://projectstorm.cloud/react-diagrams](http://projectstorm.cloud/react-diagrams)

**(SOME) DOCS:** [https://projectstorm.gitbooks.io/react-diagrams](https://projectstorm.gitbooks.io/react-diagrams)

**RELEASE NOTES** : [http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/](http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/)

A super simple, no-nonsense diagramming library written in React that just works.

[![Join the chat at https://gitter.im/projectstorm/react-diagrams](https://badges.gitter.im/projectstorm/react-diagrams.svg)](https://gitter.im/projectstorm/react-diagrams?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![NPM](https://img.shields.io/npm/v/@projectstorm/react-diagrams.svg)](https://npmjs.org/package/@projectstorm/react-diagrams)  [![NPM](https://img.shields.io/npm/dt/storm-react-diagrams.svg)](https://npmjs.org/package/storm-react-diagrams) [![Package Quality](http://npm.packagequality.com/shield/storm-react-diagrams.svg)](http://packagequality.com/#?package=storm-react-diagrams)  [![CircleCI](https://circleci.com/gh/projectstorm/react-diagrams/tree/master.svg?style=svg)](https://circleci.com/gh/projectstorm/react-diagrams/tree/master) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)


Example implementation using custom models: (Dylan's personal code)

![Personal Project](./docs/images/example1.jpg)
![](./docs/images/example2.jpg)
Get started with the default models right out of the box:
![](./docs/images/example3.jpg)

## Introduction

A no-nonsense diagramming library written entirely in React with the help of a few small libraries. It aims to be:

* Simple, and void of any fuss/complications when implementing it into your own application
* Customizable without having to hack the core \(adapters/factories etc..\)
* Simple to operate and understand without sugar and magic
* Fast and optimized to handle large diagrams with hundreds of nodes/links
* Use HTML to create nodes, instead of SVG's
* Super easy to use, and should work as you expect it to
* Perfect for creating declarative systems such as programmatic pipelines and visual programming languages (Labview, Symlink etc..)

## Installing

For all the bells and whistles:

    yarn add @projectstorm/react-diagrams

This includes all the packages listed below (and works like it used to before version 6.0)

### A more modular approach

This library now has a more modular design and you can import just the core (contains no default factories or routing)

    yarn add @projectstorm/react-diagrams-core

and add some extras:

    yarn add @projectstorm/react-diagrams-defaults
    yarn add @projectstorm/react-diagrams-routing
    
## How to use

Take a look at the demos `[./lib-demo-gallery/demos](./lib-demo-gallery/demos)`

## Run the demos

After running `yarn install` you must then run:  `yarn run storybook`

## Building from source

Simply run `yarn build` in the root directory \(or `NODE_ENV=production yarn build` if you want a production build\) and it will spit out the transpiled code and typescript definitions into the dist directory as a single file.
We use webpack for this because TSC cannot compile a single UMD file \(TSC can currently only output multiple UMD files\).

## [Checkout the docs](https://projectstorm.gitbooks.io/react-diagrams)




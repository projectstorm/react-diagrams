# STORM React Diagrams

**PSA**: React Diagrams is currently getting a bit of a rewrite to enable much more advanced features. To see the new foundation WIP visit [https://github.com/projectstorm/react-canvas](https://github.com/projectstorm/react-canvas).

---

**DEMO**: [http://www.projectstorm.io/react-diagrams](http://www.projectstorm.io/react-diagrams)

**DOCS:** [https://projectstorm.gitbooks.io/react-diagrams](https://projectstorm.gitbooks.io/react-diagrams)

**RELEASE NOTES** : [http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/](http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/)

A super simple, no-nonsense diagramming library written in React that just works.

[![Join the chat at https://gitter.im/projectstorm/react-diagrams](https://badges.gitter.im/projectstorm/react-diagrams.svg)](https://gitter.im/projectstorm/react-diagrams?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![NPM](https://img.shields.io/npm/v/storm-react-diagrams.svg)](https://npmjs.org/package/storm-react-diagrams)  [![NPM](https://img.shields.io/npm/dt/storm-react-diagrams.svg)](https://npmjs.org/package/storm-react-diagrams) [![Package Quality](http://npm.packagequality.com/shield/storm-react-diagrams.svg)](http://packagequality.com/#?package=storm-react-diagrams)  [![CircleCI](https://circleci.com/gh/projectstorm/react-diagrams/tree/master.svg?style=svg)](https://circleci.com/gh/projectstorm/react-diagrams/tree/master)

Example implementation using custom models:
![Personal Project](./images/example1.jpg)
![](./images/example2.jpg)
Get started with the default models right out of the box:
![](./images/example3.jpg)


## Introduction

A no-nonsense diagramming library written entirely in React with the help of a few small libraries. It aims to be:

* Simple, and void of any fuss/complications when implementing it into your own application
* Customizable without having to hack the core \(adapters/factories etc..\)
* Simple to operate and understand without sugar and magic
* Fast and optimized to handle large diagrams with hundreds of nodes/links
* Super easy to use, and should work as you expect it to
* Perfect for creating declarative systems such as programmatic pipelines and visual programming languages 

#### Run the demos

After running `yarn install` you must then run:  `yarn run storybook`

#### Building from source

Simply run `webpack` in the root directory \(or `export NODE_ENV=production && webpack` if you want a production build\) and it will spit out the transpiled code and typescript definitions into the dist directory as a single file.   
We use webpack for this because TSC cannot compile a single UMD file \(TSC can currently only output multiple UMD files\).

## [Checkout the docs](https://projectstorm.gitbooks.io/react-diagrams)




# Getting Started

## Get the package

The first thing you need to do, is grab the distribution files on NPM. You can do this either using **yarn** or **npm.**

**Via yarn:**

```text
yarn add @projectstorm/react-diagrams
```

**Via npm:**

```text
npm install @projectstorm/react-diagrams
```

When you run this in your project directory, this will install the library into `./node_modules/@projectstorm/react-diagrams`. You will then find a **dist** folder that contains all the minified and production ready code.

## Install the peer dependencies

The library includes it's dependencies as peer-dependencies, so yarn will output warnings letting you know which ones are missing. Simple install them, specifically these ones:

**Via yarn:**

```text
yarn add closest lodash react dagre pathfinding paths-js @emotion/react @emotion/styled resize-observer-polyfill
```

**Via npm:**

```text
npm install closest lodash react dagre pathfinding paths-js @emotion/react @emotion/styled resize-observer-polyfill
```

We do this, so that you can better control the versions of these libraries yourself since you might make use of `Lodash` in other parts of your software.




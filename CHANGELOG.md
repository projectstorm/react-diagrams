__V7!__

we are now using changesets! you can see the changes for individual packages in their corresponding folders.
Here is the main changeset for the core package which depends on everything:

[Changelog for @projectstorm/react-diagrams](./packages/react-diagrams/CHANGELOG.md)

---

__6.7.4__

.0 -> .4 because I messed up the version / publishing

* (upgrade all dependencies, including a move to React 18)
  * https://github.com/projectstorm/react-diagrams/pull/947

__6.7.0__

bug fixes:
* https://github.com/projectstorm/react-diagrams/pull/882
* https://github.com/projectstorm/react-diagrams/pull/914
* https://github.com/projectstorm/react-diagrams/pull/875

types
* https://github.com/projectstorm/react-diagrams/pull/906

features:
* https://github.com/projectstorm/react-diagrams/pull/915
* https://github.com/projectstorm/react-diagrams/pull/877

__6.6.1__

bug fixes:
* https://github.com/projectstorm/react-diagrams/pull/861
* https://github.com/projectstorm/react-diagrams/pull/871
* https://github.com/projectstorm/react-diagrams/pull/870

Some maintenance:
* https://github.com/projectstorm/react-diagrams/pull/861

__6.6.0__

* (docs-broken) https://github.com/projectstorm/react-diagrams/pull/834
* (bug) https://github.com/projectstorm/react-diagrams/pull/838
* (docs-broken) https://github.com/projectstorm/react-diagrams/pull/847
* (bug) https://github.com/projectstorm/react-diagrams/pull/852
* (docs-broken) https://github.com/projectstorm/react-diagrams/pull/856
* (improvement) https://github.com/projectstorm/react-diagrams/pull/857
* (bug) https://github.com/projectstorm/react-diagrams/pull/860

Also includes a bump on all packages using `ncu` recursively.

__6.5.2__

https://github.com/projectstorm/react-diagrams/pull/830

* (fix) issue with zoom to fit selected
* (improvement) properly export PathFinding
* (maintenance) bump all dependencies

__6.5.1__

https://github.com/projectstorm/react-diagrams/pull/829

* (improved) zoom to fit now centers correctly
* (fix) remove wrong peer dependency (@emotion/core)

__6.5.0__

https://github.com/projectstorm/react-diagrams/pull/814

* Some rendering fixes
* small api change around `zoomToFit`
* more api options with the `DefaultLink`

__6.4.0__

https://github.com/projectstorm/react-diagrams/pull/813

* Bump all packages and move to Emotion 11 and React 17
* Move to the latest Storybook

__6.2.0__

* (improvement) Move away fromn math-js (https://github.com/projectstorm/react-diagrams/pull/651)
* (fix) https://github.com/projectstorm/react-diagrams/pull/639
* (fix) Fixing link spawning at (0,0) when clicking port once (inspired by https://github.com/projectstorm/react-diagrams/pull/637)

__6.1.1__

* (feature) https://github.com/projectstorm/react-diagrams/pull/576 [Add zoom to fit nodes feature, fixes #568]
* (improvement) https://github.com/projectstorm/react-diagrams/pull/621 [Support deriving from DefaultLabelModel]
* (fix) https://github.com/projectstorm/react-diagrams/pull/603
   [Fixes selectionChanged listener not being deregistered on NodeWidget, Fixes unchecked access to this.props.link.getSourcePort() on LinkWidget]
* (maintenance) bump everything
* fix serialize/deserialize issue with example project raw JS node

__6.0.0__

Note: This is a complete rewrite of the library, a good place to start to see how the new system works
is with the new demo project which illustrates the new capability.

I would also recommend taking a look at the new updated DiamondPort widget which shows more capability.

* Break up library into monorepo
* Introduce react-canvas-core as a new framework
* Use geometry classes instead of raw X and Y primitives so we can do matrix stuff in the future
* move testing framework to a name based system instead of ID's
* Introduce multiple layers (can now have multiple node and link layers)
* Rewrote the deserialization system to be promise based
* Completely overhauled the observer framework on the models
* Moved all the logic in the DiagramWidget into a a new hierarchical state machine
* Introduces new states for editing
* Introduced faster layout rendering when transforming the canvas directly
* Moved all canvas smart routing into its own link-type under routing package
* Broke up link rendering into a much more modular system that is much easier to extend
* Introduced port alignment allowing the developer to specify how enter it
* Improved generics throughout the entire model system with Mapped Types
* Rewrote all the styles using emotion instead of sass
* Fixed up all the demos to use the new API
* Introduced a demo project that illustrates how to use the library with ES6 as well as with Typescript
* Improved the grid rendering system to allow graphical elements to specify how they get transformed
* Introduced a performance widget for improving performance in a more deterministic way by comparing the serialization of the model (with a way of opting out)
* Renamed a bunch of methods to be more consistent and more understandable
* Completely removed the double render state system that required nodes to render before links, this is done when ports report their new positions
* Ports can now dynamically be added and removed without having to tell the system it happeend
* Port widgets are now containers dumb containers for you own ports
* Port widgets report new sizing information to their target links when they change position, you no longer need to invalidate them

__5.3.2__

* (maintenance) Upgrade :allthethings: (all the build tooling was upgrade)
* (api) move to ES6 (JS now contains native classes)
* (api) changed package name to @projectstorm/react-diagrams
* (bug) (PR259)(https://github.com/projectstorm/react-diagrams/pull/259) Fixes #258
* (refactor) (PR 306)(https://github.com/projectstorm/react-diagrams/pull/306) `:any` fix
* (feature) (PR 178)(https://github.com/projectstorm/react-diagrams/pull/178) Trigger a positionChanged event when moving a Node that has the listener assigned.
* (fix) (PR 356)(https://github.com/projectstorm/react-diagrams/pull/356) Fixed Type issue with 'PointModel()'
* (demo) dark mode and upgrade storybook

__5.2.1__

* (fix) Always remove link from old source/target port on port change
* (maintenance) upgrade node modules
* (refactor) https://github.com/projectstorm/react-diagrams/commit/55f62587bd3b12513c7d37eff59edfc8bdb8d6c9
* (bug) https://github.com/projectstorm/react-diagrams/commit/75ef02dd4d131a0e7c08b2680c69efc390e50b84
-> and other improvements, also checkout the foundation work happening over at https://github.com/projectstorm/react-canvas

__5.1.0__

* (api) Rename XXXFactory into AbstractXXXFactory
* (refactor) tslint and prettier are now the same
* (refactor) Each class now explicitely has its own class file (consistency)
* (feature) Smooth vertical links (no longer limited to horizontal)
* (feature) Dedicated documentation via gitbook
* (bug) forgot to export some
* (refactor) consistently use lodash where possible
* (maintenance) upgrade node modules

__5.0.0__ [http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/](https://dylanvorster.com/storm-react-diagrams-v5-0/)

PR: https://github.com/projectstorm/react-diagrams/pull/145

* (refactor) Links completely overhauled
* (feature) Smart Routing
* (feature) Flow support
* (demo) Smart Routing
* (demo) Animated links
* (api) Bootstrapping Improvements
* (feature) add custom properties to all widgets
* (refactor) use BEM for all css
* (feature) Default Link factory hooks
* (tests) e2e tests + helper framework
* (tests) automatically load JEST Snapshots
* (feature) Link labels!

__4.0.0__ [http://dylanv.blog/2018/01/18/storm-react-diagrams-v4-0-0/](https://dylanvorster.com/storm-react-diagrams-v4-0/)

* (refactor) Events system was completely overhauled
* (demo) Custom Link Sizes
* (refactor) Demos are now much more verbose and better managed
* (update) node packages
* (bug) Fix #129
* (feature) Control link creation through ports
* (refactor) Models are now in seperate files
* (refactor) Merged the concept of instance factories and widget factories into one
* (feature) Models can now be cloned at various parts of the model graph
* (demo) Cloning
* (feature) models control isLocked

__3.2.0__ [http://dylanv.blog/2017/11/22/storm-react-diagrams-3-2-0/](https://dylanvorster.com/storm-react-diagrams-3-2-0/)
* (feature) zoom to fit
* added Circle CI tests
* (demo) dagre automatic layouts
* (demo) zoom to fit
* (demo) selection events
* (demo) limit number of points
* (demo) programmatic node updating
* updated dependencies
* (bugs) swapping diagram models in engines
* (bugs) issues with the rendering pipeline #107
* added ci badge to Readme

__3.1.3__
* Refactor links slightly
* use min extension for css
* bump package versions
* export more classes

__3.1.2__
* Hotfix: fix zooming when canvas not in the top left corner
(https://github.com/projectstorm/react-diagrams/pull/88)

__3.1.0__ [http://dylanv.blog/2017/09/15/storm-react-diagrams-3-1-0/](https://dylanvorster.com/storm-react-diagrams-3-1-0/)
* Zoom relative to mouse location
* Fixed links not connecting when grid is larger than port size
* Prevented points from dragging when connected to a port and the node itself is not selected
* API fixes
* Code cleanup

__3.0.0__ [http://dylanv.blog/2017/09/13/storm-react-diagrams-v3/](https://dylanvorster.com/storm-react-diagrams-3-0/)
* Massive performance updates
* Complete rewrite
* Started a changelog and design documents for each revision

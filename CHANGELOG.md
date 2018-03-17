__5.1.0__ 

* [api] Rename XXXFactory into AbstractXXXFactory
* [refactor] tslint and prettier are now the same
* [refactor] Each class now explicitely has its own class file (consistency)
* [feature] Smooth vertical links (no longer limited to horizontal)
* [feature] Dedicated documentation via gitbook
* [bug] forgot to export some
* [refactor] consistently use lodash where possible
* [maintenance] upgrade node modules

__5.0.0__ http://dylanv.blog/2018/03/03/storm-react-diagrams-5-0-0/

PR: https://github.com/projectstorm/react-diagrams/pull/145

* [refactor] Links completely overhauled
* [feature] Smart Routing
* [feature] Flow support
* [demo] Smart Routing
* [demo] Animated links
* [api] Bootstrapping Improvements
* [feature] add custom properties to all widgets
* [refactor] use BEM for all css
* [feature] Default Link factory hooks
* [tests] e2e tests + helper framework
* [tests] automatically load JEST Snapshots
* [feature] Link labels!

__4.0.0__ http://dylanv.blog/2018/01/18/storm-react-diagrams-v4-0-0/

* [refactor] Events system was completely overhauled
* [demo] Custom Link Sizes
* [refactor] Demos are now much more verbose and better managed
* [update] node packages
* [bug] Fix #129
* [feature] Control link creation through ports
* [refactor] Models are now in seperate files
* [refactor] Merged the concept of instance factories and widget factories into one
* [feature] Models can now be cloned at various parts of the model graph
* [demo] Cloning
* [feature] models control isLocked 

__3.2.0__ http://dylanv.blog/2017/11/22/storm-react-diagrams-3-2-0/
* [feature] zoom to fit
* added Circle CI tests
* [demo] dagre automatic layouts
* [demo] zoom to fit
* [demo] selection events
* [demo] limit number of points
* [demo] programmatic node updating
* updated dependencies
* [bugs] swapping diagram models in engines
* [bugs] issues with the rendering pipeline #107
* added ci badge to Readme

__3.1.3__ 
* Refactor links slightly
* use min extension for css
* bump package versions
* export more classes

__3.1.2__ 
* Hotfix: fix zooming when canvas not in the top left corner
(https://github.com/projectstorm/react-diagrams/pull/88)

__3.1.0__ http://dylanv.blog/2017/09/15/storm-react-diagrams-3-1-0/
* Zoom relative to mouse location
* Fixed links not connecting when grid is larger than port size
* Prevented points from dragging when connected to a port and the node itself is not selected
* API fixes
* Code cleanup 

__3.0.0__ http://dylanv.blog/2017/09/13/storm-react-diagrams-v3/
* Massive performance updates
* Complete rewrite
* Started a changelog and design documents for each revision

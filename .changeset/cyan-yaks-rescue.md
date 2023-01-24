---
'@projectstorm/react-diagrams-defaults': major
'@projectstorm/react-diagrams-routing': major
'@projectstorm/react-diagrams-core': major
'@projectstorm/react-canvas-core': major
'@projectstorm/react-diagrams': major
'@projectstorm/react-diagrams-gallery': major
'@projectstorm/react-diagrams-demo': major
'@projectstorm/geometry': major
---

- moves to `Pnpm` (instead of yarn -_-)
- moves to `Changesets` for releases
- removes `Lerna`
- moves dependencies back to each package. (After years of working on libraries, I've come to actually hate peer dependencies, and this is easily solved with build systems / package managers).
- upgrades all dependencies
- switches to workspace protocol syntax (Changesets will bake in the correct version when a publish occurs)
- Changesets will open a release PR which can wrap up several changes in 1 go
- Changesets will run the storybook deploy automatically upon merging the release PR
- removes a lot of the stuff from the root package.json
- cleans up the build and clean commands
- export more stuff form the main react-diagrams package
- removed a lot of dependencies form the root which were no longer needed
- compile both ES6 and UMD
- [FIX] Wrong type name for react-canvas model listener

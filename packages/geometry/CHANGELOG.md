# @projectstorm/geometry

## 7.0.4

### Patch Changes

- 430e922: Updated packages to support React v19

## 7.0.3

### Patch Changes

- 80285fe: refactor: update lodash imports to use individual functions

## 7.0.2

### Patch Changes

- 66c687a: Upgrade all dependencies and fix Storybook after upgrade

## 7.0.1

### Patch Changes

- b8a4cbd: Inline sources in sourcemap

## 7.0.0

### Major Changes

- b051697: - [internal] moves to `Pnpm` (instead of yarn -\_-)
  - [internal]moves to `Changesets` for releases
  - [internal]removes `Lerna`
  - [internal] upgrades all dependencies
  - [internal] switches to workspace protocol syntax (Changesets will bake in the correct version when a publish occurs)
  - [internal] Changesets will open a release PR which can wrap up several changes in 1 go
  - [internal] Changesets will run the storybook deploy automatically upon merging the release PR
  - [internal] removes a lot of the stuff from the root package.json
  - [internal] cleans up the build and clean commands
  - [internal] remove E2E tests, they are a nightmare to maintain and the ROI is far too low
  - [fix] Wrong type name for react-canvas model listener
  - [fix] export more stuff form the main react-diagrams package
  - [fix] circular deps with Rectangle and Polygon (turns out this was a problem but only with UMD builds, sorry @everyone who I doubted, but this is also why I could never reproduce the issue)
  - [breaking change] compile both ES6 and UMD
  - [breaking change] moves dependencies back to each package. (After years of working on libraries, I've come to actually hate peer dependencies, and this is easily solved with build systems / package managers).
  - [breaking change] static methods on `Polygon` and `Rectangle` moved to standalone methods
  - [breaking change] static construction methods to rather deal with different Rectangle constructor overloads (I now consider this bad design)
  - [breaking change] introduce `Bounds` as a simpler point-array type to deal with boundary computation instead

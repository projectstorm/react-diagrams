# Testing

STORM React diagrams is tested two main ways.

## JEST Snapshot testing

With Jest snapshots, we render all the demos in the demo folder by automatically looking into each `demo-*` folder and searching for an **index.tsx** file.

For each file we find, we dynamically include it as a storybook story and assemble one big test. This test then renders each demo in a deterministic way and compares it to the snapshot file situated in **snapshots**. If the snapshots don't match, then something has changed and either the snapshot needs to be updated, or the test is failing in which case we need to fix the code.

Snapshot testing does not test the functionality of the program but it is a first important step to make sure that changes aren't having a drastic effect on the overall system.

In the event that the snapshot needs to be updated, please run `yarn run test -u` to overwrite the snapshot file, and then make sure to your branch.

## End to end testing

To test the functionality of the library, we make use of e2e tests \(end to end tests\). In this library, we spin up a headless chrome using pupeteer and interactively and programmatically tell the mouse pointer to click and drag on various elements while making assertions along the way.

We use Jest for the assertions and the interactivity is handled by puppeteer. Due to the laborious nature of writing e2e tests, there is a helper method that is provided in each test that makes interacting with the diagrams a lot easier. Using this helper, you can easily tell the mouse to drag links between nodes, select them and also easily assert information about them. The important thing here, is that this helper does not touch the model in any way, but is purely a helper for writing the tests themselves. Please make use of this helper when writing tests, as it ensure that the tests are defensive in nature, and also reduces the overhead of physically writing them.


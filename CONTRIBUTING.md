# Contributing

See below for guidelines on house keeping:

### Always add a PR

Since the project runs on GitHub, the best way to contribute is to fork and then submit a PR.
You will find a template that you will need to fill out

### Adding new demos

Add a new folder in the ./demos directory and make sure that it is named correctly like the other demos. 
A new demo should conform to the standard of either `demo-simple` in which it contains a markdown file that
clearly explains 'whats going on', or the code sample should have very clear comments that almost always should ready
like an instruction manual such as the simple demo.

Finally, you should link up your demo to the __index.tsx__ file in the __demos__ directory. It should be quite
self explanatory on how it works, but ultimately I have a helper method that makes it easy to link source code
to the demo itself, hence the 'require' statements. The third parameter is if you want to place your demo
inside a markdown guide (again: see simple demo for how that is done).

### Make the demo testable

Similar procedure, except link your demo in the __index.tsx__ file sitting in the __tests__ directory.
Running `yarn run test` will fire up jest (hopefully) and then it will render your demo to a snapshot directory
which when run again (for a second time), should compare the output to the newely generated snapshot. Make sure
to commit the updated snapshot file with your PR!

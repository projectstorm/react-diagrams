## Questions

#### Why didn’t I render the nodes as SVG's?

Because its vastly better to render nodes as standard HTML so that we can embed input controls and not have
to deal with the complexities of trying to get SVG to work like we want it to. I also created this primarily to embed into
enterprise applications where the nodes themselves are highly interactive with buttons and other controls that cave when I try to use SVG.

#### Why Typescript?

Because it can transpile into any level of ECMA Script, and the library got really complicated, so I ported it to Typescript
to accommodate the heavy architectural changes I was starting to make. <3 Type Script

#### Why is there no JSX?

Because most of the library is 95% all logic anyway, and I construct very complex DOM elements with many dynamic properties. JSX
Would just get in the way, and I personally hate JSX for a multitude of reasons anyway.

#### But I really want JSX :C

Changing the internals of this library to be JSX is a pointless endeavor because I built this library in such a way that you never need to hack it to get what you want out of it. If the library is missing something, then I would rather add it as a pluggable feature, or provide some mechanism to allow you to do this.

Just because this library is NOT JSX, doesn't however mean that you cant use JSX when you want to integrate it into your own system :)

#### How do I make my own elements?

Take a look at the __defaults__ directory, with specific attention to the __DefaultNodeWidget__

That being said, the defaults directory is an EXAMPLE of how you can create your own elements. A number of people want to use the defaults as is, which is cool, but is recommended to create your own base node like the onw you see

#### How do I use the library?

Take a look at the demo folders, they have simple and complex examples of the complete usage.

A good example of a real-world example is Demo 5

# Space Invaders

This is an implementation of the classic Space Invaders game using [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) and the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Table of Contents
- [Overview](#overview)
- [Process](#process)
   - [Useful Resources](#useful-resources)
- [Author](#author)

## Overview

## Process

### Canvas

I chose the canvas API because it is a little bit more challenging than using the DOM.

### Objects Position Problem

The best approach i could think of, taking into account that I would like the canvas to resize, is using percentage for the position of the objects. For example, if the `x` property of the `pos` property of an object was 20, then the object would be 20% off the left border of the canvas.

### Useful Resources
- [Generating a `tsconfig.json` file](https://stackoverflow.com/questions/36916989/how-can-i-generate-a-tsconfig-json-file)
- [Eloquent JS - Project: A Platform Game](https://eloquentjavascript.net/16_game.html)
- [tsc apparently not picking up tsconfig.json](https://github.com/microsoft/TypeScript/issues/6591)
- [Is there a Typescript way of adding properties to a prototype?](https://stackoverflow.com/questions/74033732/is-there-a-typescript-way-of-adding-properties-to-a-prototype)
- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)
- [How to define a private property when implementing an interface in Typescript?](https://stackoverflow.com/questions/37791947/how-to-define-a-private-property-when-implementing-an-interface-in-typescript)

## Author
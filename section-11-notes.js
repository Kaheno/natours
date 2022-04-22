// ************ 1. Types of Relationship between data **************
// 1). 1:1
// => Movie--Name (movie can only have 1 name)

// 2). 1:MANY
// 1:FEW => Movie--awards (movie can have a few awards)
// 1:MANY => Movie--Reviews (hundred-thousands)
// 1:TON => App--log (log can grow to millions of documents)

// 3). MANY:MANY
// => Movie Can have many Actors
// => Same Actors can play in many Movies

// ************* 2. Referencing Vs. Embedding ******************

// Referenced/Normalize => All "actors:" from the movie are separated and referenced by "_id"
// => "actors": [actorID('1'), actorID('2')]
//  PROS => Perfomance: it's easier to query each document on its own
//  CONS => We need 2 queries to get data from referenced document

// Embedded/Denormalized => All "actors:" are stored in the same movie document
// => "actors": [{actor1Data}, {actor2Data}]
//  PROS => Increases perfomance => get information in one query
//  CONS => Impossible to query the embedded document on its own

// ************ 3. When to EMBED and WHen to REFERENCE? **************

// * REFERENCING
// => IF 1:TON, MANY:MANY
// => Data is Updated a lot, (movies reviews)
// => If we need to query datasets on their own

// * EMBEDDING
// => IF 1:FEW, or 1:MANY
// => Data is mostly read, Data does not change quickly
// => Ex. (Movies + Images(100)) => images in a movie are not updating frequently or never.
// => If datasets really beloing together (user + Email)

// *********** 4. Types of Referencing ***********

// * Child Referencing
// => Parent contains all IDs referencing all child Elements
// 1:FEW => All IDs in the parent element could be too heavy

// * Parent Referencing
// => Child contain ID referencing Parent Element
// 1:MANY, 1:TON => each Child element are separated so space is unlimited

// * Two-Way Referencing
// => Parent and Child are connected in both directions (movie + actors) (actors + movies)
// MANY:MANY => Both contains a list of IDs

// ********* TIPS *********

// => Always favor embedding, unless theres a good reason to not to

// => Structure data before deciding to Embed/Reference

// => 1:TON, MANY:MANY is usually a good reason to REFERENCE

// => Favor REFERENCING if data is Updated a lot, and if Dataset is frequently need to be access

// => Don't allow arrays to grow indefinitely: use CHILD REFERENCING for 1:MANY, and PARENT REFERENCING got 1:TON

// => Use TWO-WAY Referencing for MANY:MANY
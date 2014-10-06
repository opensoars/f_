f_ (f.low, flow)
==================


[![Build Status](https://img.shields.io/travis/opensoars/f_.svg?style=flat)](https://travis-ci.org/opensoars/f_)
[![Coverage Status](https://img.shields.io/coveralls/opensoars/f_.svg?style=flat)](https://coveralls.io/r/opensoars/f_)
[![Dependency Status](https://david-dm.org/opensoars/f_.svg?style=flat)](https://david-dm.org/opensoars/f_)
[![Development Dependency Status](https://david-dm.org/opensoars/f_/dev-status.svg?style=flat)](https://david-dm.org/opensoars/f_#info=devDependencies&view=table)


Asynchronous Node.js made easy and fun!


---


### Dependencies
* [cls](https://github.com/opensoars/cls)
* [ezlog](https://github.com/opensoars/ezlog)


### Install
`npm install f_`


### Use
```js
var f_ = require('f_');

// Augment a task list class.
TaskList = f_.augment(require('TaskList.js'));

// Setup a task list instance.
var taskListInstance = f_.setup( new TaskList() );

// Call task list it's self written start mmethod.
// .start() will call f_next();
taskListInstance.start();
```


---


### Todo

###### Mandatory
* Write memory tests using [raminfo](https://github.com/opensoars/raminfo).
* Write a 'real world' example (will be used in documentation)
* Complete documentation

###### Optional
* Add functionality for "default maxTries from maxTries object? `maxTries: { methods: '?' }`"

### Time schedule (from the 10th of September 2014)
* 1.5/2 weeks (will result in pre-alpha release)
  - Further brainstorming
  - Expand documentation all features
  - Complete features
  - Release of a working prototype

* 2.5/3 weeks (will result in alpha release)
  - Complete product development
  - Documentation of development process

* 2.5/3 weeks (will result in beta release)
  - Testing
  - Fixing unexpected behaviour
  - Complete documentation


---


## Future documentation content
1. Title
2. Badges
3. One liner
4. Dependencies
5. Install
6. Use
7. Documentation
  1. Problem
  2. Solution
  3. Introduction
    * Async and sync
    * Small examples
      * Not wanted
      * Wanted
  4. Full example covering complete usage (API)
  5. Individual components
8. Example usage


---


## Documentation (outdated)


### Problem to be solved
Writing asynchronous, maintainable, modular and loosely coupled programs in Node.js without some help from a library/framework is hard (if you do not want to end up with 'christmas tree' code which will get you down in callback hell).


### How is `f_` going to solve this problem?
Allow programmers to use a Node.js module with a simple API which will make separation of concerns (which results in loosely coupled programs), modular and asynchronous programming a breeze.


### Introduction
Every (large) Node.js program has lots of asynchronous tasks such as:
* HTTP requests
* Complex equation solving
* Audio/video compressing

Ofcourse small tasks in larger asynchronous tasks will be synchronous. Some examples are:
* Concatenating a string
* solving simple equations
* Declaring variables

When we look at the two lists above, we can categorize computational tasks into two separate groups:

1. Asynchronous (either simple and quick or complex and long lasting)
2. Synchronous (only simple and quick)


<!---
LET'S FIX THIS SHIT BELOW!
LET'S FIX THIS SHIT BELOW!
LET'S FIX THIS SHIT BELOW!
-->

### API
Everything `f_` offers will be used in the code example below. We will be using a class based approach (plain object not recommended). Since we will be initiating a lot of instances, so we will make use of JavaScript it's prototypal inheritance pattern.
```js

// EDIT THIS WITH NEW API / PROTO ASSIGMENT

var f_ = require('f_');

/** Class based TaskList.
 * All methods are written in this class
 * @class TaskList      Class which holds all methods, used to set data
 *                      on initialization
 * @arg o.url {string}  Url to grab source code from
 */
var TaskList = function TaskList (o){
  o = o || {};

  return this;
};

/**
 * Create an empty namespace object to hold our proto(type) methods
 * Which will be assigned to the TaskList its prototype object
 */
var proto = Object.create(null);

/**
 * @method start  Check if requirements are met
 */
proto.start = function (){

};


/**
 * @method getSource          Gets a website source code
 * @req    url {string}  Url to grab source code from
 * @data   d.source {string}  Website it's source code
 */
proto.getSource = function (){

};


/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
proto.writeSource = function (){

};


/**
 * @method notify  Log what happened in the previous methods
 */
proto.notify = function (){

};


/**
 * Adding data to Class proto object, it will be same with every instance.
 * No need to add it to our shared data object namespace, which could be reset.
 * Also using the prototype object, we only assign it once.
 */
proto.writeDir = './sourceCodes';


/**
 * Assign methods from proto object to our TaskList its actual
 * prototype object.
 * Ofcourse, make sure our proto object has all properties we want it
 * to have before we assign it!
 */
TaskList.prototype = proto;


/** f_config object
 * In this object we can tell f_ what to do.
 * It can be quite detailed. But only a few properties are actualy
 * required for f_ to work
 */
var f_config = {

  // Function order f_ uses to call methods
  // REQUIRED to atleast have one element!
  functionFlow: ['getSource', 'writeSource', 'notify'],

  // Name given to the errors array
  // default: errs
  errorArray: 'errs', 

  // Do we want a data reset when we use 'retryAll'. Can be changed later on
  // in our code ofcourse!
  // Default: false
  resetOnRetryAll: true,

  // Object in which we store our shared data.
  // Default: 'd'
  dataNamespace: 'd',

  // Data namespace properties to keep on reset.
  keepOnReset: ['testNamespace'],

  // How many times f_ will retry the whole task list
  // Default: 10
  maxRetriesAll: 15,

  // How many times f_ will retry a single method
  // Default: 10
  maxMethodRetries: 5,

  // Specific methods will be retried specified times.
  // Will override maxMethodRetries
  maxMethodRetriesByName: {
    getSource: 10,
    writeSource: 5
  },

  // What to log
  // start:   If first method in functionFlow is called
  // next:    A method is called, we log the method name.
  // retry:   A retry occurs, log everything known about it.
  // error:   An error gets pushed to errs array, log err description and
  //          origional error object.
  // abort:   f_ aborts a task list, log error stack and method
  //          which caused error.
  // finish:  Log when tasks is complete and time taken
  // all:     Log 'everything' f_ does, all above triggers will be true.
  // silent:  Log nothing at all.
  // Default: ['all']
  toLog: ['next', 'retry']

};

// 'augment' method takes two arguments: object/class to augment and
// a config object.
TaskList = f_.augment(TaskList, f_config);

// Initiate 100 instances 
for(var i = 0; i < 100; i+=1){
  // Provide data which will be set to the instance it's properties.
  var tasksInstance = new TaskList();
  tasksInstance.start();

  if(tasksInstance.errs.length === 0)
    console.log('Ok, everything has started correctly, task:', i);
  else
    console.log('Errors at start, probably we do not want to continue w/', i);
}
```

### In depth look at the way `f_` DOESN'T work.

When we are looking at the way Node handles asynchronous computation, we are looking at the simple to grasp and understand, yet powerful practice of callbacks. Whilst this practice may be simple, code management, separation of concerns and loose coupling can be diffucult to achieve. This is due to something called 'callback hell'. Which will result in 'christmas tree code'. An (ugly) example below:
```js
/**
 * Simple task which will first GET google.com source code, write it to a HTML
 * file. When those two tasks are complete it will GET google.nl source code
 * and also write that to a HTML file. Written the most ugly way possible,
 * we're not even using named function declaration above the the async logic.
 */
http.get('http://www.google.com', function (googleRes){
  
  var googleSource = '';
  
  googleRes.on('data', function (googleChunk){
    googleSource = googleSource + googleChunk;
  });
  
  googleRes.on('end', function (){
    fs.writeFile('googleSource.html', googleSource, function (googleWriteErr){
      if(googleWriteErr) return console.log(googleWriteErr);
      
      http.get('http://www.youtube.com', function (ytRes){
        
        var ytSource = '';
        
        ytRes.on('data', function (ytChunk){
          ytSource = ytSource + ytChunk;
        });
        
        ytRes.on('end', function (){
          fs.writeFile('ytSource.html', ytSource, function (ytWriteErr){
            if(ytWriteErr) return console.log(ytWriteErr);
            
            return console.log('Tasks complete!');
          });
        });
      });
    });
  });
});
```



As you can see, this code hard to read, write and maintain. We're not even taking error handling and dependecy management in account here... Which will make it even harder to read, write and maintain.

### In depth look at the way `f_` DOES work.

Let's take a look at the way I want to write this simple task!

```js
/**
 * Please note we're still not using a good error handling mehtod,
 * the same logic as the ugly example is used.
 */

GetAndWriteTasks.prototype.getGoogle = function (){
  var self = this;

  http.get('http://www.google.com', function (res){

    var source = '';
    res.on('data', function (chunk){ source = source + chunk; });

    res.on('end', function (){
      // Using the d object namespace to store data we
      // need to use in other/later function scopes
      self.d.googleSource = source;

      // return statement isn't necessary, using it to show we're
      // done with this task.
      return self.next();
    });

  });
};


GetAndWriteTasks.prototype.writeGoogle = function (){
  var self = this,
      googleSource = self.d.googleSource;

  fs.writeFile('googleSource.html', googleSource, function (err){
    if(err) return console.log(err);
    return self.next();
  });

};

GetAndWriteTasks.prototype.getYt = function (){
  var self = this;

  http.get('http://www.youtube.com', function (res){

    var source = '';
    res.on('data', function (chunk){ source = source + chunk; });

    res.on('end', function (){
      self.d.ytSource = source;
      return self.next();
    });

  });
};

GetAndWriteTasks.prototype.writeYt = function (){
  var self = this,
      ytSource = self.d.ytSource;

  fs.writeFile('ytSource.html', ytSource, function (err){
    if(err) return console.log(err);

    // Using next when there are no more tasks will result in a low
    // level f_ API 'f_.finish' method call. Clearing up used memory, etc..
    return self.next();
  });

};
```

Yes, we did it; separation of concerns and loose coupling! We could even modularize (litteraly) it, since all those smaller asynchronous tasks could be single modules, if wanted they can even be put in single files. In this case I would keep it in a single file, since all tasks are small and easy to read/maintain. Even though we are using more lines of code.

So far we can say that `f_` will allow us to program in a modularized way. Which is great already! Well, more greatness is coming your way!

Now let's take a look at the way we will be handling errors (using a piece of the previous example):
```js
/**
 * In this piece of code, we will catch error messages so we can display
 * the complete error stack when the task is aborted, or when we look up
 * the f_ 'errs' array filled with error objects.
 */
GetAndWriteTasks.prototype.getGoogle = function (){
  var self = this;

  http.get('http://www.google.com', function (res){

    var source = '';
    res.on('data', function (chunk){ source = source + chunk; });

    res.on('end', function (){
      self.d.googleSource = source;
      return self.next();
    });

  }).on('error', function (err){
    // We provide a custom error message string and the original err object
    return self.addErr('http.get error', err);
  });
};


GetAndWriteTasks.prototype.writeGoogle = function (){
  var self = this,
      googleSource = self.d.googleSource;

  fs.writeFile('googleSource.html', googleSource, function (err){
    // Same as with http.get
    if(err) return self.addErr('fs.writeFile error', err);

    return self.next();
  });

};
```

So we've got a way to create an error stack, now we need a way to do something when an error occurs. This could ofcourse be done traditionally with 
`on('error')` event listeners. The problem with that is, we cannot directly 'throw' in a retry when something fails. Writing `on('error')` listeners everytime is tedious. Something we try to remove from programming Node programs (don't forget you CAN still use them!). So with `f_` we can do it directly from a piece of code that causes an error. Take a look at this example:
```js
// Immediately retry this asynchronous part of a larger task list
GetAndWriteTasks.prototype.getGoogle = function (){
  var self = this;

  http.get('http://www.google.com', function (res){
    // ...
  }).on('error', function (err){
    // With this function call we still add errors to the stack,
    // but immediately retry the current function
    return self.retryThis('http.get error', err);
  });
};
```

Let's say we use the source code received from Google.com in a later function but the `GET` request fails the first time, we want to make sure every piece of data we stored is removed from our RAM. We need a way to make `f_` know what data to remove from the data namespace object. We can do this by manualy providing `f_` with objects.

```js
GetAndWriteTasks.prototype.getGoogle = function (){
  var self = this;

  http.get('http://www.google.com', function (res){
    self.d.googleSource = '';
    res.on('data', function (chunk){
      self.d.googleSource = self.d.googleSource + chunk;
    });

    res.on('end', function (){
      return self.next();
    });

  }).on('error', function (err){
    // Providing 'dataToReset' with an object, f_ will reset properties
    // with given values when we use the retryThis method
    self.dataToReset = { googleSource: '' };

    // The following syntax is also supported, this way we can reset
    // objects deeper in the data namespace object
    self.dataToReset = { 'dataObjectNamespace.someProperty': {} }

    return self.retryThis('http.get error', err);
  });
};
```

This way we can ensure data is removed, ofcourse you could also override properties. But this could result in unwanted and hard to find corrupted data. There also is way to make sure EVERY piece of data is removed from our data object namespace: `self.resetAllData();`

So far we've talked about the data object namespace quite a lot. Let's take a closer look at how it works. We used the `d` namespace in our examples. This is just a plain JS object. With `f_` we can set our data object like this: `self.setDataObject('d')` or like this: `self.d = {};`. If you want more namespaces, simply do the following:
`self.d.newNameSpace = {}`. 
Please note that when you use the `self.resetAllData();` all namespaces in the top level namespace will be cleared. In case this is unwanted there is a way to let `f_` know we want to keep certain properties in our main namespace: 
`self.keepOnReset = ['newNameSpace'];`. There might even be cases where you don't want to reset anything at all, use: `self.resetOnRetry = false;`


* DISCUSS: `retryAll(optErrMsgString, optErrObj);`
* DISCUSS: `retryThis(optErrMsgString, optErrObj);`



Let's put everything in a part of a 'real world' code example:
```js
/**
 * When using f_, I tend to use 'start' as a function which will check
 * for dependencies and as a setup.
 */
GetAndWriteTasks.prototype.start = function (){
  // ... dependency verification could/should be here ...

  self.setDataObject('d');
  // ^ Could also be written like this: self.d = {};
  // might result in overriding data, since setDataObject won't
  // change the property if it's set already

  self.d.newNameSpace = {};       // this one will be kept
  self.d.someOtherNamespace = {}; // this one will be removed

  // Which properties to keep when we use a reset
  self.keepOnReset = ['newNameSpace'];

  // Do we actualy want a data reset? In this case; true!
  self.resetOnRetry = true;

};

GetAndWriteTasks.prototype.getGoogle = function (){
  var self = this;

  self.d.googleSource = '';
  res.on('data', function (chunk){
    self.d.googleSource = self.d.googleSource + chunk;
  });

  res.on('end', function (){
    return self.next();
  }).on('error', function (err){
    // With this function call we still add errors to the stack,
    // but immediately retry the current function
    return self.retryThis('http.get error', err);
  });

};

GetAndWriteTasks.prototype.writeGoogle = function (){
  // Check if the required data is present. In case it isn't,
  // we retry our whole task list
};

```
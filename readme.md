`f_` (f.low, flow)
==
Asynchronous Node.js made easier.

### Problem to be solved
Write asynchronous Node.js programs without ending up with hard to maintain, read and write 'cristmas tree' code. So we won't end up in (callback) hell!


### How is `f_` going to solve this problem?
Allow programmers to use a simple API which will take care of separation of concerns in a modularized way.


### Introduction
Every (good) Node program is written mainly asynchronously. Ofcourse smaller tasks in larger asynchronous tasks will be synchronous. Some examples are:
* String concatenation
* Simple equation solving
* Variable declaration

And then there are the asynchronous tasks, such as:
* HTTP requests
* Complex equation solving
* Audio/video compressing

When we look at the two lists above, we can categorize computational tasks into two separate groups:

1. Synchronous (small and quick)
2. Asynchronous (both small and quick or large and long lasting)

### API
Everything `f_` offers will be used in the code example below. We will be using a class based approach (plain object not recommended), since we will be initiating a lot of instances, so we will make use of JavaScript it's prototypal inheritance pattern.
```js
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
 * @method start      Check if requirements are met
 * @req url {string}  Url to grab source code from
 */
TaskList.prototype.start = function (){

};

/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
TaskList.prototype.getSource = function (){

};

/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
TaskList.prototype.writeSource = function (){

};

/**
 * @method notify  Log what happened in the previous methods
 */
TaskList.prototype.notify = function (){

};

// Adding data to Class prototype object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the prototype object, we only assign it once.
TaskList.prototype.writeDir = './sourceCodes';

var f_config = {

  // Note that we dont use a f_ namespace, methods are just prefixed
  // with 'f_'. Will save us quite some object lookup overhead. 
  prefixed_or_namespaced: 'prefixed', // Default: 'namespaced'

  // Function order f_ uses to call methods
  functionFlow: ['getSource', 'writeSource', 'notify'],

  // Name given to the errors array
  // default: errs
  errorArray: 'errs', 

  // Do we want a data reset when we use 'retryAll'. Can be changed later on
  // in our code ofcourse!
  // Default: true
  resetOnRetry: true,

  // Object in which we store our shared data.
  // Default: 'd'
  dataNamespace: 'd',

  // Data namespace properties to keep on reset.
  keepOnReset: ['testNamespace'],

  // How many times f_ will retry the whole task list
  // Default: 10
  maxTotalRetries: 15,

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
  // next:    A method is called, we log the method name.
  // retry:   A retry occurs, log everything known about it.
  // error:   An error gets pushed to errs array, log err description and
  //          origional error object.
  // abort:   f_ aborts a task list, log error stack and method
  //          which caused error.
  // all:     log 'everything' f_ does, all above triggers will be true.
  // silent:  log nothing at all.
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

### In depth look at the way `f_` works.

When we are looking at the way Node handles asynchronous computation, we are looking at the simple to grasp and understand, yet powerful practice of callbacks. Whilst this practice may be simple, code management and separation of concerns can be diffucult to achieve. This is due to something called 'callback hell'. Which will result in 'christmas tree code'. An example below:

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



As you can see, this code hard to read, write and maintain. We're not even taking error handling and dependecy management in account here... Making it even harder to read, write and maintain.

Now let's take a look at the way I want to write this simple task!

```js
/**
 * Please note we're still not using a good error handling mehtod,
 * the same logic as the ugly example is used.
 */

getAndWriteTasks.prototype.getGoogle = function (){
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


getAndWriteTasks.prototype.writeGoogle = function (){
  var self = this,
      googleSource = self.d.googleSource;

  fs.writeFile('googleSource.html', googleSource, function (err){
    if(err) return console.log(err);
    return self.next();
  });

};

getAndWriteTasks.prototype.getYt = function (){
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

getAndWriteTasks.prototype.writeYt = function (){
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
getAndWriteTasks.prototype.getGoogle = function (){
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


getAndWriteTasks.prototype.writeGoogle = function (){
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
getAndWriteTasks.prototype.getGoogle = function (){
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
getAndWriteTasks.prototype.getGoogle = function (){
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







DISCUSS: `retryAll(optErrMsgString, optErrObj);`
DISCUSS: `retry('methodToRetry', optErrMsgString, optErrObj);`
DISCUSS: `retryFrom('methodToRetryFrom', optErrMsgString, optErrObj);`
DISCUSS: `retryThis(optErrMsgString, optErrObj);`







Let's put everything in a part of a 'real world' code example:
```js
/**
 * When using f_, I tend to use 'start' as a function which will check
 * for dependencies and as a setup.
 */
getAndWriteTasks.prototype.start = function (){
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

getAndWriteTasks.prototype.getGoogle = function (){
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

getAndWriteTasks.prototype.writeGoogle = function (){
  // Check if the required data is present. In case it isn't,
  // we retry our whole task list
};

```


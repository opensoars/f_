f_
==
Asynchronous Node.js made easier.

### Problem to be solved
Write asynchronous Node.js programs without ending up with hard to maintain, read and write 'cristmas tree' code. So we won't find ourself in (callback) hell!


### How are we going to solve this problem?
Allow programmers to use a simple API which will take care of separation of concerns in a modularized way.


### Introduction
Every (good) Node program is mainly written asynchronously. Ofcourse smaller tasks in larger asynchronous tasks will be synchronous. Some examples are:
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


### In depth look at the way f_ works and how it will fix our previously described problem.

When we are looking at the way Node handles asynchronous computation, we are looking at the simple to grasp and understand yet powerful practice of callbacks. Whilst this practice may be simple, code management and separation of concerns can be diffucult to achieve. This is due to something called 'callback hell'. Which will result in 'christmas tree code'. An example below:

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
 * Also note we're not using a class based approach. Just a simple object
 * namespace, since this is a simple demonstration.
 */

var getAndWriteTasks = {};

getAndWriteTasks.getGoogle = function (){
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


getAndWriteTasks.writeGoogle = function (){
  var self = this,
      googleSource = self.d.googleSource;

  fs.writeFile('googleSource.html', googleSource, function (err){
    if(err) return console.log(err);
    return self.next();
  });

};

getAndWriteTasks.getYt = function (){
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

getAndWriteTasks.writeYt = function (){
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

Yes, we did it, separation of concerns. We could even modularize it, since all those smaller asynchronous tasks could be single modules, if wanted they can even be put in single files. In this case I would keep it in a single file, since all tasks are small and easy to read/maintain. Even though we are using more lines of code.

So far we can say that `f_` will allow us to program in a modularized way. Which is great already! Well, more greatness is coming your way!

Now let's take a look at the way we will be handling errors (using a piece of the previous example):
```js
/**
 * In this piece of code, we will catch error messages so we can display
 * the complete error stack when the task is aborted, or when we look up
 * the f_ 'errs' array filled with error objects.
 */
getAndWriteTasks.getGoogle = function (){
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


getAndWriteTasks.writeGoogle = function (){
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
`on('error')` event listeners. The problem with that is, we cannot directly 'throw' in a retry when something fails. Writing `on('error')` listeners everytime is tedious. Something we try to remove from programming Node programs. So with `f_` we can do it directly from a piece of code that causes an error. Take a look at this example:
```js
/**
 * Immediately retry this asynchronous part of a larger task list
 */
getAndWriteTasks.getGoogle = function (){
  var self = this;

  http.get('http://www.google.com', function (res){
    // ...
  }).on('error', function (err){
    // With this function call we still add errors to the stack,
    // but immediately retry it if wanted
    return self.retryThis('http.get error', err);
  });
};
```

Let's say we use the source code received from Google.com in a later function but the `GET` request fails the first time, we want to make sure every piece of data we stored is removed from our RAM. We need a way to make `f_` know what data to remove from the data namespace object. We can do this by manualy providing `f_` with property names.

```js
getAndWriteTasks.getGoogle = function (){
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

This way we can ensure data is removed, ofcourse you could also override properties. But this could cause unwanted and hard to find corrupt data.
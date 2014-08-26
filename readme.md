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
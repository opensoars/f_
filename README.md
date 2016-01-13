# f_ (wip)

Async and modular application development made easy.

[![Build Status](https://travis-ci.org/opensoars/f_.svg)](https://travis-ci.org/opensoars/f_)
[![Coverage Status](https://coveralls.io/repos/opensoars/f_/badge.svg?branch=master&service=github)](https://coveralls.io/github/opensoars/f_?branch=master)
[![Inline docs](http://inch-ci.org/github/opensoars/f_.svg?branch=master)](http://inch-ci.org/github/opensoars/f_)
[![Codacy Badge](https://api.codacy.com/project/badge/f3e64501763645b9aa483bf83a4dd1d5)](https://www.codacy.com/app/sam_1700/f_)
[![Code Climate](https://codeclimate.com/github/opensoars/f_/badges/gpa.svg)](https://codeclimate.com/github/opensoars/f_)
[![Dependency Status](https://david-dm.org/opensoars/f_.svg)](https://david-dm.org/opensoars/f_)
[![devDependency Status](https://david-dm.org/opensoars/f_/dev-status.svg)](https://david-dm.org/opensoars/f_#info=devDependencies)

---


## Install

`npm install f_`


## Use

```js
const f_ = require('f_');

let f_.getConstructor({
  function_flow: [
    {
      name: 'method1',
      function: function method1() {
        this.f_next();
      }
    },
    {
      name: 'method2',
      function: function method2() {
        this.f_next();
      }
    }
  ]
});
```
# Moff - Mobile First Framework
Website: [moffjs.com](http://moffjs.com/ "Moff - Mobile First Framework")

Moff is a javascript framework designed to offer best practices for mobile first development. It has rich API to work with browser, files and modularity system. Also it support Asynchronous Module Definition (AMD) which help to control loading of your modules. Data events system allows to load content with the least efforts. And it has pluggable system which allows to create plugins and extend the framework.

## Install
Before installing be sure bower is installed.
```bash
npm install bower -g
```
Install Moff
```bash
bower install moff --save
```
## Include Moff
Moff has three types of compiled files in <code>./dist</code> directory.
- <code>moff.js</code> - Full, not minified version with debug info + soursermap.
- <code>moff.prod.js</code> - Production, not minified version. W/o debug info.
- <code>moff.min.js</code> - Minified, production version. W/o debug info.

## Development
Clone [Moff](https://github.com/kfuzaylov/moff) repository.
```bash
git clone git@github.com:kfuzaylov/moff.git
```
```bash
cd moff
```
### Install package
```bash
npm install
```
Before package installation, npm installs testem, gulp and bower as global binary.
```bash
npm install testem -g && npm install gulp -g && npm install bower -g && bower install
```
## Compile
After made changes, need to update framework version in <code>bower.json</code> file and compiled files.
```bash
gulp compile
```

## Tests
Tests are kept in <code>./packages</code> directory. You can run tests only for some package.
```bash
gulp test --package=amd
```
Run tests for all packages.
```bash
gulp test --package=all
```
Tests will run via Testem. On press "Enter" button on console, gulp re-compile test files to get the latest version.

## License
The MIT License (MIT)

Copyright (c) 2015 Kadir A. Fuzaylov
# Moff - Create for mobile, extend to desktop.
Website: [moffjs.com](http://moffjs.com/ "Moff - Mobile First Framework")

###Create mobile first website then extend to tablet and desktop is so easy now!

<table>
    <tr>
        <td valign="top"><h3>1. Create mobile first website</h3>
            Create website only for mobile device. And display the main information needed for user.
            All other, additional parts could be registered as <a href="http://moffjs.com/amd.html">AMD modules</a> and will be loaded by user request.
            E.g. red color links "More images", "Show on the map" and "Share this page".
            Thus you will maximum reduce page size, show main content and will show user availability of additional information.
            <div><img src="http://moffjs.com/images/mobile-website.png"></div>
        </td>
    </tr>
</table>

<table>
 <tr>
        <td valign="top">
            <h3>2. Extend needed parts to tablet</h3>
            You can adjust parts of the page which will be loaded automatically on tablet.
            <a href="http://moffjs.com/data-events.html">Data Events</a> will help to load AMD module which will apply all needed functionality.
            E.g. on tablet you can see thumbnails carousel with slideshow.
           <div><img src="http://moffjs.com/images/tablet-website.png"></div>
        </td>
    </tr>
</table>

<table>
<tr>
        <td valign="top">
            <h3>3. Get fully featured website on desktop</h3>
            Then same way as on tablet you can load all website features on desktop. E.g. additionally loaded Google Map module.
           <div>
            <img src="http://moffjs.com/images/desktop-website.png">
            </div>
        </td>
    </tr>
</table>


## Install
Before installing be sure <code>bower</code> is installed.
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
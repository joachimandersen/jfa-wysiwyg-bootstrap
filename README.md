JFA WYSIWYG with bootstrap
==========================

Description
-----------
A WYSIWYG editor that don't make use of the browsers built in execCommand function
but builds the markup using jQuery.

The plugin is built as a jQuery widget

Dependencies
------------

This plugin depends on the following libraries, version listed in () is the version
used for development:

* jQuery (1.8.2) - http://www.jquery.com/
* jQuery ui (1.9.0) - http://www.jqueryui.com/
* Rangy (1.3 alpha 681) - http://code.google.com/p/rangy/

Test
----
I use TDD to develop the plugin. Unit tests are written using jasmine.
To run the tests simply open the tests/index.html in a browser. If many 
tests fail it *might* be because the selection helper functions in
jfa.rangetools fails

Browser compatibility
---------------------
Still early to say, but tests pass in the following browsers:

* Chrome (Version 23.0.1271.64) in Ubuntu
* Chrome (Version 23.0.1271.64 m) in Windows 7
* Firefox (Version 17.0) in Ubuntu
* Firefox (Version 12.0) in Windows 7
* IE 9 in Windows 7

License
-------

MIT license see LICENSE.txt


Changelog
---------
* 0.1: Development started November 21 - 2012

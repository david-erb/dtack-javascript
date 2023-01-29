# dtack-javascript

A grab bag of reusable javascript functions.

This code was developed in the 2000's which was the era of ECMAscript 3. 
There was no "class" semantic and one used prototype chains to implement classes.

I kept a loose concept of namespacing by naming conventions.
The functions and "classes" are organized into function groups of related "objects".

Most of the functions use jquery to access DOM elements.

Quite at bit of the functionality in this package can now be replaced by modern libraries available in the community.
Certainly the interaction handling is primitive compared to React and Vue.

This repo contains an elderly version of jquery.  There are some other third party libraries included in the thirdparty folder.

There are a few tests, but these require interaction so cannot run in a CI pipeline.  There is no jest or cypress testing here yet.

Here is a list of the function groups.

name | description
--------------- | -----------------------------
ajax1 | Issues ajax commands asynchronously.  Displays waiting message and finish message.  Handles events to update database when table sorted using drag/drop.
allnone1    | Displays a checkbox in a table column header, clicking it chooses all or none of the checkboxes in the column below.
basic1     | Basic functions such as date formatting, timers and packet parsing.  Also logs debug to console or separate DIV or window.  This group has a base class from which all other objects derive.
bezel1     | Makes an indented 3d-like border around a DIV.  Terribly ugly, must better to use modern CSS.
buttons1     | Different types of button groups and buttons behavior, such as mutually exclusive buttons and class changes when button clicks.
data_entry1     | Handles events from DOM objects and performs data entry validation with error message display on bad inputs.
dom1     | Simple DOM things like scrollable divs, collapsing divs and a file uploader.
drawing1     | Drawing tools using Raphael. User can draw lines and place symbols over a background.  Zoom in on the drawing with navigation pane.
dyemarkers1     | Drops trackable messages into the debug text stream.
gmap1     | Google maps interface layer, version 1.
gmap2     | Google maps interface layer, version 2, better.
input1     | Data validation early version, replaced by data_entry1.
interaction1     | Interactions between DOM elements.  Primarily a cascading dropdown scheme where changing an upstream one will change the choicelists in the downstream.
interactive1     | Displays interactive messages on form fields.
menubar1     | Simple menu bar functions with ajax post when clicked.
miniwindow1     | A wrapper over a popup dialog.  Can look like a speechbubble and meant to be used over a canvas with the drawing1 function group.
page1     | Class representing the displayed DOM page.  Can be informed about displayed records tied to a database, with automatically ajaxed changes.
scortable1     | Class which renders sortable column headers and handles events on them.
select1     | Has a class which renders as two dropdowns side by side, where you can select from one to the other, for picking multiple choices.
tabs1     | Early attempt at tabs controller.  The jquery ui tabs is much better now.
toolbox1     | Displays toolbox (toolbar) of icons and handles events on them.

     
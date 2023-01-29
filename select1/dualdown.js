/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
  ! THIS FILE IS A COMPONENT OF THE DTACK_JAVASCRIPT LIBRARY
  ! Copyright (C) 2009 Dtack Inc. All Rights Reserved
  ! This software is provided AS IS with no warranty expressed or implied.
  ! Dtack Inc. accepts no liability for use or misuse of this file.
  ! http://www.dtack.com  dtack@dtack.com  telephone +360.670.5775
  ! Dtack Inc., 1009 Homestead Ave., Port Angeles, WA USA 98362
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */


// this object represents a selection system using two select boxes

// --------------------------------------------------------------------
										// inherit the base methods and variables
dtack_dualdown_c.prototype = new dtack_base2_c();
										/* remember who the base class is */
dtack_dualdown_c.prototype.parent = dtack_base2_c;

function dtack_dualdown_c(dtack_environment)
{
										/* operate within this environment */
  this.dtack_environment = dtack_environment;

  this.name = "";

  this.from_formfield = null;
  this.into_formfield = null;
  this.hidden_formfield = null;
  this.from_filter_text_formfield = null;
  this.into_filter_text_formfield = null;

  this.from_filtered_out_options = new Array();
}

// --------------------------------------------------------------------
// initialize the dualdown
// the from, into and hidden field names are derived from the name according to a naming convention

dtack_dualdown_c.prototype.initialize = function(name)
{
  var F = "initialize";

  this.from_formfield = this.formfield(name + "_from");
                                        // also look for SELECT fields ending with [] to accommodate php's naming convention
  	                                    // watchfrog #148
  if (!this.from_formfield)
    this.from_formfield = this.formfield(name + "_from[]");
    
  this.into_formfield = this.formfield(name + "_into");
  if (!this.into_formfield)
    this.into_formfield = this.formfield(name + "_into[]");
    
  this.hidden_formfield = this.formfield(name);

  this.from_filter_text_formfield = this.formfield(name + "_from_filter_text");
  this.into_filter_text_formfield = this.formfield(name + "_into_filter_text");

} // end method


// -----------------------------------------------------------------------------------
// compare two options within a list by their text values
dtack_dualdown_c.prototype.compare_option_text = function(a, b) 
{ 
  return a.text.localeCompare(b.text);
}

// -----------------------------------------------------------------------------------
// move selected items from the "from" list into the "into" list

dtack_dualdown_c.prototype.insert = function (moveAll) 
{ 
  if (!this.from_formfield ||
      !this.into_formfield ||
      !this.hidden_formfield)
  {
  	                                    // watchfrog #148
  	alert("formfields are not set up right");
    return;
  }
    
  this.move(this.from_formfield, this.into_formfield, moveAll);
										// capture the current value as currently held by the "into" pulldown
  this.capture();
                                        // apply the filter to the "into" list
  this.apply_into_filter();
}

// -----------------------------------------------------------------------------------
// move selected items from the "into" list into the "from" list

dtack_dualdown_c.prototype.remove = function (moveAll) 
{ 
  if (!this.from_formfield ||
      !this.into_formfield ||
      !this.hidden_formfield)
  {
  	                                    // watchfrog #148
  	alert("formfields are not set up right");
    return;
  }

  this.move(this.into_formfield, this.from_formfield, moveAll);

										// capture the current value as currently held by the "into" pulldown
  this.capture();
                                        // apply the filter to the "from" list
  this.apply_from_filter();
}

// -----------------------------------------------------------------------------------
// capture the current value as currently held by the "into" pulldown

dtack_dualdown_c.prototype.capture = function () 
{ 
  var F = "capture";

  var hidden_text = "";

  var options = this.into_formfield.options;

  for ( var j = 0; j < options.length; j++ ) 
  {
    if ( options[j] != null )
    {
	  if (hidden_text != "")
		hidden_text += ",";

	  hidden_text += options[j].value;
    }
  }

  if (this.hidden_formfield.value != hidden_text)
  {

										/* this is the value that gets submitted */
	this.hidden_formfield.value = hidden_text;

	try
	{
										/* signal the change to the form if possible */
										// watchfrog #1
	  _changed(this.hidden_formfield);
	}
	catch(exception)
	{
	  this.debug(F, exception.message);
	}
  }

}

// -----------------------------------------------------------------------------------
// Dual list move function
// adapted from http://javascript.internet.com/miscellaneous/move-dual-list.html 

dtack_dualdown_c.prototype.move = function (srcList, destList, moveAll) 
{ 

  // Do nothing if nothing is selected
  if (  ( srcList.selectedIndex == -1 ) && ( moveAll == false )   )
  {
    return;
  }

  newDestList = new Array( destList.options.length );

  var len = 0;

  for( len = 0; len < destList.options.length; len++ ) 
  {
    if ( destList.options[len] != null )
    {
      newDestList[len] = new Option( 
		destList.options[len].text, 
		destList.options[len].value, 
		destList.options[len].defaultSelected, 
		destList.options[len].selected);
    }
  }

  for( var i = 0; i < srcList.options.length; i++ ) 
  { 
    if ( srcList.options[i] != null && ( srcList.options[i].selected == true || moveAll ) )
    {
										// incorporate into new list
	  newDestList[len] = new Option( 
		srcList.options[i].text, 
		srcList.options[i].value, 
		srcList.options[i].defaultSelected, 
		srcList.options[i].selected );
	  len++;
    }
  }

										// sort out the new destination list
  newDestList.sort( this.compare_option_text );   // BY TEXT

										// Populate the destination with the items from the new array
  for ( var j = 0; j < newDestList.length; j++ ) 
  {
    if ( newDestList[j] != null )
    {
      destList.options[j] = newDestList[j];
    }
  }

										// erase source list selected elements
  for( var i = srcList.options.length - 1; i >= 0; i-- ) 
  { 
    if ( srcList.options[i] != null && ( srcList.options[i].selected == true || moveAll ) )
    {
										// erase Source
       srcList.options.remove(i);
    }
  }

} // end method





// --------------------------------------------------------------------
// filter items in the "from" list based on text in the textbox

dtack_dualdown_c.prototype.apply_from_filter = function()
{
  var F = "apply_from_filter";
                                        // no pulldown form in the DOM?
  if (!this.from_formfield)
    return;
                                        // no filter text field in the DOM?
  if (!this.from_filter_text_formfield)
    return;
  
                                       // merge the currently displayed options with the ones that have been filtered out
  var merged_options = this.merge_option_arrays(
    this.from_formfield.options, 
    this.from_filtered_out_options);
  
                                       // clear the filtered-out options list
  this.from_filtered_out_options = new Array();
  
  var pattern_text = this.from_filter_text_formfield.value.replace(/^\s+|\s+$/g, "");
    
  var pattern_regexp = new RegExp(pattern_text, "i");
    
  var filtered_in_options = new Array();
  
  var i;
  
                                       // traverse the merged list
  for (i=0; i<merged_options.length; i++)
  {
  	var option = merged_options[i];
  	
  	if (!option)
  	  continue;
  	  
  	if (option.text.match(pattern_regexp))
  	{
                                       // add to displayed list
  	  filtered_in_options[filtered_in_options.length] = option;
	}
	else
	{
                                       // add to filtered-dout list
  	  this.from_filtered_out_options[this.from_filtered_out_options.length] = option;
	}
  }
										// sort the filtered list list by text
  filtered_in_options.sort(this.compare_option_text);
  
  var n = this.from_formfield.options.length;
  
                                         // clear the entire displayed options list
  for (i=n-1; i>=0; i--)
  {
  	this.from_formfield.options.remove(i);
  }
  
  var cleared_length = this.from_formfield.options.length;
  
                                       // traverse the filtered-in list
  for (i=0; i<filtered_in_options.length; i++)
  {
  	this.from_formfield.options[i] = filtered_in_options[i];
  }
  
  if (false)
  alert(
    "merged " + merged_options.length + "\n" +
    "filtered in " + filtered_in_options.length + "\n" +
    "filtered out " + this.from_filtered_out_options.length + "\n" +
    "original length " + n + "\n" +
    "cleared_length " + cleared_length + "\n" +
    "displayed " + this.from_formfield.options.length);

} // end method




// --------------------------------------------------------------------
// clear the filter by showing all items in the "from" list and setting the textbox to blank

dtack_dualdown_c.prototype.clear_from_filter = function()
{
  var F = "clear_from_filter";

                                        // no filter text field in the DOM?
  if (!this.from_filter_text_formfield)
    return;
    
  this.from_filter_text_formfield.value = "";
  
  this.apply_from_filter();
} // end method



// --------------------------------------------------------------------
// filter items in the "from" list based on text in the textbox

dtack_dualdown_c.prototype.apply_into_filter = function()
{
  var F = "apply_into_filter";
  
} // end method






// --------------------------------------------------------------------
// clear the filter by showing all items in the "from" list and setting the textbox to blank

dtack_dualdown_c.prototype.clear_into_filter = function()
{
  var F = "clear_into_filter";

} // end method







// --------------------------------------------------------------------
// merge two lists of options into one and return the one

dtack_dualdown_c.prototype.merge_option_arrays = function(array1, array2)
{
  var F = "merge_option_arrays";
  
  var array3 = new Array();
  
  for (var i=0; i<array1.length; i++)
  {
  	if (array1[i])
  	  array3[array3.length] = array1[i];
  }

  for (var i=0; i<array2.length; i++)
  {
  	if (array2[i])
      array3[array3.length] = array2[i];
  }

  return array3;
} // end method


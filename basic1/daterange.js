var dtack_daterange_period_objects = {
  "last_calendar_year": {"date1": "1/1/2012", "date2": "12/31/2012"},
  "last_calendar_month": {"date1": "5/1/2013", "date2": "5/31/2013"}
};


// --------------------------------------------------------------------
// class representing date range functions

										// inherit the base methods and variables
dtack_daterange_c.prototype = new dtack_base2_c();

										// override the constructor
dtack_daterange_c.prototype.constructor = dtack_base2_c;

// -------------------------------------------------------------------------------
// constructor

function dtack_daterange_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_daterange_c";
    
										/* call the base class constructor helper */
	dtack_base2_c.prototype.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);

    this.parent = dtack_base2_c.prototype;
    
    this.date_format_options = {"format": "american date only"};
  
    this.today = new Date();
    
    this.should_ever_hide_date_fields = true;
    this.should_blank_pulldown_after_set = false;
    
    // specify a different day for testing
    //this.today = new Date(this.today.getFullYear(), 1, 10);
    
   }

} // end constructor

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.set_datepickers_from_period_pulldown = function(pulldown_formfield)
{
  var F = "set_datepickers_from_period_pulldown";
  
  if (pulldown_formfield == undefined)
    return this.alert(F, "pulldown_formfield argument has undefined value");
    
  if (pulldown_formfield.selectedIndex == undefined)
    return this.alert(F, "pulldown_formfield.selectedIndex has undefined value");

  var date1_value = "";
  var date2_value = "";
  var should_hide_date_fields = false
  
  if (pulldown_formfield.selectedIndex == -1)
  {
  	//date1_value = "";
  	//date2_value = "";
  }
  else
  {
    var option = pulldown_formfield.options[pulldown_formfield.selectedIndex];
  
    if (option == undefined)
      return this.alert(F, "pulldown_formfield[" + pulldown_formfield.selectedIndex + "] has undefined value");
    
                                        // get the name of the period (such as "last_calendar_year")
    var period_value = option.value;
                                        // nothing selected in the pulldown yet?
    if (period_value == "")
    {
  	  //date1_value = "";
  	  //date2_value = "";
    }
                                        // pulldown has something in it?
    else
    {
                                        // don't show the custom date input fields
      should_hide_date_fields = true;
      
      var date1date2_object = this.calculate_period(period_value);
  	
  	                                   // pulldown value is not a known daterange string?
      if (date1date2_object == undefined)
        return this.alert(F, "date1date2_object could not calculate period from \"" + period_value + "\"");
      
      date1_value = date1date2_object["date1"];
      date2_value = date1date2_object["date2"];
    }
  }
  
  var date1_fieldname = pulldown_formfield.name.replace(/-period-/, "-date1-");
  var date1_formfield = pulldown_formfield.form.elements[date1_fieldname];
  if (date1_formfield == undefined)
  {
    return this.alert(F, "date1_formfield named \"" + date1_fieldname + "\" cannot be found");;
  }
    
  var date2_fieldname = pulldown_formfield.name.replace(/-period-/, "-date2-");
  var date2_formfield = pulldown_formfield.form.elements[date2_fieldname];
  if (date2_formfield == undefined)
  {
    return this.alert(F, "date2_formfield named \"" + date2_fieldname + "\" cannot be found");;
  }
  
  date1_formfield.value = date1_value; 
  date2_formfield.value = date2_value; 
  
                                        // eztask #12430: GSWMP (OP49): Report#2 - Grading Permit Summary report 
                                        // option to keep date fields visible at all times
                                        // watchfrog #155
  if (this.should_ever_hide_date_fields)
  {
                                        // eztask #11049: (hq): Summary Reports - date range select
    if (should_hide_date_fields)
    {
      //this.alert(F, "should_hide_date_fields " + should_hide_date_fields);
      //this.alert(F, "date1_formfield.style is \"" + date1_formfield.style + "\"");
      date1_formfield.style.display = "none"; 
      date2_formfield.style.display = "none"; 
    }
    else
    {
      date1_formfield.style.display = "inline"; 
      date2_formfield.style.display = "inline"; 
    }
  }

  if (this.should_blank_pulldown_after_set)
  {
  	pulldown_formfield.selectedIndex = -1;
  }
  
  return;
} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_period = function(daterange_nickname)
{
  var F = "calculate_period";
  
  var date1date2_object = undefined;
  
  switch(daterange_nickname)
  {
  	case "last_calendar_year": date1date2_object = this.calculate_last_calendar_year(); break;
  	case "last_calendar_month": date1date2_object = this.calculate_last_calendar_month(); break;
  	case "this_year_to_date": date1date2_object = this.calculate_this_year_to_date(); break;
  	case "this_month_to_date": date1date2_object = this.calculate_this_month_to_date(); break;
  	case "this_quarter_to_date": date1date2_object = this.calculate_this_quarter_to_date(); break;
  	case "last_quarter": date1date2_object = this.calculate_last_quarter(); break;
  	default: this.alert(F, "unknown daterange_nickname \"" + daterange_nickname + "\"");
  }
  
  return date1date2_object;

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_last_calendar_year = function()
{
  var F = "calculate_last_calendar_year";
  
  var date1 = new Date(this.today.getFullYear()-1, 0, 1);
  var date2 = new Date(this.today.getFullYear()-1, 11, 31);
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method


// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_last_calendar_month = function()
{
  var F = "calculate_last_calendar_month";

  
  var date1 = new Date(this.today.getFullYear(), this.today.getMonth()-1, 1);
  var date2 = new Date(this.today.getFullYear(), this.today.getMonth(), 0);
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_this_year_to_date = function()
{
  var F = "calculate_this_year_to_date";

  var date1 = new Date(this.today.getFullYear(), 0, 1);
  var date2 = this.today;
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_this_month_to_date = function()
{
  var F = "calculate_this_month_to_date";

  var date1 = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  var date2 = this.today;
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_this_quarter_to_date = function()
{
  var F = "calculate_last_quarter";

  var this_month = this.today.getMonth() + 1;
  
  var date1;
  var date2;
  
  if (this_month < 3)
  {
    date1 = new Date(this.today.getFullYear(), 1-1, 1);
  }
  else
  if (this_month < 6)
  {
    date1 = new Date(this.today.getFullYear(), 4-1, 1);
  }
  else
  if (this_month < 9)
  {
    date1 = new Date(this.today.getFullYear(), 7-1, 1);
  }
  else
  {
    date1 = new Date(this.today.getFullYear(), 10-1, 1);
  }
  
  date2 = this.today;
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.calculate_last_quarter = function()
{
  var F = "calculate_last_quarter";

  var this_month = this.today.getMonth() + 1;
  
  var date1;
  var date2;
  
  if (this_month < 3)
  {
    date1 = new Date(this.today.getFullYear()-1, 10-1, 1);
    date2 = new Date(this.today.getFullYear()-1, 12-1, 31);
  }
  else
  if (this_month < 6)
  {
    date1 = new Date(this.today.getFullYear(), 1-1, 1);
    date2 = new Date(this.today.getFullYear(), 3-1, 31);
  }
  else
  if (this_month < 9)
  {
    date1 = new Date(this.today.getFullYear(), 4-1, 1);
    date2 = new Date(this.today.getFullYear(), 6-1, 30);
  }
  else
  {
    date1 = new Date(this.today.getFullYear(), 7-1, 1);
    date2 = new Date(this.today.getFullYear(), 9-1, 30);
  }
  
  return { 
    "date1": this.format_date(date1, this.date_format_options),
    "date2": this.format_date(date2, this.date_format_options)
  };

} // end method

// -------------------------------------------------------------------------------
dtack_daterange_c.prototype.alert = function(F, message)
{
  alert(F + ": " + message);
  return undefined;
} // end method

// -------------------------------------------------------------------------------
var dtack_daterange_static_object = undefined;

// -------------------------------------------------------------------------------
// shortform for ease of javascript calling

function dtack_daterange_set_datepickers_from_period_pulldown(pulldown_formfield)
{
                                        // global object not yet instantiated?
  if (dtack_daterange_static_object == undefined)
    dtack_daterange_static_object = new dtack_daterange_c(dtack_environment);
  
  dtack_daterange_static_object.set_datepickers_from_period_pulldown(pulldown_formfield);
}
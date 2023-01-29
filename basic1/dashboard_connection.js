// this object a connection between the page and the dashboard
// implements a protocol for bidirectional communication

										// inherit the base methods and variables
dtack_dashboard_connection_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack_dashboard_connection_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack_dashboard_connection_c.prototype.constructor = dtack_dashboard_connection_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack_dashboard_connection_c(dtack_environment, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack_dashboard_connection_c";

										/* call the base class constructor helper */
	dtack_dashboard_connection_c.prototype.base.constructor.call(
	  this,
	  dtack_environment,
	  classname != undefined? classname: F);
                                                                   // push the class hierarchy so debug_verbose may be used
    this.push_class_hierarchy(F);
    
    this.CONSTANTS = {};
    this.CONSTANTS.EVENTS = {};
    this.CONSTANTS.EVENTS.HAS_LAUNCHED_WINDOW = "has_launched_window";
}

} // end constructor


// -------------------------------------------------------------------------------
// let the dashboard initialize itself

dtack_dashboard_connection_c.prototype.initialize = function(configuration)
{
  var F = "dtack_dashboard_connection_c::initialize";

  this.dashboard_protocol = this.dtack_environment.cgis["dashboard_protocol"];
  
  if (this.dashboard_protocol === undefined)
  {
    this.dashboard_protocol = this.host_value("dashboard_connection.protocol");
  }

  this.debug(F, "initializing dashboard connection for protocol " + this.vts(this.dashboard_protocol));

  this.configuration = configuration;

  this.register();
} // end method

// -------------------------------------------------------------------------------
// let the dashboard associate a name with this document instance

dtack_dashboard_connection_c.prototype.register = function()
{
  var F = "dtack_dashboard_connection_c::register";

  if (!this.dashboard_protocol)
  {
    this.debug(F, "no dashboard protocol so not registering dashboard connection");
    return;
  }

  if (this.registered)
  {
    this.debug(F, "already registered so not registering dashboard connection");
    return;
  }

  if (!this.configuration)
  {
    this.debug(F, "no configuration initialized so not registering dashboard connection");
    return;
  }

  var payload_id = "dtack_dashboard_connection_registration_payload";

                                        // change payload variable for page name
                                        // watchfrog #130
  var payload =
  	"dashboard_registration_name=" + this.configuration.dashboard_registration_name +
  	"&" +
    "receive=" + encodeURIComponent(this.configuration.global_variable_page_name + ".dashboard_connection.receive()");

  this.register_on_existing_id(payload_id, payload);

  this.debug(F, "dashboard registration payload is \"" + payload + "\"");

  this.registered = true;

} // end method

// -------------------------------------------------------------------------------
// let the dashboard associate a name with this document instance

dtack_dashboard_connection_c.prototype.register_on_existing_id = function(payload_id, payload)
{
  var F = "dtack_dashboard_connection_c::register_on_existing_id";

  this.debug(F, "registering dashboard connection by finding existing div with id " + payload_id);

  var div = this.want_element(F, payload_id);

  if (div)
  {
    div.innerHTML = payload;
  }

} // end method

// -------------------------------------------------------------------------------
// let the dashboard associate a name with this document instance

dtack_dashboard_connection_c.prototype.register_by_creating_id = function(payload_id, payload)
{
  var F = "dtack_dashboard_connection_c::register_by_creating_id";

  this.debug(F, "registering dashboard connection by creating div with id " + payload_id);

  var div = document.createElement("div");
  div.style.display = "none";
  div.id = payload_id;

  div.innerHTML = payload;

  document.body.appendChild(div);

} // end method

// -------------------------------------------------------------------------------
// attach the cgi to the given url which will allow that page to make the same dashboard connection

dtack_dashboard_connection_c.prototype.append_cgi = function(url)
{
  var F = "dtack_dashboard_connection_c::append_cgi";

  var url2 = url;

  if (this.dashboard_protocol != undefined &&
      this.dashboard_protocol != "")
  {
    url2 += (url2.indexOf("?") < 0? "?": "&") + "dashboard_protocol=" + this.dashboard_protocol;
  }

  if (this.dtack_environment != undefined &&
      this.dtack_environment.cgis != undefined &&
      this.dtack_environment.cgis.debug != undefined &&
      this.dtack_environment.cgis.debug != "")
  {
    url2 += (url2.indexOf("?") < 0? "?": "&") + "debug=" + this.dtack_environment.cgis.debug;
  }

  return url2;

} // end method


// -------------------------------------------------------------------------------
// dispatch an event to the dashboard in its own thread
// watchfrog #142

dtack_dashboard_connection_c.prototype.send_asynchronously = function(event_name, cgis, inhibit_debug)
{
  var F = "dtack_dashboard_connection_c::send_asynchronously";

  var that = this;

  setTimeout(function() {that.send(event_name, cgis, inhibit_debug);}, 1);

} // end method

// -------------------------------------------------------------------------------
// dispatch an event to the dashboard

dtack_dashboard_connection_c.prototype.send = function(event_name, cgis, inhibit_debug)
{
  var F = "dtack_dashboard_connection_c::send";

  var cgi;
  cgi = "event_name=" + event_name;

  if (cgis)
  for (var k in cgis)
  {
  	cgi += "&" + k + "=" + encodeURIComponent(cgis[k]);
  }

  if (!this.tried_dtack_document_callback_handle)
  {
    this.dtack_document_callback_handle = this.dtack_environment.peek_dtack_document_callback_handle();
    this.tried_dtack_document_callback_handle = true;
  }

  if (this.dtack_document_callback_handle)
  {
    cgi += "&dtack_document_callback_handle=" + this.dtack_document_callback_handle
  }

  if (this.dashboard_protocol == "3")
  {
                                        // caller is not requesting to inhibit debug?
    if (!inhibit_debug)
      this.debug(F, "calling window.external.receive_javascript(" + cgi + ")");
    window.external.receive_javascript(cgi);
  }
  else
  {
    if (!inhibit_debug)
      this.debug(F, "no dashboard protocol so not calling window.external.receive_javascript(" + cgi + ")");

    //alert("sending to dashboard:\n\n" + cgi);
  }

} // end method

// -------------------------------------------------------------------------------
// dispatch an event to the dashboard with packet as data

dtack_dashboard_connection_c.prototype.send_packet = function(event_name, payload_packet, inhibit_debug, should_send_and_wait)
{
  var F = "dtack_dashboard_connection_c::send_packet";

  var event_packet = new dtack__basic__packet_c(this.dtack_environment, "event");
  
  var payload_container_packet = event_packet.new_packet("payload");
  payload_container_packet.add_packet(payload_packet);

  event_packet.attribs.event_name = event_name;
  
  var response = undefined;

  if (!this.tried_dtack_document_callback_handle)
  {
    this.dtack_document_callback_handle = this.dtack_environment.peek_dtack_document_callback_handle();
    this.tried_dtack_document_callback_handle = true;
  }

  if (this.dtack_document_callback_handle)
  {
    event_packet.attribs.dtack_document_callback_handle = this.dtack_document_callback_handle;
  }

  this.debug_verbose(F, "this.dashboard_protocol is " + this.vts(this.dashboard_protocol));
  
  if (this.dashboard_protocol == "3")
  {
                                        // caller is not requesting to inhibit debug?
    if (!inhibit_debug)
      this.debug(F, "calling window.external.receive_javascript_xml()");
      
    if (should_send_and_wait)
    {
      response = window.external.receive_javascript_xml(event_packet.compose_xml());
    }
    else
    {
      var that = this;
      
                                        // run the discussion with c# after the screen updates with the waiting gif
      setTimeout(
        function() 
        {    
                                        // do the toolhost command, which should return a packet
          response_xml_text = window.external.receive_javascript_xml(event_packet.compose_xml());
  
          try
          {
            $xml = $($.parseXML(response_xml_text));
            var $response = $xml.find("response");
            
                                        // response packet indicates a new window was launched?
            var has_launched_window = $response.find("has_launched_window").text();
            
            if (has_launched_window == "yes")
            {
                                        // let anyone know who cares
                                        // typically this is the page_base, who removes the hourglass icon from the clicked element
              that.pull_triggers(that.CONSTANTS.EVENTS.HAS_LAUNCHED_WINDOW, "");
            }
            else
            {
            }
          }
          catch(exception)
          {
          }
          
        }, 1);
    }
  }
  else
  {
    if (!inhibit_debug)
      this.debug(F, "no dashboard protocol so not calling window.external.receive_javascript_xml()");

    //alert("sending to dashboard:\n\n" + packet.compose_xml());
  }
  
  return response;

} // end method
                           

// -------------------------------------------------------------------------------
// dispatch an event to the dashboard with packet as data

dtack_dashboard_connection_c.prototype.send_ajax = function(url, xml_string, inhibit_debug)
{
  var F = "dtack_dashboard_connection_c::send_ajax";

  var response = null;
  
  if (this.dashboard_protocol == "3")
  {
                                        // caller is not requesting to inhibit debug?
    if (!inhibit_debug)
      this.debug(F, "calling window.external.receive_javascript_ajax()");
      
    response = window.external.receive_javascript_ajax(url, xml_string);
  }
  else
  {
    if (!inhibit_debug)
      this.debug(F, "no dashboard protocol so not calling window.external.receive_javascript_xml()");

    //alert("sending to dashboard:\n\n" + packet.compose_xml());
  }

  return response;

} // end method
                           

// -------------------------------------------------------------------------------
// receive a notification from the dashboard
// transfer to a standard trigger pull on the instance

dtack_dashboard_connection_c.prototype.receive = function(event_name, event_data)
{
  var F = "dtack_dashboard_connection_c::receive";
                                        // don't debug here because it might go back to c#
  //this.debug(F, "received event \"" + event_name + "\"");

  //alert(F + ": received event \"" + event_name + "\"");

  if (false)
  {
                                        // run the event in its own thread, return immediately
                                        // fire just once after short delay
    this.timer_start(
      event_name,
      {
        "period": "10",
        "maximum_repetitions": "1",
        "immediate": "no",
        "opaque": event_data
      });
  }
                                        // use a new timer instance for each incoming message from the dashboard
  else
  if (false)
  {
    if (this.receive_timer_objects == undefined)
      this.receive_timer_objects = new Array();

                                        // we need a new timer instance in case events with the same names pile up
    var timer_object = new dtack_timer_c(
      this.dtack_environment);

      // memory leak here?  these timers float around with no references to them, what happens to them after they cease?
    //this.receive_timer_objects.push(timer_object);

    timer_object.timer_start(
                                        // first argument is the object to pull triggers on,
                                        // obviously this is the one people will be waiting on
      this,
      event_name,
      {
        "period": "10",
        "maximum_repetitions": "1",
        "immediate": "no",
        "destruct_after_final_repetition": "yes",
        "opaque": event_data
      });

  }
                                       // use the simplest method to decrease chances of memory leak
                                       // watchfrog #103
  else
  {
    var that = this;
                                        /* set a timer to call it again after the period */
    setTimeout(
      function()
      {
        that.pull_triggers(event_name, event_data);
      },
      10);
  }

} // end method

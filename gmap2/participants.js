// --------------------------------------------------------------------

										// inherit the base methods and variables
dtack__gmap__participants_c.prototype = new dtack_base2_c();

                                        // provide an explicit name for the base class
dtack__gmap__participants_c.prototype.base = dtack_base2_c.prototype;

										// override the constructor
dtack__gmap__participants_c.prototype.constructor = dtack__gmap__participants_c;

// -------------------------------------------------------------------------------
// constructor (functioning as a prototype, this constructor cannot take arguments)

function dtack__gmap__participants_c(page, map_selector, classname)
{
										// we are not doing a prototype construction?
  if (arguments.length > 0)
  {
	var F = "dtack__gmap__participants_c";

										/* call the base class constructor helper */
	dtack__gmap__participants_c.prototype.base.constructor.call(
	  this,
	  page.dtack_environment,
	  classname != undefined? classname: F);
  }
  
  this.page = page;
  
  this.map_selector = map_selector;
  
  this.map = null;
  
  this.participants = new Array();
   
  this.participant_count = 0;
  
  var that = this;
  page.attach_trigger(
    page.TRIGGER_EVENTS.WINDOW_RESIZED, 
    function() {that.handle_triggered_window_resize()});
  
} // end constructor


// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.handle_triggered_window_resize = function()
{
  var F = "handle_triggered_window_resize";
  
  if (this.map)
  {
    this.debug(F, "selector \"" + this.map_selector + "\" target div size is " + $(this.map_selector).width() + "x" + $(this.map_selector).height());
    this.map.updateSize();
  }
  else
  {
    this.debug(F, "handling triggered window resize, but no map");
  }
  
} // end method


// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.peek_map = function()
{
  return this.map;

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.add = function(participant)
{
  var F = "add";
                           
  this.add_participant_by_index(participant, this.participant_count++)

} // end method

// -------------------------------------------------------------------------------

dtack__gmap__participants_c.prototype.add_participant_by_index = function(participant, index)
{
  var F = "add_participant_by_index";
  
  this.participants[index] = participant;

} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.activate = function()
{
  var F = "activate";
  
  var that = this;
  
  var mapOptions = 
  {
  // should get from global_map_data.json.settings.map.view
    center: { lat: 39.70850737329455, lng: -104.82776641845703},
    zoom: 6
  };

  var target = $(this.map_selector).get(0);

  var osm_layer = new ol.layer.Tile({source: new ol.source.OSM()});
                
  var esri_sample_layer = new ol.layer.Tile(
    {
      source: new ol.source.TileArcGISRest(
        {
          url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer"
		}
	  ),
      opacity: .5  
    });
                
  var aurora_storm_mains_layer = new ol.layer.Tile(
    {
      source: new ol.source.TileArcGISRest(
        {
          url: "http://ags.auroragov.org/aurora/rest/services/AuroraStormCollector/MapServer",
          format: "json",
          layers: "show:7"
		}
	  ),
      opacity: .5  
    });
    

    var esrijsonFormat = new ol.format.EsriJSON();

    var vector_url = "http://ags.auroragov.org/aurora/rest/services/AuroraStormCollector/MapServer";
    var vector_url_layer = "7";
    
//    http://ags.auroragov.org/aurora/rest/services/AuroraStormCollector/MapServer/7/query
//    ?where=OBJECTID+LIKE+%27%25%27
//    &text=
//    &objectIds=
//    &time=
//    &geometry=
//    &geometryType=esriGeometryEnvelope
//    &inSR=
//    &spatialRel=esriSpatialRelIntersects
//    &relationParam=
//    &outFields=
//    &returnGeometry=true
//    &maxAllowableOffset=
//    &geometryPrecision=
//    &outSR=
//    &returnIdsOnly=false
//    &returnCountOnly=false
//    &orderByFields=
//    &groupByFieldsForStatistics=
//    &outStatistics=
//    &returnZ=false
//    &returnM=false
//    &gdbVersion=
//    &returnDistinctValues=false
//    &f=pjson
    
	var vector_source = new ol.source.Vector(
	{
      loader: function(extent, resolution, projection) 
      {
      	that.debug(F, "projection is " + ol.proj.get(projection).getCode() +
      	 " zoom is " + view.getZoom() +
      	 " resolution is " + resolution);
      	
        var url = vector_url + "/" + vector_url_layer + '/query/' +
          '?f=json' +
          '&where=OBJECTID+LIKE+%27%25%27' +
          "&outFields=OBJECTID" +
          '&returnGeometry=true' +
          '&spatialRel=esriSpatialRelIntersects' +
          '&geometry=' +
            encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
                extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
                ',"spatialReference":{"wkid":102100}}') +
          '&geometryType=esriGeometryEnvelope' +
          '&inSR=102100' +
          '&outFields=*' +
          '&outSR=102100' +
          "";
        $.ajax(
          {
      	    url: url, 
      	    dataType: 'jsonp', 
      	    success: function(response) 
      	    {
              if (response.error) 
              {
      	        that.debug(F, 
      	          response.error.message + "\n" +
                  response.error.details.join('\n'));
              } 
              else 
              {
                // dataProjection will be read from document
                var features = esrijsonFormat.readFeatures(response, 
                  {
                    featureProjection: projection
                  }
                );
                
                that.debug(F, "got " + features.length + " features " +
                  " from extent [" + extent[0] + ", " + extent[1] + ", " + extent[2] + ", " + extent[3] + "]");
//                var i = 0;
//                for(var k in features)
//                {
//                  var feature = features[k];
//                  feature.setStyle(vector_style);
//                  that.debug(F, "feature[" + k + "]" +
//                    " style is " + feature.getStyle() +
//                    " geometry is " + feature.getGeometryName());
//                  if (++i >= 10)
//                    break;
//				}
                if (features.length > 0) 
                {
                  vector_source.addFeatures(features);
                }
              }
    	    }
          }
        );
      },
      strategy: ol.loadingstrategy.bbox
	}
  );
  
  var vector_style = new ol.style.Style(
    {
      image: new ol.style.Icon(
        {
	    	src: "http://calibre.wd.permix.net/dtack_javascript/fugue_pngs/pipette.png"
  		}
  	  ),

      fill: new ol.style.Fill(
        {
          //color: 'rgba(168, 112, 0, 255)'
          color: 'rgba(255, 255, 255, 0)'
        }
      ),
      stroke: new ol.style.Stroke(
        {
          //color: 'rgba(110, 110, 110, 255)',
          color: 'rgba(255, 0, 0, 255)',
          width: 1
        }
      )
    });

  var vector_layer = new ol.layer.Vector(
    {
  	  source: vector_source,
  	  style: vector_style
//      style: function(feature, resolution) 
//      {
//      	return vector_style;
//  	  }
	}
  );

    
//  var layer = new ol.layer.Tile({
//    source: new ol.source.TileArcGISRest(
//     {
//      url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer",
//    }),
//    opacity: .5  
//  });
    
//  var layer = new OpenLayers.Layer.ArcGIS93Rest( 
//    "ArcGIS Server Layer",
//    "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/export", 
//    {layers: "show:0,2"});
    
    //"http://ags.auroragov.org/aurora/rest/services/AuroraStormCollector/MapServer"
                
//  var lat = 39.70850737329455;
//  var lon = -104.82776641845703;
  var lat = 39.68314127755169;
  var lon = -104.69059066474528;
  
  var zoom = 14;
  var view = new ol.View(
    {
      center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
      zoom: zoom
    }
  );

  this.map = new ol.Map(
    {
      target: target,
      renderer: 'canvas',
      layers: [
        osm_layer, 
        //esri_sample_layer, 
        //aurora_storm_mains_layer.
        vector_layer
      ],
      view: view
    }
  );
                         
  for(var k in this.participants)
  {
  	//this.participants[k].activate(this);
  }  

} // end method


// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.attach_participant_by_index = function(participant_index)
{
  var F = "attach_participant_by_index";
  
  if (this.participants[participant_index] !== undefined)
  {
    this.participants[participant_index].attach();
  }
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.detach = function(participant)
{
  var F = "detach";
                         
  for(var k in this.participants)
  {
  	this.participants[k].detach();
  }  

} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.show_participant_by_index = function(index)
{
  var F = "dtack__gmap__participants_c::show_participant_by_index";
  
  var participant = this.search(index);
  
  if (participant)
  {
    this.debug(F, "showing participant with index \"" + index + "\"");
    
    participant.show();
  }
  
} // end method

// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.hide_participant_by_index = function(index)
{
  var F = "dtack__gmap__participants_c::hide_participant_by_index";
  
  var participant = this.search(index);
  
  if (participant)
  {
    this.debug(F, "hiding participant with index \"" + index + "\"");
    
    participant.hide();
  }
  
} // end method


// -------------------------------------------------------------------------------
dtack__gmap__participants_c.prototype.search = function(index)
{
  var F = "dtack__gmap__participants_c::search";
  
  var participant = this.participants[index];

  if (!participant)
  {
  	this.debug(F, "cannot find participant with index \"" + index + "\"");
  }
    
  return participant;
  
} // end method

// -------------------------------------------------------------------------------


dtack__gmap__participants_c.prototype.save = function(options)
{
  var F = "save";
                         
  for(var k in this.participants)
  {
  	this.participants[k].save(options);
  }  

} // end method


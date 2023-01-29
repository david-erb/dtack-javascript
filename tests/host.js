
var host = {

  debug_verbose: 
  {                                            
  	harnesses__interaction_01__level1_interaction_c: "yes",
  	harnesses__interaction_01__level2_interaction_c: "yes",
  	dtack__interaction__cascading_json_autoid_select_c: "yes",
  	dtack__interaction__cascading_json_autoid_pair_c: "yes",
  	dtack__interaction__cascading_json_choicelist_base_c: "yes",
  	dtack__interaction__cascading_json_choicelist_pulldown_c: "yes",
  	dtack__interaction__cascading_json_choicelist_pulldowns_c: "yes",
  	dtack_page_base_c: "yes"
  },

  "debug": {
    "excluded_methods": 
    {
      "map_url_to_filename": "yes"
    }
  },
    
  "persist": {
  },
  
  "tasks": {
  },
  
  "websequence": {
  },
  
  "webproblem": {
  },
  
  "gui": {
  },
    
  "idlewatcher": {
  	"enabled": "no",  
  	"should_activate": "yes",
  	//"initial_container_mode": "hidden",
  	"initial_container_mode": "normal",
  	//"initial_container_mode": "minimized",
  	"should_reset_on_mousemove": "no",
  	"popup_seconds": 1200,
  	"logout_seconds": 120
  },

  "changewatcher": {
  	"enabled": "yes",
  	"mappings": {
  	  "http://localhost/iadot_shell": "c:/13/iadot/trunk/iadot_ecod_shell/shell",
  	  "http://localhost/iadot_portal": "c:/13/iadot/trunk/iadot_ecod_shell/portal_wap",
  	  "http://localhost/iadot_csw_satwap": "c:/13/iadot/trunk/iadot_ecod_shell/csw_satwap",
  	  "http://localhost/iadot_csw": "c:/13/iadot/trunk/iadot_ecod_shell/csw_wap",
  	  "http://localhost/iadot_ghpp": "c:/13/iadot/trunk/iadot_ecod_shell/ghpp_wap",
  	  "http://localhost/iadot_pepi": "c:/13/iadot/trunk/iadot_ecod_shell/pepi_wap",
  	  "http://localhost/13": "c:/13"
	}
  },
                                                                     
  "development": {
  	"debug_level": 1,
  	"confirm_post": "no",
  	"delay_activation_hide": 20
  }
  


};

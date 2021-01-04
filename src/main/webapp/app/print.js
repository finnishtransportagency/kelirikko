require([ 
    "dojo/_base/array",
    "dojo/_base/Color",
	"dojo/_base/config",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/io-query",
	"dojo/json",
	"dojo/on",
	"dojo/ready",
	"dojo/data/ItemFileReadStore",
	"dijit/registry",
	"esri/config",
	"esri/graphic",
	"esri/map",
	"esri/geometry/Extent",
	"esri/geometry/Polygon",
	"esri/dijit/InfoWindow",
	"esri/layers/ArcGISDynamicMapServiceLayer",
	"esri/layers/ImageParameters",
	"esri/layers/WMTSLayer",
	"esri/layers/WMTSLayerInfo",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol",
	"esri/tasks/IdentifyTask",
	"esri/tasks/IdentifyParameters",
	"esri/tasks/QueryTask",
	"esri/tasks/query",
	"put-selector/put",
	// no callbacks
	"dijit/form/CheckBox", 
	"dijit/form/ComboBox",
	"dijit/layout/AccordionContainer", 
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane", 
	"dijit/layout/TabContainer",
	"dojox/grid/DataGrid" 
], function(
	array,
	Color,
	config,
	lang,
	dom,
	domClass,
	ioQuery,
	JSON,
	on,
	ready,
	ItemFileReadStore,
	registry,
	esriConfig,
	esriGraphic,
	esriMap,
	esriExtent,
	esriPolygon,
	esriInfoWindow,
	esriArcGISDynamicMapServiceLayer,
	esriImageParameters,
	esriWMTSLayer,
	esriWMTSLayerInfo,
	esriSimpleFillSymbol,
	esriSimpleLineSymbol,
	esriIdentifyTask,
	esriIdentifyParameters,
	esriQueryTask,
	esriQuery,
	put
) {

	var app = config.app || {};
	var map = null;
	
	function init() {
	
		
		lang.mixin(app,ioQuery.queryToObject(location.search.substring(1)));
		
		if (app.LAYER_DEFINITIONS.match(/LISTA\=\'A\'/)) {
			put(dom.byId("headerA"),"!.dijitHidden");
			put(dom.byId("layersA"),"!.dijitHidden");
		}
		if (app.LAYER_DEFINITIONS.match(/LISTA\=\'C\'/)) {
			put(dom.byId("headerC"),"!.dijitHidden");
			put(dom.byId("layersC"),"!.dijitHidden");
		}
		if (app.LAYER_DEFINITIONS.match(/LISTA\=\'D\'/)) {
			put(dom.byId("headerD"),"!.dijitHidden");
			put(dom.byId("layersD"),"!.dijitHidden");
			
			var y = app.LAYER_DEFINITIONS.match(/VUOSI\=([0-9]+)/);
			put(dom.byId("headerDYear"), { innerHTML: y[1] });
			put(dom.byId("layersDYear"), { innerHTML: y[1] });	
		}
		
		initMap();
		initEvents();
		
	};
	
	function initMap() {
		
		esriConfig.defaults.io.proxyUrl = "proxy.jsp";
		esriConfig.defaults.io.alwaysUseProxy = true;
		esriConfig.defaults.io.corsDetection = false;
		
		var infoWindow = new esriInfoWindow({});
		
		infoWindow.setContent(registry.byId("infoTab").domNode);
		
		infoWindow.startup();
		
		map = new esriMap("map", {
			extent: new esriExtent(JSON.parse(app.EXTENT,true)),
			infoWindow: infoWindow,
			logo : false,
			showAttribution: false,
			slider: false
		});
		
		map.addLayers([
		    new esriWMTSLayer(app.WMTS_SERVICE_URL + app.WMTS_SERVICE_NAME, {
		    	id : "WMTS",
		    	serviceMode : "KVP",
		    	layerInfo : new esriWMTSLayerInfo({
		    		identifier : "liikennevirasto:PTP_Taustakartta",
		    		tileMatrixSet : "EPSG:3067_PTP_new",
		    		format : "png"
		    	}),
		    	visible: true
		    }),
		    new esriArcGISDynamicMapServiceLayer(app.AGS_SERVICE_URL + app.KELIRIKKO_SERVICE_NAME, {
				id: "DYNAMIC",
				imageParameters: lang.mixin(new esriImageParameters(), {
					transparent: true,
					layerIds: [ 0 ],
					layerDefinitions: [ app.LAYER_DEFINITIONS ],
					outfields: app.OUT_FIELDS
				}),
				visible: true
			})
		]);
		
		map.getLayer("WMTS").on("load", function(evt) {
			evt.target.UrlTemplate = "proxy.jsp?" + evt.layer.UrlTemplate;
		});
		
	};
		
	function initEvents() {
		
		
		map.on("click", onMapClick);
		map.on("extent-change", onMapExtentChange);
		map.on("mouse-wheel", onMapMouseWheel);
		
		

	};
	
	function onMapClick(evt) {
		var identifyTask = new esriIdentifyTask(app.AGS_SERVICE_URL + app.KELIRIKKO_SERVICE_NAME);
		
		var identifyParameters = lang.mixin(new esriIdentifyParameters(), {
			geometry: evt.mapPoint,
			mapExtent: map.extent,
			tolerance: 3,
			returnGeometry: true,
			layerIds: [ 0 ],
			layerOption: esriIdentifyParameters.LAYER_OPTION_ALL,
			width: map.width,
			height: map.height
		});
		
		identifyTask.execute(identifyParameters, function(results) {
			map.graphics.clear();
			map.infoWindow.hide();
			
			var content = put("div");
			
			if (results.length != 0) {

				var table = put(content, "table#identifytable");
				
				var body = put(table, "tbody");
			
				var text = [ "Tie", "Tienimi", "Kunta", "Pituus", "Alkaa", "P&auml;&auml;ttyy", "Raj.(t)", "Paikan kuvaus", "Lis&auml;tietoja", "P&auml;ivitetty" ];
				array.forEach(results, function(item, index) {
					
					// Only first is displayed so...
					if (index == 0) {
						
						array.forEach([
						    "TIE",
						    "TIENIMI",
						    "KUNTA",
						    "PITUUS_TEKSTI",
						    "ALKAA",
						    "LOPPUU",
						    "PAINORAJOITUS_TEKSTI",
						    "PAIKAN_KUVAUS",
						    "LISATIETOJA",
						    "TALLENNUSAIKA"
						], function(key, index) {
				
							var bodyrow = put(body, "tr");
						
							var value = item.feature.attributes[key] || "";
					
							put(bodyrow, "th", {
								innerHTML: text[index] 
							});
						
							put(bodyrow, "td", {
								innerHTML: value != "Null" ? value : ""
							});
						
						});
						
						map.infoWindow.setTitle(item.feature.attributes["TIENIMI"]);
						
					}
					
				});
				
				map.infoWindow.resize(250, 250);
				//map.infoWindow.setTitle("Kelirikko - Tulokset");
				map.infoWindow.setContent(content);
				map.infoWindow.show(evt.mapPoint);
				
			}	
				
		});
		
	};
	
	function onMapExtentChange(evt) {
		
		var layer = map.getLayer("DYNAMIC");

		if (layer.visible && layer.layerDefinitions && layer.layerDefinitions[0]) {
			
			var queryTask = new esriQueryTask(app.AGS_SERVICE_URL + app.KELIRIKKO_SERVICE_NAME +"/0");

			var query = lang.mixin(new esriQuery(), {
				geometry: evt.extent,
				returnGeometry: false,
				where: layer.layerDefinitions[0],
				outFields: app.OUT_FIELDS,
				spatialRelationship: esriQuery.SPATIAL_REL_INTERSECTS
			});

			queryTask.execute(query, function(featureset) {
		
				var table = dom.byId("featurestable");
				
				if (table) {
					put(table,"!");	
				}
				
				var features = featureset.features;
				
				if (features.length != 0) {

					table = put(dom.byId("features"),"table#featurestable");
					
					headrow = put(table, "thead tr");
					
					array.forEach([ 
				        "Tienimi",
				        "Kunta",
				        "Km",
				        "Alkaa",
				        "P&auml;&auml;ttyy",
				        "Raj.(t)",
				        "Vuosi",
				        "Symboli"
				    ], function(item, index) {
				
						put(headrow, "th", {
							innerHTML: item
						});
					
					});
				
					var body = put(table, "tbody");
				
					array.forEach(features, function(feature, index) {
						
						var rowclass = index % 2 == 0 ? "even" : "odd";
						
						var bodyrow = put(body, "tr." + rowclass);
						
						array.forEach([
					        "TIENIMI",
					        "KUNTA",
					        "PITUUS_TEKSTI",
					        "ALKAA",
					        "LOPPUU",
					        "PAINORAJOITUS",
					        "VUOSI",
					        "LISTA"
					    ], function(key, index) {
						
							var value = feature.attributes[key] || "";
							
							if (key == "LISTA") {
								
								var image = "";
								
								if (value === "A") {
									image = "app/resources/images/uhanalaiset.png";	
								}
								if (value === "C") {
									image = "app/resources/images/voimassa.png";
								}
								if (value === "D") {
									image = "app/resources/images/olleet.png";
								}
								
								put(bodyrow, "td img", {
									src: image
								});
								
								
							} else if (key == "KUNTA") {
								
								var rowcol = put(bodyrow, "td div");
								
								if (value.indexOf(",") != -1) {
									
									var parts = value.split(",");
									
									array.forEach(parts, function(part,index) {
										
										var comma = index != parts.length - 1 ? "," : "";
										
										put(rowcol, "div", {
											innerHTML: part + comma
										});
									
									});
									
								} else {
									
									put(rowcol, {
										innerHTML: value
									});
								
								}
								
							} else {
								
								put(bodyrow, "td div", {
									innerHTML: value
								});
								
							}
							
						});
					});
					
				} else {
					put(content, "p",{
						innerHTML: "Ei kohteita"
					});
				}

			});
			
		}
	};
	
	function onMapMouseWheel(evt) {
		map.infoWindow.hide();
	};
	
	function onMapInfoWindowShow() {
		registry.byId("infoTab").resize();
	};
	
	function onMapInfoWindowHide() {
		map.graphics.clear();
	};
	
	ready(init);

});
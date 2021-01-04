require([ 
    "dojo/_base/array",
    "dojo/_base/Color",
	"dojo/_base/config",
	"dojo/_base/lang",
	"dojo/aspect",
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
	"esri/request",
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
	aspect,
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
	esriRequest,
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
	var overview = null;
	
	function init() {
	
		initMap();
		initOverview();
		initEvents();
		
		updateLayerDefinitions();
		
	};
	
	function initMap() {
		esriConfig.defaults.io.proxyUrl = "proxy.jsp";
		esriConfig.defaults.io.alwaysUseProxy = true;
		esriConfig.defaults.io.corsDetection = false;
				
		var infoWindow = new esriInfoWindow({});
		
		infoWindow.setContent(registry.byId("infoTab").domNode);
		
		infoWindow.startup();
		
		map = new esriMap("map", {
			extent: new esriExtent({
				xmin: 50199.48138252203,
				ymin: 6574635.60369497,
				xmax: 761274.624721668,
				ymax: 7795411.870622758,
				spatialReference: {
					wkid: 3067
				}
			}),
			infoWindow: infoWindow,
			logo : false,
			showAttribution: false,
			slider: true,
			sliderStyle: "large"
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
					layerIds: [],
					layerDefinitions: [],
					outfields: app.OUT_FIELDS
				}),
				visible: true
			})
		]);
		
		map.getLayer("WMTS").on("load", function(evt) {
			evt.target.UrlTemplate = "proxy.jsp?" + evt.layer.UrlTemplate;
		});
	};
	
	function initOverview() {
		
		overview = new esriMap("mapOVDiv", {
			extent: new esriExtent({
				xmin: 90000, 
				ymin: 6600000, 
				xmax: 790000,
				ymax: 7800000, 
				spatialReference: {
					wkid : 3067
				}
			}),
			logo : false
		});
		
		overview.addLayer(new esriArcGISDynamicMapServiceLayer(app.AGS_SERVICE_URL + app.OV_SERVICE_NAME));

	};
	
	function initEvents() {
		
		map.on("mouse-wheel", onMapMouseWheel);
		map.on("extent-change", onMapExtentChange);
		map.on("click", onMapClick);
				
		map.infoWindow.on("show", onMapInfoWindowShow);
		map.infoWindow.on("hide", onMapInfoWindowHide);
		
		overview.on("load", onOverviewLoad);
		overview.on("click", onOverviewClick);
		on(dom.byId("mapOVHideDiv"), "click", onOverviewToggle);
			
		registry.byId("grid").on("RowDblClick", onGridRowDblClick);
		
		registry.byId("weightLimitAll").on("change",onUserSelect);
		registry.byId("weightLimitCurrent").on("change", onUserSelect);
		registry.byId("weightLimitPrevious").on("change", onUserSelect);
		registry.byId("weightLimitPreviousYear").on("change", onUserSelect);
		
		registry.byId("ohje").on("click", onOhjeClick);
		
		registry.byId("tulosta").on("click", onTulostaClick);
	
	}
	
	function onMapMouseWheel(evt) {
		map.infoWindow.hide();
	};
	
	function onMapExtentChange(evt) {
		
		updateOverview(evt.extent);
				
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
		
				var km = 0;
				var features = array.map(featureset.features, function(feature) {
					km = km + Number(feature.attributes['PITUUS']);
					return feature.attributes;
				});

				updateFeatures(features,km);
				
			});
			
		} else {
			
			updateFeatures([],0);
			
		}
	};
	
	function onMapInfoWindowShow() {
		
		registry.byId("infoTab").resize();
		
	};
	
	function onMapInfoWindowHide() {

		map.graphics.clear();
		registry.byId("grid").selection.clear();

	};
	
	function onMapClick(evt) {
		
		var identifyTask = new esriIdentifyTask(app.AGS_SERVICE_URL + app.KELIRIKKO_SERVICE_NAME);
		
		var identifyParameters = lang.mixin(new esriIdentifyParameters(), {
			geometry: evt.mapPoint,
			mapExtent: map.extent,
			tolerance: 13,
			returnGeometry: true,
			layerIds: [ 0 ],
			layerOption: esriIdentifyParameters.LAYER_OPTION_ALL,
			width: map.width,
			height: map.height	
		});
		
		identifyTask.execute(identifyParameters, function(results) {
			
			var featuresAll = identifyTaskResultFilter(results, "weightLimitAll");
			var featuresCurrent = identifyTaskResultFilter(results, "weightLimitCurrent");
			var featuresPrevious = identifyTaskResultFilter(results, "weightLimitPrevious", registry.byId("weightLimitPreviousYear").get("value"));
			
			map.infoWindow.resize(570, 250);
			map.infoWindow.setTitle("Kelirikko - Tulokset");
			map.infoWindow.show(evt.mapPoint);
			
			identifyTaskResultTable(featuresAll, "infoTabAll");
			identifyTaskResultTable(featuresCurrent, "infoTabCurrent");
			identifyTaskResultTable(featuresPrevious, "infoTabPrevious");
			
			var widget = registry.byId("infoTab");	
			
			if (featuresAll.length != 0) {
				widget.selectChild("infoTabAll");
			} else {
				if (featuresCurrent.length != 0) {
					widget.selectChild("infoTabCurrent");
				} else {
					if (featuresPrevious.length != 0) {
						widget.selectChild("infoTabPrevious");
					} else {
						widget.selectChild("infoTabAll");
					}
				}
			}
					
		});
		
	};

	function onOverviewLoad() {
		overview.disableMapNavigation();
		overview.hideZoomSlider();
		updateOverview(map.extent);
	};
	
	function onOverviewClick(evt) {
		map.centerAt(evt.mapPoint);
	};
	
	function onOverviewToggle(evt) {
		domClass.toggle(dom.byId("mapOVDiv"), "dijitHidden");
	};
	
	function onGridRowDblClick(evt) {
		var queryTask = new esriQueryTask(app.AGS_SERVICE_URL + app.KELIRIKKO_SERVICE_NAME +"/0");
			
		var query = lang.mixin(new esriQuery(), {
			returnGeometry: true,
			where: "OBJECTID=" + this.getItem(evt.rowIndex).OBJECTID,
			outFields: app.OUT_FIELDS
		});

		queryTask.execute(query, function(featureset) {
			map.infoWindow.hide();
			map.setExtent(featureset.features[0].geometry.getExtent().expand(2));
		});		
	};
	
	function onUserSelect() {
		updateLayerDefinitions();
	};
	
	function onOhjeClick(evt) {
		window.open("ohje/ohje.html");
	};
	
	function onTulostaClick(evt) {
		
		var extent = map.extent.getExtent().toJson();
		
		for (var key in extent) {
			if (key != "spatialReference") {
				extent[key] = Math.round(extent[key]);
			}
		}
		
		var object = {
			EXTENT: JSON.stringify(extent),
			LAYER_DEFINITIONS: updateLayerDefinitionsValues().join(" OR ")
		};
		
		window.open("print.jsp?" + ioQuery.objectToQuery(object));

		
	};
	
	function updateOverview(extent) {
		
		if (overview != null && overview.graphics != null) {
			
			var polygon = new esriPolygon({
				rings: [
				  	[
				  	 	[ extent.xmin, extent.ymin ],
				  	 	[ extent.xmin, extent.ymax ],
				  	 	[ extent.xmax, extent.ymax ],
				  	 	[ extent.xmax, extent.ymin ],
				  	 	[ extent.xmin, extent.ymin ]
				  	 ]
				],
				spatialReference: {
					wkid: 3067
				}
			});
		
			var symbol = new esriSimpleFillSymbol(
				esriSimpleFillSymbol.STYLE_SOLID, 
				new esriSimpleLineSymbol(
					esriSimpleLineSymbol.STYLE_SOLID, 
					new Color([ 255, 0, 0, 0.5 ]),
					3.0
				),
				new Color([ 255, 0, 0, 0.1 ])
			);

			var graphic = new esriGraphic(polygon, symbol);
			
			overview.graphics.clear();
			overview.graphics.add(graphic);

		}
			
	};
	
	function updateLayerDefinitionsValues() {
		
		var vals = [];
		
		var valueAll = registry.byId("weightLimitAll").get("value");
		
		if (valueAll) {
			vals.push(valueAll);
		}
		
		var valueCurrent = registry.byId("weightLimitCurrent").get("value");
		
		if (valueCurrent) {
			vals.push(valueCurrent);
		}
		
		var valuePrevious = registry.byId("weightLimitPrevious").get("value");
		
		if (valuePrevious) {
			
			var valuePreviousYear = registry.byId("weightLimitPreviousYear").get("value");
			vals.push("(" + valuePrevious + " AND " + "VUOSI=" + valuePreviousYear + ")");
			
		}
		
		return vals;
	};
	
	function updateLayerDefinitions() {
		
		var vals = updateLayerDefinitionsValues();
		
		var layer = map.getLayer("DYNAMIC");
		
		if (vals.length != 0) {
			
			var visibleLayers = [ 0 ];
			var layerDefinitions = [];
			layerDefinitions[0] = vals.join(" OR ");
			layer.setLayerDefinitions(layerDefinitions);
			layer.setVisibleLayers(visibleLayers);
			layer.setVisibility(true);
			
		} else {
			
			layer.setVisibility(false);
			
		}
		
		map.setExtent(map.extent);
		
	};
		
	function updateFeatures(features,km) {

		dom.byId("kmlista").innerHTML = "N&auml;kyv&auml;n kartan alueella on kohteita ("
			+ features.length
			+ " kpl, yht. "
			+ roundNumber(km / 1000, 1) + " km)";
		
		registry.byId("grid").setStore(new ItemFileReadStore({
			data : {
				identifier : "OBJECTID",
				items : features
			}
		}));
	};
	
	function roundNumber(num, dec) {
		
		return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
		
	};
	
	function identifyTaskResultFilter(results, widgetName, year) {
		
		var widget = registry.byId(widgetName);
		var value = widget.get("value");
		
		if (value) {
			
			var id = value.slice(value.indexOf("'") + 1,value.lastIndexOf("'"));
			
			return array.filter(results, function(item) {
				if (year) {
					return item.feature.attributes.LISTA == id && item.feature.attributes.VUOSI == year;
				} else {
					return item.feature.attributes.LISTA == id;
				}
			});
			
		}
		
		return [];
	};
	
	function identifyTaskResultTable(results, widgetName) {
		
		var content = put("div");
		
		if (results.length != 0) {

			put(content, "p",{
				innerHTML: "Kohteita: " + results.length
			});
			var table = put(content, "table#identifytable");
			var headrow = put(table, "thead tr");
		
			array.forEach([ 
		        "ID",
		        "Tien nimi",
		        "Tie",
		        "Kunta",
		        "Pituus",
		        "Alkaa",
		        "P&auml;&auml;ttyy",
		        "Painorajoitus",
		        "Paikan kuvaus",
		        "Lis&auml;tietoja",
		        "P&auml;ivitetty" 
		    ], function(item, index) {
		
				put(headrow, "th", {
					innerHTML: item
				});
			
			});
		
			var body = put(table, "tbody");
		
			array.forEach(results, function(item, index) {

				var bodyrow = put(body, "tr");
			
				array.forEach([
			        "OBJECTID",
			        "TIENIMI",
			        "TIE",
			        "KUNTA",
			        "PITUUS_TEKSTI",
			        "ALKAA",
			        "LOPPUU",
			        "PAINORAJOITUS_TEKSTI",
			        "PAIKAN_KUVAUS",
			        "LISATIETOJA",
			        "TALLENNUSAIKA"
			    ], function(key, index) {
				
					var value = item.feature.attributes[key];
				
					if (key != "OBJECTID") {
					
						put(bodyrow, "td", {
							innerHTML: value != "Null" ? value : ""
						});
						
					} else {		
						
						var bodycol = put(bodyrow, "td");
						
						put(bodycol, "div", {
							innerHTML: value
						});
						put(bodycol, "a", {
							href: "#",
							innerHTML: "(korosta)",
							onclick: function(evt) {
								showFeature(evt, item.feature);
							}
						});
						
					}
				});
			});
			
		} else {
			put(content, "p",{
				innerHTML: "Ei kohteita"
			});
		}
		
		registry.byId(widgetName).setContent(content);
	};
	
	function showFeature(evt, feature) {	
		
		var graphic = map.graphics.graphics[0];
		var grid = registry.byId("grid");
		map.graphics.clear();
		grid.selection.clear();
		
		if (graphic != feature) {
		
			feature.setSymbol(new esriSimpleLineSymbol("SOLID", new Color([ 255, 0, 255 ]), 5));
			map.graphics.add(feature);
			
			for ( var i = 0; i < grid.rowCount; i++) {
				
				var gridItem = grid.getItem(i);
				
				if (gridItem && parseInt(gridItem.OBJECTID[0]) === parseInt(feature.attributes["OBJECTID"])) {
					grid.rows.setOverRow(i);
					grid.scrollToRow(i);
					grid.selection.setSelected(gridItem, true);
					break;
				}
			}
		}
	};
	
	ready(init);

});
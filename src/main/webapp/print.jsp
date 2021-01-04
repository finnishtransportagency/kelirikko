<!DOCTYPE html>
<%@page import="fi.liikennevirasto.kelirikko.KelirikkoProperties"%>
<%@page import="fi.liikennevirasto.kelirikko.KelirikkoCache"%>
<%@page import="fi.liikennevirasto.kelirikko.KelirikkoProperties.Arvo"%>
<html>
	<head>
    	<meta charset="utf-8">
    	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=7, IE=9, IE=10">
    	<title>Kelirikko</title>
    	<link rel="stylesheet" href="app/resources/print.css">
    	<script>
    		dojoConfig={
    	   		async: true,
        		cacheBust: true,
        		parseOnLoad: true,
        		tlmSiblingOfDojo: true,
        		app: {
        			WMTS_SERVICE_URL: "<%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.WMTS_SERVICE_URL)%>",
        			AGS_SERVICE_URL: "<%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.AGS_SERVICE_URL)%>",
        			WMTS_SERVICE_NAME: "<%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.WMTS_SERVICE_NAME)%>",
        			KELIRIKKO_SERVICE_NAME: "<%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.KELIRIKKO_SERVICE_NAME)%>",
        			OV_SERVICE_NAME: "<%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.OV_SERVICE_NAME)%>",
        			OUT_FIELDS: <%=KelirikkoCache.getInstance().getKelirikkoProperties().getProp(KelirikkoProperties.Arvo.OUT_FIELDS)%>
    			}
    		};
    	</script>
    	<script src="./arcgis_js_v38_api/init.js"></script>
    	<!--   <script src="//js.arcgis.com/3.6/js/dojo/dojo/dojo.js"></script>  -->
    	<script src="app/print.js"></script>
	</head>
	<body class="tundra">
		<div id="header" data-dojo-type="dijit.layout.ContentPane">
			<img align="left" src="app/resources/images/logo-vayla.png"/>
			<div>
				<p><span class="dijitHidden" id="headerA">Painorajoitusuhanalaiset tiet</span></p>
				<p><span class="dijitHidden" id="headerC">Voimassa olevat painorajoitukset</span></p>
				<p><span class="dijitHidden" id="headerD">Voimassa olleet painorajoitukset vuonna <span id="headerDYear"></span></span></p>
			</div>
		</div>
		<hr/>
		<div id="map" data-dojo-type="dijit.layout.ContentPane">
		</div>
		<hr/>
		<div id="layers" data-dojo-type="dijit.layout.ContentPane">
			<p class="dijitHidden" id="layersA">	
				<img src="app/resources/images/uhanalaiset.png"/>
				<label>Painorajoitusuhanalaiset tiet</label>
			</p>
			<p class="dijitHidden" id="layersC">			
				<img src="app/resources/images/voimassa.png"/>
				<label>Voimassa olevat painorajoitukset</label>
			</p>
			<p class="dijitHidden" id="layersD">			
				<img src="app/resources/images/olleet.png"/>
				<label>Voimassa olleet painorajoitukset vuonna <span id="layersDYear"></span></label>
			</p>		
        </div>
        <hr/>
		<div id="features" data-dojo-type="dijit.layout.ContentPane">
			
       </div>
			
		<!-- info window tabs -->
		<div id="infoTab" data-dojo-type="dijit.layout.TabContainer" style="width:550px;height:200px;">
			<div id="infoTabAll" data-dojo-type="dijit.layout.ContentPane" title="Uhanalaiset"></div>
			<div id="infoTabCurrent" data-dojo-type="dijit.layout.ContentPane" title="Voimassa olevat"></div>
			<div id="infoTabPrevious" data-dojo-type="dijit.layout.ContentPane" title="Voimassa olleet"></div>
		</div>
		
	</body>
</html>
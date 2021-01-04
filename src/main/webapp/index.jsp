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
    	<link rel="stylesheet" href="app/resources/main.css">
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
    	<script src="app/main.js"></script>
	</head>
	<body class="nihilo">
		<div id="container" data-dojo-type="dijit.layout.BorderContainer" data-dojo-props="gutters:'true'">
			<div id="header" data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region: 'top'">
				<table style="height:40px; width:100%;">
					<tbody>
						<tr>
							<td>
								<img  border="0" align="left" src="app/resources/images/logo-vayla.png"/>
							</td>
							<td>
								<span>Kelirikkopalvelu</span>
							</td>
							<td width="40px">
								<button id="tulosta" data-dojo-type="dijit.form.Button" type="button" title="Tulosta">Tulosta</button>
							</td>
							<td width="40px">
								<button id="ohje" data-dojo-type="dijit.form.Button" type="button" style="padding-right:10px;" title="Avaa ohjesivun">Ohje</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="leftPane" data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region: 'leading', splitter: true">
	     		<div data-dojo-type="dijit.layout.AccordionContainer">
					<div id="weightPane" data-dojo-type="dijit.layout.ContentPane" title="Painorajoitukset kartalla">
						<span id="layer_list">
							<br/>
							<input id="weightLimitAll" name="weightLimitAll" data-dojo-type="dijit.form.CheckBox" value="LISTA='A'"/>
		        			<img src="app/resources/images/uhanalaiset.png"/>
							<label for="weightLimitAll">Painorajoitusuhanalaiset tiet</label>
							<img src="app/resources/images/help_small.gif" title="Painorajoitusuhan alaiset tiet. N&auml;ille teille joudutaan todenn&auml;k&ouml;isesti asettamaan painorajoituksia kev&auml;&auml;ll&auml;. Asiaan vaikuttaa kev&auml;&auml;n s&auml;&auml;olosuhteiden kehitys. On kuitenkin mahdollista, ett&auml; painorajoituksia asetetaan muillekin teille."/>
	        				<br/>
	        				<br/>
	        			</span>
	        			<hr/>
		        		<span id="layer_list">
		        			<br/>
							<input id="weightLimitCurrent" name="weightLimitCurrent" data-dojo-type="dijit.form.CheckBox" value="LISTA='C'" checked />
							<img src="app/resources/images/voimassa.png"/>
							<label for="weightLimitCurrent">Voimassa olevat painorajoitukset</label>
							<img src="app/resources/images/help_small.gif" title="Voimassa olevat painorajoitukset"/>
							<br/>
							<br/>
						</span>
						<hr/>
						<span id="layer_list">
							<br/>
							<input id="weightLimitPrevious" name="weightLimitPrevious" data-dojo-type="dijit.form.CheckBox" value="LISTA='D'"/>
							<img src="app/resources/images/olleet.png"/>
							<label for="weightLimitPrevious">Voimassa olleet painorajoitukset vuonna</label>
							<select id="weightLimitPreviousYear" name="weightLimitPreviousYear" data-dojo-type="dijit.form.ComboBox" style="width:80px;">
								<option selected="selected">2020</option>
								<option>2019</option>
								<option>2018</option>
								<option>2017</option>
								<option>2016</option>
								<option>2015</option>
								<option>2014</option>
								<option>2013</option>
	        	        		<option>2012</option>
	            	    		<option>2011</option>
	                			<option>2010</option>
								<option>2009</option>
								<option>2008</option>
								<option>2007</option>
								<option>2006</option>
								<option>2005</option>
								<option>2004</option>
								<option>2003</option>
								<option>2002</option>
								<option>2001</option>
								<option>2000</option>
								<option>1999</option>
								<option>1998</option>
								<option>1997</option>
							</select>
							<img src="app/resources/images/help_small.gif" title="Voimassa olleet painorajoitukset. N&auml;ill&auml; teill&auml; on ollut painorajoitus kev&auml;&auml;n tai syksyn kelirikon vuoksi."/>
						</span>
		        		<br/>
		        		<br/>
		        		<br/>
	    	    		<span id="kmlista"></span>
	        			<br/>	
						<br/>			
					</div>
		     		<div id="painoPane" data-dojo-type="dijit.layout.ContentPane" title="Painorajoitukset listana">
	    	 			<script type="text/javascript">
	     					function makeListaButton(item) {
	     						var zBtn1;
	     						if (item === 'A') {
	     							zBtn1 = "<div data-dojo-type='dijit.form.Button'><img src='app/resources/images/uhanalaiset.png'";
	     						}
		     					if (item === 'C') {
		     						zBtn1 = "<div data-dojo-type='dijit.form.Button'><img src='app/resources/images/voimassa.png'";
	    	 					}
	     						if (item === 'D') {
	     							zBtn1 = "<div data-dojo-type='dijit.form.Button'><img src='app/resources/images/olleet.png'";
	     						}
	     						zBtn1 = zBtn1 + " width='20' height='10'";
	     						zBtn1 = zBtn1 + " ></div>";
		     					return zBtn1;
		     				}
						</script>
	    				<table id="grid" data-dojo-type="dojox.grid.DataGrid" data-dojo-props="selected:true, selectionMode:'extended', autoWidth:true" style="height: 100%;">
	         				<thead>
	         					<tr>
	         						<th field="TIENIMI" >Tienimi</th>
	         						<th field="TIE" >Tie</th>
	         						<th field="KUNTA" >Kunta</th>
		         					<th field="PITUUS_TEKSTI" >Km</th>
		         					<th field="ALKAA" >Alkaa</th>
	    	     					<th field="LOPPUU" >P&auml;&auml;ttyy</th>
									<th field="PAINORAJOITUS_TEKSTI" >Raj.(t)</th>
									<th field="VUOSI" >Vuosi</th>
									<th field="LISTA" formatter="makeListaButton">Symboli</th>  
								</tr>	
							</thead>
						</table>
					</div>
					<div id="linkkiPane" data-dojo-type="dijit.layout.ContentPane" title="Lis&auml;tietolinkit">
						<table>
							<tbody>
								<tr>
									<td>&nbsp;&nbsp;</td>
									<td>
										<a target="_blank" href="https://extranet.vayla.fi/katselu/katselu?katselutyyppi=A">Painorajoitusuhan alaiset tiet</a> (taulukko)
										<br/>
										<br/>
										<a target="_blank" href="https://extranet.vayla.fi/katselu/katselu?katselutyyppi=C">Kelirikosta johtuvat painorajoitukset</a> (taulukko)
										<br/>
										<br/>
										<a target="_blank" href="https://vayla.fi/tieverkko/kunnossapito/painorajoitukset#.XJ35AS1Dy1s">Lis&auml;&auml; tietoa kelirikosta ja painorajoituksista</a>
										<br/>
										<br/>
										<a target="_blank" href="https://liikennetilanne.tmfg.fi/?view=&checkedLayers=3">Liikennetilanne</a>
										<br/>
										<br/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div id="map" class="shadow" data-dojo-type="dijit.layout.ContentPane" data-dojo-props="region:'center', liveSplitters:false" style="border:solid thin silver;">
			<!-- 
				<span id="status" style="position: absolute; z-index: 999; right:5px; top:5px; background-color: black; color: white; padding: 3px; font-size: small; font-family: Arial Unicode MS,Arial,sans-serif; border: solid 1px white;">
	        		Kartta latautuu...
	      		</span>
	      		-->	
	      		
	      		<div id="mapOVDiv" style="position: absolute; z-index: 200; right:5px; bottom:5px; height:200px; width:120px; background-color: white; color: black; padding: 3px; border: solid 1px black;"></div>
	        	<div id="mapOVHideDiv" style="position: absolute; z-index: 300; right:3px; bottom:3px; height:20px; width:20px;" title="N&auml;yt&auml;/piilota yleissilm&auml;yskartta">
					<img src="app/resources/images/minmax_oa.bmp" style="z-index: 400;"/>
	        	</div>
	        	 
	        	<div id="copyright" style="position: absolute; z-index: 150; right: 150px; bottom: 15px">
					<h6 style="font-family:Verdana">&copy; Karttakeskus L4356, Maanmittauslaitos lupa nro 20/MML/13</h6>
				</div>
			</div>	 
		</div>
			
		<!-- info window tabs -->
		<div id="infoTab" data-dojo-type="dijit.layout.TabContainer" style="width:550px;height:200px;">
			<div id="infoTabAll" data-dojo-type="dijit.layout.ContentPane" title="Uhanalaiset"></div>
			<div id="infoTabCurrent" data-dojo-type="dijit.layout.ContentPane" title="Voimassa olevat"></div>
			<div id="infoTabPrevious" data-dojo-type="dijit.layout.ContentPane" title="Voimassa olleet"></div>
		</div>
		
	</body>
</html>
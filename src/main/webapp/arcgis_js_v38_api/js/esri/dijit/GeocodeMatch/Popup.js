/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
require({cache:{"url:esri/dijit/GeocodeMatch/templates/Popup.html":"\x3cdiv\x3e\n\x3cp data-dojo-attach-point\x3d'_addressTag'\x3e\x3c/p\x3e\n\x3cdiv data-dojo-attach-point\x3d'_matchButton' data-dojo-type\x3d\"dijit.form.Button\"\x3e${i18n.popup.matchButtonLabel}\x3c/div\x3e\n\x3cdiv data-dojo-attach-point\x3d'_discardButton' data-dojo-type\x3d\"dijit.form.Button\"\x3e${i18n.popup.discardButtonLabel}\x3c/div\x3e\n\x3c/div\x3e"}});
define("esri/dijit/GeocodeMatch/Popup","require dojo/_base/declare dojo/_base/lang dojo/Evented dojo/on dojo/uacss dijit/form/Button dijit/_WidgetBase dijit/_TemplatedMixin esri/kernel dojo/text!esri/dijit/GeocodeMatch/templates/Popup.html dojo/i18n!esri/dijit/GeocodeMatch/nls/master".split(" "),function(b,f,c,g,d,h,e,k,l,m,n,p){b.toUrl("esri/dijit");b=f([k,l,g],{templateString:n,i18n:p,constructor:function(a,b){a.rowData&&(this._graphicID=a.graphic.attributes.id,a.rowData.address&&(this._address=
a.rowData.address))},postCreate:function(){this.inherited(arguments);this._address&&(this._addressTag.innerHTML=this._address);this._matchButtonRef=new e({label:this.i18n.popup.matchButtonLabel,iconClass:"dijitEditorIcon dijitEditorIconSave"},this._matchButton);this._discardButtonRef=new e({label:this.i18n.popup.discardButtonLabel,iconClass:"dijitEditorIcon dijitEditorIconDelete"},this._discardButton);this._listenerHandles=[d(this._matchButtonRef,"click",c.hitch(this,function(){this.graphic.attributes.type==
this.i18n.customLabel?this.geocodeMatch._matchCustomFeature(this.graphic):this.geocodeMatch._matchFeature(this.graphic.attributes.id);this.map.infoWindow.hide()})),d(this._discardButtonRef,"click",c.hitch(this,function(){this.map._layers[this.graphicsLayer.id].remove(this.graphic);this.map.infoWindow.hide()}))];!0===this.graphic.attributes.matched?(this._discardButtonRef.destroy(),this._matchButtonRef.destroy()):!1===this.graphic.attributes.matched&&this._address&&this._discardButtonRef.destroy()},
startup:function(){this.inherited(arguments)},destroy:function(){this.inherited(arguments);this._listenerHandles.forEach(function(a){a.remove()})}});h("extend-esri")&&c.setObject("dijit.GeocodeMatchPopup",b,m);return b});
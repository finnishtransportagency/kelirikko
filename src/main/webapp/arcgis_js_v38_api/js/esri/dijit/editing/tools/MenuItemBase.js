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
define("esri/dijit/editing/tools/MenuItemBase","dojo/_base/declare dojo/_base/lang dojo/has dijit/MenuItem esri/dijit/editing/tools/ToolBase esri/kernel".split(" "),function(a,d,e,b,c,f){a=a([b,c],{declaredClass:"esri.dijit.editing.tools.MenuItemBase",destroy:function(){b.prototype.destroy.apply(this,arguments);c.prototype.destroy.apply(this,arguments)}});e("extend-esri")&&d.setObject("dijit.editing.tools.MenuItemBase",a,f);return a});
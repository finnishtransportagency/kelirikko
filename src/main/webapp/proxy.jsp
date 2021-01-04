<%@page import="fi.liikennevirasto.kelirikko.KelirikkoProperties"%>
<%@page import="fi.liikennevirasto.kelirikko.KelirikkoProperties.Arvo"%>
<%@page import="fi.liikennevirasto.kelirikko.KelirikkoCache"%>
<%@page session="false"%>
<%@page import="java.net.*,java.io.*"%>

<%
	KelirikkoProperties prop = KelirikkoCache.getInstance()
		.getKelirikkoProperties();

	String[] serverUrls = {
			prop.getProp(Arvo.WMTS_SERVICE_URL),
			prop.getProp(Arvo.AGS_SERVICE_URL)
	};
	try {
		String reqUrl = request.getQueryString();
		boolean allowed = false;
		String token = null;
		for (String surl : serverUrls) {
			String[] stokens = surl.split("\\s*,\\s*");
			if (reqUrl.toLowerCase().startsWith(
					stokens[0].toLowerCase())) {
				allowed = true;
				if (stokens.length >= 2 && stokens[1].length() > 0)
					token = stokens[1];
				break;
			}
		}
		if (!allowed) {
			response.setStatus(403);
			return;
		}
		
		if(reqUrl.toLowerCase().startsWith(prop.getProp(Arvo.AGS_SERVICE_URL))){
			reqUrl= reqUrl + (reqUrl.indexOf("?") > -1 ? "&" : "?") + "token=" + prop.getProp(Arvo.ARCGIS_TOKEN); 
		} else if (token != null) {
			reqUrl = reqUrl + (reqUrl.indexOf("?") > -1 ? "&" : "?")
					+ "token=" + token;
		}
		
		URL url = new URL(reqUrl);
		HttpURLConnection con = (HttpURLConnection) url
				.openConnection();
		con.setDoOutput(true);
		con.setRequestMethod(request.getMethod());
		if (request.getContentType() != null) {
			con.setRequestProperty("Content-Type",request.getContentType());
		}
		if (request.getHeader("Referer") != null) {
			con.setRequestProperty("Referer", "kelirikko");
		} 
		int clength = request.getContentLength();
		if (clength > 0) {
			con.setDoInput(true);
			InputStream istream = request.getInputStream();
			OutputStream os = con.getOutputStream();
			final int length = 5000;
			byte[] bytes = new byte[length];
			int bytesRead = 0;
			while ((bytesRead = istream.read(bytes, 0, length)) > 0) {
				os.write(bytes, 0, bytesRead);
			}
		} else {
			con.setRequestMethod("GET");
		}
		out.clear();
		out = pageContext.pushBody();
		OutputStream ostream = response.getOutputStream();
		response.setContentType(con.getContentType());
		InputStream in = con.getInputStream();
		final int length = 5000;
		byte[] bytes = new byte[length];
		int bytesRead = 0;
		while ((bytesRead = in.read(bytes, 0, length)) > 0) {
			ostream.write(bytes, 0, bytesRead);
		}
	} catch (Exception e) {
		response.setStatus(500);
	}
%>
package fi.liikennevirasto.kelirikko;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Properties-tiedoston luku.
 * 
 * @author matikaineno
 *
 */ 
public class KelirikkoProperties {

	private static Log logger = LogFactory.getLog(KelirikkoProperties.class);

	private HashMap<String, String> taulukko = new HashMap<String, String>();
	
	/**
	 * Kaikki arvot jotka voidaan lukea properties-tiedostosta.
	 * @author matikaineno
	 *
	 */
	public enum Arvo {
		STAGE("stage"),
		WMTS_SERVICE_URL("wmtsServiceUrl"),
		AGS_SERVICE_URL("agsServiceUrl"),
		WMTS_SERVICE_NAME("wmtsServiceName"),
		KELIRIKKO_SERVICE_NAME("kelirikkoServiceName"),
		OV_SERVICE_NAME("ovServiceName"),
		OUT_FIELDS("outFields"),
        ARCGIS_TOKEN("arcGISToken");
		
		private String nimi;
		private Arvo(String nimi) {
			this.nimi = nimi;
		}
	}

    public KelirikkoProperties() {
    	
    	// devel|test|prod
    	String environment = "devel";
    
   		logger.debug("Ladataan .properties tiedosto contextista");
   		
   		InputStream in = Thread.currentThread().getContextClassLoader().getResourceAsStream("/kelirikko.properties");
    	if (in == null) {
        	logger.debug("Ei löytynyt. Ladataan .properties tiedosto war-paketista");
        	in = this.getClass().getResourceAsStream("/kelirikko.properties");
    	}
    	try {
            Properties prop = new Properties();
            prop.load(in);

            String stage = System.getProperty("fi.liikennevirasto.kelirikko.KelirikkoProperties.stage", environment);
            if (stage.equals("test") || stage.equals("prod")) {
            	prop.setProperty("agsServiceUrl", prop.getProperty(stage + "." + "agsServiceUrl"));
            } else {
        		prop.setProperty("agsServiceUrl", prop.getProperty("devel.agsServiceUrl"));
            }
            
            prop.setProperty("arcGISToken", prop.getProperty(stage + "." + "arcGISToken"));
        
            Arvo[] arvot = Arvo.values();
            for (int i = 0; i < arvot.length; i++) {
				Arvo arvo = arvot[i];
				taulukko.put(arvo.nimi, prop.getProperty(arvo.nimi));
			}
            
            logger.debug("Parametrit luettu. ");
        } catch (IOException e) {
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public String getProp(Arvo arvo) {
    	return taulukko.get(arvo.nimi);
    }
    
    @Override
    public String toString() {
    	StringBuilder sb = new StringBuilder();

    	Iterator<String> keys = taulukko.keySet().iterator();
    	while (keys.hasNext()) {
			String key = (String) keys.next();
			sb.append(key);
			sb.append("=");
			sb.append(taulukko.get(key));
			sb.append(", ");
		}

    	return sb.toString();
    }
}

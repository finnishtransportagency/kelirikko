package fi.liikennevirasto.kelirikko;

/**
 * Luokan tarkoituksena on pit‰‰ tallessa kannasta, tai muista asetuksista haettuja arvoja, jotka eiv‰t muutu.
 * Arvot voidaan tyhjent‰‰ tarvittaessa.
 * 
 * @author matikaineno
 *
 */
public class KelirikkoCache {

	/**
	 * Singleton-tyyppinen instanssi.
	 */
	private static KelirikkoCache instance = null;
	
	private KelirikkoProperties kelirikkoProperties;


	private KelirikkoCache() {}
	
	/**
	 * Palauttaa singelton-tyyppisen instanssin Cacheen.
	 * 
	 * @return
	 */
    public static KelirikkoCache getInstance() {
        if (instance == null)
            instance = new KelirikkoCache();
        return instance;
    }

	/**
	 * Tyhjent‰‰ kaikki arvot Cachesta.
	 */
	public void clear() {
		kelirikkoProperties = null;

	}
	
	public KelirikkoProperties getKelirikkoProperties() {
		if (kelirikkoProperties == null)
			kelirikkoProperties = new KelirikkoProperties();
		return kelirikkoProperties;
	}



	
	
}


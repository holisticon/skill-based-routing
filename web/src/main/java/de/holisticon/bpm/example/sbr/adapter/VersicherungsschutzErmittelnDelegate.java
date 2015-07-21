package de.holisticon.bpm.example.sbr.adapter;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Named;

import org.apache.commons.lang3.ArrayUtils;

import static org.apache.commons.lang3.StringUtils.*;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.bpm.engine.variable.value.ObjectValue;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.ImmutableMap;

import de.holisticon.bpm.example.sbr.LeistungsabrechnungProcess.Variables;
import de.holisticon.bpm.sbr.dmn.Leistung;
import de.holisticon.bpm.sbr.dmn.Leistungsabrechnung;

/**
 * Ermittelt die versicherten Tarife für die abzurechnenden Leistungen.
 * 
 * @author Jo Ehm (Holisticon AG)
 * 
 */
@Named(VersicherungsschutzErmittelnDelegate.NAME)
public class VersicherungsschutzErmittelnDelegate implements JavaDelegate {

    public final static String NAME = "versicherungsschutzErmitteln";

    /*
     * Produkte
     */
    protected static final String PRODUKT_BASIS_SCHUTZ = "Basis-Schutz";
    protected static final String PRODUKT_PREMIUM_KOMPLETT = "Premium Komplett";
    protected static final String PRODUKT_ZAHNZUSATZ = "Zahnzusatz";
    protected static final String PRODUKT_BRILLE_2000 = "Brille 2000";

    @Override
    public void execute(final DelegateExecution execution) throws Exception {

        String produkt = (String) execution.getVariable(Variables.PRODUKT);
        Leistungsabrechnung abrechnung = (Leistungsabrechnung) execution.getVariable(Variables.LEISTUNGSABRECHNUNG);
        for (final Leistung leistung : abrechnung.getLeistungen()) {
            if (leistung.isGebuehrenrechtlichOk()) {
                switch (produkt) {
                case PRODUKT_BASIS_SCHUTZ:
                    leistung.setTarif(basisTarife.get(getKey(leistung)));
                    break;
                case PRODUKT_PREMIUM_KOMPLETT:
                    leistung.setTarif(premiumTarife.get(getKey(leistung)));
                    break;
                case PRODUKT_ZAHNZUSATZ:
                    leistung.setTarif(zahnzusatzTarife.get(getKey(leistung)));
                    break;
                case PRODUKT_BRILLE_2000:
                    leistung.setTarif(sehhilfeTarife.get(getKey(leistung)));
                    break;
                default:
                    break;
                }
            }
        }
        
        ObjectValue jsonValue = org.camunda.bpm.engine.variable.Variables.objectValue(abrechnung).serializationDataFormat("application/json").create();
        execution.setVariable(Variables.LEISTUNGSABRECHNUNG, jsonValue);
        
        //execution.setVariable(Variables.LEISTUNGSABRECHNUNG, abrechnung);

    }

    @VisibleForTesting
    protected String getKey(Leistung leistung) {
        String key = null;
        String[] tokens = split(upperCase(leistung.getBezeichnung()));
        if (ArrayUtils.isNotEmpty(tokens)) {
            key = tokens[0];
        }
        return key;
    }

    @SuppressWarnings("serial")
    private static final Map<String, String> basisTarife = Collections.unmodifiableMap(new HashMap<String, String>() {
        {
            put("GOÄ-100", "AS6B (60%)");
            put("GOÄ-150", "AS6B (60%)");
            put("GOÄ-200", "AB1 (100%)");
            put("GOÄ-250", "AB1 (100%)");
            put("GOÄ-300", "AB1 (100%)");
            put("GOÄ-350", "AB1 (100%)");
            put("GOÄ-400", "AB2 (80%)");
            put("GOÄ-450", "AB2 (80%)");
            put("GOÄ-500", "AB2 (80%)");
            put("GOÄ-550", "AB2 (80%)");
            put("GOZ-100", "ZB1 (100%)");
            put("GOZ-150", "ZB1 (100%)");
            put("GOZ-200", "ZB1 (100%)");
            put("GOZ-250", "ZB1 (100%)");
            put("GOZ-300", "ZB2 (80%)");
            put("GOZ-350", "ZB2 (80%)");
            put("GOZ-400", "ZB2 (80%)");
            put("GOZ-450", "ZB2 (80%)");
            put("GOZ-500", "ZN (50%)");
            put("GOZ-550", "ZN (50%)");
            put("AM", "ABZ (80%)");
        }
    });

    private static final Map<String, String> premiumTarife = Collections.unmodifiableMap(new HashMap<String, String>() {
        {
            put("GOÄ-100", "AS8 (80%)");
            put("GOÄ-101", "AS8 (80%)");
            put("GOÄ-150", "AS8 (80%)");
            put("GOÄ-151", "AS8 (80%)");
            put("GOÄ-200", "AB1 (100%)");
            put("GOÄ-201", "ABZ (80%)");
            put("GOÄ-250", "AB1 (100%)");
            put("GOÄ-251", "ABZ (80%)");
            put("GOÄ-300", "AB1 (100%)");
            put("GOÄ-301", "ABZ (80%)");
            put("GOÄ-350", "AB1 (100%)");
            put("GOÄ-351", "ABZ (80%)");
            put("GOÄ-400", "AB2+ (100%)");
            put("GOÄ-401", "ABZ (80%)");
            put("GOÄ-450", "AB2+ (100%)");
            put("GOÄ-451", "ABZ (80%)");
            put("GOÄ-500", "AB2+ (100%)");
            put("GOÄ-501", "ABZ (80%)");
            put("GOÄ-550", "AB2+ (100%)");
            put("GOÄ-551", "AB2+ (100%)");
            put("GOZ-100", "ZB1 (100%)");
            put("GOZ-101", "ZBE (60%)");
            put("GOZ-150", "ZB1 (100%)");
            put("GOZ-151", "ZBE (60%)");
            put("GOZ-200", "ZB1 (100%)");
            put("GOZ-201", "ZBE (60%)");
            put("GOZ-250", "ZB1 (100%)");
            put("GOZ-251", "ZBE (60%)");
            put("GOZ-300", "ZB2+ (100%)");
            put("GOZ-301", "ZBE (60%)");
            put("GOZ-350", "ZB2+ (100%)");
            put("GOZ-351", "ZBE (60%)");
            put("GOZ-400", "ZB2+ (100%)");
            put("GOZ-401", "ZBE (60%)");
            put("GOZ-450", "ZB2+ (100%)");
            put("GOZ-451", "ZBE (60%)");
            put("GOZ-500", "ZN+ (75%)");
            put("GOZ-501", "ZNE (50%)");
            put("GOZ-550", "ZN+ (75%)");
            put("GOZ-551", "ZBE (50%)");
            put("AM", "AE+ (100%)");
            put("HM", "HMZ (80%)");
            put("SH", "SHB (60%)");
        }
    });

    private static final Map<String, String> zahnzusatzTarife = Collections.unmodifiableMap(new HashMap<String, String>() {
        {
            put("GOÄ-250", "ZA (100%)");
            put("GOÄ-450", "ZA (80%)");
            put("GOÄ-551", "ZA (80%)");
            put("GOZ-100", "ZB1 (100%)");
            put("GOZ-101", "EZ1 (100%)");
            put("GOZ-150", "ZB1 (100%)");
            put("GOZ-151", "EZ1 (100%)");
            put("GOZ-200", "ZB1 (100%)");
            put("GOZ-201", "EZ1 (100%)");
            put("GOZ-250", "ZB1 (100%)");
            put("GOZ-251", "EZ1 (100%)");
            put("GOZ-300", "ZB2 (80%)");
            put("GOZ-301", "EZ2 (80%)");
            put("GOZ-350", "ZB2 (80%)");
            put("GOZ-351", "EZ2 (80%)");
            put("GOZ-400", "ZB2 (80%)");
            put("GOZ-401", "EZ2 (80%)");
            put("GOZ-450", "ZB2 (80%)");
            put("GOZ-451", "EZ2 (80%)");
            put("GOZ-500", "ZN+ (70%)");
            put("GOZ-501", "ZN+ (70%)");
            put("GOZ-550", "ZN+ (50%)");
            put("GOZ-551", "ZN+ (80%)");
            put("AM", "ABZ (80%)");
        }
    });

    private static final Map<String, String> sehhilfeTarife = Collections.unmodifiableMap(new HashMap<String, String>() {
        {
            put("GOÄ-1200", "SB1 (100%)");
            put("GOÄ-1210", "SB1 (100%)");
            put("GOÄ-1220", "SB1 (100%)");
            put("GOÄ-1230", "SB1 (100%)");
            put("GOÄ-1240", "SB1 (100%)");
            put("GOÄ-1250", "SB1 (100%)");
            put("GOÄ-1300", "SB2 (80%)");
            put("GOÄ-1310", "SB2 (80%)");
            put("GOÄ-1320", "SB2 (80%)");
            put("GOÄ-1330", "SB2 (80%)");
            put("GOÄ-1340", "SB2 (80%)");
            put("GOÄ-1350", "SB1 (80%)");
            put("SH", "SHE (80%)");
            put("AM", "ABZ (80%)");
        }
    });

}

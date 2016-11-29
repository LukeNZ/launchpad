import {PipeTransform, Pipe} from "@angular/core";

@Pipe({
    name: "acronyms"
})
export class AcronymsPipe implements PipeTransform {

    public transform(value: string) : string {
        Object.keys(this.acronymsAndExpansions).forEach(key => {
            value = value.replace(key, `${key} (${this.acronymsAndExpansions[key]})`);
        });

        return value;
    }

    private acronymsAndExpansions = {
        'ACS': 'Attitude Control System',
        'AOS': 'Acquisition of Signal',
        'ASDS': 'Autonomous Spaceport Droneship',
        'CCAFS': 'Cape Canaveral Air Force Station',
        'FTS': 'Flight Termination System',
        'GEO': 'Geostationary Earth Orbit',
        'GNC': 'Guidance, Navigation, & Control',
        'GN2': 'Gaseous Nitrogen',
        'GTO': 'Geostationary Transfer Orbit',
        'HIF': 'Horizontal Integration Facility',
        'IIP': 'Instantaneous Impact Point',
        'JRTI': 'Just Read The Instructions',
        'KSC': 'Kennedy Space Center',
        'LD': 'Launch Director',
        'LDA': 'Launch Decision Authority',
        'LEO': 'Low Earth Orbit',
        'LN2': 'Liquid Nitrogen',
        'LOS': 'Loss of Signal',
        'LOX': 'Liquid Oxygen',
        'Max-Q': 'Maximum Aerodynamic Pressure',
        'MECO': 'Main Engine Cutoff',
        'MVac': 'Merlin Vacuum Engine',
        'M1D': 'Merlin 1D Engine',
        'OCISLY': 'Of Course I Still Love You',
        'RCO': 'Range Control Officer',
        'RCS': 'Reaction Control System',
        'ROC': 'Range Operations Coordinator',
        'RP-1': 'Rocket Propellant 1',
        'SECO': 'Second Stage Engine Cutoff',
        'T/E': 'Transporter/Erector',
        'TVC': 'Thrust Vector Control',
        'VAB': 'Vehicle Assembly Building',
        'VAFB': 'Vandenberg Air Foce Base'
    };
}
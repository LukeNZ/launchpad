import {CountdownComponents} from "../Interfaces/CountdownComponents";

export class CountdownComponentCalculator {

    /**
     * Calculates the component values of a duration in seconds, splitting and formatting it into
     * an object of days, hours, minutes, and seconds.
     *
     * @param secondsBetween {number} The seconds between two dates.
     *
     * @returns {CountdownComponents} The duration between the two dates, formatted as days, hours,
     * minutes, and seconds.
     */
    public static calculate(secondsBetween : number) : CountdownComponents {

        let components = { days: null, hours: null, minutes: null, seconds: null };

        secondsBetween = Math.abs(secondsBetween);

        components.days = Math.floor(secondsBetween / (60 * 60 * 24));
        secondsBetween -= components.days * 60 * 60 * 24;

        components.hours = Math.floor(secondsBetween / (60 * 60));
        secondsBetween -= components.hours * 60 * 60;

        components.minutes = Math.floor(secondsBetween / 60);
        secondsBetween -= components.minutes * 60;

        components.seconds = secondsBetween;

        return components;
    }
}
import {Resource} from "../Interfaces/Resource";
import {DescriptionSection} from "../Interfaces/DescriptionSection";
import {Webcast} from "../Interfaces/Webcast";

export class Launch {
    public name : string;
    public beganAt: Date;
    public countdown: Date;
    public isPaused: boolean;
    public introduction: string;
    public webcasts: Webcast[] = [];
    public resources: Resource[] = [];
    public descriptionSections: DescriptionSection[] = [];

    /**
     * Empty constructor.
     */
    constructor();

    /**
     *
     *
     * @param name
     * @param beganAt
     * @param countdown
     * @param isPaused
     * @param introduction
     * @param webcasts
     * @param resources
     * @param descriptionSections
     */
    constructor(name?: string, beganAt?: Date, countdown?: Date, isPaused?: boolean, introduction?: string, webcasts?: Webcast[], resources?: Resource[], descriptionSections?: DescriptionSection[]);

    /**
     *
     *
     * @param name
     * @param beganAt
     * @param countdown
     * @param isPaused
     * @param introduction
     * @param webcasts
     * @param resources
     * @param descriptionSections
     */
    constructor(name?: string, beganAt?: Date, countdown?: Date, isPaused?: boolean, introduction?: string, webcasts?: Webcast[], resources?: Resource[], descriptionSections?: DescriptionSection[]) {
        this.name = name;
        this.beganAt = beganAt;
        this.countdown = countdown;
        this.isPaused = isPaused;
        this.introduction = introduction;
        this.webcasts = webcasts;
        this.resources = resources;
        this.descriptionSections = descriptionSections;
    }

    /**
     * Static helper to construct a Launch object.
     *
     * @param model
     * @returns {Launch}
     */
    static create(model: any) : Launch {
        return new Launch(model.name, model.beganAt, model.countdown, model.isPaused,
            model.introduction, model.webcasts, model.resources, model.descriptionSections);
    }
}
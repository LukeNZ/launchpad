import {Resource} from "../Interfaces/Resource";
import {DescriptionSection} from "../Interfaces/DescriptionSection";
import {Webcast} from "../Interfaces/Webcast";

export class Launch {
    public name : string;
    public began_at: Date;
    public introduction: string;
    public webcasts: Webcast[];
    public resources: Resource[];
    public descriptionSections: DescriptionSection[];

    /**
     *
     *
     * @param name
     * @param began_at
     * @param introduction
     * @param webcasts
     * @param resources
     * @param descriptionSections
     */
    constructor(name: string, began_at: Date, introduction: string, webcasts: Webcast[], resources: Resource[], descriptionSections: DescriptionSection[]) {
        this.name = name;
        this.began_at = began_at;
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
        return new Launch(model.name, model.began_at, model.introduction, model.webcasts, model.resources, model.descriptionSections);
    }
}
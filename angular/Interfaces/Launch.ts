import {Resource} from "./Resource";
import {DescriptionSection} from "./DescriptionSection";

export interface Launch {
    name: string;
    beganAt: Date;
    countdown: Date;
    isPaused: boolean;
    introduction: string;
    resources: Resource[];
    descriptionSections: DescriptionSection[];
}
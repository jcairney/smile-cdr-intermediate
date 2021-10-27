import {FHIRBase} from "src/app/models/fhir-base";
import {QuestionnaireItem} from "src/app/models/questionnaire-item";

export interface Questionnaire extends FHIRBase {
  resourceType: "Questionnaire";
  item: Array<QuestionnaireItem>;
}

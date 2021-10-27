import {Questionnaire} from "src/app/models/questionnaire";

export enum QuestionnaireItemType {
  Boolean = "boolean",
  Choice = "choice",
  Date = "date",
  String = "string"
}

export interface QuestionnaireItem {
  linkId: string,
  text: string,
  type: QuestionnaireItemType
  option?: Array<QuestionnaireChoiceItemOption>
}

export interface QuestionnaireChoiceItemOption {
  valueCoding: ValueCoding
}

export interface ValueCoding {
  system: string,
  code: string,
  display: string,
}


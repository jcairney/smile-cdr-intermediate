import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Questionnaire} from "src/app/models/questionnaire";
import {QuestionnaireChoiceItemOption, QuestionnaireItem, QuestionnaireItemType} from 'src/app/models/questionnaire-item';
import {QuestionnaireResponseStatus} from "src/app/models/status.enum";
import {FormDescriptionService} from "src/app/services/form-description.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  QuestionnaireItemType = QuestionnaireItemType; // we need to define this field with same name as this enum to make the enum visible in markup layer
  title = 'smile-CDR';
  formGroup: FormGroup = new FormGroup({}); // I'd rather just use null here, but then the [formGroup] directive throws a type assertion during compilation
  questionnaire: Questionnaire | null = null;
  questionnaireResponse: any;

  constructor(
    private formDescriptionService: FormDescriptionService,
  ) {
  }

  ngOnInit() {
    this.formDescriptionService.getFormDescription().subscribe((payload: Questionnaire) => {

      // Let's put the questionnaire JSON where the markup can see it.
      // Question fields will be generated using the JSON during ViewInit (after we're done here), so the necessary FormGroup structure will already
      // be ready to go.
      this.questionnaire = payload;

      let formGroup = new FormGroup({});
      payload.item.forEach((item: QuestionnaireItem) => {
        switch (item.type) {
          case QuestionnaireItemType.Boolean:
            formGroup.addControl(item.linkId, new FormControl(null, [Validators.required]))
            break;
          case QuestionnaireItemType.String:
            formGroup.addControl(item.linkId, new FormControl(null, [Validators.required]))
            break;
          case QuestionnaireItemType.Date:
            formGroup.addControl(item.linkId, new FormControl(null, [Validators.required, Validators.pattern(/(19|20)[0-9][0-9]-(0[1-9]|1[012])-([012][0-9]|3[01])/)]));
            break;
          case QuestionnaireItemType.Choice:
            formGroup.addControl(item.linkId, new FormControl(null, [Validators.required]))
            break;
        }
      });
      this.formGroup = formGroup;
    });
  }

  getCurrentDateAsString(): string {
    let date = new Date();
    // could call datePipe here, but this should work well enough
    let dateString = date.toISOString();
    return dateString.substring(0, dateString.indexOf('T'));
  }

  submit() {
    let formReturn = this.formGroup.value;

    // TODO: define classes for the below structures.
    let questionnaireResponse = {
      "resourceType": "QuestionnaireResponse",
      "questionnaire": this.questionnaire!.url, // Form being answered
      "status": QuestionnaireResponseStatus.Completed,
      // subject: we don't have a URL for subject.
      "authored": this.getCurrentDateAsString(), // Date the answers were gathered
      //"author" : this should probably be a reference to the patient, or a value indicating the response was captured by a device, but we don't have either', // Person who received and recorded the answers
      //"source" : see thoughts on 'author'
      "item": [] as Array<any>,
    };

    this.questionnaire!.item.forEach((item: QuestionnaireItem) => {
      const answerItem = {
        "linkId": item.linkId,
        // TODO: "definition": example didn't have this on items.
        "text": item.text,
        "answer": [] as Array<any>,
      };

      let answer;
      switch (item.type) {
        case QuestionnaireItemType.Boolean:
          answer = {
            "valueBoolean": !!this.formGroup.get(item.linkId)?.value,
          };
          break;
        // TODO: case decimal
        // TODO: case integer
        case QuestionnaireItemType.Date:
          answer = {
            "valueDate": this.formGroup.get(item.linkId)?.value,
          };
          break;
        // TODO: case date-time:
        // TODO: case time:
        case QuestionnaireItemType.String:
          answer = {
            "valueString": this.formGroup.get(item.linkId)?.value,
          };
          break;
        // TODO: case URI:
        // TODO: case attachment:
        case QuestionnaireItemType.Choice:
          answer = this.findSelectedValue(item, this.formGroup.get(item.linkId)?.value) || null;
          break;
        // TODO: case quantity
        // TODO: case reference
      }

      answerItem.answer.push(answer);

      questionnaireResponse.item.push(answerItem);
    });

    this.questionnaireResponse = questionnaireResponse;
  };

  private findSelectedValue(question: QuestionnaireItem, answer: any): QuestionnaireChoiceItemOption | undefined {
    return question.option!.find((option: QuestionnaireChoiceItemOption) => option.valueCoding.code === answer)
  }
}

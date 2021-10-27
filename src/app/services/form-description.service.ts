import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {defer, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {FHIRBase} from "src/app/models/fhir-base";
import {Questionnaire} from "src/app/models/questionnaire";

@Injectable()
export class FormDescriptionService {

  // We could have just imported this asset at compile time, but that wouldn't show any asynchronous work, and the application would be less dynamic.
  // Here we want the hot/coldness of the returned observable to mimic how calls with Angular's HttpClient works.
  getFormDescription(): Observable<Questionnaire>{
    // @ts-ignore
    return defer( ():Promise<Object> => import("src/assets/questionnaire.json")).pipe(
      map((promiseReturn: Object)=>{
        // TypeScript compile-time reading of .json files isn't smart enough to match up some of the string properties with the enums
        // or constant properties of the same name in the model files.  So we're going to ignore the warning (above) and use this extra map step to cast the JSON value.
        return promiseReturn as Questionnaire;
      }));
  }
}

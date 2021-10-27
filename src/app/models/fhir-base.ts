export enum ObjectStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum SubjectType {
  Patient = "Patient",
}

export class FHIRBase {
  "resourceType": string;
  "id": string;
  "url": string;
  "status": ObjectStatus;
  "subjectType": Array<SubjectType>;
  "date": string;
}

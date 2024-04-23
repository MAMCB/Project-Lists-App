import { createValidator } from "../decorators/validation-decorators-v2.js";

export enum ProjectStatus {
  active,
  finished,
}
//Project class
export class Project {
  // @RequiredField
  @createValidator
  title: string;
  // @RequiredField
  @createValidator
  description: string;
  // @PositiveNumber
  @createValidator
  people: number;

  id: string;

  status: ProjectStatus = ProjectStatus.active;
  constructor(title: string, description: string, people: number) {
    this.title = title;
    this.description = description;
    this.people = people;
    this.id = Math.random().toString();
  }
}

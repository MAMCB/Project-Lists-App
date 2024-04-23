import { ProjectComponent } from "./project-component.js";
import { Autobind } from "../decorators/autobind-decorator.js";
import { Project } from "../models/project-model.js";
import { projectState } from "../state/project-state-management.js";
import { validate2, validators } from "../decorators/validation-decorators-v2.js";
  //ProjectInput class

 export class ProjectInput extends ProjectComponent<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
      super("project-input", "app", true);

      this.element.addEventListener("submit", this.submitHandler);
      this.element.id = "user-input";
      this.titleInput = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInput = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInput = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;
    }

    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();

      const title = this.titleInput.value;
      const description = this.descriptionInput.value;
      const people = +this.peopleInput.value;

      //using the validation decorator version2
      for (let i = 0; i < validators.length; i++) {
        if (i === 0) {
          validators[i].value = title;
        }
        if (i === 1) {
          validators[i].value = description;
        }
        if (i === 2) {
          validators[i].value = people;
        }
      }
      for (let validator of validators) {
        if (!validate2(validator)) {
          alert("Invalid input, please try again");
          return;
        }
      }
      const newProject = new Project(title, description, people);
      //  if (!validate(newProject, "Project")) {
      //    alert("Invalid input, please try again");
      //    return;
      //  }

      // activeProjects.assignedProjects.push(newProject);
      //activeProjects.renderList();
      projectState.addProject(newProject);
      this.clearInputs();
    }
    private clearInputs() {
      this.titleInput.value = "";
      this.descriptionInput.value = "";
      this.peopleInput.value = "";
    }
  }


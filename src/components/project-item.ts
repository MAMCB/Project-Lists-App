import { Draggable } from "../models/drag-drop-interfaces";
import { Project } from "../models/project-model";
import { ProjectComponent } from "./project-component";
import { Autobind } from "../decorators/autobind-decorator";

  //ProjectItem class
  export class ProjectItem
    extends ProjectComponent<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;
    titleElement: HTMLHeadingElement;
    numPeopleElement: HTMLHeadingElement;
    descriptionElement: HTMLParagraphElement;
    get persons() {
      if (this.project.people === 1) {
        return "1 person";
      }
      return this.project.people + " people";
    }
    get projectId() {
      return this.project.id;
    }
    constructor(hostId: string, project: Project) {
      super("single-project", hostId, false);
      this.project = project;
      this.titleElement = this.element.querySelector(
        "h2"
      ) as HTMLHeadingElement;
      this.numPeopleElement = this.element.querySelector(
        "h3"
      ) as HTMLHeadingElement;
      this.descriptionElement = this.element.querySelector(
        "p"
      ) as HTMLParagraphElement;
      this.titleElement.textContent = this.project.title;
      this.numPeopleElement.textContent = this.persons + " assigned";
      this.descriptionElement.textContent = this.project.description;
      this.configure();
    }
    @Autobind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData("text/plain", this.project.id);
      event.dataTransfer!.effectAllowed = "move";
    }

    @Autobind
    dragEndHandler(_: DragEvent): void {
      console.log("DragEnd");
    }
    configure(): void {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
      this.element.id = this.project.id;
    }
  }


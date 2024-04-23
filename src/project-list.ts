/// <reference path="autobind-decorator.ts"/>
/// <reference path="project-component.ts"/>
/// <reference path="project-state-management.ts"/>

namespace App {
  export class ProjectList
    extends ProjectComponent<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: ProjectItem[];
    ulElement: HTMLUListElement;

    constructor(private type: ProjectStatus) {
      super("project-list", "projects", true);
      this.assignedProjects = [];
      // this.element.id = `${ProjectStatus[this.type]}-projects`;
      this.element.id = `${ProjectStatus[this.type]}-projects`;
      this.ulElement = this.element.querySelector("ul") as HTMLUListElement;
      this.ulElement.id = `${ProjectStatus[this.type]}-projects-list`;
      this.element.querySelector("h2")!.textContent = `${ProjectStatus[
        this.type
      ].toUpperCase()} PROJECTS`;
      this.configure();
    }

    configure(): void {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);
      projectState.addListener(this.addProject);
    }
    @Autobind
    addProject(projects: Project[]) {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === ProjectStatus.active) {
          return prj.status === ProjectStatus.active;
        }
        return prj.status === ProjectStatus.finished;
      });
      for (const prj of relevantProjects) {
        if (document.getElementById(prj.id)) {
          let element = document.getElementById(prj.id);
          element!.remove();
        }
      }
      this.assignedProjects = relevantProjects.map(
        (project) => new ProjectItem(this.ulElement.id, project)
      );
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        this.ulElement.classList.add("droppable");
      }
    }

    @Autobind
    dropHandler(event: DragEvent): void {
      console.log(event, "dropped");
      console.log(event.dataTransfer!.getData("text/plain"));
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.updateProjectStatus(
        projectId,
        this.type === ProjectStatus.active
          ? ProjectStatus.active
          : ProjectStatus.finished
      );
    }

    @Autobind
    dragLeaveHandler(event: DragEvent): void {
      this.ulElement.classList.remove("droppable");
      console.log(event);
    }
  }
}

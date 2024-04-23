/// <reference path="validation-decorators-v2.ts"/>

namespace App {
  //Project state management

  abstract class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
    abstract notifyListeners(): void;
  }

  type Listener<T> = (items: T[]) => void;
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

  export class ProjectManagementState extends State<Project> {
    private static instance: ProjectManagementState;
    private projects: Project[] = [];

    private constructor() {
      super();
    }
    public static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectManagementState();
      return this.instance;
    }
    addProject(project: Project) {
      this.projects.push(project);
      this.notifyListeners();
    }

    notifyListeners() {
      for (const listener of this.listeners) {
        listener(this.projects);
      }
    }
    public updateProjectStatus(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((project) => project.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.notifyListeners();
      }
    }
  }

  export const projectState = ProjectManagementState.getInstance();
}
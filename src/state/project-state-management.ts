import { Project, ProjectStatus } from "../models/project-model.js";
  //Project state management

  abstract class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
    abstract notifyListeners(): void;
  }

  type Listener<T> = (items: T[]) => void;
 

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

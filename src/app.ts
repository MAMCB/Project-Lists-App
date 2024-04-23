abstract class ProjectComponent <T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    insertAtStart: boolean;
    constructor(templateId: string, hostElementId: string, insertAtStart: boolean ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
         const importedNode = document.importNode(
           this.templateElement.content,
           true
         );
         this.element = importedNode.firstElementChild as U;
          this.insertAtStart = insertAtStart;
         this.hostElement.insertAdjacentElement(insertAtStart?"afterbegin":"beforeend", this.element);
    }
    
    }

//Project state management

abstract class State <T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
  abstract notifyListeners(): void;
}

type Listener<T> = (items: T[]) => void;

class ProjectManagementState extends State <Project>{
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

const projectState = ProjectManagementState.getInstance();
    
enum ProjectStatus {
  active,
  finished,
}
    
//autobind decorator
   function Autobind(
     _: any,
     _2: string | Symbol,
     descriptor: PropertyDescriptor
   ) {
     const originalMethod = descriptor.value; //store the original method,accessible in the descriptor object value property.
     const adjustedDescriptor: PropertyDescriptor = {
       configurable: true,
       enumerable: false,
       get() {
         return originalMethod.bind(this); //bind the original method to the object that is calling the method, this refers to the object that is calling the method
       },
     };
     return adjustedDescriptor;
   }


//validation decorator version1

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; //["required","positive"]
  };
}

const registeredValidators: ValidatorConfig = {};

function RequiredField(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
}

function validate(obj: any, className: string): boolean {
  const objValidatorConfig = registeredValidators[className];
  if (!objValidatorConfig) {
    alert("No validation found for this object");
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop]; //the !! converts the value to a boolean
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

//Validation decorator version2
const titleParameters = {required:true,minLength:5,maxLength:30};
const descriptionParameters = {required:true,minLength:5,maxLength:300};
const peopleParameters = {required:true,min:1,max:10};
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate2(obj: Validatable){
  let isValid = true;
  if(obj.required){
    isValid = isValid && obj.value.toString().trim().length !== 0;
  }
  if(obj.minLength != null && typeof obj.value === 'string'){
    isValid = isValid && obj.value.length >= obj.minLength;
  }
  if(obj.maxLength != null && typeof obj.value === 'string'){
    isValid = isValid && obj.value.length <= obj.maxLength;
  }
  if(obj.min != null && typeof obj.value === 'number'){
    isValid = isValid && obj.value >= obj.min;
  }
  if(obj.max != null && typeof obj.value === 'number'){
    isValid = isValid && obj.value <= obj.max;
  } 
  return isValid;
}

const validators: Validatable[] = [];

function createValidator(obj: any , prop: string){
  
  let validatableProp : Validatable = {value:'',required:false};
 
    if(prop === "title")
    {
      validatableProp = {value: obj[prop],...titleParameters} as Validatable;
    }
    if(prop === "description")
    {
      validatableProp = {value: obj[prop],...descriptionParameters} as Validatable;
    }
    if(prop === "people")
    {
      validatableProp = {value: obj[prop],...peopleParameters} as Validatable;
    }

    
  
  validators.push(validatableProp);
  
}


 //Drag and drop interfaces
 interface Draggable {
   dragStartHandler(event: DragEvent): void;
   dragEndHandler(event: DragEvent): void;
 }

 interface DragTarget {
   dragOverHandler(event: DragEvent): void;
   dropHandler(event: DragEvent): void;
   dragLeaveHandler(event: DragEvent): void;
 }

//Project class
class Project {
  // @RequiredField
  @createValidator
  title: string;
  // @RequiredField
  @createValidator
  description: string;
  // @PositiveNumber
  @createValidator
  people: number;

  id:string;

  status: ProjectStatus = ProjectStatus.active;
  constructor(
    title: string,
    description: string,
    people: number,
   
  ) {
   
    this.title = title;
    this.description = description;
    this.people = people;
    this.id = Math.random().toString();
  }

}

//ProjectItem class
class ProjectItem extends ProjectComponent<HTMLUListElement, HTMLLIElement> implements Draggable {
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
    this.titleElement = this.element.querySelector("h2") as HTMLHeadingElement;
    this.numPeopleElement = this.element.querySelector(
      "h3"
    ) as HTMLHeadingElement;
    this.descriptionElement = this.element.querySelector(
      "p"
    ) as HTMLParagraphElement;
    this.titleElement.textContent = this.project.title;
    this.numPeopleElement.textContent =  this.persons + " assigned";
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

//ProjectInput class
 


class ProjectInput extends ProjectComponent <HTMLDivElement,HTMLFormElement>{
   
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;
  
    constructor(){
        super('project-input','app',true);
       
        this.element.addEventListener('submit',this.submitHandler);
        this.element.id = 'user-input';
        this. titleInput = this.element.querySelector("#title") as HTMLInputElement;
        this. descriptionInput = this.element.querySelector(
          "#description"
        ) as HTMLInputElement;
        this. peopleInput = this.element.querySelector(
          "#people"
        ) as HTMLInputElement;
        
    }
   
        
        
    @Autobind
    private submitHandler(event: Event){
        event.preventDefault();
        
        
        const title = this.titleInput.value;
       const description = this.descriptionInput.value;
        const people = +this.peopleInput.value;

        //using the validation decorator version2
       for(let i=0; i<validators.length; i++){
        if(i === 0){
          validators[i].value = title;
          
        }
        if(i === 1){
          validators[i].value = description;
        }
        if(i === 2){
          validators[i].value = people;
        }
       }
       for(let validator of validators){
          if(!validate2(validator)){
            alert("Invalid input, please try again");
            return;
          }
        }
        const newProject = new Project(title,description,people);
        //  if (!validate(newProject, "Project")) {
        //    alert("Invalid input, please try again");
        //    return;
        //  }
        
       // activeProjects.assignedProjects.push(newProject);
        //activeProjects.renderList();
        projectState.addProject(newProject);
        this.clearInputs();
        

    }
    private clearInputs(){
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
   
    
}


 class ProjectList
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
      if(document.getElementById(prj.id)){
        let element = document.getElementById(prj.id);
        element!.remove();
      }
    }
    this.assignedProjects = relevantProjects.map(
      (project) => new ProjectItem(this.ulElement.id, project)
    );
   
   }

   @Autobind
   dragOverHandler(event: DragEvent): void
   {
    if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain")
      {
        event.preventDefault();
        this.ulElement.classList.add("droppable");
      }
    
    
   }

    @Autobind
   dropHandler(event: DragEvent): void
    {console.log(event,"dropped");
      console.log(event.dataTransfer!.getData("text/plain"));
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.updateProjectStatus(projectId, this.type === ProjectStatus.active ? ProjectStatus.active : ProjectStatus.finished);
      

    }

    @Autobind
   dragLeaveHandler(event: DragEvent): void
    {
      this.ulElement.classList.remove("droppable");
      console.log(event);
    }
 }


 






const finishedProjects = new ProjectList(1);
const activeProjects = new ProjectList(0);
const projectInput = new ProjectInput();
   


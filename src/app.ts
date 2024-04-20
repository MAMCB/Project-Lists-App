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

type Listener<T> = (items: T) => void;

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
      listener(this.projects[this.projects.length - 1]);
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
class ProjectItem extends ProjectComponent<HTMLUListElement, HTMLLIElement> {
  private project: Project;
  titleElement: HTMLHeadingElement;
  numPeopleElement: HTMLHeadingElement;
  descriptionElement: HTMLParagraphElement;
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
    this.numPeopleElement.textContent = this.project.people.toString();
    this.descriptionElement.textContent = this.project.description;

    
  }

  public getProject() {
    return this.project;
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


 class ProjectList extends ProjectComponent <HTMLDivElement,HTMLElement> {
 
   assignedProjects: ProjectItem[];
   ulElement: HTMLUListElement;
  

   constructor(private type: ProjectStatus) {
     super("project-list", "app",true);
     this.assignedProjects = [];
     this.element.id = `${ProjectStatus[this.type]}-projects`;
     
     this.ulElement = this.element.querySelector("ul") as HTMLUListElement;
     this.element.querySelector("h2")!.textContent = `${ProjectStatus[this.type].toUpperCase()} PROJECTS`;
      projectState.addListener(this.addProject);
   }
   log() {
     console.log(this);
   }
   @Autobind
   addProject(project: Project) {
    if (project.status === this.type) {
      const projectElement = new ProjectItem(
        this.element.id,
        project
      );
      this.assignedProjects.push(projectElement);
      
    }
    }


   

 
 }

 






const finishedProjects = new ProjectList(1);
const activeProjects = new ProjectList(0);
const projectInput = new ProjectInput();
   


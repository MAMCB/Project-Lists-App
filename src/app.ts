abstract class ProjectComponent {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    constructor(templateId: string, hostElementId: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as HTMLDivElement;
         const importedNode = document.importNode(
           this.templateElement.content,
           true
         );
         this.element = importedNode.firstElementChild as HTMLElement;
         this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
    
    }


    

    class Project {
      constructor(
        public title: string,
        public description: string,
        public people: number,
        public templateElement: HTMLTemplateElement,
      ) {}
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


//ProjectInput class
 


class ProjectInput extends ProjectComponent{
    form: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;
    constructor(){
        super('project-input','app');
        this.form = this.element as HTMLFormElement;
        this.form.addEventListener('submit',this.submitHandler);
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
        const people = this.peopleInput.value;
        const newProject = new Project(title,description,+people,document.getElementById('single-project') as HTMLTemplateElement);
        projectList.assignedProjects.push(newProject);
        projectList.renderList();
        this.clearInputs();

    }
    private clearInputs(){
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
   
    
}

 class ProjectList extends ProjectComponent {
  private static instance: ProjectList;
   assignedProjects: Project[];
   ulElement: HTMLUListElement;

   private constructor() {
     super("project-list", "app");
     this.assignedProjects = [];
     
     this.ulElement = this.element.querySelector("ul") as HTMLUListElement;
     this.log();
   }
   log() {
     console.log(this);
   }


   public static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectList();
      return this.instance;
    }

   renderList() {
     const projectElement = document.importNode(
       this.assignedProjects[this.assignedProjects.length - 1].templateElement
         .content,
       true
     );
     const listLElement = projectElement.firstElementChild as HTMLLIElement;
        listLElement.textContent = this.assignedProjects[
        this.assignedProjects.length - 1
        ].title;

     this.ulElement.appendChild(listLElement);
   }
 }







const projectList = ProjectList.getInstance();
const projectInput = new ProjectInput();
   


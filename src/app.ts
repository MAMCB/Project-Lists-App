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

   

 


class ProjectInput extends ProjectComponent{
    form: HTMLFormElement;
    constructor(){
        super('project-input','app');
        this.form = this.element as HTMLFormElement;
        this.form.addEventListener('submit',this.submitHandler.bind(this));
    }
   
        
        
    
    private submitHandler(event: Event){
        event.preventDefault();
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const peopleInput = document.getElementById('people') as HTMLInputElement;

        const title = titleInput.value;
        const description = descriptionInput.value;
        const people = peopleInput.value;
        const newProject = new Project(title,description,+people,document.getElementById('single-project') as HTMLTemplateElement);
        projectList.assignedProjects.push(newProject);
        projectList.renderList();

    }
   
    
}

 class ProjectList extends ProjectComponent {
   assignedProjects: Project[];
   ulElement: HTMLUListElement;
   constructor() {
     super("project-list", "app");
     this.assignedProjects = [];
     
     this.ulElement = this.element.querySelector("ul") as HTMLUListElement;
     this.log();
   }
   log() {
     console.log(this);
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







const projectList = new ProjectList();
const projectInput = new ProjectInput();
   


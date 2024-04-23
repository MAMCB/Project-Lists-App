
  export  abstract class ProjectComponent<
      T extends HTMLElement,
      U extends HTMLElement
    > {
      templateElement: HTMLTemplateElement;
      hostElement: T;
      element: U;
      insertAtStart: boolean;
      constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean
      ) {
        this.templateElement = document.getElementById(
          templateId
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(
          this.templateElement.content,
          true
        );
        this.element = importedNode.firstElementChild as U;
        this.insertAtStart = insertAtStart;
        this.hostElement.insertAdjacentElement(
          insertAtStart ? "afterbegin" : "beforeend",
          this.element
        );
      }
    }

namespace App {
  //autobind decorator
 export function Autobind(
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
}
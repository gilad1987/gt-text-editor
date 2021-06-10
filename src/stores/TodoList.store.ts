import { action, computed, makeObservable, observable } from "mobx";
import TodoModel from "./Todo.model";

class TodoListStore {
  items: TodoModel[] = [];

  constructor() {
    makeObservable(this, {
      items: observable,
      onDelete: action,
      add: action,
      completed: computed,
    });
  }

  onDelete = (todo: TodoModel) => {
    this.items = this.items.filter((item: TodoModel) => item !== todo);
  };
  add = () => {
    const todo = new TodoModel(this);
    this.items.push(todo);
  };

  get completed() {
    return this.items.filter((item: TodoModel) => item.completed).length;
  }
}

export default TodoListStore;

import { action, makeObservable, observable } from "mobx";
import TodoListStore from "./TodoList.store";
import { v4 as uuidv4 } from "uuid";

class TodoModel {
  store: TodoListStore;
  uuid: string = uuidv4();
  text: string = "";
  completed: boolean = false;

  constructor(store: TodoListStore) {
    this.store = store;

    makeObservable(this, {
      text: observable,
      completed: observable,
      delete: action,
      setCompleted: action,
      onChangeText: action,
    });
  }

  setCompleted = (completed: boolean) => {
    this.completed = completed;
  };

  onChangeText = (text: string) => {
    this.text = text;
  };

  delete = () => {
    this.store.onDelete(this);
  };
}

export default TodoModel;

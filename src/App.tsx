import { Provider } from "mobx-react";
import React from "react";
import "./App.scss";
import GtEditor from "./components/GtEditor/GtEditor";
import TodoListStore from "./stores/TodoList.store";

const stores = {
  todoListStore: new TodoListStore(),
};
function App() {
  return (
    <Provider {...stores}>
      <div className="App">
        <GtEditor />
      </div>
    </Provider>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // ✅ 초기 데이터 로딩
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setTodos(data);
      }
    };

    fetchTodos();
  }, []);

  // ✅ 추가
  const addTodo = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text: inputValue, completed: false }])
      .select();

    if (!error && data && data.length > 0) {
      setTodos([data[0], ...todos]);
    }

    setInputValue("");
  };

  // ✅ 완료 상태 토글
  const toggleTodo = async (id, currentStatus) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !currentStatus })
      .eq("id", id)
      .select();

    if (!error && data && data.length > 0) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !currentStatus } : todo
        )
      );
    }
  };

  // ✅ 삭제
  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <header className="header">
          <h1>🌟 Todo List</h1>
          <p className="subtitle">일정을 체계적으로 관리하세요</p>
        </header>

        <form className="input-form" onSubmit={addTodo}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            추가
          </button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">아직 할 일이 없습니다</div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <label className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

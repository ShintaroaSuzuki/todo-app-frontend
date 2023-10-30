import React from "react";
import { TodoProps } from "./components/Todo";
import { TodoList } from "./components/TodoList";
import { TodoInput } from "./components/TodoInput";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
    const [todos, setTodos] = useState<TodoProps[]>([]);

    const [input, setInput] = useState("");

    const addTodo = async () => {
        const response = await fetch(`${API_URL}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: input,
            }),
        });
        const data = await response.json();
        setTodos([data, ...todos]);
        setInput("");
    };

    const updateTodo = async ({ id, done }: { id: number; done: boolean }) => {
        const response = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                done,
            }),
        });
        const data = await response.json();
        const newTodos = todos.map((todo) => {
            if (todo.id === id) {
                return data;
            }
            return todo;
        });
        setTodos(newTodos);
    };

    const deleteTodo = async ({ id }: { id: number }) => {
        await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const newTodos = todos.filter((todo) => todo.id !== id);
        setTodos(newTodos);
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const response = await fetch(`${API_URL}/todos`);
            const data = await response.json();
            setTodos(data);
        };
        fetchTodos();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center my-16 gap-y-16">
            <TodoInput input={input} setInput={setInput} addTodo={addTodo} />
            <TodoList
                todos={todos}
                updateTodo={updateTodo}
                deleteTodo={deleteTodo}
            />
        </div>
    );
}

export default App;

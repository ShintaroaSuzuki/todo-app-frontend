import { Todo, TodoProps } from "./Todo";

export type TodoListProps = {
    todos: TodoProps[];
    updateTodo: ({ id, done }: { id: number; done: boolean }) => Promise<void>;
    deleteTodo: ({ id }: { id: number }) => Promise<void>;
};

export const TodoList = ({ todos, updateTodo, deleteTodo }: TodoListProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            {todos.map((todo, index) => (
                <Todo
                    key={`todo_${index}`}
                    id={todo.id}
                    title={todo.title}
                    done={todo.done}
                    updateTodo={updateTodo}
                    deleteTodo={deleteTodo}
                />
            ))}
        </div>
    );
};

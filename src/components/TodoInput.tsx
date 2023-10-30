export type TodoInputProps = {
    input: string;
    setInput: (input: string) => void;
    addTodo: () => void;
};

export const TodoInput = ({ input, setInput, addTodo }: TodoInputProps) => {
    return (
        <div className="flex w-96 h-16 p-4 items-center justify-between bg-slate-50 rounded-lg border-slate-300 border-2">
            <input
                className="bg-transparent flex-grow outline-none"
                type="text"
                placeholder="Add a new todo"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                onClick={addTodo}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-8 w-8 flex items-center justify-center text-slate-50"
            >
                +
            </button>
        </div>
    );
};

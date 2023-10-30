export type TodoProps = {
    id: number;
    title: string;
    done?: boolean;
    updateTodo: ({ id, done }: { id: number; done: boolean }) => Promise<void>;
    deleteTodo: ({ id }: { id: number }) => Promise<void>;
};

export const Todo = ({
    id,
    title,
    done,
    updateTodo,
    deleteTodo,
}: TodoProps) => {
    return (
        <div className="flex w-96 p-4 items-center justify-between bg-slate-50 rounded-lg border-slate-300 border-2">
            <div className="flex flex-row items-center">
                <input
                    type="checkbox"
                    className="h-4 w-4 mr-2"
                    checked={done}
                    onClick={() => updateTodo({ id, done: !done })}
                />
                <span className="w-48">{title}</span>
            </div>
            <div className="flex flex-row items-center gap-x-4">
                <span
                    className={`text-xs py-1 ${
                        done ? "text-cyan-500" : "text-slate-500"
                    }`}
                >
                    {done ? "done" : "in progress"}
                </span>
                <button
                    onClick={() => deleteTodo({ id })}
                    className="bg-gradient-to-r from-fuchsia-500 to-red-500 rounded-full h-8 w-8 flex items-center justify-center text-slate-50"
                >
                    -
                </button>
            </div>
        </div>
    );
};

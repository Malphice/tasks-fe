"use client"

import {useState, useEffect, useCallback} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Plus, Search, X} from "lucide-react"
import {Task} from "@/index";
import {createTask, deleteTask, getTasks, searchTasks, updateTask} from "@/utils/requests";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea";


export default function Component() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [hits, setHits] = useState<Task[] | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAddTask = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;

        const titleInput = form.elements.namedItem('title') as HTMLInputElement;
        const descriptionInput = form.elements.namedItem('description') as HTMLTextAreaElement;
        const newTask = await createTask(titleInput.value, descriptionInput.value);

        setTasks([...tasks, newTask])
        setIsModalOpen(false)
    }, [tasks])

    useEffect(() => {
        async function fetchTasks() {
            const taskData = await getTasks()
            setTasks(taskData)
        }

        fetchTasks()
    }, [setTasks]);

    const toggleTaskCompletion = async (id: string) => {
        const task = tasks.find(task => task._id === id)
        if (!task) return
        try {
            await updateTask(id, {completed: !task.completed})
        } catch (e) {
            console.log(e)
            return
        }
        const updatedTask = {...task, completed: !task.completed}
        const updatedTasks = tasks.map(task => task._id === id ? updatedTask : task)
        setTasks(updatedTasks)
    }


    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id)
        } catch (e) {
            console.log(e)
            return
        }
        const updatedTasks = tasks.filter(task => task._id !== id)
        setTasks(updatedTasks)
    }

    const handleSearch = async (query: string) => {
        if (!query || query === "") {
            setHits(null)
            return
        }
        if (query.length >= 2) {
            const hits = await searchTasks(query)
            setHits(hits)
        }
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Personal Task Management</h1>
            <form className="mb-4 relative flex flex-row gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Search tasks..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={18}/>
                <Button
                    variant="ghost"
                    size="icon"
                    type="reset"
                    className=""
                    onClick={() => setHits(null)}
                >
                    <X size={18}/>
                </Button>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4"/> Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title (required)</Label>
                                <Input
                                    id="title"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                />
                            </div>
                            <Button type="submit">Add Task</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </form>
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
                {hits === null ? tasks.map(task =>
                    <TaskCard key={task._id} task={task} handleDelete={handleDelete}
                              toggleTaskCompletion={toggleTaskCompletion}/>) : hits.length > 0 ? hits.map(hit =>
                    <TaskCard key={hit._id} task={hit} handleDelete={handleDelete}
                              toggleTaskCompletion={toggleTaskCompletion}/>) : <span>No task found</span>}
            </ScrollArea>
        </div>
    )
}

function TaskCard({task, handleDelete, toggleTaskCompletion}: {
    task: Task,
    handleDelete: (id: string) => void,
    toggleTaskCompletion: (id: string) => void
}) {
    return (
        <Card key={task._id} className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-full">
                <CardTitle className="text-sm font-medium">
                                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                        {task.title}
                                    </span>
                </CardTitle>
                <X className="w-4 h-4" role="button" onClick={() => handleDelete(task._id)}></X>
            </CardHeader>
            <CardContent className="flex flex-row justify-between items-center">
                <div>
                    <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Date: {task.created_at.substring(0, 10)}</p>
                </div>
                <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task._id)}
                />
            </CardContent>
        </Card>
    )
}
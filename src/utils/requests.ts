import {Task} from "@/index";

export async function getTasks(): Promise<Task[]>{
    const res = await fetch("http://localhost:3000/task")
    const data: Task[] = await res.json()
    return data
}

export async function createTask(title: string, description?: string): Promise<Task> {
    const res = await fetch("http://localhost:3000/task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"title": title, "description": description ? description : ""})
    })
    const data: Task = await res.json()
    return data
}

export async function updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const res = await fetch(`http://localhost:3000/task/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    })
    const data: Task = await res.json()
    return data
}

export async function deleteTask(id: string): Promise<void> {
    await fetch(`http://localhost:3000/task/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export async function searchTasks(query: string): Promise<Task[]> {
    const res = await fetch(`http://localhost:3000/task/search?query=${query}`)
    const data: Task[] = await res.json()
    return data
}


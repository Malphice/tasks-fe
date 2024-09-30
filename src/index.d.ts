export interface Task {
    _id: string
    title: string
    description: string
    created_at: string
    completed: boolean
}

export interface SearchHit {
    taskId: string
    title: string
    description: string
    matches: {
        field: 'title' | 'description'
        text: string
    }[]
}
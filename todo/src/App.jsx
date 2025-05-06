import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || []
    console.log("Loaded from localStorage:", savedTodos)
    setTodos(savedTodos)
  }, [])

  useEffect(() => {
    console.log("Saving to localStorage:", todos)
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos])

  const handleEdit = (e, id) => {
    const t = todos.find(i => i.id === id)
    setTodo(t.todo)
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleDelete = (e, id) => {
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleAdd = () => {
    if (todo.trim() === "") return
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
  }

  const handleCheckbox = (e) => {
    const id = e.target.name
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    )
    setTodos(updatedTodos)
  }

  const handleShowFinished = () => {
    setShowFinished(!showFinished)
  }

  return (
    <div className="container mx-auto p-4 bg-violet-100 min-h-screen">
      <div className="addTodo max-w-2xl mx-auto">
        <h2 className='text-lg font-bold mb-2'>Add TODO</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            className='w-full bg-white flex-1 px-3 py-2 border border-gray-300 rounded-md'
            placeholder="Enter your task"
          />
          <button
            onClick={handleAdd}
            className='bg-violet-800 hover:bg-violet-600 px-4 py-2 text-sm text-white rounded-md'
          >
            Add
          </button>
        </div>
      </div>

      <div className="todos max-w-2xl mx-auto mt-8">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4 cursor-pointer select-none">
          <input
            onChange={handleShowFinished}
            type="checkbox"
            checked={showFinished}
            className="form-checkbox h-4 w-4 text-violet-800 rounded focus:ring-violet-500"
          />
          Show Finished Tasks
        </label>

        <h2 className='text-xl font-bold pb-4'>Your TODOs</h2>
        {todos.map(item => (showFinished || !item.isCompleted) && (
          <div key={item.id} className="todo bg-white shadow-sm rounded-md p-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className='flex gap-3 items-center w-full sm:w-auto'>
              <input
                onChange={handleCheckbox}
                type="checkbox"
                checked={item.isCompleted}
                name={item.id}
              />
              <div className={`w-full sm:w-auto break-words ${item.isCompleted ? "line-through text-gray-500" : ""}`}>
                {item.todo}
              </div>
            </div>
            <div className="buttons flex gap-2 mt-2 sm:mt-0">
              <button
                className='bg-violet-800 hover:bg-violet-600 px-3 py-1 text-sm text-white rounded-md'
                onClick={(e) => handleEdit(e, item.id)}
              >
                Edit
              </button>
              <button
                className='bg-violet-800 hover:bg-violet-600 px-3 py-1 text-sm text-white rounded-md'
                onClick={(e) => handleDelete(e, item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

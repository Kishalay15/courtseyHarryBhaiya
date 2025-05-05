import Navbar from './components/Navbar'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

function App() {

  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])

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


  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 p-5 bg-violet-100 min-h-[80vh]">
        <div className="addTodo">
          <h2 className='text-lg font-bold'>Add TODO</h2>
          <input onChange={handleChange} value={todo} type="text" className='bg-white w-80' />
          <button onClick={handleAdd} className='bg-violet-800 hover:bg-violet-600 p-2 py-1 text-sm text-white mx-6'>Add</button>
        </div>
        <h2 className='text-xl font-bold py-5'>Your TODOs</h2>
        <div className="todos">
          {todos.map(item => (
            <div key={item.id} className="todo my-1 w-1/2 flex justify-between">
              <div className='flex gap-3'>
                <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} name={item.id} id="" />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons">
                <button className='bg-violet-800 hover:bg-violet-600 p-2 py-1 text-sm text-white mx-1' onClick={(e) => { handleEdit(e, item.id) }}>Edit</button>
                <button className='bg-violet-800 hover:bg-violet-600 p-2 py-1 text-sm text-white' onClick={(e) => { handleDelete(e, item.id) }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App

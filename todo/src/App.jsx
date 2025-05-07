import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Check,
  Pencil,
  PlusCircle,
  Trash,
  X,
  Edit3
} from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [editId, setEditId] = useState(null)
  const [editingTodos, setEditingTodos] = useState({})

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || []
    console.log("Loaded from localStorage:", savedTodos)
    setTodos(savedTodos)
  }, [])

  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const timeout = setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(todos))
    }, 300)
    return () => clearTimeout(timeout)
  }, [todos])

  const startEdit = (id, currentText) => {
    setEditingTodos(prev => ({
      ...prev,
      [id]: { text: currentText }
    }))
  }

  const cancelEdit = (id) => {
    setEditingTodos(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
    showToast("Edit cancelled", "info")
  }

  const saveEdit = (id) => {
    const newText = editingTodos[id]?.text?.trim()
    if (!newText) return
    setTodos(todos.map(item =>
      item.id === id ? { ...item, todo: newText } : item
    ))
    setEditingTodos(prev => {
      const updated = { ...prev }
      delete updated[id]
      return updated
    })
    showToast("Task updated successfully", "info")
  }


  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" })
    }, 3000)
  }

  const handleDelete = (e, id) => {
    const todoText = todos.find(item => item.id === id)?.todo
    setTodos(todos.filter(item => item.id !== id))
    showToast(`"${todoText.substring(0, 20)}${todoText.length > 20 ? '...' : ''}" deleted`, "error")
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleAdd = () => {
    if (todo.trim() === "") return
    if (editId) {
      setTodos(todos.map(item =>
        item.id === editId ? { ...item, todo } : item
      ))
      showToast("Task updated successfully", "info")
      setEditId(null)
    } else {
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
      showToast("Task added successfully")
    }
    setTodo("")
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setEditId(null)
      setTodo("")
      showToast("Edit cancelled", "info")
    }
  }

  const handleCheckbox = (e) => {
    const id = e.target.name
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    )
    setTodos(updatedTodos)

    const changed = updatedTodos.find(item => item.id === id)
    showToast(
      changed.isCompleted ? "Task marked as complete" : "Task marked as incomplete",
      changed.isCompleted ? "success" : "info"
    )
  }

  const handleShowFinished = () => {
    setShowFinished(!showFinished)
  }

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id)
    if (e.key === "Escape") cancelEdit(id)
  }

  const todoVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { opacity: 1, height: "auto", marginBottom: "0.75rem" },
    exit: { opacity: 0, height: 0, marginBottom: 0 }
  }

  const toastVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 bg-violet-100 min-h-screen min-w-0">
      <div className="addTodo max-w-2xl mx-auto">
        <h2 className='text-lg font-bold mb-2'>Add TODO</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            className='w-full bg-white flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent'
            placeholder="Enter your task"
            onKeyDown={handleKeyDown}
          />
          <button
            title="Add Task"
            onClick={handleAdd}
            className='bg-violet-800 hover:bg-violet-600 p-2 sm:px-4 sm:py-2 text-white rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors'
            aria-label="Add Task"
          >
            <PlusCircle size={20} className="sm:hidden" />
            <span className="hidden sm:inline text-sm">Add</span>
          </button>
        </div>
      </div>

      <div className="todos max-w-2xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 mb-6 px-4 py-3 rounded-md">
          <button
            onClick={handleShowFinished}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border transition-colors
      ${showFinished
                ? "bg-violet-800 text-white border-violet-800 hover:bg-violet-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-violet-50"}
    `}
          >
            {showFinished ? "Hide Finished Tasks" : "Show Finished Tasks"}
          </button>

          <button
            onClick={() => {
              setTodos([])
              localStorage.removeItem("todos")
              showToast("All tasks cleared", "info")
            }}
            className="text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-md px-3 py-1 transition-colors"
          >
            Clear All Tasks
          </button>
        </div>


        <h2 className='text-xl font-bold pb-4'>Your TODOs</h2>

        <AnimatePresence>
          {todos.map(item => (showFinished || !item.isCompleted) && (
            <motion.div
              key={item.id}
              variants={todoVariants}
              initial="hidden"
              animate="visible"
              aria-live="assertive"
              exit="exit"
              className="todo bg-white shadow-sm rounded-md p-3 mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className='flex gap-3 items-center w-full sm:w-auto'>
                <input
                  onChange={handleCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                  name={item.id}
                  className="form-checkbox h-5 w-5 text-violet-800 rounded focus:ring-violet-500 transition-all"
                  aria-label={`Mark "${item.todo}" as ${item.isCompleted ? 'incomplete' : 'complete'}`}
                />
                {editingTodos[item.id] ? (
                  <input
                    type="text"
                    value={editingTodos[item.id].text}
                    onChange={e => setEditingTodos(prev => ({
                      ...prev,
                      [item.id]: { text: e.target.value }
                    }))}
                    onKeyDown={(e) => handleEditKeyDown(e, item.id)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                    autoFocus
                  />
                ) : (
                  <div className={`w-full sm:w-auto break-words ${item.isCompleted ? "line-through text-gray-500" : ""}`}>
                    {item.todo}
                  </div>
                )}
              </div>
              <div className="buttons flex gap-2 mt-2 sm:mt-0">
                {editingTodos[item.id] ? (
                  <>
                    <button
                      title="Save Task"
                      onClick={() => saveEdit(item.id)}
                      className="bg-green-600 hover:bg-green-500 p-2 text-white rounded-md transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      title="Cancel Edit"
                      onClick={() => cancelEdit(item.id)}
                      className="bg-gray-500 hover:bg-gray-400 p-2 text-white rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      title="Edit Task"
                      onClick={() => startEdit(item.id, item.todo)}
                      className="bg-violet-800 hover:bg-violet-600 p-2 text-white rounded-md transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Delete Task"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="bg-violet-800 hover:bg-violet-600 p-2 text-white rounded-md transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No tasks yet. Add one above!
          </div>
        )}
      </div>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-live="assertive"
            variants={toastVariants}
            className={`fixed bottom-4 right-4 max-w-xs sm:max-w-sm break-words text-sm flex items-center gap-2 p-3 rounded-md shadow-lg ${toast.type === 'error' ? 'bg-red-100 text-red-800' :
              toast.type === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}
          >
            <span className="p-1 rounded-full bg-white">
              {toast.type === 'error' ? <X size={16} /> :
                toast.type === 'info' ? <Edit3 size={16} /> :
                  <Check size={16} />}
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="text-center text-gray-400 text-xs py-6">
        <span>
          Built with <span className="text-violet-700">💜</span> by{" "}
          <a
            href="https://personal-portfolio-wheat-kappa.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-violet-600 transition-colors"
          >
            Kishalay Lahiri
          </a>
        </span>
      </footer>
    </div>
  )
}

export default App

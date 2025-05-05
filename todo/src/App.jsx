import Navbar from './components/Navbar'
import { useState } from 'react'

function App() {

  const [todos, setTodos] = useState("")

  const handleEdit = () => {

  }

  const handleDelete = () => {

  }

  const handleAdd = () => {

  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 p-5 bg-violet-100 min-h-[80vh]">
        <div className="addTodo">
          <h2 className='text-lg font-bold'>Add TODO</h2>
          <input type="text" className='bg-white w-80' />
          <button onClick={handleAdd} className='bg-violet-800 hover:bg-violet-600 p-2 py-1 text-sm text-white mx-6'>Add</button>
        </div>
        <h2 className='text-xl font-bold'>Your TODOs</h2>
        <div className="todos">
          <div className="todo flex">
            <div className="text">Lorem ipsum dolor sit amet</div>
            <div className="buttons">
              <button onClick={handleEdit}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

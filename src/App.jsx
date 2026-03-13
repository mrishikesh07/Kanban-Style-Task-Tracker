import { useEffect, useState } from 'react'
import AddTask from './components/AddTask'
import DisplayBoard from './components/DisplayBoard'
import { useDrop } from 'react-dnd'

function App() {

  const [taskList, setTaskList] = useState(() => {
    const stored = localStorage.getItem("taskList")
    return stored ? JSON.parse(stored) : []
  })

  const [completed, setCompleted] = useState(() => {
    const stored = localStorage.getItem("completedTasks")
    return stored ? JSON.parse(stored) : []
  })

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList))
    localStorage.setItem("completedTasks", JSON.stringify(completed))
  }, [taskList, completed])

  // PAGINATION CALCULATIONS
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = taskList.slice(indexOfFirstTask, indexOfLastTask)

  const totalPages = Math.ceil(taskList.length / tasksPerPage)

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item) => addToCompleted(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }))

  const addToCompleted = (id) => {

    const task = taskList.find(t => t.id === id)

    if (!task) return

    setCompleted(prev => {
      if (prev.some(t => t.id === id)) return prev
      return [...prev, task]
    })

    setTaskList(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      <h1 className='text-2xl font-bold py-4 pl-6'>The Task Tracker</h1>
      <p className='text-xl pl-6'>Hi there!</p>

      <div className='flex flex-row items-center'>
        <p className='text-xl pl-6'>Click</p>

        <AddTask
          taskList={taskList}
          setTaskList={setTaskList}
        />

        <p className='text-xl my-2'>to add a new task</p>
      </div>

      <div className='flex flex-row'>

        <div className='w-full'>
          <h2 className='ml-6 text-xl font-semibold w-3/4 max-w-lg py-2 px-4 my-4 bg-gray-300'>
            To Do:
          </h2>

          <div className='ml-6 flex flex-col-reverse'>

            {currentTasks.map((task, i) => (

              <DisplayBoard
                key={task.id}
                task={task}
                index={i}
                taskList={taskList}
                setTaskList={setTaskList}
                completed={completed}
                setCompleted={setCompleted}
              />

            ))}

          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className='ml-6 flex gap-3 my-4 items-center'>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className='border px-3 py-1 rounded'
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className='border px-3 py-1 rounded'
              >
                Next
              </button>

            </div>
          )}

        </div>

        <div
          className={`w-full flex flex-col ${isOver ? "bg-green-100" : ""}`}
          ref={drop}
        >

          <h2 className='text-xl font-semibold w-3/4 max-w-lg py-2 px-4 my-4 bg-gray-300'>
            Completed:
          </h2>

          {completed.map((task, i) => (

            <DisplayBoard
              key={task.id}
              task={task}
              index={i}
              taskList={taskList}
              setTaskList={setTaskList}
              completed={completed}
              setCompleted={setCompleted}
            />

          ))}

        </div>

      </div>
    </>
  )
}

export default App
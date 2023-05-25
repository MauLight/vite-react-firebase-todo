import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, runTransaction, orderBy, query } from 'firebase/firestore'
import EditTodo from "./EditTodo"
import { db } from '../services/firebase.config'
import { useState, useEffect } from 'react'

const Todo = () => {

    const collectionRef = collection(db, 'to-do')
    const [createTodo, setCreateTodo] = useState("")
    const [todos, setTodos] = useState([])
    const [checked, setChecked] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await addDoc(collectionRef, {
                todo: createTodo,
                ischecked: false,
                timestamp: serverTimestamp()
            })
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            window.confirm("Are you sure you want to delete this Item?")
            const documentRef = doc(db, "to-do", id)
            await deleteDoc(documentRef)
            window.location.reload()
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleCheck = async (e, todo) => {
        setChecked(state => {
            const indexToUpdate = state.findIndex(checkBox => checkBox.id.toString() === e.target.name)
            let newState = state.slice()
            newState.splice(indexToUpdate, 1, {
                ...state[indexToUpdate],
                ischecked: !state[indexToUpdate].ischecked
            })
            setTodos(newState)
            return newState
        })

        try {
            const docRef = doc(db, "to-do", e.target.name)
            await runTransaction(db, async (transaction) => {
                const todoDoc = await transaction.get(docRef)
                if (!todoDoc.exists()) {
                    throw "Document does not exist."
                }
                const newValue = !todoDoc.data().isChecked;
                transaction.update(docRef, { isChecked: newValue })
            })
            console.log("Transaction succcesfully commited.")
        }
        catch (error) {
            console.log("Transaction failed:", error)
        }
    }

    useEffect(() => {
        const getTodos = async () => {
            const q = query(collectionRef, orderBy('timestamp'))
            await getDocs(q).then((todo) => {
                let todoData = todo.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setTodos(todoData)
                setChecked(todoData)
            }).catch((error) => {
                console.log(error)
            })
        }
        getTodos()
    }, [])

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-white">
                            <div className="card-body">
                                <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#addModal"
                                    type="button"
                                    className="btn btn-info">Add Todo
                                </button>

                                {
                                    todos.map(({ todo, id, isChecked, timestamp }) =>

                                        <div key={id} className="todo-list">
                                            <div className="todo-item">
                                                <hr />
                                                <span className={`${isChecked ? 'done' : ''}`}>
                                                    <div className="checker" >
                                                        <span className="" >
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked={isChecked}
                                                                name={id}
                                                                onChange={(e) => handleCheck(e, todo)}
                                                            />
                                                        </span>
                                                    </div>
                                                    &nbsp;{todo}<br />
                                                    <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                                                </span>
                                                <span className=" float-end mx-3">
                                                    <EditTodo todo={todo} id={id} /></span>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger float-end"
                                                    onClick={() => handleDelete(id)}>Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="addModal"
                tabIndex="-1"
                aria-labelledby="addModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <form className="d-flex" onSubmit={handleSubmit}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5
                                    className="modal-title"
                                    id="addModalLabel">
                                    Add Todo
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a Todo"
                                    onChange={(e) => setCreateTodo(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                                </button>

                                <button className="btn btn-primary">Create Todo</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Todo
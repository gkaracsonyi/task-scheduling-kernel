import { useDebugValue, useEffect, useState } from "react";
import { db } from "./firebase.js";
import {
    onSnapshot,
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

function App() {
    const [tasks, setTasks] = useState([]);

    const colRef = collection(db, 'tasks');
    const q = query(colRef, orderBy('createdAt'));

    // TODO: Shit is bugging. Constantly reading from firestore

    useEffect(() => {
        // Setup onSnapshot subscription
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let tasksData = [];
            snapshot.docs.forEach((doc) => {
                tasksData.push({ ...doc.data(), id: doc.id });
            });
            setTasks(tasksData);
            console.log(tasksData);
        });
    
        // Cleanup function
        return () => {
            unsubscribe(); // Unsubscribe when component unmounts
        };
    }, []);

    const handleAddTaskSubmit = (e) => {
        e.preventDefault();

        addDoc(colRef, {
            title: e.target.title.value,
            description: e.target.desc.value,
            createdAt: serverTimestamp(),
            priority: e.target.priority.value,
            expiry: e.target.expiry.value
        })
            .then(() => {
                e.target.reset();
            })
            .then(() => {
                closePopup();
            })
            .catch(error => {
                console.error("Error adding document: ", error);
            })
    };

    const handleRemoveDocSubmit = (e) => {
        e.preventDefault();

        const docRef = doc(colRef, e.target.docID.value);

        deleteDoc(docRef)
            .then(() => {
                e.target.reset();
            });
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            // Convert Firestore timestamp to JavaScript Date
            const jsDate = timestamp.toDate();
    
            // Format the date for display
            const formattedDate = jsDate.toLocaleString(); // Adjust format as needed
    
            return formattedDate;
        } else {
            return "Invalid Timestamp";
        }
    };
    

    // Sets popup to hidden on page load
    const [isPopupShown, setIsPopupShown] = useState(true);

    // Shows popup
    function openPopup() {
        setIsPopupShown(false);
        document.getElementById("taskField").focus();
    }

    // Hides popup
    function closePopup() {
        setIsPopupShown(true);
    }   

    useEffect(() => {
        const handleKeyPress = (event) => {
            console.log("Key pressed:", event.key)
            // Check if the pressed key is "t" and the Shift key is pressed
            if ((event.key === "T" || event.key === "t") && event.shiftKey) {
            // Call your function here
            handleShiftTKeyPress();
          }
        };
    
        const handleShiftTKeyPress = () => {
          openPopup();
        };
    
        // Add the global event listener when the component mounts
        window.addEventListener("keydown", handleKeyPress);
    
        // Remove the event listener when the component unmounts
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, []);
    

    return (
        <div className="app-main">
            <div className="app--header">
                <img className="app--header--logo" src="/tsk.svg" />
                <h1>Testing Database Connection</h1>
            </div>
            <h3>Add Task</h3>
            <button className="app--header--addTaskButton" onClick={openPopup}>Add Task</button>
            <div className={`app--popupContainer ${isPopupShown ? "app--popupContainerHidden" : ""}`}>
                <form className="addTask" id="addTask" onSubmit={handleAddTaskSubmit}>
                    <div className="addTask--header">
                        <h2>Add Task</h2>
                        <div>
                            <p className="addTask--header--esc">(esc)</p>
                            <button onClick={closePopup}>
                                <img src="/whiteX.svg" alt="white X symbol" />
                            </button>
                        </div>
                    </div>
                    <input
                        id="taskField"
                        type="text"
                        name="title"
                        placeholder="Task Name"
                        className="app--addTask--input"
                    />
                    <br />
                    <input
                        type="text"
                        name="desc"
                        placeholder="Description"
                        className="app--addTask--input"
                    />
                    <br />
                    <input
                        type="datetime-local"
                        name="expiry"
                        className="app--addTask--date"
                    />
                    <br />
                    <select name="priority" placeholder="priority" className="app--addTask--prioritySlider">
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">URGENT</option>
                    </select>
                    <br />
                    <button className="app--addTask--submit" type="submit">Submit</button>
                </form>
            </div>
            <h3>Remove Document</h3>
            <form className="removeDoc" id="removeDoc" onSubmit={handleRemoveDocSubmit}>
                <input
                    type="text"
                    name="docID"
                    placeholder="document ID"
                />
                <br />
                <button type="submit">Delete</button>
            </form>
            <br />
            <br />
            <h2>Task List</h2>
            <h3>(It normally works but Sundar is a fucking cunt!)</h3>
            <div className="taskList">
                {tasks.map(task => (
                    <div key={task.id}>
                        <h4>Name: {task.title}</h4>
                        <p>Description: {task.description}</p>
                        <p>ID (dev only): {task.id}</p>
                        <p>Created: {formatTimestamp(task.createdAt)}</p>
                        <p>Expiry: </p>
                        <p>Priority: {task.priority}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default App;

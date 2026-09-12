const Storage = "To-Do-List";
const form = document.getElementById("addform");
const input = document.getElementById("addtasks");
const today = document.getElementById("date");
const filterbtn = document.querySelectorAll(".filters");
const myList = document.getElementById("taskList");
const emptyList = document.getElementById("empty");
const clearbtn = document.getElementById("clear");
const countLable = document.getElementById("count");

let myTasks = loadTasks();
let currentFilter = "all";

function loadTasks(){
    try{
        const raw = localStorage.getItem(Storage);
        return raw ? JSON.parse(raw) : [];
    } catch{
        return [];
    }
}
function saveTasks (){
    localStorage.setItem(Storage, JSON.stringify(myTasks))
}
function render(){
    myList.innerHTML =""
    const visible = myTasks.filter((t) => {
        if(currentFilter === "active")
            return !t.done;
        if(currentFilter === "done")
            return t.done;
        return true;
    });
    visible.forEach(myTask => {
        const li = document.createElement("li");
        const check = document.createElement("button");
        check.className = "Check" + (myTask.done ? " is-checked" : "");
        check.setAttribute("Aria-label", "put a mark");
        check.addEventListener("click", () => toggleTask(myTask.id));

        const text = document.createElement("span");
        text.className = "task-text" + (myTask.done ? " is-done" : "");
        text.textContent = myTask.text;

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "X";
        remove.setAttribute("aria-label", "DELETE");
        remove.addEventListener("click", () => removeTasks(myTask.id));

        li.append(check, text, remove);
        myList.appendChild(li);
    });

    emptyList.classList.toggle("is-hidden", myTasks.length>0);

    const remaining = myTasks.filter((t) => !t.done).length;
    countLable.textContent = `${remaining} tasks`;
}
function addTask(text){
    myTasks.unshift({id: Date.now().toString(), text, done:false});
    saveTasks();
    render();
}
function toggleTask(id){
    myTasks = myTasks.map((t) => (t.id === id ? {...t, done: !t.done} : t));
    saveTasks();
    render();
}
function removeTasks(id){
    myTasks = myTasks.filter((t) => t.id !==id);
    saveTasks();
    render();
}
form.addEventListener("submit", (e) => {e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    addTask(text);
    input.value="";
});
filterbtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterbtn.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        currentFilter = btn.dataset.filter;
        render();
    });
});
clearbtn.addEventListener("click", () => {
    myTasks = myTasks.filter((t) => !t.done);
    saveTasks();
    render();
});
today.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
});
render();
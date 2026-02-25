// script.js


function create_task_element(id, task, completed){
    const new_task = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `check_box_${id}`;
    if(completed){
        checkbox.checked = true;
    }
    checkbox.onchange = () => toggleTask(id);

    const span = document.createElement("span");
    span.textContent = task;
    span.id = `task_item_${id}`;
    if(completed){
        span.classList.toggle("completed");
    }

    const edit = get_edit_svg();
    // edit.innerHTML = "Edit";
    edit.id = `edit_btn_${id}`
    edit.onclick = () => editTask(id, task);
    
    
    new_task.appendChild(checkbox);
    new_task.appendChild(span);
    if(!completed){
        new_task.appendChild(edit);
    }

    return new_task
}

function editTask(id, task){
    const item = document.getElementById(`task_item_${id}`);
    const edit_btn = document.getElementById(`edit_btn_${id}`);
    const update_btn = get_ok_svg();
    update_btn.onclick = () => updateTask(id);
    edit_btn.replaceWith(update_btn);

    const update_field = document.createElement("input");
    update_field.type = "text";
    update_field.id = `update_field_${id}`;
    update_field.value = task;
    item.replaceWith(update_field);

}

async function updateTask(id){
    const updated_task = document.getElementById(`update_field_${id}`).value;

    const response = await fetch("http://127.0.0.1:8000/update-task", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body : JSON.stringify({
            "id": id,
            "item": updated_task
        })
    });
    // console.log(response);
    fetch_items();
}

async function toggleTask(id){
    const response = await fetch("http://127.0.0.1:8000/complete", {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "id": id
        })
    });
    // console.log(response);
    fetch_items();
}

async function fetch_items(){
    const response = await fetch("http://127.0.0.1:8000/get-items", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    });
    const data = await response.json();
    const records = data["data"]
    // console.log(records);
    const list = document.getElementById("item-list");
    list.replaceChildren();
    if(records){
        for (let i=0; i<records.length; i++){
            const new_task = create_task_element(records[i]["id"], records[i]["item"], records[i]["completed"]);
            list.appendChild(new_task);
        }
    }
}

async function delete_completed() {
    const response = await fetch("http://127.0.0.1:8000/delete-completed", {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        }
    });
    // console.log(response);
    fetch_items();
}

function get_edit_svg(){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("class", "size-6");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("d", "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10");

    svg.appendChild(path);
    return svg;

}

function get_ok_svg(){
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("class", "size-6");
    svg.setAttribute("fill", "none");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("d", "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");

    svg.appendChild(path);
    return svg;
}

/*

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>


*/
// submit even listener

document.getElementById("add-task-form").addEventListener("submit", async (e)=> {
    e.preventDefault();

    const input_field = document.getElementById("task-name");
    input_field.innerHTML = "";

    const form_data = new FormData(e.target);

    const data = Object.fromEntries(form_data.entries());
    // console.log(JSON.stringify(data));

    const response = await fetch("http://127.0.0.1:8000/add", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    });

    // console.log(response);
    e.target.reset();
    fetch_items();

});

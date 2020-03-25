function createTodo() {
  const name = document.getElementById("name")
  const todo = document.getElementById("todo")

  const form = {
    name: name.value,
    todo: todo.value,
  }

  fetch("/todos", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  }).then((response) => {
    if (response.ok) {
      alert("登録しました")
      getTodo()
    } else {
      alert("登録失敗しました")
    }
  }).catch((err) => {
    console.log(err);
  })
}

function getTodo() {
  fetch("/todos").then((response) => {
    return response.json();
  }).then((todos) => {
    for (const todo of todos) {
      todo.button = "button"
    }
    makeTodoTable(todos)
  }).catch((err) => {
    console.log(err);
  })
}

function makeTodoTable(todos) {
  const table = document.getElementById("table")
  table.innerHTML = ""

  todos.unshift({id:"id", name: "name", todo:"todo", operation: "operation"})

  for (const todo of todos) {
    const tr = document.createElement("tr")
    for (const c of Object.values(todo)) {
      if (c === "button") {
        const button = document.createElement("button")
        button.textContent = "削除"
        button.onclick = function() {
          fetch(`/todos?id=${todo.id}`, {
            method: 'DELETE',
          }).then((response) => {
            if (response.ok) {
              alert("削除しました")
              getTodo()
            } else {
              alert("削除失敗しましt")
            }
          }).catch((err) => {
            console.log(err);
          })
        }
        tr.appendChild(button)
      } else {
        const td = document.createElement("td")
        td.textContent = c
        tr.appendChild(td)
      }
    }
    table.appendChild(tr)
  }
}

getTodo()

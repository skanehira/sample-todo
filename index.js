const table = document.getElementById("table")

function makeTr(data) {
  const tr = document.createElement("tr")

  for (h of data) {
    if (h == "button") {
      const bt = document.createElement("button")
      bt.textContent = "削除"
      bt.onclick = function() {
        const id = data[0]

        fetch(`/todos?id=${id}`, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            alert("削除しました")
            updateTable()
          } else {
            alert("エラー")
          }
        }).catch((err) => {
          console.log(err);
        })
      }
      tr.appendChild(bt)
    } else {
      const td = document.createElement("td")
      td.textContent = h
      tr.appendChild(td)
    }
  }

  return tr
}

function makeHeader() {
  const headers = ["id", "name", "todo", "operation"]
  return makeTr(headers)
}

function getTodo() {
  fetch("/todos").then((response) => {
    return response.json();
  }).then((todos) => {
    for (todo of todos) {
      let t = Object.values(todo)
      t.push("button")
      table.appendChild(makeTr(t))
    }
  }).catch((err) => {
    console.log(err);
  })
}

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
  }).then(() => {
    alert("登録しました")
    updateTable()
    name.value = ""
    todo.value = ""
  }).catch((err) => {
    console.log(err);
  })

  console.log(`name: ${name}, todo: ${todo}`)
}

function deleteTodo() {

}

function updateTable() {
    table.innerHTML = ""
    table.appendChild(makeHeader())
    getTodo()
}

table.appendChild(makeHeader())
getTodo()

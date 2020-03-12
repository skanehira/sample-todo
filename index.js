const app = new Vue({
  el: '#app',
  data: {
    form: {
      title: "",
      detail: "",
    },
    header: [
      "id",
      "title",
      "detail",
      "operation",
    ],
    todos:[
    ],
    message: 'Hello Vue!'
  },
  methods: {
    resetFrom() {
      this.form = {}
    },
    getTodo() {
      axios.get("/todos").then(response => {
        this.todos = response.data
      }).catch(err => {
        alert(err)
      })
    },
    addTodo(event) {
      event.preventDefault();
      if (!this.form.title || !this.form.detail) {
        alert("タイトルまたは詳細が入力されていません")
        return
      }
      axios.post("/add", this.form).then(() => {
        alert("登録できました")
        this.getTodo()
      }).catch(err => {
        alert(err)
      })
    },
    deleteTodo(id) {
      axios.delete("/delete", {
        params: {
          id: id,
        }
      }).then(() => {
        alert("削除しました")
        this.getTodo()
      }).catch(err => {
        alert(err)
      })
    }
  },
  mounted(){
    this.getTodo()
  }
})


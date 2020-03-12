const app = new Vue({
  el: '#app',
  data: {
    form: {},
    header: [
      "id",
      "name",
      "todo",
      "operation",
    ],
    todos: []
  },
  methods: {
    createTodo() {
      axios.post("/todos", this.form).then((response) => {
        alert("登録しました")
        this.getTodos()
        this.form = {}
      }).catch((error) => {
        console.log(error);
      })
    },
    getTodos() {
      axios.get("/todos", {}).then((response) => {
        this.todos = response.data;
      }).catch((error) => {
        console.log(error);
      })
    },
    deleteTodo(id) {
      axios.delete("/todos", {
        params: {
          id: id,
        }
      }).then((response) => {
        alert("削除しました")
        this.getTodos()
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted(){
    this.getTodos();
  }
})


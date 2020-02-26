package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

type Todo struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Detail string `json:"detail"`
}

func getTodos() ([]Todo, error) {
	todos := []Todo{}

	rows, err := db.Query("select * from todos")
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var id int
		var (
			title  string
			detail string
		)

		if err := rows.Scan(&id, &title, &detail); err != nil {
			return nil, err
		}

		todos = append(todos, Todo{ID: id, Title: title, Detail: detail})
	}

	return todos, nil
}

func addTodo(todo Todo) error {
	if _, err := db.Exec("insert into todos (title, detail) values(?, ?)", todo.Title, todo.Detail); err != nil {
		return err
	}
	return nil
}

func deleteTodo(id int) error {
	if _, err := db.Exec("delete from todos where id = ?", id); err != nil {
		return err
	}
	return nil
}

func writeError(w http.ResponseWriter, err error) {
	w.Write([]byte(err.Error()))
	w.WriteHeader(http.StatusInternalServerError)
}

func init() {
	var err error
	// init db connection
	db, err = sql.Open("sqlite3", "test.db")
	if err != nil {
		log.Fatal(err)
	}

	// create table
	createSQL := `
create table if not exists todos (id integer primary key AUTOINCREMENT, title varchar(255), detail varchar(255))
`
	if _, err = db.Exec(createSQL); err != nil {
		log.Fatal(err)
	}
}

func main() {
	http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
		todos, err := getTodos()
		if err != nil {
			writeError(w, err)
			return
		}

		if err := json.NewEncoder(w).Encode(todos); err != nil {
			writeError(w, err)
			return
		}
	})

	http.HandleFunc("/add", func(w http.ResponseWriter, r *http.Request) {
		todo := Todo{}
		if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
			writeError(w, err)
			return
		}
		if err := addTodo(todo); err != nil {
			writeError(w, err)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	http.HandleFunc("/delete", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query()
		if query == nil {
			writeError(w, errors.New("no query parameter"))
			return
		}
		ids, ok := query["id"]
		if !ok {
			writeError(w, errors.New("not found id"))
			return
		}

		id, err := strconv.Atoi(ids[0])
		if err != nil {
			writeError(w, err)
			return
		}

		if err := deleteTodo(id); err != nil {
			writeError(w, err)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	http.Handle("/", http.FileServer(http.Dir(".")))
	log.Println("Start server")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

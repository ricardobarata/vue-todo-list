<template>
  <v-container class="app-todo">
    <v-card :dark="darkTheme" max-width="500" class="mx-auto app-todo__card">
      <v-toolbar
        :class="darkTheme ? 'yellow darken-1' : 'blue darken-1'"
        :dark="!darkTheme"
        :light="darkTheme"
      >
        <v-toolbar-title>Todo List</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y left :dark="darkTheme">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            <v-btn icon @click="toggleDarkTheme">
              <v-icon>mdi-brightness-6</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="sortByPriorityAsc">
              <v-list-item-icon>
                <v-icon>mdi-sort-ascending</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sort by priority ascending</v-list-item-title>
            </v-list-item>
            <v-list-item @click="sortByPriorityDesc">
              <v-list-item-icon>
                <v-icon>mdi-sort-descending</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sort by priority descending</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-row class="app-todo__addrow">
        <v-col>
          <v-card outlined tile>
            <v-card-text>
              <v-text-field
                v-model="todo"
                label="Add a todo"
                solo
                clearable
                hide-details="auto"
              >
              </v-text-field>
            </v-card-text>
            <v-row>
              <v-col align="center" justify="center">
                <v-btn-toggle v-model="priority" borderless mandatory>
                  <v-btn outlined value="1">
                    <v-icon left>mdi-numeric-1-circle-outline</v-icon>
                    <span>Life Changing</span>
                  </v-btn>
                  <v-btn outlined value="2">
                    <v-icon left>mdi-numeric-2-circle-outline</v-icon>
                    <span>Important</span>
                  </v-btn>
                  <v-btn outlined value="3">
                    <v-icon left>mdi-numeric-3-circle-outline</v-icon>
                    <span>Meh</span>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-divider class="mt-12"></v-divider>
            <v-card-actions>
              <v-btn text @click="clearTodos">Clear List</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                :class="darkTheme ? 'yellow darken-1' : 'blue darken-1'"
                raised
                :disabled="validateTodoInput"
                @click="addTodo"
                :dark="!validateTodoInput && !darkTheme"
                :light="!validateTodoInput && darkTheme"
                >Add</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-simple-table class="app-todo__table" fixed-header height="500px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Todo</th>
              <th class="text-left">Priority</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in todos" :key="item.id">
              <td class="app-todo__tdtodo">{{ item.todo }}</td>
              <td>
                <v-icon
                  left
                  v-text="'mdi-numeric-' + item.priority + '-circle-outline'"
                ></v-icon>
              </td>
              <td>
                <v-btn icon @click="editTodo(item)">
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn icon @click="deleteTodo(item.id)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-overlay :z-index="zIndex" :value="overlay" :dark="darkTheme">
      <v-card outlined>
        <v-card-text>
          <v-text-field
            v-if="todoToEdit"
            v-model="todoToEdit.todo"
            outlined
            hide-details="auto"
            label="Todo"
          ></v-text-field>
          <!-- classic br -->
          <br />
          <v-text-field
            v-if="todoToEdit"
            v-model="todoToEdit.priority"
            outlined
            hide-details="auto"
            label="Priority"
          ></v-text-field>
        </v-card-text>
        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
          <v-btn text @click="overlay = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn raised @click="updateTodo()">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  name: "TodoList",
  props: {},
  data: () => ({
    darkTheme: false,
    todo: "",
    priority: 1,
    todoMaxId: 0,
    todos: [],
    overlay: false,
    zIndex: 10,
    todoToEdit: null
  }),
  mounted() {
    this.loadTheme();
    this.loadTodos();
    this.initMaxId();
  },
  computed: {
    validateTodoInput() {
      if (!this.todo) {
        return true;
      }

      return this.todo.trim().length === 0;
    }
  },
  methods: {
    addTodo() {
      this.todoMaxId = ++this.todoMaxId;
      this.todos = [
        ...this.todos,
        {
          id: this.todoMaxId,
          todo: this.todo,
          priority: this.priority
        }
      ];
      this.saveTodos();
      this.todo = null;
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(item => item.id != id);
    },
    updateTodo() {
      // Didn't write any validation to update the todo.. we can update it with anything
      const todo = this.todos.find(todo => todo.id === this.todoToEdit.id);
      let index = this.todos.indexOf(todo);
      this.todos.fill((todo.todo = this.todoToEdit.todo), index, index++);
      this.todos.fill(
        (todo.priority = this.todoToEdit.priority),
        index,
        index++
      );
      this.overlay = false;
      this.saveTodos();
    },
    editTodo(todo) {
      this.todoToEdit = { ...todo };
      this.overlay = true;
    },
    clearTodos() {
      this.todos = [];
    },
    initMaxId() {
      this.todos.forEach(todo => {
        if (todo.id > this.todoMaxId) {
          this.todoMaxId = todo.id;
        }
      });
    },
    sortByPriorityAsc() {
      this.todos.sort((a, b) => a.priority - b.priority);
      this.saveTodos();
    },
    sortByPriorityDesc() {
      this.todos.sort((a, b) => b.priority - a.priority);
      this.saveTodos();
    },
    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme;
      this.saveTheme();
    },
    saveTodos() {
      const parsed = JSON.stringify(this.todos);
      localStorage.setItem("_todos", parsed);
    },
    loadTodos() {
      if (localStorage.getItem("_todos")) {
        try {
          this.todos = JSON.parse(localStorage.getItem("_todos"));
        } catch (e) {
          localStorage.removeItem("_todos");
        }
      }
    },
    loadTheme() {
      try {
        this.darkTheme = JSON.parse(localStorage.darkTheme);
      } catch (e) {
        console.log("loadTheme", e);
      }
    },
    saveTheme() {
      localStorage.darkTheme = this.darkTheme;
    }
  }
};
</script>

<style lang="scss">
.app-todo {
  .app-todo__card {
    .app-todo__addrow {
      .col {
        padding: 0 12px 0 12px;
      }
    }
    .app-todo__table {
      .app-todo__tdtodo {
        width: 100%;
        max-width: 0;
      }
    }
  }
}
</style>

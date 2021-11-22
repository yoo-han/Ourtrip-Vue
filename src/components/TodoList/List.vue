<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">To Do List</h3>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="todos" :search="search" :single-expand="singleExpand" :expanded.sync="expanded" item-key="note" show-expand class="elevation-1">
        <template v-slot:[`item.priority`]="{ item }">
          <v-icon x-large color="yellow darken-2" @click="showSnackbar(item)">mdi-information-outline</v-icon>
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" v-if="item.priority== 'Tidak Penting'" class="blue white--text">
            Note: {{ item.note }}
          </td>
          <td :colspan="headers.length" v-if="item.priority== 'Penting'" class="red white--text">
            Note: {{ item.note }}
          </td>
          <td :colspan="headers.length" v-if="item.priority== 'Biasa'" class="green white--text">
            Note: {{ item.note }}
          </td>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" small color="red darken-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small color="green darken-2" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Form Todo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="formTodo.task"
              label="Task"
              required
            ></v-text-field>
            <v-select
              v-model="formTodo.priority"
              :items="['Penting', 'Biasa', 'Tidak Penting']"
              label="Priority"
              required
            ></v-select>
            <v-textarea
              v-model="formTodo.note"
              label="Note"
              required
            ></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-2" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="delete_dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Konfirmasi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-text>Yakin mau menghapus todo ini?</v-text-text>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDeleteDialog"> Batal </v-btn>
          <v-btn color="red darken-2" text @click="deleteItemConfirm"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar_penting" right top color="red" :timeout="timeout">
      <p class="text-center mt-3 font-weight-bold" >Penting</p>
    </v-snackbar>
    <v-snackbar v-model="snackbar_biasa" left top color="green" :timeout="timeout">
      <p class="text-center mt-3 font-weight-bold">Biasa</p>
    </v-snackbar>
    <v-snackbar v-model="snackbar_tidakpenting" color="blue" :timeout="timeout">
      <p class="text-center mt-3 font-weight-bold">Tidak Penting</p>
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
  name: "List",
  data() {
    return {
      search: null,
      dialog: false,
      delete_dialog: false,
      selected_index: -1,
      snackbar_penting: false,
      snackbar_biasa: false,
      snackbar_tidakpenting: false,
      timeout: 1000,
      expanded: [],
      singleExpand: false,
      headers: [
        {
          text: "Task",
          align: "start",
          sortable: true,
          value: "task"
        },
        { text: "Priority", value: "priority" },
        { text: "Note", value: "note" },
        { text: "Actions", value: "actions" },
      ],
      todos: [
        {
          task: "Coding",
          priority: "Penting",
          note: "Code for your life",
        },
        {
          task: "Gaming",
          priority: "Tidak Penting",
          note: "Wasting Time",
        },
        {
          task: "Masak",
          priority: "Biasa",
          note: "Indomie saat coding terbaik gan",
        },
      ],
      formTodo: { task: null, priority: null, note: null },
    };
  },
  methods: {
    save() {
      if (this.selected_index > -1) {
        Object.assign(this.todos[this.selected_index], this.formTodo);
      } else {
        this.todos.push(this.formTodo);
      }
      this.cancel();
    },

    editItem (item) {
      this.selected_index = this.todos.indexOf(item);
      this.formTodo = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem (item) {
      this.selected_index = this.todos.indexOf(item);
      this.formTodo = Object.assign({}, item);
      this.delete_dialog = true;
    },

    deleteItemConfirm () {
      this.todos.splice(this.selected_index, 1);
      this.closeDeleteDialog();
    },

    closeDeleteDialog () {
      this.$nextTick(() => {
        this.resetForm();
        this.selected_index = -1;
      });
      this.delete_dialog = false;
    },

    cancel() {
      this.resetForm();
      this.dialog = false;
    },

    resetForm() {
      this.formTodo = { task: null, priority: null, note: null };
    },

    showSnackbar(item) {
      this.selected_index = this.todos.indexOf(item);
      if(this.todos[this.selected_index].priority == "Penting") {
        this.snackbar_penting = true;
      } else if(this.todos[this.selected_index].priority == "Biasa") {
        this.snackbar_biasa = true;
      } else {
        this.snackbar_tidakpenting = true;
      }
      this.selected_index = -1;
    },
  },
};
</script>
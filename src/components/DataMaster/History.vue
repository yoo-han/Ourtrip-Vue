<template>
    <v-main class="list">
        <v-card min-height="1000" v-bind:style="{ 'backgroundImage': 'url(https://philialabs.com.au/wp-content/uploads/2019/01/cropped-cool-wallpaper-dawn-dusk-66997.jpg)' }">
            <h3 class="text-h3 font-weight-medium mx-5 py-5 white--text"> History </h3>
            <v-card-title class="justify-center">
                <v-text-field
                    dark
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    class="mx-10"
                ></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card class="mx-10">
                <v-data-table dark :headers="headers" :items="reservations" :search="search">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small color="blue darken-1" class="mr-2 white--text" @click="editHandler(item)"><v-icon>mdi-pencil</v-icon> edit </v-btn>
                        <v-btn small color="red darken-3" class="white--text" @click="deleteHandler(item.id)"><v-icon>mdi-close</v-icon> delete </v-btn>
                    </template>
                </v-data-table>
            </v-card>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Reservation</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-date-picker no-title header-color="blue lighten-1" color="blue lighten-1" v-model="form.date" label="date" required></v-date-picker>
                        <v-text-field v-model="form.name" label="name" required></v-text-field>
                        <v-text-field v-model="form.location" label="location" required :disabled="disabled"></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>
                    Anda Yakin ingin membatalkan ini?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Tidak </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Ya </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            disabled: 0,
            headers: [
                { text: "Tanggal", align: "center", sortable: true, value: "date" },
                { text: "Nama", align: "center", value: "name" },
                { text: "Lokasi", align: "center", value: "location" },
                { text: "Actions", align: "center", value: "actions" },
            ],
            reservation: new FormData,
            reservations: [],
            form: {
                date: null,
                name: null,
                location: null,
            },
            deleteId: '',
            editId: ''
        };
    },
    methods: {
        setForm(){
            if(this.inputType !== 'Tambah'){
                this.update();
            }else{
                this.save();
            }
        },

        readData() {
            var url = this.$api + '/reservation/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.reservations = response.data.data;
            })
        },

        save() {
            this.reservation.append('date', this.form.date);
            this.reservation.append('name', this.form.name);
            this.reservation.append('location', this.form.location);

            var url = this.$api + '/reservation'
            this.load = true;
            this.$http.post(url, this.reservation, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        
        update(){
            let newData = {
                date : this.form.date,
                name : this.form.name,
                location : this.form.location,
            };

            var url = this.$api + '/reservation/' + this.editId;
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        deleteData(){
            var url = this.$api + '/reservation/' + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = "Tambah";
                this.$router.push({
                    name: 'History',
                });
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        editHandler(item) {
            this.disabled = (this.disabled + 1) % 2;
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.date = item.date;
            this.form.name = item.name;
            this.form.location = item.location;
            this.dialog = true;
        },

        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        close() {
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readData();
        },

        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },
        
        resetForm() {
            this.form = { date: null,
                name: null,
                location: null};
            this.disabled=0;
        },
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
    },
};
</script>
<template>
    <v-main>
        <v-card min-height="1000" v-bind:style="{ 'backgroundImage': 'url(https://philialabs.com.au/wp-content/uploads/2019/01/cropped-cool-wallpaper-dawn-dusk-66997.jpg)' }">
            <h3 class="text-h3 font-weight-medium mx-5 py-5 white--text"> Reservation </h3>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-btn color="success" v-if="priority == 'Admin'" dark @click="dialogAdmin = true"><v-icon>mdi-plus</v-icon>Tambah </v-btn>
            </v-card-title>

            <v-row>
                <v-col 
                cols="4"
                sm="12"
                md="6"
                lg="4"
                xl="2"
                v-for="item in items" 
                :key="item.title"
                >
                    <v-card>
                        <v-btn v-if="priority == 'Admin'" @click="editHandler(item)" icon><v-icon color="green darken-1">mdi-pencil</v-icon></v-btn>
                        <v-btn v-if="priority == 'Admin'" @click="deleteHandler(item.id)" icon><v-icon color="red darken-3">mdi-delete</v-icon></v-btn>
                        <v-img
                            :src="item.urlPhoto"
                            height="200"
                            width="1904"
                        ></v-img>
                        <v-card-title class="justify-center"> {{ item.title }} </v-card-title>
                        <v-card-subtitle> {{ item.description }} </v-card-subtitle>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn v-if="priority != 'Admin'" @click="addReservation(item)" color="blue darken-1" class="white--text">
                            <v-icon>mdi-plus</v-icon>
                            Pesan
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Reservation</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-date-picker no-title header-color="blue lighten-1" color="blue lighten-1" v-model="form.date" label="Tanggal" required></v-date-picker>
                        <v-text-field v-model="form.name" label="Name" :rules="inputRules" required></v-text-field>
                        <v-text-field v-model="form.location" label="Lokasi" required :disabled="disabled"></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog min-height="1000" v-model="dialogAdmin" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Location</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formAdmin.title" label="Title" required></v-text-field>
                        <v-text-field v-model="formAdmin.description" label="Description" required></v-text-field>
                        <v-text-field v-model="formAdmin.urlPhoto" label="Link Image" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelAdmin"> Cancel </v-btn>
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
                    Anda Yakin ingin Menghapus ini?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelAdmin"> Tidak </v-btn>
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
            priority: localStorage.getItem('name'),
            inputType: 'Add',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogAdmin: false,
            disabled: 0,
            editId: '',
            deleteId: '',
            dialogConfirm:false,
            form: {
                date: null,
                name: null,
                location: null,
            },
            formAdmin: {
                destination: null,
                description: null,
                image: null,
            },
            imageUrl: '',
            item: new FormData,  
            items: [],
            location: new FormData,
            locations: [],
            reservation: new FormData,
            reservations: [],
            inputRules: [
                (v) => !!v || 'Masukkan data yang sesuai!',
            ],
        };
    },
    methods: {
        setForm(){
            if(this.inputType !== 'Add'){
                this.update();
            }else{
                this.saveAdmin();
            }
        },

        addReservation(item) {
            this.dialog = true;
            this.disabled = 1;
            this.form.location = item.title;
            
        },

        save() {
            if(this.form.name != null){            
                this.reservation.append('date', this.form.date);
                this.reservation.append('name', this.form.name);
                this.reservation.append('location', this.form.location);
                this.reservation.append('idUser', localStorage.getItem('id'));

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
                    this.cancel();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            } else {
                this.error_message = 'incorrect name (null)';
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            }
        },

        update(){
            let newData = {
                title : this.formAdmin.title ,
                description : this.formAdmin.description,
                urlPhoto : this.formAdmin.urlPhoto,
            };

            var url = this.$api + '/location/' + this.editId;
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
                this.cancelAdmin();
                this.readData();
                this.inputType = 'Add';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        deleteData(){
            var url = this.$api + '/location/' + this.deleteId;
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
                this.cancelAdmin();
                this.readData();
                this.inputType = "Add";
                this.deleteId = '';
                this.$router.push({
                    name: 'Reservation',
                });
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        editHandler(item) {
            this.disabled = 1;
            this.inputType = 'Edit';
            this.editId = item.id;
            this.formAdmin.title = item.title;
            this.formAdmin.description = item.description;
            this.formAdmin.urlPhoto = item.urlPhoto;
            this.dialogAdmin = true;
        },

        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        readData() {
            var url = this.$api + '/location';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.items = response.data.data;
            })
        },

        saveAdmin() {
            this.location.append('title', this.formAdmin.title);
            this.location.append('description', this.formAdmin.description);
            this.location.append('urlPhoto',this.formAdmin.urlPhoto);

            var url = this.$api + '/location'
            this.load = true;
            this.$http.post(url, this.location, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.cancelAdmin();
                this.readData();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
        },
        
        cancelAdmin() {
            this.resetFormAdmin();
            this.readData();
            this.dialogAdmin = false;
            this.dialogConfirm = false;
        },
        
        resetForm() {
            this.form = { date: null,
                name: null,
                location: null};
            this.disabled=0;
        },

        resetFormAdmin() {
            this.formAdmin = {
                destination: null, description: null,
            };
            this.disabled = 0;
        }
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
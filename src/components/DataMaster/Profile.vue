<template>
    <v-main>
        <v-card min-height="1000" v-bind:style="{ 'backgroundImage': 'url(https://philialabs.com.au/wp-content/uploads/2019/01/cropped-cool-wallpaper-dawn-dusk-66997.jpg)' }">
            <h3 class="text-h3 font-weight-medium mx-5 py-5 white--text"> My Profile </h3>
            <v-avatar class="mt-5" color="indigo" size="150">
                <v-icon dark size="100">
                    mdi-account-circle
                </v-icon>
            </v-avatar>
            <v-spacer class="mt-5">
            </v-spacer>
            <span class="headline white--text mt-5">
                <h3>{{user.name}}</h3>
                <v-spacer class="mt-2"></v-spacer>
                <h5>{{user.email}}</h5>
            </span>
            <v-spacer>
            </v-spacer>
            <v-btn color="blue darken-1" class="mt-8 white--text" @click="editHandler(user)"><v-icon>mdi-account-edit</v-icon> Edit Profile</v-btn>
            <v-spacer>
            </v-spacer>
            <v-container fluid v-if="checkRating == true">
                <v-layout flex fill-height align-center justify-center>
                    <v-flex xs12 sm3>
                        <v-card class="mt-8" width="500">
                            <v-card-actions class="float-right">
                                <v-btn icon @click="editRatingHandler(rating)"><v-icon>mdi-pencil</v-icon></v-btn>
                                <v-btn icon @click="deleteRatingHandler(rating.id)"><v-icon>mdi-close</v-icon></v-btn>
                            </v-card-actions>
                            <v-card-title class="flex"><h4>Review Pengguna</h4></v-card-title>
                            <v-rating
                            dense
                            length="5"
                            v-model="rating.rating"
                            readonly
                            ></v-rating>
                            <v-text-field placeholder="(Description)" class="mx-5" v-model="rating.description" disabled></v-text-field>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-btn class="mt-8 mb-16" v-if="checkRating == false" @click="giveRating"><v-icon color="yellow darken-3">mdi-star-outline</v-icon>Rating Website</v-btn>
            <v-spacer>
            </v-spacer>
            <v-btn color="red darken-3" class="mt-16 white--text" @click="logOut"><v-icon>mdi-logout</v-icon> LogOut</v-btn>
        </v-card> 

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.name" type="text" label="Nama" required :rules="inputRules"></v-text-field>
                        <v-text-field v-model="form.email" type="text" label="Email" required :disabled="disabled"></v-text-field>
                        <v-text-field v-model="form.password" type="password" label="Password" required :rules="inputRules"></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="update"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRating" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Rating Website</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-rating
                            v-model="formRating.rating"
                            dense
                            length="5"
                            required
                        ></v-rating>
                        <v-text-field v-model="formRating.description" type="text" label="Description"></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelRating"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setFormRating"> Save </v-btn>
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
                    <v-btn color="blue darken-1" text @click="cancelRating"> Tidak </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteRating"> Ya </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            disabled: 0,
            user: new FormData,
            form: {
                name: null,
                email: null,
                password: null,
            },
            dialog: false,
            inputRules: [
                (v) => !!v || 'Masukkan data yang sesuai!',
            ],
            dialogRating: false,
            formRating: {
                rating: null,
                description: null,
            },
            rating: new FormData,
            inputType: 'Add',
            editId:'',
            deleteId:'',
            checkRating: false,
            dialogConfirm: false,
        }
        
    },
    methods: {
        readData() {
            var url = this.$api + '/user/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.user = response.data.data;
            })
        },
        
        update(){
            let newData = {
                name : this.form.name,
                email : this.form.email,
                password : this.form.password,
            };

            var url = this.$api + '/user/' + localStorage.getItem('id');
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                localStorage.setItem('name',response.data.data.name);
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.inputType= 'Add';
                this.close();
                this.readData();
                this.readDataRating();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        editHandler(user) {
            this.disabled = 1;
            this.form.name = user.name;
            this.form.email = user.email;
            this.form.password = user.password;
            this.inputType= 'Edit';
            this.dialog = true;
        },

        close() {
            this.dialog = false;
            this.dialogConfirm = false;
            this.readData();
            this.readDataRating();
        },

        cancel() {
            this.resetForm();
            this.readData();
            this.readDataRating();
            this.dialog = false;
            this.dialogConfirm = false;
        },
        
        resetForm() {
            this.form = { 
                name: null,
                email: null,
                password: null};
            this.disabled=0;
        },

        logOut() {
            localStorage.clear();
            this.$router.push({
                name: 'Home',
            });
        },

        giveRating(rating) {
            this.formRating.rating = rating.rating;
            this.formRating.description = rating.description;
            this.dialogRating = true;
        },

        resetFormRating() {
            this.formRating = { 
                rating: null,
                description: null};
            this.disabled=0;
        },

        cancelRating(){
            this.resetFormRating();
            this.readDataRating();
            this.readData();
            this.dialogRating = false;
            this.dialogConfirm = false;
        },

        setFormRating(){
            if(this.inputType !== 'Add'){
                this.updateRating();
            }else {
                this.saveRating();
            }
        },

        saveRating() {
            if(this.formRating.description != null){
                this.rating.append('rating', this.formRating.rating);
                this.rating.append('description', this.formRating.description);
                this.rating.append('idUser', localStorage.getItem('id'));

                var url = this.$api + '/rating'
                this.load = true;
                this.$http.post(url, this.rating, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.readData();
                    this.readDataRating();
                    this.cancelRating();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            } else {
                this.error_message = 'incorrect description (null)';
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            }
        },

        readDataRating() {
            var url = this.$api + '/rating/' + localStorage.getItem('id');
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.rating = response.data.data;
                if(this.rating != null){
                    this.checkRating = true;
                }
            })
        },

        deleteRatingHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },

        deleteRating(){
            var url = this.$api + '/rating/' + this.deleteId;
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
                this.cancelRating();
                this.readData();
                this.readDataRating();
                this.inputType = "Add";
                this.$router.go(this.$router.currentRoute);
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },

        editRatingHandler(item) {
            this.inputType = 'Edit';
            this.editId = item.id;
            this.formRating.rating = item.rating;
            this.formRating.description = item.description;
            this.dialogRating = true;
        },

        updateRating(){
            let newData = {
                rating : this.formRating.rating ,
                description : this.formRating.description,
            };

            var url = this.$api + '/rating/' + this.editId;
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
                this.cancelRating();
                this.readData();
                this.readDataRating();
                this.inputType = 'Add';
                this.editId = '';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
        this.readDataRating();
    },

}
</script>
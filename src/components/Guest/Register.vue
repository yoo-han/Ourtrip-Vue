<template>
    <v-main v-bind:style="{ 'backgroundImage': 'url(https://philialabs.com.au/wp-content/uploads/2019/01/cropped-cool-wallpaper-dawn-dusk-66997.jpg)' }">
        <v-container fluid style="height: 100vh;">
            <v-layout flex fill-height align-center justify-center>
                <v-flex xs4 sm4 elevation-6>
                    <v-toolbar dark>
                        <v-toolbar-title class="white--text flex text-center">
                            <h2>REGISTER</h2>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text class="pt-4">
                            <div>
                                <v-form v-model="valid" ref="form">
                                    <v-text-field label="Nama" v-model="name" :rules="inputRules" required></v-text-field>
                                    <v-text-field label="E-mail" v-model="email" :rules="inputRules" required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password" :rules="inputRules" required></v-text-field>
                                    <v-text-field label="Confirm Password" v-model="confirm_password" type="password" :rules="[inputRules,passwordConfirmationRule]" required></v-text-field>
                                    <v-layout class="pt-4 mt-2" justify-center>
                                        <v-btn class="mr-2 white--text" large dark @click="submit" :class=" { 'white--text' : valid, disabled: !valid }">Register</v-btn>
                                    </v-layout>
                                    <v-layout justify-center class="pt-4 mt-2">
                                        <p>Sudah punya akun? <v-btn small text href="/login">Masuk</v-btn></p>
                                    </v-layout>
                                </v-form>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom> {{ error_message }}</v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>          
    </v-main>
</template>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Gothic+A1&family=Roboto&display=swap');
    .white--text{
        font-family: 'Roboto', sans-serif;
    }
</style>

<script>
    export default {
        name: "Register",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,
                inputRules: [
                    (v) => !!v || 'Masukkan data yang sesuai!',
                ],
                name: '',
                password: '',
                email: '',
                confirm_password: '',
            };
        },
        methods: {
            countryChanged(country) {
                this.country = country.dialCode
            },
            submit() {
                if(this.$refs.form.validate()) {
                    //cek validasi data yang terkirim
                    this.load = true;
                    this.$http.post(this.$api + '/register', {
                        name: this.name,
                        email: this.email,
                        password: this.password
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.color = "green";
                        this.snackbar = true;
                        this.load = false;
                        this.clear();
                        this.$router.push({
                            name: 'Login',
                        });
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.color = "red";
                        this.snackbar = true;
                        this.load = false;
                    })
                }
            },

            clear() {
                this.$refs.form.reset()
            },
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.password === this.confirm_password) || 'Password harus sama'
            },
        }
    };
</script>
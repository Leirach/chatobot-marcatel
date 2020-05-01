<template>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy" class="contact-form answerText">
        <v-text-field v-model="name" :rules="nameRules" label="Nombre" class="custom-label"
                    required>
        </v-text-field>
        <v-text-field v-model="email" :rules="emailRules" label="E-mail"
                    required>
        </v-text-field>
        <v-text-field v-model="company" label="Empresa (opcional)" class="custom-label">
        </v-text-field>
        <v-row class="no-padding">
            <div class="col-auto mr-auto no-padding">
                <input type="checkbox" class="form-check form-check-inline" v-model="client">
                <label for="checkbox">Ya soy cliente Marcatel</label>
            </div>
            <v-btn :disabled="!valid" class="submit-button col-auto" @click="submit">
                submit
            </v-btn>
        </v-row>
    </v-form>
</template>

<script>
    export default {
        data: () => ({
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Nombre no puede estar vacio.',
            ],
            email: '',
            emailRules: [
                v => !!v || 'E-mail no puede estar vacio',
                v => /.+@.+\..+/.test(v) || 'E-mail debe ser valido',
            ],
            company: '',
            client: false,
            lazy: false,
        }),
        methods: {
            submit () {
                let form = {name: this.name, email: this.email, company: this.company, client: this.client};
                console.log(form)
            }
        },
    };

</script>

<style lang="scss" scoped>
    @import "../Chat.scss";
</style>




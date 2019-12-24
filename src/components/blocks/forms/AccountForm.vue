<template>
<form class="form profile-form" v-if="ready" @submit="submit">
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">First Name</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" required v-model="firstname" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-signature"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Surname</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" v-model="surname" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-signature"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Email</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="email" class="input" v-model="email" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-at"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Password</label>
        </div>
        <div class="field-body">
            <div class="field" v-if="!pass_reset">
                <p><button tabindex="-1" @click.prevent="pass_reset = true" class="button is-text">Change password...</button></p>
            </div>
            <div class="field" v-else>
                <div class="field">
                    <div class="control is-expanded has-icons-left">
                        <input type="password" class="input" v-model="pass" placeholder="New password" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                </div>
                <div class="field">
                    <div class="control is-expanded has-icons-left">
                        <input @blur="validate_pass" type="password" class="input" v-model="repass" placeholder="Confirm password" />
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                    <p v-if="!pass && !repass" class="help">Leave blank if you don't wish to change the password.</p>
                    <p v-if="pass_error" class="help is-danger">{{pass_error}}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-grouped is-grouped-right action">
        <p class="control">
            <button type="submit" :class="['button is-primary', {'is-loading': is_loading}]">
                Save
            </button>
        </p>
    </div>
</form>
</template>

<script>
export default {
    name        :   'AccountForm',
    data() {
        return {
            ready       :   false,
            is_loading  :   false,
            id          :   null,
            firstname   :   null,
            surname     :   null,
            email       :   null,
            pass_reset  :   false,
            pass        :   null,
            repass      :   null,
            pass_error  :   null
        }
    },
    created() {
        this.get();
    },
    methods     :   {
        prep(resp) {
            let me  =   this;
            me.id           =   resp.data.id;
            me.firstname    =   resp.data.first_name;
            me.surname      =   resp.data.surname;
            me.email        =   resp.data.email;
            me.ready        =   true;
        },
        validate_pass() {
            this.pass_error =   null;
            if (this.pass_reset && (this.pass || this.repass)) {
                if (!this.pass || this.pass.length == 0) {
                    this.pass_error =   'Password cannot be empty!';
                    return false;
                }

                if (!this.repass || this.repass.length == 0) {
                    this.pass_error =   'Please enter your password again!';
                    return false;
                }

                if (this.pass != this.repass) {
                    this.pass_error =   'Passwords do not match!';
                    return false;
                }
            }

            return true;
        },
        get() {
            let me  =   this;

            axios.get(
                base_url + endpoints.member
            ).then(this.prep);
        },
        submit(e) {
            if (e) {
                e.preventDefault();
            }

            if (!this.id) return false;
            if (!this.validate_pass()) return false;
            if (this.is_loading) return false;
            this.is_loading =   true;

            let me      =   this,
                data    =   new FormData();

            data.append('firstname', me.firstname);
            data.append('surname', me.surname);
            data.append('email', me.email);
            if (me.pass_reset && me.pass && me.repass && !me.pass_error) {
                data.append('pass', me.pass);
            }

            axios.post(
                base_url + endpoints.member + '/' + me.id,
                data
            ).then((resp) => {
                me.is_loading   =   false;
                this.prep(resp);
                me.$bus.$emit('onLive', resp.data);
                me.$bus.$emit('showMessage', 'Store information has been updated', 'success');
            }).catch((error) => {
                me.is_loading   =   false;
                if (error.response && error.response.data && error.response.data.message) {
                    me.$bus.$emit('showMessage', error.response.data.message);
                }
            });
        }
    }
}
</script>

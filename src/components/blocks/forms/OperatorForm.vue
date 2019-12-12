<template>
<form @submit.prevent="submit" method="post" v-if="op_data">
    <fieldset :disabled="is_submitting">
        <div class="columns">
            <div class="column">
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Names</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="text" class="input" :required="id ? false : true" name="firstname" placeholder="First Name" v-model="firstname" />
                        </div>
                        <div class="field">
                            <input type="text" class="input" name="surname" placeholder="Surname" v-model="surname" />
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Email</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="email" required class="input" name="email" v-model="email" />
                        </div>
                    </div>
                </div>
                <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">Password</label>
                    </div>
                    <div class="field-body">
                        <div class="field">
                            <input type="password" class="input" :required="id ? false : true" v-model="password" name="password" placeholder="Password" />
                        </div>
                        <div class="field">
                            <input type="password" class="input" v-model="repass" name="repass" placeholder="Confirm password" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-narrow">
                <div class="field">
                    <button type="submit" class="button is-small is-primary"><template v-if="id">Update</template><template v-else>Create</template></button>
                </div>
                <div class="field">
                    <button @click.prevent="onCancel" class="button is-small is-danger">Cancel</button>
                </div>
            </div>
        </div>
    </fieldset>
</form>
</template>

<script>
export default {
    name    :   'OperatorForm',
    props   :   {
        op_data :   {
            type    :   Object,
            default()  {
                return {
                    id          :   null,
                    firstname   :   null,
                    surname     :   null,
                    email       :   null
                }
            }
        },
        on_success  :   {
            type    :   Function,
            default :   null
        },
        on_cancel   :   {
            type    :   Function,
            default :   null
        }
    },
    data()
    {
        return {
            id              :   this.op_data.id,
            firstname       :   this.op_data.firstname,
            surname         :   this.op_data.surname,
            email           :   this.op_data.email,
            password        :   null,
            repass          :   null,
            is_submitting   :   false,
        }
    },
    methods :   {
        onSuccess()
        {
            if (this.on_success) {
                this.on_success();
            }
        },
        onCancel(e)
        {
            if (this.on_cancel) {
                this.on_cancel();
            }
        },
        update_operator()
        {
            return {
                query   :   `mutation ($id: ID!, $email: String!, $firstname:String!, $surname: String!, $password: String, $repass: String) {
                                updateOperator(id: $id, email: $email, firstname: $firstname, surname: $surname, password: $password, repass: $repass) {
                                    ID, FirstName, Surname, Email
                                }
                            }`,
                variables: {
                    id          :   this.id,
                    email       :   this.email,
                    firstname   :   this.firstname,
                    surname     :   this.surname,
                    password    :   this.password,
                    repass      :   this.repass
                }
            };
        },
        submit(e)
        {
            if (this.is_submitting) return false;
            this.is_submitting  =   true;
            let me  =   this;
            axios.get(
                base_url + endpoints.session
            ).then(resp => {
                axios.defaults.headers.common['X-CSRF-TOKEN']   =   resp.data.csrf;
            }).then(() => {
                let data    =   !this.op_data.id ? this.create_operator() : this.update_operator();
                axios.post(
                    base_url + 'graphql',
                    data
                ).then(resp => {
                    delete axios.defaults.headers.common['X-CSRF-TOKEN'];
                    me.is_submitting    =   false;
                    if (resp.data.errors) {
                        me.$bus.$emit('showMessage', resp.data.errors[0].message, 'danger');
                    } else {
                        me.onSuccess();
                    }
                }).catch(error => {
                    me.is_submitting    =   false;
                });
            }).catch(error => {
                me.is_submitting    =   false;
            });
        },
        create_operator()
        {
            return {
                query   :   `mutation ($email: String!, $firstname:String!, $surname: String!, $password: String!, $repass: String!) {
                              createOperator(email: $email, firstname: $firstname, surname: $surname, password: $password, repass: $repass) {
                                  ID, FirstName, Surname, Email
                              }
                            }`,

                variables: {
                    email       :   this.email,
                    firstname   :   this.firstname,
                    surname     :   this.surname,
                    password    :   this.password,
                    repass      :   this.repass
                }
            };
        }
    }
}
</script>

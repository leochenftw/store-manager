<template>
<form class="form supplier-form" method="post" @submit.prevent="submit">
    <fieldset :disabled="is_loading">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Name</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input class="input" v-model="name" type="text" placeholder="Name">
                        <span class="icon is-small is-left">
                            <i class="fas fa-signature"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Alias</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input class="input" v-model="alias" type="text" placeholder="Alias">
                        <span class="icon is-small is-left">
                            <i class="fas fa-signature"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Email</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input class="input" v-model="email" type="text" placeholder="Alias">
                        <span class="icon is-small is-left">
                            <i class="far fa-envelope"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Phone</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control is-expanded has-icons-left">
                        <input class="input" v-model="phone" type="text" placeholder="Alias">
                        <span class="icon is-small is-left">
                            <i class="fas fa-phone"></i>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Memo</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <textarea class="textarea"></textarea>
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-grouped is-grouped-right action">
            <p class="control">
                <button type="submit" :class="['button is-primary', {'is-loading': is_loading}]">
                    Save
                </button>
            </p>
            <p class="control"><router-link class="button is-light" :to="{ name: 'Suppliers' }">Cancel</router-link></p>
        </div>
    </fieldset>
</form>
</template>

<script>

export default {
    name        :   'SupplierForm',

    data()
    {
        return {
            is_loading  :   false,
            id          :   this.$route.params.id,
            name        :   null,
            alias       :   null,
            email       :   null,
            phone       :   null,
            memo        :   null
        }
    },
    created()
    {
        this.fetch_supplier();
    },
    methods     :   {
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
                let data    =   this.id == 'new' ? this.create_supplier() : this.update_supplier();
                axios.post(
                    base_url + 'graphql',
                    data
                ).then(resp => {
                    delete axios.defaults.headers.common['X-CSRF-TOKEN'];
                    me.is_submitting    =   false;
                    if (resp.data.errors) {
                        me.$bus.$emit('showMessage', resp.data.errors[0].message, 'danger');
                    } else {
                        me.$router.push({name: 'Suppliers'});
                    }
                }).catch(error => {
                    me.is_submitting    =   false;
                });
            }).catch(error => {
                me.is_submitting    =   false;
            });
        },
        create_supplier()
        {
            return {
                query   :   `mutation createAppSupplier($Input: AppSupplierCreateInputType!) {
                                createAppSupplier(Input: $Input) {
                                    ID
                                }
                            }`,
                variables: {
                    Input: {
                        Title   :   this.name,
                        Alias   :   this.alias,
                        Email   :   this.email,
                        Phone   :   this.phone,
                        Memo    :   this.memo
                    }
                }
            };
        },
        update_supplier()
        {
            return {
                query   :   `mutation updateAppSupplier($Input: AppSupplierUpdateInputType!) {
                                updateAppSupplier(Input: $Input) {
                                    ID
                                }
                            }`,
                variables: {
                    Input: {
                        ID      :   this.id,
                        Title   :   this.name,
                        Alias   :   this.alias,
                        Email   :   this.email,
                        Phone   :   this.phone,
                        Memo    :   this.memo
                    }
                }
            };
        },
        fetch_supplier()
        {
            if (this.$route.params.id == 'new') return;
            let me      =   this,
                data    =   {
                    query   :   `query {
                        readAppSuppliers(
                            Filter: {
                                ID__eq: ` + this.id + `
                            }
                        ) {
                            edges {
                                node {
                                    ID
                                    Title
                                    Alias
                                    Email
                                    Phone
                                    Memo
                                }
                            }
                        }
                    }`
                };

            axios.post(
                base_url + 'graphql',
                data
            ).then(resp => {
                delete axios.defaults.headers.common['X-CSRF-TOKEN'];
                me.is_submitting    =   false;
                if (resp.data.errors) {
                    me.$bus.$emit('showMessage', resp.data.errors[0].message, 'danger');
                } else if (resp.data.data.readAppSuppliers.edges.length) {
                    let node    =   resp.data.data.readAppSuppliers.edges[0].node;

                    this.name   =   node.Title;
                    this.alias  =   node.Alias;
                    this.email  =   node.Email;
                    this.phone  =   node.Phone;
                    this.memo   =   node.Memo;
                }
            }).catch(error => {
                me.is_submitting    =   false;
            });
        }
    }
}
</script>

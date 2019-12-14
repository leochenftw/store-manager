<template>
    <section class="main-content profile">
        <div class="section">
            <div class="container">
                <header class="columns profile__head">
                    <div class="column is-narrow">
                        <h1 class="title is-4">Profile</h1>
                    </div>
                </header>
                <div class="profile__body">
                    <div class="tabs">
                        <ul>
                            <li :class="{'is-active': !this.$route.params.section}">
                                <router-link :to="{ name: 'StoreProfile' }">Store Information</router-link>
                            </li>
                            <li :class="{'is-active': this.$route.params.section == 'accounts'}">
                                <router-link :to="{ name: 'StoreProfileSections', params: {section: 'accounts'} }">Accounts</router-link>
                            </li>
                        </ul>
                    </div>
                    <StoreInfoForm v-if="!this.$route.params.section" />
                    <template v-if="this.$route.params.section == 'accounts'">
                        <h2 class="title is-5 form-title">Owner</h2>
                        <hr />
                        <AccountForm />
                        <div class="columns is-gapless form-title">
                            <div class="column is-narrow title-col">
                                <h2 class="title is-5 is-marginless">Operators</h2>
                            </div>
                            <div class="column has-text-right">
                                <button v-if="!newing_op" @click.prevent="newing_op = true;" class="button is-primary"><span class="icon"><i class="fas fa-plus"></i></span></button>
                            </div>
                        </div>
                        <hr />
                        <OperatorForm v-if="newing_op" :on_cancel="cancel_creating" :on_success="on_operation_done" />
                        <table v-else class="table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Surname</th>
                                    <th>Email</th>
                                    <th style="width: 140px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="operator in operators">
                                    <tr>
                                        <td>{{operator.firstname}}</td>
                                        <td>{{operator.surname}}</td>
                                        <td>{{operator.email}}</td>
                                        <td class="has-text-right">
                                            <template v-if="!operator.editing">
                                                <button @click.prevent="operator.editing = true;" class="button is-small is-primary">Edit</button>
                                                <button @click.prevent="suspend_operator($event, operator)" class="button is-small is-danger">Suspend</button>
                                            </template>
                                        </td>
                                    </tr>
                                    <tr v-if="operator.editing">
                                        <td colspan="4">
                                            <OperatorForm :op_data="operator" :on_cancel="e => { operator.editing = false; }" :on_success="on_operation_done" />
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import StoreInfoForm from '../blocks/forms/StoreInfoForm';
import AccountForm from '../blocks/forms/AccountForm';
import OperatorForm from '../blocks/forms/OperatorForm';
export default {
    name            :   'StoreProfile',
    props           :   ['member'],
    components      :   {StoreInfoForm, AccountForm, OperatorForm},
    data()
    {
        return {
            newing_op       :   false,
            is_submitting   :   false,
            operators       :   []
        }
    },
    created() {
        this.fetch_operators();
    },
    methods         :   {
        on_operation_done()
        {
            this.newing_op  =   false;
            this.fetch_operators();
        },
        cancel_creating()
        {
            this.newing_op  =   false;
        },
        suspend_operator(e, operator)
        {
            if (confirm('Do you want to suspect this operator?')) {
                if (this.is_submitting) return false;
                this.is_submitting  =   true;
                let me  =   this;
                axios.get(
                    base_url + endpoints.session
                ).then(resp => {
                    axios.defaults.headers.common['X-CSRF-TOKEN']   =   resp.data.csrf;
                }).then(() => {
                    let data    =   {
                        query   :   `mutation ($id: ID!) {
                                        suspendOperator(id: $id) {
                                            ID, FirstName, Surname, Email
                                        }
                                    }`,
                        variables: {
                            id          :   operator.id
                        }
                    };
                    axios.post(
                        base_url + 'graphql',
                        data
                    ).then(resp => {
                        delete axios.defaults.headers.common['X-CSRF-TOKEN'];
                        me.is_submitting    =   false;
                        if (resp.data.errors) {
                            me.$bus.$emit('showMessage', resp.data.errors[0].message, 'danger');
                        } else {
                            me.on_operation_done();
                        }
                    }).catch(error => {
                        me.is_submitting    =   false;
                    });
                }).catch(error => {
                    me.is_submitting    =   false;
                });
            }
        },
        fetch_operators()
        {
            let data = {
                query   :   `query {
                                listOperators {
                                    ID, FirstName, Surname, Email
                                }
                            }`
            };

            axios.post(
                base_url + 'graphql',
                data
            ).then(resp => {
                if (resp.data.data.listOperators && Array.isArray(resp.data.data.listOperators)) {
                    this.operators  =   [];
                    resp.data.data.listOperators.forEach( o => {
                        let operator    =   {
                            id          :   o.ID,
                            firstname   :   o.FirstName,
                            surname     :   o.Surname,
                            email       :   o.Email,
                            editing     :   false
                        }
                        this.operators.push(operator);
                    });
                }
            });
        }
    }
}
</script>

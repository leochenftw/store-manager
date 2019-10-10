<template>
    <section class="main-content profile">
        <div class="section">
            <div class="container">
                <header class="columns profile-head">
                    <div class="column is-narrow">
                        <h1 class="title is-4">Profile</h1>
                    </div>
                </header>
                <div class="profile-body">
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
                                <button class="button is-primary"><span class="icon"><i class="fas fa-plus"></i></span></button>
                            </div>
                        </div>
                        <hr />
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import StoreInfoForm from '../blocks/forms/StoreInfoForm';
import AccountForm from '../blocks/forms/AccountForm';
export default {
    name            :   'StoreProfile',
    components      :   {StoreInfoForm, AccountForm},
    created() {

    }
}
</script>

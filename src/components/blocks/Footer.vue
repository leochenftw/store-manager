<template>
<footer id="footer" :class="{'mini': signed}">
    <div class="section">
        <div class="container has-text-centered">
            <router-link :to="!signed ? '/' : { name: 'StoreProfile' }" :class="['is-block current-user', {'shake': shaking}]">
                <img src="@/assets/man.svg" />
                <span v-if="signed" class="current-user__action has-text-centered">Edit</span>
            </router-link>
            <p>{{display_name}}</p>
        </div>
        <ul class="menu">
            <li><router-link class="is-home" :to="{ name: 'Homepage' }"><i class="fas fa-tachometer-alt"></i>Dashboard</router-link></li>
            <li><router-link :to="{ name: 'Products' }"><i class="fas fa-shopping-bag"></i>Products</router-link></li>
            <li><router-link :to="{ name: 'Sales' }"><i class="fas fa-dollar-sign"></i>Sales</router-link></li>
            <li><router-link :to="{ name: 'Members' }"><i class="fas fa-user-circle"></i>Members</router-link></li>
            <li><router-link :to="{ name: 'Ranking' }"><i class="fas fa-trophy"></i>Ranking</router-link></li>
            <li><router-link :to="{ name: 'Suppliers' }"><i class="fas fa-people-carry"></i></i>Suppliers</router-link></li>
            <li><router-link :to="{ name: 'Discounts' }"><i class="fas fa-percent"></i>Discounts</router-link></li>
            <li><router-link :to="{ name: 'Labels' }"><i class="fas fa-tags"></i>Labels</router-link></li>
        </ul>
    </div>
    <div class="footer">
        <div :class="['has-text-centered', {'is-invisible': !signed}]"><a href="#" @click.prevent="signout"><i class="fas fa-sign-out-alt"></i></a></div>
    </div>
</footer>
</template>

<script>
export default {
    name: 'Footer',
    props: [],
    data() {
        return {
            shaking :   false,
            signed  :   false,
            member  :   null
        };
    },
    components: {},
    watch: {

    },
    created() {
        let me  =   this;

        if (localStorage && localStorage.recent_member && localStorage.recent_member != 'undefined') {
            this.member =   JSON.parse(localStorage.recent_member);
        }

        this.$bus.$on('onSigninBegin', () => {
            this.shaking    =   false;
        });

        this.$bus.$on('onSigninFailed', () => {
            this.shaking    =   true;
        });

        this.$bus.$on('onLive', (member) => {
            this.signed =   true;
            this.member =   member;
        });
        this.$bus.$on('onDie', () => {
            me.signed                   =   false;
            me.member                   =   localStorage.recent_member ? JSON.parse(localStorage.recent_member) : null;
            me.$parent.authenticated    =   null;
        });
        this.$bus.$on('onRecentMemberErased', () => {
            me.member                   =   null;
        });
    },
    computed: {
        display_name() {
            if (this.member) {
                return (this.member.first_name + ' ' + (this.member.surname ? this.member.surname : '')).trim();
            }
            return 'Please sign in';
        }
    },
    methods :   {
        signout() {
            let me      =   this;
            axios.post(
                base_url + endpoints.signout
            ).then((resp) => {
                me.$bus.$emit('onDie');
            });
        }
    }
}
</script>

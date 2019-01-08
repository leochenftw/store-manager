<template>
<header id="header" :class="{'show': signed}">
    <nav class="navbar is-transparent is-mobile">
        <div class="navbar-brand">
            <router-link class="navbar-item" :to="{ name: 'Homepage' }"><i class="fas fa-kiwi-bird"></i> OneStore</router-link>
            <!-- <div v-on:click="show_mobile_menu" :class="{'navbar-burger': true, 'burger': true, 'is-active': mobile_menu_is_active}" data-target="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
            </div> -->
        </div>
        <div id="mobile-menu" :class="{'navbar-menu': true, 'is-active': mobile_menu_is_active}">
            <div class="navbar-end">
                <a class="navbar-item" href="https://store.one-stop.co.nz" target="_blank"><span class="icon"><i class="fas fa-cash-register"></i></span></a>
            </div>
        </div>
    </nav>
</header>
</template>
<script>
export default {
    name: 'Header',
    data: function() {
        return {
            signed: false,
            mobile_menu_is_active: false,
            navigation: []
        }
    },
    created() {
        let me  =   this;
        this.$bus.$on('onLive', (member) => {
            me.signed   =   true;
        });
        this.$bus.$on('onDie', () => {
            me.signed   =   false;
        });
    },
    methods: {
        click_to_close: function(e) {
            let target = $(e.target);
            if (!target.is('.burger') &&
                target.parents('.burger').length == 0 &&
                !target.is('.navbar-item') &&
                target.parents('.navbar-item').length == 0) {

                this.mobile_menu_is_active = false;
                $(window).unbind('mousedown', this.click_to_close);
            }
        },
        show_mobile_menu: function(e) {
            e.preventDefault();
            $(window).unbind('mousedown', this.click_to_close).on('mousedown', this.click_to_close);
            this.mobile_menu_is_active = !this.mobile_menu_is_active;
        }
    }
}
</script>

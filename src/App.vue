<template>
<div id="app" :class="[class_name]">
    <Header />
    <div class="columns is-gapless is-marginless">
        <div class="column is-narrow">
            <div id="shim"></div>
        </div>
        <div class="column">
            <transition
                name="fade"
                mode="out-in"
                @beforeLeave="beforeLeave"
                @enter="enter"
                @afterEnter="afterEnter"
            >
                <router-view :member="member" />
            </transition>
        </div>
    </div>
    <Footer />
    <SigninForm />
    <MessageBox />
</div>
</template>

<script>
import Header from './components/blocks/Header';
import Footer from './components/blocks/Footer';
import slugify from 'slugify';
import SigninForm from './components/blocks/forms/SigninForm';
import MessageBox from './components/blocks/MessageBox';
export default {
    name: 'App',
    components: {
        Header,
        Footer,
        SigninForm,
        MessageBox
    },
    data() {
        return {
            member      :   null,
            prevHeight  :   0
        };
    },
    computed: {
        class_name() {
            return slugify(this.$route.name, {lower: true});
        }
    },
    created() {
        let me  =   this;
        this.alive();
        this.$bus.$on('onLive', (member) => {
            me.member   =   member;
        });
        this.$bus.$on('onDie', () => {
            me.member   =   null;
            setTimeout(function () {
                me.$router.replace('/');
            }, 1000);
        });

        $(window).on('scroll', function(e)
        {
            me.$bus.$emit('onWindowScroll', $(window).scrollTop());
        });
    },
    methods :   {
        alive() {
            let me      =   this;
            me.member   =   null;
            axios.get(
                base_url + endpoints.session
            ).then((resp) => {
                me.$nextTick().then(() => {
                    me.$nextTick().then(() => {
                        me.$bus.$emit('onLive', resp.data.member);
                    });
                });
            }).catch((error) => {
                me.member   =   null;
            });
        },
        beforeLeave(element) {
            this.prevHeight = getComputedStyle(element).height;
        },
        enter(element) {
            const { height } = getComputedStyle(element);

            element.style.height = this.prevHeight;

            setTimeout(() => {
                element.style.height = height;
            });
        },
        afterEnter(element) {
            element.style.height = 'auto';
        }
    }
}
</script>
<style>
/* @import '../node_modules/lightbox2/src/css/lightbox.css'; */
@import 'css/styles.css';
</style>

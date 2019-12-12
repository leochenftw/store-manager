<template>
<form v-if="!hide" class="form signin section" method="post" @submit="submit">
    <fieldset :disabled="is_loading">
        <div class="field">
            <label v-if="recent_member" class="label has-text-centered">{{recent_member.email}} <a href="#" @click.prevent="erase_recent">not me</a></label>
            <div v-else class="control">
                <input type="email" class="input" v-model="email" placeholder="Email" />
            </div>
        </div>
        <div class="field">
            <div class="control">
                <input type="password" class="input" v-model="pass" placeholder="Password" />
            </div>
        </div>
        <div class="field action">
            <button :class="['button is-primary is-fullwidth', {'is-loading': is_loading}]">SIGNIN</button>
        </div>
    </fieldset>
</form>
</template>

<script>
export default
{
    name        :   'SigninForm',
    data() {
        return {
            hide            :   false,
            is_loading      :   false,
            recent_member   :   null,
            email           :   null,
            pass            :   null
        }
    },
    created() {
        let me  =   this;
        if (localStorage && localStorage.recent_member && localStorage.recent_member != 'undefined') {
            me.recent_member    =   JSON.parse(localStorage.recent_member);
        }
        this.$bus.$on('onLive', (member) => {
            me.recent_member            =   member;
            localStorage.recent_member  =   JSON.stringify(member);
            TweenMax.to(me.$el, 0.5, {opacity: 0, onComplete: function()
            {
                me.hide         =   true;
                me.is_loading   =   false;
            }});
        });
        this.$bus.$on('onDie', () => {
            me.hide =   false;
            me.$nextTick().then(() => {
                TweenMax.to($(me.$el).css('opacity', 0), 0.5, {delay: 0.5, opacity: 1});
            });
        });
    },
    methods     :   {
        erase_recent() {
            this.recent_member  =   null;
            delete localStorage.recent_member;
            this.$bus.$emit('onRecentMemberErased');
        },
        submit(e) {
            e.preventDefault();
            if (this.is_loading) return false;
            if (!this.recent_member && (!this.email || this.email.trim().length == 0)) return false;
            if (!this.pass || this.pass.trim().length == 0) return false;

            this.is_loading =   true;

            let me          =   this,
                params      =   new FormData();
            if (this.recent_member) {
                params.append('email', this.recent_member.email);
            } else {
                params.append('email', this.email);
            }
            params.append('pass', this.pass);
            me.$bus.$emit('onSigninBegin');
            axios.post(
                base_url + endpoints.signin,
                params
            ).then((resp) => {
                me.$bus.$emit('onLive', resp.data);
            }).catch((error) => {
                me.is_loading   =   false;
                me.$bus.$emit('onSigninFailed');
            });
        }
    }
}
</script>

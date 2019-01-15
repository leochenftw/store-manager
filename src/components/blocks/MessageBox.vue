<template>
<div :class="['modal message-box', {'is-active': show}]">
    <div class="modal-background" @mousedown="close"></div>
    <div class="modal-content">
        <article :class="['message is-large', 'is-' + type]">
            <div class="message-header">
                <p>OneStore</p>
            </div>
            <div class="message-body" v-html="content"></div>
            <div class="message-foot has-text-centered">
                <button @click.prevent="close" :class="['button is-large', 'is-' + type]">OK</button>
            </div>
        </article>
    </div>
</div>
</template>

<script>
export default {
    name        : 'MessageBox',
    data() {
        return {
            show        :   false,
            type        :   'danger',
            content     :   null,
            callback    :   null
        };
    },
    created() {
        this.$bus.$on('showMessage', this.to_show);
    },
    watch       :   {
        show(nv, ov) {
            if (nv == true) {
                $(window).bind('keydown', this.keydownhandler);
            }
        }
    },
    methods     :   {
        keydownhandler(e) {
            if (e.keyCode == 27 || e.keyCode == 13) {
                this.close();
            }
        },
        to_show(message, type, title, callback) {
            let me  =   this;
            me.show =   true;
            if (type) {
                me.type     =   type;
            }
            if (title) {
                me.title    =   title;
            }

            if (callback) {
                me.callback =   callback;
            }

            me.content  =   message;
        },
        close() {
            $(window).unbind('keydown', this.keydownhandler);
            if (this.callback) {
                this.callback();
            }
            this.show       =   false;
            this.type       =   'danger';
            this.content    =   null;
            this.callback   =   null;
        }
    }
}
</script>

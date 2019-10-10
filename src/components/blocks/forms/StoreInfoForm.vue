<template>
<form class="form profile-form" v-if="ready" @submit="submit">
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Store Name</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" required v-model="storename" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-store"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Tagline</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" v-model="slogan" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-bullhorn"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">GST</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" v-model="gst" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-hashtag"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Phone</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control is-expanded has-icons-left">
                    <input type="text" class="input" v-model="phone" />
                    <span class="icon is-small is-left">
                        <i class="fas fa-phone"></i>
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
            <label class="label">Location</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <textarea class="textarea" v-model="location" placeholder="e.g. Hello world"></textarea>
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
    name        :   'StoreInfoForm',
    data() {
        return {
            ready       :   false,
            is_loading  :   false,
            storename   :   null,
            slogan      :   null,
            gst         :   null,
            phone       :   null,
            email       :   null,
            location    :   null
        }
    },
    created() {
        this.get();
    },
    methods     :   {
        prep(resp) {
            let me  =   this;
            me.storename    =   resp.data.title;
            me.slogan       =   resp.data.slogan;
            me.gst          =   resp.data.gst;
            me.phone        =   resp.data.phone;
            me.email        =   resp.data.email;
            me.location     =   resp.data.location;
            me.ready        =   true;
        },
        get() {
            let me  =   this;
            axios.get(
                base_url + endpoints.store
            ).then(this.prep);
        },
        submit(e) {
            if (e) {
                e.preventDefault();
            }

            if (this.is_loading) return false;
            this.is_loading =   true;

            let me      =   this,
                data    =   new FormData();

            data.append('storename', me.storename);
            data.append('slogan', me.slogan);
            data.append('gst', me.gst);
            data.append('phone', me.phone);
            data.append('email', me.email);
            data.append('location', me.location);
            axios.post(
                base_url + endpoints.store,
                data
            ).then((resp) => {
                me.is_loading   =   false;
                this.prep(resp);
                me.$bus.$emit('showMessage', 'Store information has been updated', 'success');
            }).catch((error) => {
                me.is_loading   =   false;
            });
        }
    }
}
</script>

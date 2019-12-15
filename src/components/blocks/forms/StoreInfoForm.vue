<template>
<form class="form profile-form" v-if="ready" @submit="submit">
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">Store Logo</label>
        </div>
        <div class="field-body">
            <div class="field" v-if="logo_src && !logo_file">
                <div class="control">
                    <img class="is-block" :src="logo_src" />
                </div>
            </div>
            <div class="field" v-if="logo_file">
                <div class="control">
                    <canvas ref="canvas" class="is-block" />
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <div class="file" v-if="!logo_file">
                        <label class="file-label">
                            <input class="file-input" accept="image/*" type="file" @change="file_chosen">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose a new logo…
                                </span>
                            </span>
                        </label>
                    </div>
                    <button v-else class="button" @click.prevent="logo_file = null;">Cancel</button>
                </div>
            </div>
        </div>
    </div>
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
            logo_file   :   null,
            logo_src    :   null,
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
        processFile(dataURL, fileType) {
            let maxWidth = 240,
                image = new Image(),
                me  =   this;

            image.src = dataURL;

            image.onload = function () {
                var width       =   image.width,
                    height      =   image.height,
                    newWidth    =   maxWidth,
                    newHeight   =   height * (maxWidth / width);

                var canvas = me.$refs.canvas;

                canvas.width = newWidth;
                canvas.height = newHeight;

                var context = canvas.getContext('2d');

                context.drawImage(this, 0, 0, newWidth, newHeight);

                dataURL = canvas.toDataURL(fileType);
            };

            image.onerror = function () {
                alert('There was an error processing your file!');
            };
        },
        file_chosen(e)
        {
            let files = e.target.files || e.dataTransfer.files;
            if (files.length) {

                if (files[0].type != 'image/png' && files[0].type != 'image/jpeg') {
                    this.logo_file  =   null;
                    this.$bus.$emit('showMessage', '仅支持png和jpg格式', 'danger');
                } else {
                    this.logo_file  =   files[0];

                    let fr          =   new FileReader();
                    fr.onload = () => this.processFile(fr.result, this.logo_file.type);
                    fr.readAsDataURL(this.logo_file);
                }
            }
        },
        prep(resp) {
            let me  =   this;
            me.storename    =   resp.data.title;
            me.slogan       =   resp.data.slogan;
            me.gst          =   resp.data.gst;
            me.logo_src     =   resp.data.logo ? resp.data.logo.url : null,
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
            if (me.slogan) {
                data.append('slogan', me.slogan);
            }
            if (me.gst) {
                data.append('gst', me.gst);
            }
            if (me.phone) {
                data.append('phone', me.phone);
            }
            if (me.email) {
                data.append('email', me.email);
            }
            if (me.location) {
                data.append('location', me.location);
            }
            if (me.logo_file) {
                data.append('logo', me.logo_file);
            }
            axios.post(
                base_url + endpoints.store,
                data
            ).then((resp) => {
                me.is_loading   =   false;
                me.logo_file    =   null;
                this.prep(resp);
                me.$bus.$emit('showMessage', 'Store information has been updated', 'success');
            }).catch((error) => {
                me.is_loading   =   false;
            });
        }
    }
}
</script>

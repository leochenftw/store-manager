<template>
<section class="main-content labels">
    <div class="section">
        <div class="container">
            <header class="columns">
                <div class="column is-narrow">
                    <h1 class="title is-4">Label Printing</h1>
                </div>
                <div class="column">
                    <form class="form product-finder" method="post" @submit="lookup">
                        <div class="field has-addons has-addons-right">
                            <div class="control has-icons-left has-icons-right">
                                <input type="text" class="input" v-model="search_term" placeholder="Barcode" />
                                <span class="icon is-small is-left"><i class="fas fa-search"></i></span>
                                <span class="icon is-small is-right" v-if="search_term">
                                    <a class="delete" @click.prevent="search_term = null;"></a>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="column is-narrow">
                    <button class="button is-success" @click.prevent="labels = [];"><span class="icon"><i class="fas fa-eraser"></i></span></button>
                    <button @click.prevent="show_qr = !show_qr;" :class="['button', {'is-primary': show_qr}]"><span class="icon"><i class="fas fa-qrcode"></i></span></button>
                    <button @click.prevent="do_print" class="button is-info"><span class="icon"><i class="fas fa-print"></i></span></button>
                </div>
            </header>
            <div v-if="labels && labels.length > 0" class="columns is-variable is-1 is-multiline price-labels">
                <Label
                    v-for="item in labels"
                    :source="item"
                    :key="item.id"
                    :show_qr="show_qr"
                />
            </div>
            <p v-else class="title is-4 has-text-centered" style="color: #ccc; margin-top: 5rem;">Please scan or input barcodes to begin</p>
        </div>
    </div>
</section>
</template>

<script>
import Label from '../blocks/elements/Label';
export default {
    name        :   'Labels',
    components  :   { Label },
    data() {
        return {
            search_term     :   null,
            labels          :   [],
            is_loading      :   false,
            show_qr         :   false
        }
    },
    created()
    {
        if (localStorage.working_labels) {
            try {
                this.labels =   JSON.parse(localStorage.working_labels);
                delete localStorage.working_labels;
            } catch (e) {
                console.error('Something not right');
            }
        }
    },
    beforeDestroy()
    {
        if (this.labels.length > 0) {
            localStorage.working_labels =   JSON.stringify(this.labels);
        } else {
            delete localStorage.working_labels;
        }
    },
    methods     :   {
        do_print() {
            window.print();
        },
        remove_label(id, e)
        {
            if (confirm('You are going to remove this label from the list. Continue?')) {
                let i   =   this.labels.findIndex((o) => o.id == id);
                if (i > -1) {
                    this.labels.splice(i, 1);
                }
            }
        },
        lookup(e) {
            if (e) {
                e.preventDefault();
            }

            if (this.search_term == null || this.search_term.trim().length == 0) {
                return false;
            }

            if (this.is_loading) return false;
            this.is_loading     =   true;

            let me              =   this,
                params          =   new FormData();

            params.append('term', this.search_term);
            this.search_term    =   null;
            axios.post(
                base_url + endpoints.singlelookup,
                params
            ).then((resp) => {
                $(me.$el).find('.price-labels').scrollTop(0);
                me.is_loading   =   false;
                this.labels.push(resp.data);
            }).catch((error) => {
                me.is_loading   =   false;
                if (error.response && error.response.data && error.response.data.code) {
                    if (error.response.data.code == '404') {
                        me.$bus.$emit('showMessage', 'Not found');
                    }
                }
            });
        }
    }
}
</script>

<template>
<form class="form supplier-form" method="post" @submit.prevent="submit">
    <fieldset :disabled="is_loading">
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Discount Label</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input class="input" v-model="label" type="text" placeholder="e.g. Loyal Customer">
                    </p>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Discount Type</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <div class="control">
                        <label class="radio">
                            <input type="radio" v-model="type" value="by_percentage" name="type"> by Percentage
                        </label>
                        <label class="radio">
                            <input type="radio" v-model="type" value="by_amount" name="type"> by Amount
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label is-normal">
                <label class="label">Discount Value</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p class="control">
                        <input class="input" v-model="rate" type="number">
                    </p>
                    <p class="help">
                        <template v-if="type && rate">{{type == 'by_amount' ? '$' : ''}}{{rate}}{{type == 'by_percentage' ? '%' : ''}} off</template><template v-else>Please choose the type and then enter a value</template>
                    </p>
                </div>
            </div>
        </div>

        <div class="field is-grouped is-grouped-right action">
            <p class="control">
                <button type="submit" :class="['button is-primary', {'is-loading': is_loading}]">
                    Save
                </button>
            </p>
            <p class="control"><router-link class="button is-light" :to="{ name: 'Discounts' }">Cancel</router-link></p>
        </div>
    </fieldset>
</form>
</template>

<script>

export default {
    name        :   'DiscountForm',
    data()
    {
        return {
            is_loading      :   false,
            is_submitting   :   false,
            id              :   this.$route.params.id,
            label           :   null,
            type            :   null,
            rate            :   null
        }
    },
    created()
    {
        this.fetch_discount();
    },
    methods     :   {
        submit(e)
        {
            if (this.is_submitting) return false;
            this.is_submitting  =   true;
            let data    =   new FormData();

            data.append('label', this.label);
            data.append('type', this.type);
            data.append('rate', this.rate);

            axios.post(
                base_url + endpoints.discount + '/' + this.id + (this.id == 'new' ? '/create_discount' : '/update'),
                data
            ).then(resp => {
                this.is_loading =   false;
                this.$router.push({name: 'Discounts'});
            }).catch(error => {
                this.is_loading =   false;
            });
        },

        fetch_discount()
        {
            if (this.$route.params.id == 'new') return;
            if (this.is_loading) return false;
            this.is_loading =   true;
            axios.get(
                base_url + endpoints.discount + '/' + this.id
            ).then(resp => {
                this.is_loading =   false;
                this.type       =   resp.data.by == '%' ? 'by_percentage' : 'by_amount';
                this.label      =   resp.data.title;
                this.rate       =   resp.data.rate;
            }).catch(error => {
                this.is_loading =   false;
            });
        }
    }
}
</script>

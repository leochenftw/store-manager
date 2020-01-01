<template>
<div class="main-content dashboard">
    <h1 class="title is-1 is-hidden">Dashboard</h1>
    <div id="charts" :class="{'auto': member}">
        <h2 class="title is-6 has-text-centered">Sales over last 7 days</h2>
        <SalesChart :id="'sales-overview'" />
    </div>
    <div class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h2 class="title is-3">Today: {{sums.total.toDollar()}}</h2>
                    <p class="subtitle is-6">
                        <span class="icon"><i class="far fa-credit-card"></i></span> {{sums.eftpos.toDollar()}}
                        <span class="icon"><i class="far fa-money-bill-alt"></i></span> {{sums.cash.toDollar()}}
                        <span class="icon"><i class="fas fa-ticket-alt"></i></span> {{sums.voucher.toDollar()}}
                    </p>
                    <hr />
                </div>
                <div class="column">col 2</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import SalesChart from '../blocks/charts/SalesChart';
export default {
    name        :   'Homepage',
    props       :   ['member'],
    components  :   { SalesChart },
    data()
    {
        return {
            sums    :   {
                total   :   0,
                eftpos  :   0,
                cash    :   0,
                voucher :   0
            }
        };
    },
    created()
    {
        this.fetch_data();
    },
    methods :   {
        fetch_data()
        {
            axios.get(
                base_url + endpoints.dashboard
            ).then(resp => {
                this.sums   =   resp.data.sums;
            }).catch(error => {

            });
        }
    }
}
</script>

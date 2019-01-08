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
                <div class="column">col 1</div>
                <div class="column">col 2</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import SalesChart from '../blocks/charts/SalesChart';
export default {
    name: 'Homepage',
    props: ['member'],
    components: { SalesChart }
}
</script>

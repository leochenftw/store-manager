<template>
<div class="chart">
    <canvas :id="id" width="400" height="200"></canvas>
</div>
</template>

<script>
import Chart from 'chart.js';

export default
{
    name    :   'SalesChart',
    props   :   ['id', 'feed'],
    data() {
        return {
            chart   :   null
        }
    },
    mounted() {
        let me  =   this;
        this.$nextTick().then(() => {
            me.do_chart();
        });
    },
    computed    :   {
        chart_labels()
        {
            if (this.feed) {
                let list    =   [];
                this.feed.forEach(o => {
                    list.push(o.date);
                });

                return list;
            }

            return null;
        },
        chart_data()
        {
            if (this.feed) {
                let list    =   [];
                this.feed.forEach(o => {
                    list.push(o.total);
                });

                return list;
            }

            return null;
        }
    },
    methods     :   {
        do_chart() {
            if (!this.feed) return false;
            this.chart = new Chart($('#' + this.id), {
                type: 'line',
                data: {
                    labels: this.chart_labels ? this.chart_labels : ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: 'Turnover',
                        data: this.chart_data ? this.chart_data : [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                display:false
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display:false
                            },
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    maintainAspectRatio: false,
                    responsiveAnimationDuration: 0,
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItems, data) {
                                return ' ' + tooltipItems.yLabel.toDollar();
                            }
                        }
                    },
                }
            });
        }
    }
}
</script>

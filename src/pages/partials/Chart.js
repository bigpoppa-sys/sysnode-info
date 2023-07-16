import React, { Component } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';

export class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: {}
        };
    }

    componentDidMount() {
        axios.post('https://syscoin.dev/data')
            .then(response => {
                const csvData = Papa.parse(response.data, {
                    header: true,
                    transformHeader: header =>
                        header.toLowerCase().replace(/\W/g, '_')
                }).data;
                this.prepareChartData(csvData);
            })
            .catch(error => console.log(error));
    }

    prepareChartData(data) {
        const timestamps = data.map(obj => new Date(parseInt(obj.timestamp)).toDateString());
        const amounts = data.map(obj => obj.amount);
        
        this.setState({
            chartData: {
                labels: timestamps,
                datasets: [
                    {
                        label: 'Masternode Count',
                        data: amounts,
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false
                    }
                ]
            }
        });
    }

    render() {
        return (
            <div className="chart">
                <Line
                    data={this.state.chartData}
                    options={{
                        responsive: true,
                        title: {
                            text: 'Masternode Count Over Time',
                            display: true
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }}
                />
            </div>
        );
    }
}

export default Chart;

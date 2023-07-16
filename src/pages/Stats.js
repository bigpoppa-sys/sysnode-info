import React, { Component } from 'react';
import axios from "axios";

import InnerBanner from '../parts/InnerBanner';
import Doughnut from './partials/Doughnut';
import Income from './partials/Income';
import Price from './partials/Price';
import Investment from './partials/Investment';
import WorldMap from './partials/WorldMap';
import MetaTags from 'react-meta-tags';


export class Stats extends Component {
    constructor(props){  
        super(props);  
        this.state = {  
            dataload: 0,
            api_data: [],
            api_dates_data: []
        }
    }

    componentDidMount() {
        this.getStats();     
    }

    async getStats() {
        let data = await axios
                    .get("https://syscoin.dev/mnStats")
                    .then(function(result) {
                    return result;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });

        let dates = await axios
                    .get("https://syscoin.dev/mnDates")
                    .then(function(result) {
                        return result;
                    })
                    .catch(function(error) {
                        console.log('dates error: ', error);
                    });
                
        this.setState({ 
            dataload: 1, 
            api_data: data.data,
            api_dates_data: dates.data,      
        });
    }

    async getCSVData() {
        const response = await axios.get('https://your-server-url/data.csv');
        const parsedData = Papa.parse(response.data, {
            dynamicTyping: true,
            header: true,
        });
        return parsedData.data;
    }

    async componentDidMount() {
        this.getStats();

        // Fetch the CSV data and set it in state.
        const csvData = await this.getCSVData();
        this.setState({ csvData });
    }

    render() {
        if(this.state.dataload===1){
            console.log('api dates data: ',this.state.api_dates_data)
            const chartData = {
                labels: this.state.csvData.map(item => new Date(item.Timestamp).toLocaleDateString()),
                datasets: [{
                    label: 'Masternode Count',
                    data: this.state.csvData.map(item => item.Amount),
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                }]
            };
            return(
                <main className="statsPage">
                    <MetaTags>
                        <title>Syscoin Masternodes - Masternode Stats</title>
                        <meta name="keywords" content="Syscoin, Masternodes, Blockchain, Crypto, Blockmarket, Coins, Bitcoin, Cryptocurrency, Rewards" />
                        <meta name="description" content="Sysnode.info provides Syscoin Masternode Operators the tools to maximise the most from their Masternodes!" />
                    </MetaTags>
                    <InnerBanner heading="Stats"/>
                    <Doughnut chartData={this.state.api_data.stats.mn_stats}/>
                    <Income incomeData={this.state.api_data.stats.income_stats} incomeSenOneYrData={this.state.api_data.stats.income_stats_seniority_one_year} incomeSenTwoYrData={this.state.api_data.stats.income_stats_seniority_two_year}/>
                    <Price priceData={this.state.api_data.stats.price_stats}/>
                    <Investment investData={this.state.api_data.stats.mn_stats} blockchainData={this.state.api_data.stats.blockchain_stats}/>
                    <WorldMap mapData={this.state.api_data.mapData} mapFills={this.state.api_data.mapFills}/>
                    <Line data={chartData} />                    
                </main>
            )
        } else {
            return(
                <main className="statsPage">
                    <MetaTags>
                        <title>Syscoin Masternodes - Masternode Stats</title>
                        <meta name="keywords" content="Syscoin, Masternodes, Blockchain, Crypto, Blockmarket, Coins, Bitcoin, Cryptocurrency, Rewards" />
                        <meta name="description" content="Sysnode.info provides Syscoin Masternode Operators the tools to maximise the most from their Masternodes!" />
                    </MetaTags>
                    <InnerBanner heading="Stats"/>
                </main>
            )
        }
    }
}

export default Stats;

import React, { Component } from 'react';
import axios from "axios";

import InnerBanner from '../parts/InnerBanner';
import Doughnut from './partials/Doughnut';
import AxisChart from './partials/AxisChart';
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



   
    render() {
        if(this.state.dataload===1){
            console.log('api dates data: ',this.state.api_dates_data)
            return(
                <main className="statsPage">
                    <MetaTags>
                        <title>Syscoin Masternodes - Masternode Stats</title>
                        <meta name="keywords" content="Syscoin, Masternodes, Blockchain, Crypto, Blockmarket, Coins, Bitcoin, Cryptocurrency, Rewards" />
                        <meta name="description" content="Sysnode.info provides Syscoin Masternode Operators the tools to maximise the most from their Masternodes!" />
                    </MetaTags>
                    <InnerBanner heading="Stats"/>
                    <Doughnut chartData={this.state.api_data.stats.mn_stats}/>
                    <Income incomeData={this.state.api_data.stats.income_stats} incomeSenOneYrData={this.state.api_data.stats.income_stats_seniority_one_year}/>
                    
                    <Price priceData={this.state.api_data.stats.price_stats}/>
                    <AxisChart datesData={this.state.api_dates_data[0]} datal={this.state.dataload} title={'Nodes Created Each Day'}/>
                    <AxisChart datesData={this.state.api_dates_data[1]} datal={this.state.dataload} title={'Total nodes each day'}/>
                    <Investment investData={this.state.api_data.stats.mn_stats} blockchainData={this.state.api_data.stats.blockchain_stats}/>
                    <WorldMap mapData={this.state.api_data.mapData} mapFills={this.state.api_data.mapFills}/>
                    
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
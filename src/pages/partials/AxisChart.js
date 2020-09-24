import React, { Component } from 'react';
import AnyChart from 'anychart-react';
import { withTranslation } from "react-i18next";



export class AxisChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataload: 0,
            chart_details:[],
   
        }
    }

    componentDidMount() {
        this.loadCharts(this.props.datesData);
        
    }

    loadCharts(response) {
         this.setState({
            dataload: this.props.datal,
            chart_details: response,
               });


                    
    }
    render() {
                 

        const complexSettings = {
            width: "100%",
            height: 500,
            type: 'column',
              xAxis:{
                title: {
                    text: 'DATE',
                    fontColor: 'white',
                },
             
                labels: {
                    fontSize: '12',
                    fontColor: "#fff",
                }
           
             },
            yAxis:{
                title: {
                    text: 'No of Nodes',  
                    fontColor: 'white',
                },
               
                labels: {
              
                    fontSize: '12Spx',
                    fontColor: "#fff",
                }
             
            },
            data: this.state.chart_details.map((i)=> {return {x: i[0], value: i[1]} }),
            title: {
                text: '',
                fontColor: 'white',
            },
            background: 'transparent',
         
          };
        if(this.state.dataload===1) {
           
    
            return(
                <section className="section_charts gradient_box2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="Heading__Bar text-center mb-5">

                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-between">
                        <div className="col-lg-12 mb-5 mb-lg-0">
                            <AnyChart {...complexSettings}/>
                        </div>
                    </div>
                </div>
            </section>
            )
        } else {
            return(
                <p>chart loading</p>
            )
        }
    }
}

export default withTranslation()(AxisChart);

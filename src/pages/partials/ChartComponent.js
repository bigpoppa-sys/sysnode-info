import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { LinearScale, Title, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import axios from 'axios';

Chart.register(LinearScale, Title, Tooltip, Legend);

function ChartComponent() {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('7days');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fetchChartData = useCallback(() => {
    let users = [];
    let dates = [];
    let rawDates = [];

    const startDate = new Date();

    if (timeRange !== 'all') {
      if (timeRange === '7days') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (timeRange === '1month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeRange === '3months') {
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (timeRange === '6months') {
        startDate.setMonth(startDate.getMonth() - 6);
      } else if (timeRange === '12months') {
        startDate.setMonth(startDate.getMonth() - 12);
      }
    }

    axios
      .get('https://syscoin.dev/mnCount')
      .then(res => {
        console.log(res);
        for (const dataObj of res.data) {
          const date = new Date(dataObj.date);
          if (timeRange === 'all' || date >= startDate) {
            users.push(parseInt(dataObj.users));
            let label;
            if (timeRange === '7days' || timeRange === '3months' || timeRange === '1month') {
              label = date.toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
              });
            } else {
              const month = date.toLocaleString('en-US', { month: 'short' });
              const year = date.toLocaleString('en-US', { year: '2-digit' });
              label = `${month} ${year}'`;
            }
            dates.push(label);
            rawDates.push(date);
          }
        }
        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Masternodes',
              data: users,
              rawDates,
              fill: false,
              borderColor: 'rgba(0, 0, 255)',
              borderWidth: 1,
              pointStyle: 'circle',
              hoverRadius: 10,
              radius: 0.1,
            },
          ],
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, [timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const handleTimeRangeClick = value => {
    setTimeRange(value);
  };

  return (
    <div className="text-center" style={{ paddingBottom: "50px" }}>
      <h1 className="text-white display-4 font-weight-bold">Sentry Node Count</h1>
      <div className="Chart container">
        <div className="row justify-content-center">
          <div className="col-12 mt-4 justify-content-center flex-wrap">
            <div className="btn-group flex-wrap d-sm-flex d-md-inline-flex" role="group" aria-label="Time range">
              <button
                className={timeRange === 'all' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('all')}
              >
                All Time
              </button>
              <button
                className={timeRange === '7days' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('7days')}
              >
                Last 7 Days
              </button>
              <button
                className={timeRange === '1month' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('1month')}
              >
                Last Month
              </button>
              <button
                className={timeRange === '3months' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('3months')}
              >
                Last 3 Months
              </button>
              <button
                className={timeRange === '6months' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('6months')}
              >
                Last 6 Months
              </button>
              <button
                className={timeRange === '12months' ? 'btn btn-primary' : 'btn btn-outline-primary'}
                onClick={() => handleTimeRangeClick('12months')}
              >
                Last Year
              </button>
            </div>
          </div>
          <div className="col-12 mt-4 mx-auto" style={{ maxWidth: '1000px', height: '500px' }}>
            {chartData && (
              <div style={{border: "1px solid #ccc", padding: "15px", backgroundColor: "white"}} className="w-100 h-100">
                <Line
                  data={chartData}
                  getElementAtEvent={(chartElement) => {
                    setHoveredPoint(chartElement[0]?.index);
                  }}
                  onHover={(_, elements, chart) => {
                    if (elements && elements.length) {
                      const { ctx, chartArea } = chart;
                      const x = elements[0].element.x;

                      // Clear the previously drawn vertical line
                      ctx.clearRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);

                      // Draw the new vertical line
                      ctx.beginPath();
                      ctx.moveTo(x, chartArea.top);
                      ctx.lineTo(x, chartArea.bottom);
                      ctx.lineWidth = 2;
                      ctx.strokeStyle = 'rgb(255, 99, 132)';
                      ctx.stroke();
                    }
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    },
                    plugins: {
                      title: {
                        display: true,
                        text: ['The data presented shows Total Enabled till July 16 2023,', 'then the data changes to Total Sentry Nodes'],
                        position: 'bottom',
                        fontSize: 14
                      },
                      tooltip: {
                        intersect: false,
                        displayColors: false,
                        callbacks: {
                          label: function(context) {
                            var label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                            }
                            const date = context.dataset.rawDates[context.dataIndex];
                            const dateLabel = `Date: ${date.toLocaleDateString('en-GB')}`;
                            return [label, dateLabel];
                          }
                        }
                      },
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                          beginAtZero: true
                        },
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
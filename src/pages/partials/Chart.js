import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { LinearScale } from 'chart.js';
import Chart from 'chart.js/auto';
import axios from 'axios';
import 'chartjs-plugin-zoom';
import './styles.css';

Chart.register(LinearScale);

function ChartComponent() {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('all');

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
      .get('http://syscoin.dev/mnCount')
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
    <div className="Chart">
      <div className="chart-container">
        <div className="time-range-buttons">
          <button
            className={timeRange === 'all' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('all')}
          >
            All
          </button>
          <button
            className={timeRange === '7days' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('7days')}
          >
            Last 7 Days
          </button>
          <button
            className={timeRange === '1month' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('1month')}
          >
            Last Month
          </button>
          <button
            className={timeRange === '3months' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('3months')}
          >
            Last 3 Months
          </button>
          <button
            className={timeRange === '6months' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('6months')}
          >
            Last 6 Months
          </button>
          <button
            className={timeRange === '12months' ? 'active' : ''}
            onClick={() => handleTimeRangeClick('12months')}
          >
            Last Year
          </button>
        </div>
        {chartData && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'The data presented shows Total Enabled till July 16 2023, then the data changes to Total Masternodes',
                  position: 'bottom'
                },
                tooltip: {
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
                    beginAtZero: true,
                  },
                  grid: {
                    display: true,
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1,
                  },
                },
                x: {
                  ticks: {
                    maxTicksLimit: 10,
                  },
                  grid: {
                    display: false,
                  },
                  adapters: {
                    date: {
                      range: null,
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ChartComponent;

import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import { connect } from 'react-redux'
import { chartOptions, dummyData } from './PriceChart.config'

const showPriceChart = (priceChart) => (
  <div className="price-chart">
    <Chart
      options={chartOptions}
      series={dummyData}
      type="candlestick"
      width="100%"
      height="100%"
    />
  </div>
)

class PriceChart extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Price Chart</div>
        <div className="card-body">{showPriceChart()}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

// export default App
export default connect(mapStateToProps)(PriceChart)

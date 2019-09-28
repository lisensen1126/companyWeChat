export default {
  option: {
    chart: {
    },
    title: {
      text: null,
    },
    xAxis: [{
      categories: ['05/22', '05/22', '05/22', '05/22', '05/22'],
      crosshair: true,
      tickLength: 0,
      lineWidth:0,
    }],
    credits:{
      enabled:false
    },
    yAxis: [{
      gridLineColor:'#ffffff',
      gridLineWidth:0,
      min: 0,
      enabled: false, //Y轴标签不显示
      title:null,
      labels: {
        enabled: false, //Y轴标签不显示
      },
      minRange: 1,
      startOnTick: false,
      minPadding: 0,
    }],
    tooltip: {
      shared: true,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      style: {
        color: "#ffffff",
      },
      borderWidth: 0,
      shadow: false,
    },
    legend: {
      enabled: false,
    },
    series: [{
      name: '平均值',
      type: 'line',
      dashStyle: 'ShortDash',
      color: '#EB8705',
      zIndex: 2,
      data: [7.0, 6.9, 9.5, 14.5, 18.2],
    }, {
      name: '我的门店',
      type: 'area',
      color: '#B5C3FF',
      data: [49.9, 71.5, 106.4, 129.2, 144.0],
      marker: {
        symbol:'circle',
      },
    }]
  }
};

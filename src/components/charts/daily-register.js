export default {
  line: {
    chart: {
      type: "line" //指定图表的类型，默认是折线图（line）
    },
    credits: {
      enabled: false
    }, //去掉地址
    title: {
      text: "" //指定图表标题
    },
    color: ["#5F7CFF"],
    xAxis: {
      categories: [], //指定x轴分组
      tickWidth: 0,
      minPadding: "00:00",
      labels: {
        style: {
          fontSize: "8px",
          color: "#A1A6B4"
        }
      }
    },
    yAxis: {
      title: {
        text: "" //指定y轴的标题
      },
      allowDecimals: false,
      labels: {
        style: {
          fontSize: "8px",
          color: "#A1A6B4"
        }
      },
      tickAmount: 4
    },
    plotOptions: {
      line: {
        color: "#5F7CFF"
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        data: [], //数据
        lineWidth: 2,
        dataLabels: {
          style: {
            textOutline: "none"
          }
        },
        marker: {
          fillColor: "#5F7CFF",
          radius: 4,
          states: {
            hover: {
              radius: 8,
              fillColor: "#FFA24E",
              lineWidthPlus: 0
            },
            select: {
              radius: 8,
              fillColor: "#FFA24E",
              lineWidthPlus: 0
            }
          }
        }
      }
    ],
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderWidth: 0,
      borderColor: "#fff",
      shadow: false,
      style: {
        color: "#fff"
      },
      formatter: function() {
        var s = "<span>" + this.y + "<span>";
        return s;
      }
    }
  }
};

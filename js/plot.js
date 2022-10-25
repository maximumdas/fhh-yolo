// import BoxplotData from "./boxplot_data_ipm";
let CLUSTERS = 4;
let SHAPDATA = [];
window.onload = () => {
  // FHH
  var uhh = "./csv/UHH.csv";

  // Place urls for cvs files here
  var url1 = "./../csv/treemap_all.csv";

  // var url2 = "./../csv/boxplot_data_ipm.csv";
  var url2 = "./../csv/Data Train Belanja Operasional (1).csv";

  var urlSHAP = "./../csv/SHAP Values - All Data.csv";
  var urlSHAPClust = [
    "./../csv/Shap Value Cluster_1.csv",
    "./../csv/Shap Value Cluster_2.csv",
    "./../csv/Shap Value Cluster_3.csv",
    // "./../csv/SHAP Values - Cluster 4.csv",
  ];

  var urlTreemapClust = [
    "./../csv/treemap_1.csv",
    "./../csv/treemap_2.csv",
    "./../csv/treemap_3.csv",
    "./../csv/treemap_4.csv",
  ];

  // FHH

  // End FHH

  // Next piece of code deals with responsiveness
  var d3 = Plotly.d3;
  var WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 97;

  var gd1_div_fhh = d3.select("div[id='uhh_bar']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  var gd3_div1 = d3.select("div[id='treemap']");

  var gd3_div2 = d3.select("div[id='boxplot']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  // var gd3_div3 = d3.select("div[id='shap_all']").style({});

  var gd3_div3_2 = d3.select("div[id='shap_cluster']").style({});

  // treemap per cluster
  var gd3_div3_treemap1 = d3.select("div[id='treemap_clust_1']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });
  var gd3_div3_treemap2 = d3.select("div[id='treemap_clust_2']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });
  var gd3_div3_treemap3 = d3.select("div[id='treemap_clust_3']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });
  var gd3_div3_treemap4 = d3.select("div[id='treemap_clust_4']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  // fhh
  var uhhBar = gd1_div_fhh.node();

  var my_Div1 = gd3_div1.node();
  var my_Div2 = gd3_div2.node();
  // var shapAll = gd3_div3.node();
  var shapCluster = gd3_div3_2.node();
  var treemapCluster1 = gd3_div3_treemap1.node();
  var treemapCluster2 = gd3_div3_treemap2.node();
  var treemapCluster3 = gd3_div3_treemap3.node();
  var treemapCluster4 = gd3_div3_treemap4.node();

  //URL1 and URL2
  function makeplot() {
    // FHH
    // barplot
    Plotly.d3.csv(uhh, (data) => {
      console.log("uhh:", data);
      generateBarplot(data, "uhh_bar");
    });

    Plotly.d3.csv(url1, function (data) {
      processData(data, "treemap");
    });
    Plotly.d3.csv(url2, function (data) {
      createBoxPlot(data, "boxplot");
    });
    // Plotly.d3.csv(urlSHAP, function (data) {
    //   createShapPlot(data, "shap_all");
    // });

    // shap cluster
    urlSHAPClust.forEach((source) => {
      Plotly.d3.csv(source, (data) => {
        injectShapData(data);
      });
    });

    // treemap per cluster
    Plotly.d3.csv(urlTreemapClust[0], function (data) {
      processData(data, "treemap_clust_1");
    });
    Plotly.d3.csv(urlTreemapClust[1], function (data) {
      processData(data, "treemap_clust_2");
    });
    Plotly.d3.csv(urlTreemapClust[2], function (data) {
      processData(data, "treemap_clust_3");
    });
    Plotly.d3.csv(urlTreemapClust[3], function (data) {
      processData(data, "treemap_clust_4");
    });
  }

  function injectShapData(data) {
    SHAPDATA.push(data);
    if (SHAPDATA.length == 3) {
      createShapPlot(SHAPDATA, "shap_cluster", false);
      SHAPDATA = [];
    }
  }

  function pickGroup(allRow, group) {
    const result = [];
    allRow.filter((elem) => {
      if (elem.cluster == group) return result.push(elem.IPM_2021);
    });
    return result;
  }

  // FHH
  // usia harapan hidup
  function generateBarplot(data, divName) {
    var layout = {
      // title: "Bar Chart",
      yaxis: {
        automargin: true,
      },
      barmode: "group",
    };
    let xlabel = [],
      yPosValues = [];
    y2PosValues = [];
    yNegValues = [];
    barColors = [];
    for (var i = 0; i < data.length; i++) {
      xlabel.push(data[i].Provinsi);
      yPosValues.push(data[i]["2020"]);
      y2PosValues.push(data[i]["2021"]);
      // barColors.push(data[i].Sign);
    }
    var data = [
      {
        type: "bar",
        x: yPosValues,
        y: xlabel,
        base: 0,
        hovertemplate: "%{value}",
        orientation: "h",
        marker: {
          // color: barColors,
        },
        name: "Usia Harapan Hidup",
      },
      {
        type: "bar",
        x: y2PosValues,
        y: xlabel,
        base: 0,
        hovertemplate: "%{value}",
        orientation: "h",
        marker: {
          // color: barColors,
        },
        name: "Usia Harapan Hidup",
      },
    ];
    Plotly.newPlot(divName, data, layout);
  }

  // Shap value
  function createShapPlot(data, divName, all = true) {
    var layout = {
      // title: "Bar Chart",
      yaxis: {
        automargin: true,
      },
    };
    if (all) {
      let xlabel = [],
        yPosValues = [];
      yNegValues = [];
      barColors = [];
      for (var i = 0; i < data.length; i++) {
        xlabel.push(data[i].Variable);
        yPosValues.push(data[i].SHAP_abs);
        barColors.push(data[i].Sign);
      }
      var data = [
        {
          type: "bar",
          x: yPosValues,
          y: xlabel,
          base: 0,
          hovertemplate: "%{value}",
          orientation: "h",
          marker: {
            color: barColors,
          },
          name: "SHAP Value",
        },
      ];
    } else {
      let traces = [];
      for (var i = 0; i < data.length; i++) {
        let xlab = [],
          yval = [],
          barcol = [];
        for (var j = 0; j < data[i].length; j++) {
          xlab.push(data[i][j].Variable);
          yval.push(data[i][j].SHAP_abs);
          barcol.push(data[i][j].Sign);
        }
        traces.push({
          type: "bar",
          x: yval,
          y: xlab,
          base: 0,
          hovertemplate: "%{value}",
          orientation: "h",
          marker: {
            color: barcol,
          },
          yaxis: "y" + (i + 1),
          xaxis: "x" + (i + 1),
          name: "SHAP Value Cluster " + (i + 1),
        });
      }

      layout["grid"] = { rows: 3, columns: 1, pattern: "independent" };
      layout["showlegend"] = false;
      data = traces;
    }
    Plotly.newPlot(divName, data, layout);
  }

  // Boxplot
  function createBoxPlot(data, divName) {
    let clusts = [];
    // clusts.push({
    //   y: pickGroup(data, 0),
    //   type: "box",
    //   name: "Cluster " + 4,
    // });
    clusts.push({
      y: pickGroup(data, 1),
      type: "box",
      name: "Cluster " + 1,
    });
    clusts.push({
      y: pickGroup(data, 2),
      type: "box",
      name: "Cluster " + 2,
    });
    clusts.push({
      y: pickGroup(data, 3),
      type: "box",
      name: "Cluster " + 3,
    });

    // for (var i = 0; i < CLUSTERS; i++) {
    //   clusts.push({
    //     y: pickGroup(data, i),
    //     type: "box",
    //     name: "Cluster " + (i + 1),
    //   });
    // }
    Plotly.newPlot(divName, clusts);
  }

  // Treemap
  function processData(data, divName) {
    let labels = [],
      parents = [],
      values = [];
    for (var i = 0; i < data.length; i++) {
      labels.push(data[i].label);
      parents.push("APBD");
      values.push(data[i].alokasi);
    }
    var data = [
      {
        type: "treemap",
        labels: labels,
        parents: parents,
        values: values,
        textinfo: "label+value+percent entry",
        domain: { x: [0, 1] },
        outsidetextfont: { size: 20, color: "#377eb8" },
        marker: { line: { width: 2 } },
        pathbar: { visible: false },
      },
    ];

    var layout = {
      annotations: [
        {
          showarrow: false,
          text: "Alokasi APBD Berdasarkan Kegiatan",
          x: 0.5,
          xanchor: "center",
          y: 1.1,
          yanchor: "bottom",
        },
      ],
    };
    Plotly.newPlot(divName, data, layout);
  }

  makeplot();

  //instruction resizes plot
  window.onresize = function () {
    //FHH
    Plotly.Plots.resize(uhhBar);

    Plotly.Plots.resize(my_Div1);
    Plotly.Plots.resize(my_Div2);
    // Plotly.Plots.resize(shapAll);
    Plotly.Plots.resize(shapCluster);
    // treemap cluster
    Plotly.Plots.resize(treemapCluster1);
    Plotly.Plots.resize(treemapCluster2);
    Plotly.Plots.resize(treemapCluster3);
    Plotly.Plots.resize(treemapCluster4);
  };

  let treemapSelect = window.document.getElementById("treemapSelect");
  treemapSelect.addEventListener("change", function (e) {
    if (treemapSelect.value == 0) {
      window.document
        .getElementById("treemap_wrapper")
        .classList.remove("hidden");
      window.document
        .getElementById("treemap_wrapper_1")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_2")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_3")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_4")
        .classList.add("hidden");
    } else if (treemapSelect.value == 1) {
      window.document.getElementById("treemap_wrapper").classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_1")
        .classList.remove("hidden");
      window.document
        .getElementById("treemap_wrapper_2")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_3")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_4")
        .classList.add("hidden");
    } else if (treemapSelect.value == 2) {
      window.document.getElementById("treemap_wrapper").classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_1")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_2")
        .classList.remove("hidden");
      window.document
        .getElementById("treemap_wrapper_3")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_4")
        .classList.add("hidden");
    } else if (treemapSelect.value == 3) {
      window.document.getElementById("treemap_wrapper").classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_1")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_2")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_3")
        .classList.remove("hidden");
      window.document
        .getElementById("treemap_wrapper_4")
        .classList.add("hidden");
    } else if (treemapSelect.value == 4) {
      window.document.getElementById("treemap_wrapper").classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_1")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_2")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_3")
        .classList.add("hidden");
      window.document
        .getElementById("treemap_wrapper_4")
        .classList.remove("hidden");
    }
  });
};

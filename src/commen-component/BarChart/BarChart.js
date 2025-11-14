// "use client"; // ✅ Needed if you're in Next.js 13+ (App Router)
// import React, { useLayoutEffect } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// const BarChart = () => {
//   useLayoutEffect(() => {
//     // Create chart root
//     const root = am5.Root.new("chartdiv");

//     // Apply theme
//     root.setThemes([am5themes_Animated.new(root)]);

//     // Create XY chart
//     const chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: true,
//         panY: true,
//         wheelX: "panX",
//         wheelY: "zoomX",
//       })
//     );

//     // Create X axis (Category)
//     const xAxis = chart.xAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: "country",
//         renderer: am5xy.AxisRendererX.new(root, {
//           minGridDistance: 30,
//         }),
//       })
//     );

//     // Create Y axis (Value)
//     const yAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(root, {
//         renderer: am5xy.AxisRendererY.new(root, {}),
//       })
//     );

//     // Create series
//     const series = chart.series.push(
//       am5xy.ColumnSeries.new(root, {
//         name: "Sales",
//         xAxis,
//         yAxis,
//         valueYField: "value",
//         categoryXField: "country",
//         tooltip: am5.Tooltip.new(root, { labelText: "{categoryX}: {valueY}" }),
//       })
//     );

//     // Data
//     const data = [
//       { country: "USA", value: 2025 },
//       { country: "UK", value: 1882 },
//       { country: "India", value: 1809 },
//       { country: "China", value: 1322 },
//       { country: "Canada", value: 1122 },
//     ];

//     xAxis.data.setAll(data);
//     series.data.setAll(data);

//     // Animate
//     series.appear(1000);
//     chart.appear(1000, 100);

//     // Cleanup on unmount
//     return () => {
//       root.dispose();
//     };
//   }, []);

//   return <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>;
// };

// export default BarChart;

"use client";
import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ColumnsWithMovingBullets = () => {
  useLayoutEffect(() => {
    // Create root
    const root = am5.Root.new("chartdiv");

    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Data
    const data = [
      {
        name: "Zentrail",
        steps: 688,
        pictureSettings: {
          src: "https://www.zentrail.in/_next/image?url=%2Ffooterlogo.png&w=1920&q=75",
        },
      },
      {
        name: "Proonam",
        steps: 1000,
        pictureSettings: {
          src: "https://www.poornamevents.com/_next/image?url=%2Flogo2.webp&w=256&q=75",
        },
      },
    ];

    // Chart container
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingBottom: 50,
        paddingTop: 40,
        paddingLeft: 0,
        paddingRight: 0,
      })
    );

    // Axes
    const xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 60,
    });
    xRenderer.grid.template.set("visible", false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        paddingTop: 40,
        categoryField: "name",
        renderer: xRenderer,
      })
    );

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("strokeDasharray", [3]);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer,
      })
    );

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Steps",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "steps",
        categoryXField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxWidth: 50,
      fillOpacity: 0.8,
    });

    // Hover logic
    let currentlyHovered;

    function handleHover(dataItem) {
      if (dataItem && currentlyHovered !== dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        const bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    }

    function handleOut() {
      if (currentlyHovered) {
        const bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    }

    series.columns.template.events.on("pointerover", (e) =>
      handleHover(e.target.dataItem)
    );
    series.columns.template.events.on("pointerout", handleOut);

    // Bullet (moving image circle)
    const circleTemplate = am5.Template.new({});

    series.bullets.push((root, series, dataItem) => {
      const bulletContainer = am5.Container.new(root, {});
      bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 34,
          },
          circleTemplate
        )
      );

      const maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 27 })
      );

      const imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle,
        })
      );

      imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60,
        })
      );

      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: bulletContainer,
      });
    });

    // Heat rules (color based on value)
    series.columns.template.setAll({
      fillGradient: am5.LinearGradient.new(root, {
        stops: [{ color: am5.color(0x75d9e6) }, { color: am5.color(0xc843ff) }],
        rotation: 90, // vertical gradient
      }),
    });

    // Assign data
    series.data.setAll(data);
    xAxis.data.setAll(data);

    // Cursor
    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    cursor.events.on("cursormoved", () => {
      const dataItem = series.get("tooltip").dataItem;
      if (dataItem) {
        handleHover(dataItem);
      } else {
        handleOut();
      }
    });

    // Animate chart
    series.appear();
    chart.appear(1000, 100);

    // Cleanup
    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      id="chartdiv"
      style={{ width: "400px", height: "500px", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          width: "100px",
          height: "20px",
          backgroundColor: "white",
          bottom: 50,
          zIndex: 100,
        }}
      ></div>
    </div>
  );
};

export default ColumnsWithMovingBullets;

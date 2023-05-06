import React, { useRef, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "../styles/Mapbox.css";
import { point, featureCollection } from "@turf/helpers";
import circle from "@turf/circle";

const MapboxMap = ({ jsonData }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    console.log(jsonData);
    mapboxgl.accessToken =
      "pk.eyJ1IjoianVubGluZ3podWFuZzA2MTIiLCJhIjoiY2w2ZWM0bWJ2MDB6aTNubXhsdG8zZTJ3dSJ9.Eeqn1X7BTGldAw2_yNGbsw";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/junlingzhuang0612/cl6faj43y001315qk9lz1aa65",
      center: [-73.9626, 40.8075],
      zoom: 16,
    });

    // 添加悬停事件
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on("load", function () {
      // map.addLayer({
      //   id: "area",
      //   type: "fill",
      //   source: {
      //     type: "geojson",
      //     data: "data/electionDistricts.geojson", // 更改为绝对路径
      //   },
      //   layout: {},
      //   paint: {
      //     "fill-color": [
      //       "step",
      //       ["get", "shape_area"],
      //       "#ffffff",
      //       437968,
      //       "#ccedf5",
      //       525921,
      //       "#66c7e0",
      //       1000000,
      //       "#33b5d5",
      //       2089804,
      //       "#00a2ca",
      //     ],
      //     "fill-opacity": 0.5,
      //   },
      // });

      // // 显示面积的悬停事件
      // map.on("mousemove", "area", (e) => {
      //   map.getCanvas().style.cursor = "pointer";
      //   const shapeArea = e.features[0].properties.shape_area;
      //   popup
      //     .setLngLat(e.lngLat)
      //     .setHTML(`<p>Area:${shapeArea}</p>`)
      //     .addTo(map);
      // });

      // // 鼠标离开区域时移除悬停事件
      // map.on("mouseleave", "area", () => {
      //   map.getCanvas().style.cursor = "";
      //   popup.remove();
      // });

      // const geojsonData = map.getSource("area")._data;
      // console.log("加载的GeoJSON数据：", geojsonData);
      // 添加地图标记
      // jsonData.forEach((data) => {
      //   const longitude = data.POINT_X;
      //   const latitude = data.POINT_Y;

      //   // 创建一个自定义的HTML元素
      //   const markerElement = document.createElement("div");
      //   markerElement.className = "custom-marker marker-group"; // 应用自定义样式

      //   // 使用自定义HTML元素创建一个Marker
      //   const marker = new mapboxgl.Marker(markerElement)
      //     .setLngLat([longitude, latitude])
      //     .addTo(map);
      // });
      const geoJsonData = featureCollection(
        jsonData.map((data) => point([data.POINT_X, data.POINT_Y]))
      );

      map.addSource("markers", {
        type: "geojson",
        data: geoJsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "black",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    });
    map.on("load", async function () {
      // 使用fetch加载本地GeoJSON文件
      const response = await fetch("/data/buffer_points.geojson"); // 更改为你的GeoJSON文件路径
      const geojsonData = await response.json();

      // 遍历GeoJSON中的点并为每个点创建一个25米半径的圆
      const circles = geojsonData.features.map((feature) => {
        const center = feature.geometry.coordinates;
        return circle(center, 0.025, { units: "kilometers" });
      });

      // 添加圆形数据源
      map.addSource("circles", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: circles,
        },
      });

      // 添加圆形图层
      map.addLayer({
        id: "circles",
        type: "fill",
        source: "circles",
        layout: {},
        paint: {
          "fill-color": "#007cbf",
          "fill-opacity": 0.5,
        },
      });
    });
    return () => map.remove();
  }, [jsonData]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapboxMap;

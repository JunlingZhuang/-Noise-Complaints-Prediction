import React, { useRef, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "../styles/Mapbox.css";

const MapboxMap = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
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
      map.addLayer({
        id: "area",
        type: "fill",
        source: {
          type: "geojson",
          data: "data/electionDistricts.geojson", // 更改为绝对路径
        },
        layout: {},
        paint: {
          "fill-color": [
            "step",
            ["get", "shape_area"],
            "#ffffff",
            437968,
            "#ccedf5",
            525921,
            "#66c7e0",
            1000000,
            "#33b5d5",
            2089804,
            "#00a2ca",
          ],
          "fill-opacity": 0.5,
        },
      });

      // 显示面积的悬停事件
      map.on("mousemove", "area", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const shapeArea = e.features[0].properties.shape_area;
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<p>面积：${shapeArea}</p>`)
          .addTo(map);
      });

      // 鼠标离开区域时移除悬停事件
      map.on("mouseleave", "area", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapboxMap;

import React, { useEffect } from "react";
import * as d3 from "d3";

const JsonReader = ({ setJsonData }) => {
  useEffect(() => {
    d3.csv("data/SVI_withinbuffer_new.csv").then((data) => {
      console.log(data);
      setJsonData(data);
    });
  }, [setJsonData]);

  return null;
};

export default JsonReader;

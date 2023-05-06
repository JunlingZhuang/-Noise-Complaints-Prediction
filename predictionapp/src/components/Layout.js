import MapboxMap from "./Mapbox";
import JsonReader from "./JsonReader";
import { useState } from "react";

function Layout() {
  const [jsonData, setJsonData] = useState([]);

  return (
    <div>
      <JsonReader setJsonData={setJsonData} />
      <MapboxMap jsonData={jsonData} />
    </div>
  );
}

export default Layout;

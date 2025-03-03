'use client'
import { useRef, useState } from "react";
import {ImageOverlay,
    LayerGroup,
    MapContainer,
    Marker,TileLayer} from "react-leaflet";
  import "leaflet-semicircle";
  import "leaflet/dist/leaflet.css";
  import {Map,icon} from "leaflet";
  import { SemiCircle } from "react-leaflet-semicircle";
import {  INFO_CAMERAS, ORTHO_BOUNDS, ORTHO_IMAGE } from "@/app/constanst";

const cameraIcon = icon({
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -25],
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4017/4017956.png",
  });
  
export default function mapConfig (){
    const mapRef = useRef<Map>(null);
    const [currentCamera, setCurrentCamera] = useState(0);
    const currentZoom = INFO_CAMERAS[currentCamera].zoom;
    const currentCenter = INFO_CAMERAS[currentCamera].centerView;
    const [zoom, setZoomLevel] = useState(currentZoom);
    const [center, setCenter] = useState(currentCenter);
    return(
        <div>
        <MapContainer
          className="Map"
          ref={mapRef}
          zoom={zoom}
          center={center}
          doubleClickZoom={false}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ minHeight: "80vh", width: "100%" }}
          maxBounds={ORTHO_BOUNDS}
          minZoom={10}
        >
          <TileLayer
            url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            attribution=""
            maxZoom={24}
          />
          <ImageOverlay url={ORTHO_IMAGE} bounds={ORTHO_BOUNDS} />
              <LayerGroup>
                {INFO_CAMERAS.map((cameraInfo, i) => (
                  <div key={`camera-marker-${i}`}>
                    <Marker
                      position={cameraInfo.position}
                      icon={cameraIcon}
                      eventHandlers={{
                        click: () => {
                          setCurrentCamera(i);
                          mapRef.current?.setView(currentCenter, currentZoom);
                        },
                      }}
                    />
                    <SemiCircle
                      position={cameraInfo.position}
                      radius={cameraInfo.radius}
                      startAngle={cameraInfo.startAngle}
                      stopAngle={cameraInfo.stopAngle}
                    />
                  </div>
                ))}
              </LayerGroup>
        </MapContainer>
        </div>
    )
}
import { DeleteIcon } from "@chakra-ui/icons";
import { HStack, IconButton } from "@chakra-ui/react";
import { LatLngLiteral, LatLngTuple, divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import "./PointMarker.css";
import {INFO_CAMERAS} from "@/app/constanst";

const createMarkerIcon = (name: string, color: string) =>
    divIcon({
      html: `
      <svg height="20" width="20" style="stroke: transparent; stroke-width: 0px;">
        <g id="${name}">
          <circle cx="10" cy="10" r="10" fill="${color}" />
          <text x="10" y="10" text-anchor="middle" fill="white" stroke-width="2px" dy=".3em">${name}</text>
        </g>
      </svg>
      `,
      bgPos: [0, 0],
      popupAnchor: [0, -10],
      iconAnchor: [10, 10],
      iconSize: [20, 20],
    });

    interface PointMarkerProps {
        name: string; // Nombre del marcador (se muestra en el icono)
        position: LatLngTuple; // Coordenadas del marcador [lat, lng]
        setPosition: (x: LatLngLiteral) => void; // Función para actualizar la posición
        color: string; // Color del icono del marcador
        onDelete?: () => void; // Función opcional para eliminar el marcador
      }

const PointMarker = (props: PointMarkerProps) => {
  const { name, position, setPosition, color, onDelete } = props;
  const cameraInfo = INFO_CAMERAS.find((camera) => camera.name === name);
  return (
    <Marker
      draggable
      position={position}
      icon={createMarkerIcon(name, color)}
      alt={undefined}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    >
      <Popup
        autoClose={true}
        closeButton={false}
        closeOnClick={true}
        interactive={true}
        autoPan={false}
      >
        <HStack>
        <span>
    <b>Nombre:</b> {cameraInfo ? cameraInfo.name : "Desconocido"}
  </span>
          {onDelete ? (
            <IconButton
            {...({
              icon: <DeleteIcon />,
            } as any)}
            size="xs"
            aria-label="delete marker"
            colorScheme="red"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
          ) : null}
        </HStack>
      </Popup>
    </Marker>
  );
};

export default PointMarker;

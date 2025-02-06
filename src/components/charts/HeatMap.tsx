import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { HeatmapRect } from '@visx/heatmap';

// Generamos datos más realistas
const generateData = () => {
  return new Array(24).fill(0).map((_, hour) => ({
    bin: hour,
    bins: new Array(7).fill(0).map((_, day) => {
      // Simulamos más actividad durante horas laborales
      const isWorkHour = hour >= 9 && hour <= 17;
      const isWeekday = day < 5;
      const baseValue = isWorkHour && isWeekday ? 70 : 30;
      return Math.random() * baseValue;
    }),
  }));
};

const data = generateData();

export function HeatMap() {
  const width = 600;
  const height = 300;
  const margin = { top: 10, right: 20, bottom: 20, left: 40 };

  // Escalas para los ejes
  const xScale = scaleLinear({
    domain: [0, 24],
    range: [0, width - margin.left - margin.right],
  });

  const yScale = scaleLinear({
    domain: [0, 7],
    range: [0, height - margin.top - margin.bottom],
  });

  // Escala de colores más suave
  const colorScale = scaleLinear({
    domain: [0, 50, 100],
    range: ['#313695', '#f4a582', '#a50026'], // Azul a rojo
  });

  const binWidth = (width - margin.left - margin.right) / 24;
  const binHeight = (height - margin.top - margin.bottom) / 7;

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <HeatmapRect
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={1}
          />
          
          {/* Etiquetas del eje Y (días) */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, i) => (
            <text
              key={`day-${i}`}
              x={-10}
              y={yScale(i) + binHeight / 2}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize={12}
              fill="#666"
            >
              {day}
            </text>
          ))}

          {/* Etiquetas del eje X (horas) */}
          {[0, 6, 12, 18, 23].map((hour) => (
            <text
              key={`hour-${hour}`}
              x={xScale(hour) + binWidth / 2}
              y={height - margin.top - margin.bottom + 15}
              textAnchor="middle"
              fontSize={12}
              fill="#666"
            >
              {`${hour}:00`}
            </text>
          ))}
        </Group>
      </svg>

      {/* Leyenda */}
      <div className="absolute right-0 top-0 flex items-center text-sm">
        <span className="mr-2">Menos</span>
        <div className="w-20 h-4" style={{
          background: 'linear-gradient(to right, #313695, #f4a582, #a50026)'
        }} />
        <span className="ml-2">Más</span>
      </div>
    </div>
  );
} 
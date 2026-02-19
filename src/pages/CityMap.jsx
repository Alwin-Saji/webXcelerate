import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Wind, Camera, Volume2, Thermometer, Bus as BusIcon } from 'lucide-react';
import { sensorLocations, vehiclePositions, wasteBinData } from '../data/mockData';
import s from './CityMap.module.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (emoji, size = 28) =>
  L.divIcon({
    html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const LAYERS = {
  sensors: { label: 'Air Quality', icon: Wind, active: true },
  traffic: { label: 'Traffic Cams', icon: Camera, active: true },
  noise: { label: 'Noise Levels', icon: Volume2, active: false },
  vehicles: { label: 'Vehicles', icon: BusIcon, active: true },
  waste: { label: 'Waste Bins', icon: null, active: true },
};

function SensorPopup({ sensor }) {
  if (sensor.type === 'air-quality') {
    const aqiColor = sensor.aqi <= 50 ? '#22c55e' : sensor.aqi <= 100 ? '#f59e0b' : '#ef4444';
    return (
      <div className={s.popupContent}>
        <div className={s.popupHeader}>
          <Wind style={{ width: '1rem', height: '1rem', color: aqiColor }} />
          <span className={s.popupTitle}>Air Quality Sensor</span>
        </div>
        <div className={s.popupRows}>
          <div className={s.popupRow}><span className={s.popupLabel}>AQI:</span><span className={s.popupValue} style={{ color: aqiColor }}>{sensor.aqi} — {sensor.label}</span></div>
          <div className={s.popupRow}><span className={s.popupLabel}>PM2.5:</span><span>{sensor.pm25} µg/m³</span></div>
        </div>
      </div>
    );
  }
  if (sensor.type === 'traffic-cam') {
    const conColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
    return (
      <div className={s.popupContent}>
        <div className={s.popupHeader}>
          <Camera style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} />
          <span className={s.popupTitle}>Traffic Camera</span>
        </div>
        <div className={s.popupRows}>
          <div className={s.popupRow}><span className={s.popupLabel}>Vehicles:</span><span>{sensor.vehicles}</span></div>
          <div className={s.popupRow}><span className={s.popupLabel}>Congestion:</span><span className={s.popupValue} style={{ color: conColors[sensor.congestion], textTransform: 'capitalize' }}>{sensor.congestion}</span></div>
        </div>
        <div className={s.feedPreview}>📹 Live Feed Preview</div>
      </div>
    );
  }
  if (sensor.type === 'noise') {
    const noiseColor = sensor.decibels <= 60 ? '#22c55e' : sensor.decibels <= 75 ? '#f59e0b' : '#ef4444';
    return (
      <div className={s.popupContent}>
        <div className={s.popupHeader}>
          <Volume2 style={{ width: '1rem', height: '1rem', color: noiseColor }} />
          <span className={s.popupTitle}>Noise Sensor</span>
        </div>
        <div className={s.popupRows}>
          <div className={s.popupRow}><span className={s.popupLabel}>Level:</span><span className={s.popupValue} style={{ color: noiseColor }}>{sensor.decibels} dB — {sensor.level}</span></div>
        </div>
      </div>
    );
  }
  if (sensor.type === 'weather') {
    return (
      <div className={s.popupContent}>
        <div className={s.popupHeader}>
          <Thermometer style={{ width: '1rem', height: '1rem', color: 'var(--warning)' }} />
          <span className={s.popupTitle}>Weather Station</span>
        </div>
        <div className={s.popupRows}>
          <div className={s.popupRow}><span className={s.popupLabel}>Temp:</span><span>{sensor.temp}°C</span></div>
          <div className={s.popupRow}><span className={s.popupLabel}>Humidity:</span><span>{sensor.humidity}%</span></div>
          <div className={s.popupRow}><span className={s.popupLabel}>Conditions:</span><span>{sensor.conditions}</span></div>
        </div>
      </div>
    );
  }
  return null;
}

export default function CityMap() {
  const [layers, setLayers] = useState(LAYERS);

  const toggleLayer = (key) => {
    setLayers(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active }
    }));
  };

  const filteredSensors = useMemo(() => {
    const active = [];
    if (layers.sensors.active) active.push(...sensorLocations.filter(s => s.type === 'air-quality'));
    if (layers.traffic.active) active.push(...sensorLocations.filter(s => s.type === 'traffic-cam'));
    if (layers.noise.active) active.push(...sensorLocations.filter(s => s.type === 'noise'));
    active.push(...sensorLocations.filter(s => s.type === 'weather'));
    return active;
  }, [layers]);

  const getBinColor = (fill) => fill > 80 ? '#ef4444' : fill >= 50 ? '#f59e0b' : '#22c55e';
  const getBinOpacity = (fill) => 0.4 + (fill / 100) * 0.6;

  return (
    <div className={s.page}>
      <div className={s.headerRow}>
        <div>
          <h2 className={s.pageTitle}>Interactive City Map</h2>
          <p className={s.pageSubtitle}>Click markers for sensor data and live feeds</p>
        </div>
      </div>

      {/* Layer Controls */}
      <div className={s.layers}>
        {Object.entries(layers).map(([key, layer]) => {
          const Icon = layer.icon;
          return (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`${s.layerBtn} ${layer.active ? s.layerBtnActive : s.layerBtnInactive}`}
            >
              {Icon
                ? <Icon style={{ width: '0.875rem', height: '0.875rem' }} />
                : <Layers style={{ width: '0.875rem', height: '0.875rem' }} />
              }
              {layer.label}
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className={s.mapWrapper}>
        <MapContainer
          center={[40.7549, -73.9840]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {filteredSensors.map(sensor => {
            const emojis = { 'air-quality': '🌬️', 'traffic-cam': '📹', 'noise': '🔊', 'weather': '🌤️' };
            return (
              <Marker key={sensor.id} position={[sensor.lat, sensor.lng]} icon={createIcon(emojis[sensor.type] || '📍')}>
                <Popup><SensorPopup sensor={sensor} /></Popup>
              </Marker>
            );
          })}

          {layers.vehicles.active && vehiclePositions.map(v => (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={createIcon(v.type === 'bus' ? '🚌' : '🚊', 24)}>
              <Popup>
                <div className={s.popupContent}>
                  <p className={s.popupTitle}>{v.type === 'bus' ? '🚌 Bus' : '🚊 Tram'} {v.id}</p>
                  <div className={s.popupRows} style={{ marginTop: '0.25rem' }}>
                    <div className={s.popupRow}><span className={s.popupLabel}>Route:</span><span>{v.route}</span></div>
                    <div className={s.popupRow}><span className={s.popupLabel}>Speed:</span><span>{v.speed} mph</span></div>
                    <div className={s.popupRow}><span className={s.popupLabel}>Heading:</span><span>{v.heading}</span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {layers.waste.active && wasteBinData.map(bin => (
            <CircleMarker
              key={bin.id}
              center={[bin.lat, bin.lng]}
              radius={10 + bin.fill / 10}
              fillColor={getBinColor(bin.fill)}
              fillOpacity={getBinOpacity(bin.fill)}
              stroke={true}
              color={getBinColor(bin.fill)}
              weight={2}
              opacity={0.8}
            >
              <Popup>
                <div className={s.popupContent}>
                  <p className={s.popupTitle}>🗑️ {bin.location}</p>
                  <div className={s.popupRows} style={{ marginTop: '0.5rem' }}>
                    <div className={s.popupRow}>
                      <span className={s.popupLabel}>Fill Level:</span>
                      <span className={s.popupValue} style={{ color: getBinColor(bin.fill) }}>{bin.fill}%</span>
                    </div>
                    <div style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '9999px', height: '0.5rem', marginTop: '0.25rem' }}>
                      <div style={{ width: `${bin.fill}%`, backgroundColor: getBinColor(bin.fill), height: '0.5rem', borderRadius: '9999px', transition: 'all 0.3s' }} />
                    </div>
                    <div className={s.popupRow}><span className={s.popupLabel}>Type:</span><span style={{ textTransform: 'capitalize' }}>{bin.type}</span></div>
                    <div className={s.popupRow}><span className={s.popupLabel}>Last Collected:</span><span>{bin.lastCollected}</span></div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

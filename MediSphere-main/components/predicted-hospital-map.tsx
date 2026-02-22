"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import mapboxgl from "mapbox-gl";
import { CSSProperties } from "react";

type Mode = "driving" | "walking" | "bicycling";

type PredictedHospital = {
  rank: number
  name: string
  availableBeds: number
  totalBeds: number
  address?: string
  distance?: string
  phone?: string
  type?: string
  doctorsOnDuty?: number
  opdQueue?: number
  bloodBank?: Record<string, number>
  lastUpdated?: string
  lat?: number
  lng?: number
}

// ✅ Set access token once (use env variable)
mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  (typeof window !== "undefined" ? (window as any).ENV_MAPBOX_TOKEN : "");

export function PredictedHospitalMap({
  prediction,
  user,
  selected,
  onSelect,
  mode = "driving",
}: {
  prediction?: { predictedBeds: number; topHospitals: PredictedHospital[] };
  user?: { lat: number; lng: number };
  selected?: PredictedHospital;
  onSelect?: (h: PredictedHospital) => void;
  mode?: Mode;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  const hospitals = prediction?.topHospitals || [];

  // init map when token + container + user ready
  useEffect(() => {
    if (!mapboxgl.accessToken || !mapContainer.current || !user) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [user.lng, user.lat],
      zoom: 12,
      attributionControl: true,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // add user marker
      map.addSource("user", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: [user.lng, user.lat] },
          properties: {},
        },
      });

      map.addLayer({
        id: "user-pin",
        type: "circle",
        source: "user",
        paint: { "circle-radius": 6, "circle-color": "#0ea5a6" },
      });

      // add predicted hospitals
      map.addSource("hospitals", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: hospitals.filter(h => h.lat && h.lng).map((h) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [h.lng!, h.lat!] },
            properties: { 
              id: h.rank, 
              name: h.name,
              availableBeds: h.availableBeds,
              totalBeds: h.totalBeds,
              address: h.address || "",
              phone: h.phone || "",
              type: h.type || "",
              doctorsOnDuty: h.doctorsOnDuty || 0,
              opdQueue: h.opdQueue || 0
            } as any,
          })),
        },
      });

      map.addLayer({
        id: "hospitals-pin",
        type: "circle",
        source: "hospitals",
        paint: { "circle-radius": 8, "circle-color": "#dc2626" },
      });

      // popup on click
      map.on("click", "hospitals-pin", (e: any) => {
        const f = e.features?.[0];
        const rank = f?.properties?.id;
        const found = hospitals.find((x) => x.rank === rank);
        if (found) {
          const popupHtml = `
            <div style="font-size:14px; padding:8px; max-width:200px;">
              <strong style="color:#dc2626;">Rank #${found.rank}</strong><br/>
              <strong>${found.name}</strong><br/>
              <span style="color:#059669;">Available Beds: ${found.availableBeds}/${found.totalBeds}</span><br/>
              <span style="color:#d97706;">OPD Queue: ${found.opdQueue || 0}</span><br/>
              <span style="color:#7c3aed;">Doctors: ${found.doctorsOnDuty || 0}</span><br/>
              ${found.address ? `<span style="font-size:12px;">📍 ${found.address}</span><br/>` : ''}
              ${found.phone ? `<span style="font-size:12px;">📞 ${found.phone}</span>` : ''}
            </div>
          `;
          new mapboxgl.Popup()
            .setLngLat(f.geometry.coordinates)
            .setHTML(popupHtml)
            .addTo(map);
          onSelect?.(found);
        }
      });

      // cursor changes
      map.on("mouseenter", "hospitals-pin", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "hospitals-pin", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, [user, hospitals]);

  // update hospital markers when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const src = map.getSource("hospitals") as mapboxgl.GeoJSONSource;
    if (src && hospitals) {
      const features: GeoJSON.Feature[] = hospitals.filter(h => h.lat && h.lng).map((h) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [h.lng!, h.lat!],
        },
        properties: {
          id: h.rank,
          name: h.name,
          availableBeds: h.availableBeds,
          totalBeds: h.totalBeds,
          address: h.address || "",
          phone: h.phone || "",
          type: h.type || "",
          doctorsOnDuty: h.doctorsOnDuty || 0,
          opdQueue: h.opdQueue || 0
        } as any,
      }));

      const featureCollection: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features,
      };

      src.setData(featureCollection);
    }
  }, [hospitals]);

  // fly to selected hospital
  useEffect(() => {
    const map = mapRef.current;
    if (map && selected && selected.lat && selected.lng) {
      map.flyTo({ center: [selected.lng, selected.lat], zoom: 14 });
    }
  }, [selected]);

  // directions URL
  const directionUrl = useMemo(() => {
    if (!user || !selected || !selected.lat || !selected.lng) return "#";
    return `https://www.google.com/maps/dir/?api=1&origin=${user.lat},${user.lng}&destination=${selected.lat},${selected.lng}&travelmode=${mode}`;
  }, [user, selected, mode]);

  return (
    <Card className="overflow-hidden">
      <div className="h-[420px] w-full">
        {!mapboxgl.accessToken ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Map requires Mapbox token. Set NEXT_PUBLIC_MAPBOX_TOKEN to enable interactive map.
          </div>
        ) : (
          <div ref={mapContainer} className="h-full w-full" />
        )}
      </div>
      {selected && (
        <div className="flex items-center justify-between border-t p-4">
          <div>
            <p className="text-sm font-medium">Rank #{selected.rank}: {selected.name}</p>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Beds: {selected.availableBeds}/{selected.totalBeds}</span> · 
              <span className="text-amber-600">OPD: {selected.opdQueue || 0}</span>
              {selected.address ? ` · 📍 ${selected.address}` : ""}
            </p>
          </div>
          <a href={directionUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Get Directions
            </Button>
          </a>
        </div>
      )}
    </Card>
  );
}

export default PredictedHospitalMap;

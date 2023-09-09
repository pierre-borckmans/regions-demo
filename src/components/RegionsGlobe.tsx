import { GlobeProps } from "react-globe.gl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Region, REGIONS } from "~/constants/regions";

let ReactGlobe: React.FC<GlobeProps & { ref: any }> = () => null;

const ARC_REL_LEN = 0.4;
const FLIGHT_TIME = 500;
const NUM_RINGS = 4;
const RINGS_MAX_R = 5; // deg
const RING_PROPAGATION_SPEED = 5; // deg/sec

const markerSvg = (strokeCol: string) => `
  <svg viewBox="-4 0 36 36">
    <path
      fill="currentColor"
      stroke="${strokeCol}"
      d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"
    ></path>
    <circle fill="#ddd" cx="14" cy="14" r="7"></circle>
  </svg>
`;

export type RegionsGlobeProps = {
  onRegionSelected: (region: Region) => void;
};
export default function RegionsGlobe({ onRegionSelected }: RegionsGlobeProps) {
  const globeEl = useRef<
    GlobeProps & { ref: any; controls: Function; pointOfView: Function }
  >();
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ReactGlobe = require("react-globe.gl").default;
  }
  useEffect(() => {
    if (!globeEl.current) {
      return;
    }
    globeEl.current.controls().enableZoom = false;
  }, [globeEl.current]);

  useEffect(() => {
    const { lat, lng } = selectedRegion;
    globeEl.current.pointOfView({ lat, lng });
  }, []);

  const [arcsData, setArcsData] = useState<
    { startLat: number; startLng: number; endLat: number; endLng: number }[]
  >([]);

  const [ringsData, setRingsData] = useState<{ lat: number; lng: number }[]>(
    []
  );

  const [selectedRegion, setSelectedRegion] = useState<Region>(REGIONS[0]!);

  const emitArcFromRegionToSelf = (region: Region, otherRegion: Region) => {};

  const emitArcFromRegionToAnother = (region: Region, otherRegion: Region) => {
    const { lat: startLat, lng: startLng } = region;
    const { lat: endLat, lng: endLng } = otherRegion;

    const arc = { startLat, startLng, endLat, endLng };
    const backArc = {
      endLat: startLat,
      endLng: startLng,
      startLat: endLat,
      startLng: endLng,
    };
    // forward arc
    setArcsData((curArcsData) => [...curArcsData, arc]);
    setTimeout(() => {
      // backward arc
      setArcsData((curArcsData) => [
        ...curArcsData.filter((d) => d !== arc),
        backArc,
      ]);
      setTimeout(() => {
        setTimeout(
          () =>
            setArcsData((curArcsData) =>
              curArcsData.filter((d) => d !== backArc)
            ),
          FLIGHT_TIME * 1.5
        );
      });
    }, FLIGHT_TIME * 1.5);

    const srcRing = { lat: startLat, lng: startLng };
    // add and remove target rings
    setTimeout(() => {
      const targetRing = { lat: endLat, lng: endLng };
      setRingsData((curRingsData) => [...curRingsData, targetRing]);
      setTimeout(
        () =>
          setRingsData((curRingsData) =>
            curRingsData.filter((r) => r !== targetRing)
          ),
        FLIGHT_TIME * ARC_REL_LEN
      );
    }, FLIGHT_TIME * 0.75);

    // add and remove src rings
    setTimeout(() => {
      setRingsData((curRingsData) => [...curRingsData, srcRing]);
      setTimeout(
        () =>
          setRingsData((curRingsData) =>
            curRingsData.filter((r) => r !== srcRing)
          ),
        FLIGHT_TIME * ARC_REL_LEN
      );
    }, FLIGHT_TIME * 2.25);
  };

  const emitArcsFromRegionToAllOthers = (region: Region) => {
    const otherRegions = REGIONS.filter((r) => r.id !== region.id);

    otherRegions.forEach((otherRegion) => {
      emitArcFromRegionToAnother(region, otherRegion);
    });
  };

  const selectRegion = (region: Region) => {
    onRegionSelected(region);
    setSelectedRegion(region);
    const { lat, lng } = region;
    globeEl.current!.pointOfView({ lat, lng }, 750);
    setTimeout(() => {
      emitArcsFromRegionToAllOthers(region);
    }, 600);
  };

  return (
    <div className="mt-[-10vh] flex h-full w-full items-center">
      <ReactGlobe
        height={800}
        ref={globeEl}
        showGraticules={false}
        globeImageUrl="globe.jpg"
        backgroundColor="#0000"
        atmosphereColor={"hsl(47,60%,67%)"}
        atmosphereAltitude={0.3}
        // onGlobeClick={emitArc}
        arcsData={arcsData}
        arcColor={() => "hsla(290,75%,55%,1%)"}
        arcStroke={1.2}
        arcDashLength={ARC_REL_LEN}
        arcDashGap={10}
        arcDashInitialGap={1}
        arcDashAnimateTime={FLIGHT_TIME}
        arcsTransitionDuration={0}
        ringsData={ringsData}
        ringColor={() => (t: number) => `rgba(198,54,226,${Math.sqrt(1 - t)})`}
        ringMaxRadius={RINGS_MAX_R}
        ringPropagationSpeed={RING_PROPAGATION_SPEED}
        ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
        htmlElementsData={REGIONS}
        htmlElement={(region: Region) => {
          const isSelected = region === selectedRegion;
          const marker = document.createElement("div") as HTMLElement;
          marker.style.marginTop = isSelected ? "-32px" : "-22px";
          marker.innerHTML = markerSvg(isSelected ? "white" : "#bbb");
          marker.style.color = `hsla(290, 75%, 55%, ${
            isSelected ? "80%" : "65%"
          })`;
          marker.style.width = isSelected ? `60px` : `40px`;
          // @ts-ignore
          marker.style["pointer-events"] = "auto";
          marker.style.cursor = "pointer";
          marker.onclick = () => {
            selectRegion(region);
          };

          const info = document.createElement("div") as HTMLElement;
          return marker;
        }}
        html
      />
    </div>
  );
}

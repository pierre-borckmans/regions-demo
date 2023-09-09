import { GlobeProps } from "react-globe.gl";
import React, { useEffect, useRef, useState } from "react";
import { Region, REGIONS } from "~/constants/regions";
import useResizeObserver from "use-resize-observer";

let ReactGlobe: React.FC<GlobeProps & { ref: any }> = () => null;

const ARC_REL_LEN = 0.4;
const FLIGHT_TIME = 500;
const NUM_RINGS = 4;
const RINGS_MAX_R = 5; // deg
const RING_PROPAGATION_SPEED = 5; // deg/sec

const markerSvg = (strokeCol: string) => `
  <svg viewBox="-4 0 36 36">
    <g>
      <path
        fill="currentColor"
        stroke="${strokeCol}"
        transform="translate(0,0.5) scale(0.98)"
        d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"
      />
    </g>
    <g transform="scale(0.013), translate(550,400)">
        <path d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z" fill="#fff"/>
        <path d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z" fill="#fff"/>
    </g>
<!--    <circle fill="#ddd" cx="14" cy="14" r="7"></circle>-->
  </svg>
`;

export type RegionsGlobeProps = {
  onRegionSelected: (region: Region) => void;
  selectedRegion?: Region;
};
export default function RegionsGlobe({
  selectedRegion,
  onRegionSelected,
}: RegionsGlobeProps) {
  const { ref, width, height } = useResizeObserver<HTMLDivElement>();
  const globeEl = useRef<
    GlobeProps & {
      ref: any;
      controls: Function;
      pointOfView: Function;
      scene: Function;
    }
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
    if (!selectedRegion) return;
    const { lat, lng } = selectedRegion;
    globeEl.current!.pointOfView({ lat, lng });
  }, []);

  useEffect(() => {}, [width, height]);

  const [arcsData, setArcsData] = useState<
    { startLat: number; startLng: number; endLat: number; endLng: number }[]
  >([]);

  const [ringsData, setRingsData] = useState<{ lat: number; lng: number }[]>(
    []
  );

  // const emitArcFromRegionToSelf = (region: Region) => {
  //   const { lat: startLat, lng: startLng } = region;
  //   const arc = {
  //     startLat,
  //     startLng,
  //     endLat: startLat + 8,
  //     endLng: startLng,
  //   };
  //   const backArc = {
  //     startLat: startLat + 8,
  //     startLng: startLng,
  //     endLat: startLat,
  //     endLng: startLng,
  //   };
  //   setArcsData((curArcsData) => [...curArcsData, arc]);
  //   setTimeout(() => {
  //     // backward arc
  //     setArcsData((curArcsData) => [
  //       ...curArcsData.filter((d) => d !== arc),
  //       backArc,
  //     ]);
  //     setTimeout(
  //       () =>
  //         setArcsData((curArcsData) =>
  //           curArcsData.filter((d) => d !== backArc)
  //         ),
  //       FLIGHT_TIME
  //     );
  //   }, FLIGHT_TIME);
  // };

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
      setTimeout(
        () =>
          setArcsData((curArcsData) =>
            curArcsData.filter((d) => d !== backArc)
          ),
        FLIGHT_TIME * 1.5
      );
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
    // emitArcFromRegionToSelf(region);
    otherRegions.forEach((otherRegion) => {
      emitArcFromRegionToAnother(region, otherRegion);
    });
  };

  const selectRegion = (region: Region, animate: boolean) => {
    onRegionSelected(region);
    setTimeout(
      () => {
        emitArcsFromRegionToAllOthers(region);
      },
      animate && region !== selectedRegion ? 1000 : 0
    );
    if (animate) {
      const { lat, lng } = region as Region;
      globeEl.current!.pointOfView({ lat, lng }, 1000);
    }
  };

  return (
    <div ref={ref} className="flex h-full w-full  items-center">
      <ReactGlobe
        ref={globeEl}
        width={width}
        height={height * 1.25}
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
        arcAltitude={0.3}
        arcDashInitialGap={1}
        arcDashAnimateTime={FLIGHT_TIME}
        arcsTransitionDuration={0}
        ringsData={ringsData}
        ringColor={() => (t: number) => `rgba(198,54,226,${Math.sqrt(1 - t)})`}
        ringMaxRadius={RINGS_MAX_R}
        ringPropagationSpeed={RING_PROPAGATION_SPEED}
        ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
        htmlElementsData={REGIONS}
        htmlElement={(region: object) => {
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
          marker.onclick = (e) => {
            if (e.shiftKey) {
              selectRegion(region as Region, false);
              return;
            }
            selectRegion(region as Region, true);
          };
          return marker;
        }}
      />
    </div>
  );
}

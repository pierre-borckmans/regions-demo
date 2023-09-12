import { GlobeProps } from "react-globe.gl";
import React, { useEffect, useRef, useState } from "react";
import { Region } from "~/constants/regions";
import useResizeObserver from "use-resize-observer";
import { useQuery } from "@tanstack/react-query";

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
  onGlobeReady: () => void;
  onRegionSelected: (region?: Region) => void;
  selectedRegion?: Region;
  lastRefresh: number;
};
export default function RegionsGlobe({
  selectedRegion,
  onRegionSelected,
  onGlobeReady,
  lastRefresh,
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

  // useEffect(() => {
  //   if (!selectedRegion) return;
  //   const { lat, lng } = selectedRegion;
  //   globeEl.current!.pointOfView({ lat, lng });
  // }, []);

  const pingApp = async () => {
    const r = (
      await fetch(`https://svc-us-west.regions.rlwy.xyz/collect.json`)
    ).json();
    return r;
  };

  const {
    data: pingResults,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["ping", selectedRegion?.id, lastRefresh],
    cacheTime: 0,
    queryFn: pingApp,
  });

  const [arcsData, setArcsData] = useState<
    { startLat: number; startLng: number; endLat: number; endLng: number }[]
  >([]);

  const [ringsData, setRingsData] = useState<{ lat: number; lng: number }[]>(
    []
  );

  const [globeReady, setGlobeReady] = useState(false);
  const [animate, setAnimate] = useState(false);

  // useEffect(() => {
  //   if (selectedRegion) {
  //     setTimeout(
  //       () => {
  //         // emitArcsFromRegionToAllOthers(selectedRegion);
  //       },
  //       animate && selectedRegion !== selectedRegion ? 1000 : 0
  //     );
  //     if (animate) {
  //       const { lat, lng } = selectedRegion as Region;
  //       globeEl.current!.pointOfView({ lat, lng }, 1000);
  //     }
  //   }
  // }, [selectedRegion, lastRefresh]);

  const viewAllRegions = () => {
    const lat = 69.338777;
    const lng = 67.043438;
    globeEl.current!.pointOfView({ lat, lng }, 1000);
  };

  const handleGlobeReady = () => {
    onGlobeReady();
    // setTimeout(() => {
    //   const { lat, lng } = pingResults.[Math.round(Math.random() * 3)]!;
    //   globeEl.current!.pointOfView({ lat, lng });
    setGlobeReady(true);
    // }, 0);
  };

  // const emitArcFromRegionToAnother = (region: Region, otherRegion: Region) => {
  //   const { lat: startLat, lng: startLng } = region;
  //   const { lat: endLat, lng: endLng } = otherRegion;
  //
  //   const arc = { startLat, startLng, endLat, endLng };
  //   const backArc = {
  //     endLat: startLat,
  //     endLng: startLng,
  //     startLat: endLat,
  //     startLng: endLng,
  //   };
  //   // forward arc
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
  //       FLIGHT_TIME * 1.5
  //     );
  //   }, FLIGHT_TIME * 1.5);
  //
  //   const srcRing = { lat: startLat, lng: startLng };
  //   // add and remove target rings
  //   setTimeout(() => {
  //     const targetRing = { lat: endLat, lng: endLng };
  //     setRingsData((curRingsData) => [...curRingsData, targetRing]);
  //     setTimeout(
  //       () =>
  //         setRingsData((curRingsData) =>
  //           curRingsData.filter((r) => r !== targetRing)
  //         ),
  //       FLIGHT_TIME * ARC_REL_LEN
  //     );
  //   }, FLIGHT_TIME * 0.75);
  //
  //   // add and remove src rings
  //   setTimeout(() => {
  //     setRingsData((curRingsData) => [...curRingsData, srcRing]);
  //     setTimeout(
  //       () =>
  //         setRingsData((curRingsData) =>
  //           curRingsData.filter((r) => r !== srcRing)
  //         ),
  //       FLIGHT_TIME * ARC_REL_LEN
  //     );
  //   }, FLIGHT_TIME * 2.25);
  // };
  //
  // const emitArcsFromRegionToAllOthers = (region: Region) => {
  //   const otherRegions = REGIONS.filter((r) => r.id !== region.id);
  //   // emitArcFromRegionToSelf(region);
  //   otherRegions.forEach((otherRegion) => {
  //     emitArcFromRegionToAnother(region, otherRegion);
  //   });
  // };

  const peers: Region[] =
    pingResults?.OtherPeers.map((p: any) => ({
      ...p.Region,
      Type: "Peer",
    })) || [];
  const self: Region = { ...pingResults?.Self.Region, Type: "Self" };
  const edge: Region = { ...pingResults?.EdgeRegion, Type: "Edge" };
  const user: Region = { ...pingResults?.UserRegion, Type: "User" };
  const allRegions = [...peers, self, edge, user];
  return (
    <div
      ref={ref}
      className={`flex h-full flex-col items-center justify-center
            ${globeReady ? "w-full" : "hidden w-0"}
      `}
    >
      <div
        className={`${
          globeReady
            ? "space-around relative flex flex-col items-start"
            : "hidden w-0"
        }`}
      >
        <button
          className="absolute top-8 z-10 ml-4 w-32 cursor-pointer rounded border-2 text-white transition-all hover:scale-105 hover:text-gray-300 active:text-pink-500 lg:top-0 lg:mb-[-120px] lg:mt-[130px]"
          onClick={viewAllRegions}
        >
          Show all regions
        </button>
        <ReactGlobe
          onGlobeReady={handleGlobeReady}
          waitForGlobeReady={true}
          ref={globeEl}
          width={globeReady ? width : 0}
          height={globeReady ? Math.min(height! * 1.25, width! * 1.25) : 0}
          showGraticules={false}
          globeImageUrl="globe.jpg"
          backgroundColor="#0000"
          atmosphereColor={"hsl(47,60%,67%)"}
          atmosphereAltitude={0.25}
          onGlobeClick={() => {}}
          arcsData={arcsData}
          arcColor={() => () => `rgba(198,54,226,1})`}
          arcStroke={1.5}
          arcAltitudeAutoScale={0.4}
          arcDashLength={ARC_REL_LEN}
          arcDashGap={10}
          arcDashInitialGap={1}
          arcDashAnimateTime={FLIGHT_TIME}
          arcsTransitionDuration={0}
          ringsData={ringsData}
          ringColor={() => () => `rgba(198,54,226,0.0})`}
          ringMaxRadius={RINGS_MAX_R}
          ringPropagationSpeed={RING_PROPAGATION_SPEED}
          ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
          htmlElementsData={allRegions}
          htmlElement={(region: Region) => {
            console.log(region);
            const marker = document.createElement("div") as HTMLElement;
            marker.style.marginTop = "-22px";
            marker.innerHTML = markerSvg("white");
            switch (region.Type) {
              case "Edge":
                marker.style.color = `rgb(255, 0, 0)`;
                break;
              case "Peer":
                marker.style.color = `rgb(0, 255, 0)`;
                break;
              case "User":
                marker.style.color = `rgb(0, 0, 255)`;
                break;
              case "Self":
                marker.style.color = `rgb(255, 255, 0)`;
                break;
              default:
            }
            marker.style.width = `60px`;
            // @ts-ignore
            marker.style["pointer-events"] = "auto";
            marker.style.cursor = "pointer";
            marker.onclick = (e) => {};
            console.log("here");
            return marker;
          }}
        />
      </div>
    </div>
  );
}

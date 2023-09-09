import {GlobeProps} from "react-globe.gl";
import React, {useCallback, useEffect, useRef, useState} from "react";

let ReactGlobe: React.FC<GlobeProps & { ref: any }> = () => null;

const ARC_REL_LEN = 0.4; // relative to whole arc
const FLIGHT_TIME = 500;
const NUM_RINGS = 4;
const RINGS_MAX_R = 4; // deg
const RING_PROPAGATION_SPEED = 4; // deg/sec

type Region = {
    region: string;
    name: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    color: string;
    size: number;
}

const REGIONS: Region[] = [
    {
        region: 'europe-west4',
        name: 'Eemshaven',
        city: 'Eemshaven',
        country: 'Netherlands',
        lat: 53.448333,
        lng: 6.831111,
        color: 'hsla(290,75%,55%, 75%)',
        size: 40,
    },
    {
        region: 'us-west1',
        name: 'Oregon',
        city: 'The Dallas',
        country: 'USA',
        lat: 44.919284,
        lng: -123.317047,
        color: 'hsla(290,75%,55%, 75%)',
        size: 40,
    },
    {
        region: 'us-east4',
        name: 'Ashburn',
        city: 'Ashburn',
        country: 'USA',
        lat: 39.043757,
        lng: -77.487442,
        color: 'hsla(290,75%,55%, 75%)',
        size: 40,
    },    {
        region: 'us-east4',
        name: 'Jurong West',
        city: 'Jurong West',
        country: 'Singapore',
        lat: 1.34039,
        lng: 103.708988,
        color: 'hsla(290,75%,55%, 75%)',
        size: 40,
    },
]
const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;
export default function RegionsGlobe() {
    const globeEl = useRef<GlobeProps & { ref: any, controls: Function }>();
    useEffect(() => {
        if (!globeEl.current) {
            return
        }
        globeEl.current.controls().enableZoom = false;

        }, [globeEl.current]);

    if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        ReactGlobe = require("react-globe.gl").default;
    }

    const [arcsData, setArcsData] = useState<{startLat: number, startLng: number, endLat: number, endLng: number}[]>([]);
    const [ringsData, setRingsData] = useState<{lat: number, lng: number}[]>([]);
    const prevCoords = useRef({ lat: 0, lng: 0 });
    const emitArc = useCallback(({ lat: endLat, lng: endLng }: {lat: number, lng: number}) => {
        const { lat: startLat, lng: startLng } = prevCoords.current;
        prevCoords.current = { lat: endLat, lng: endLng };

        // add and remove arc after 1 cycle
        const arc = { startLat, startLng, endLat, endLng };
        const backArc = { endLat: startLat, endLng: startLng, startLat:endLat, startLng: endLng };
        debugger;
        setArcsData(curArcsData => [...curArcsData, arc]);
        setTimeout(() => {
            setArcsData(curArcsData => [...curArcsData.filter(d => d !== arc), backArc])
            setTimeout(() => {
                setTimeout(() => setArcsData(curArcsData => curArcsData.filter(d => d !== backArc)), FLIGHT_TIME * 1.5);
            })
        }, FLIGHT_TIME * 1.5);


        // add and remove start rings
        const srcRing = { lat: startLat, lng: startLng };
        setRingsData(curRingsData => [...curRingsData, srcRing]);
        setTimeout(() => {
            setRingsData(curRingsData => curRingsData.filter(r => r !== srcRing)),
        FLIGHT_TIME * ARC_REL_LEN});


        // // add and remove target rings
        // setTimeout(() => {
        //     const targetRing = { lat: endLat, lng: endLng };
        //     setRingsData(curRingsData => [...curRingsData, targetRing]);
        //     setTimeout(() => setRingsData(curRingsData => curRingsData.filter(r => r !== targetRing)), FLIGHT_TIME * ARC_REL_LEN);
        // }, FLIGHT_TIME * 0.75);

        // add and remove src rings
        // setTimeout(() => {
        //     setRingsData(curRingsData => [...curRingsData, srcRing]);
        //     setTimeout(() => setRingsData(curRingsData => curRingsData.filter(r => r !== srcRing)), FLIGHT_TIME * ARC_REL_LEN);
        // }, FLIGHT_TIME * 2.5);
    }, []);



    return <div className="flex w-full h-[200px] mt-[-10vh]">
        <ReactGlobe
            ref={globeEl}
            showGraticules={true}
            globeImageUrl="globe.jpg"
            backgroundColor="#0000"
            atmosphereColor={"hsl(47,60%,67%)"}
            atmosphereAltitude={0.3}
            // onGlobeClick={emitArc}
            arcsData={arcsData}
            arcColor={() => 'hsla(290,75%,55%,1%)'}
            arcStroke={1}
            arcDashLength={ARC_REL_LEN}
            arcDashGap={10}
            arcDashInitialGap={1}
            arcDashAnimateTime={FLIGHT_TIME}
            arcsTransitionDuration={0}
            ringsData={ringsData}
            ringColor={() => (t: number) => `rgba(198,54,226,${1-t})`}
            ringMaxRadius={RINGS_MAX_R}
            ringPropagationSpeed={RING_PROPAGATION_SPEED}
            ringRepeatPeriod={FLIGHT_TIME * ARC_REL_LEN / NUM_RINGS}
            htmlElementsData={REGIONS}
            htmlElement={(d: Region) => {
                const el = document.createElement('div') as HTMLElement;
                el.style.marginTop = "-22px";
                el.innerHTML = markerSvg;
                el.style.color = d.color;
                el.style.width = `${d.size}px`;

                // el.style['pointer-events'] = 'auto';
                el.style.cursor = 'pointer';
                el.onclick = () => emitArc({lat: d.lat, lng: d.lng});
                return el;
            }}
            html
        />
    </div>
}
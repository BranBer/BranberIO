/**
 * LanguagesPieChart — purely presentational (Story 3.6 / ADR 0001 Decision 4).
 *
 * Receives pre-computed language slices as props. Performs NO network requests.
 * The fetch + percent computation was moved server-side into getStaticProps of
 * the parent page; this component is client-rendered only for Nivo bundle-splitting.
 */
import React from "react";
import { ResponsivePie } from "@nivo/pie";
import type { LanguageSlice } from "../types/github";

interface LanguagesPieChartProps {
  slices: LanguageSlice[];
}

interface PieDatum {
  id: string;
  label: string;
  value: number;
}

const LanguagesPieChart: React.FC<LanguagesPieChartProps> = ({ slices }) => {
  if (!slices || slices.length === 0) {
    return (
      <p
        style={{
          margin: 0,
          fontSize: "var(--text-sm)",
          color: "var(--fg-muted)",
        }}
      >
        No language data available.
      </p>
    );
  }

  const data: PieDatum[] = slices.map((s) => ({
    id: s.name,
    label: s.name,
    value: s.percent,
  }));

  return (
    <div style={{ width: "100%", height: "350px", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 300,
            overflow: "visible",
            color: "var(--fg-muted)",
          }}
        >
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.85}
            padAngle={5}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "yellow_orange_brown" }}
            borderWidth={2}
            valueFormat={(value) => `${value}%`}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.9]],
            }}
            arcLinkLabelsSkipAngle={10}
            enableArcLabels={false}
            arcLinkLabelsTextColor={{ from: "color" }}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            theme={{
              tooltip: {
                container: {
                  color: "white",
                  background: "rgba(0,0,0,.4)",
                },
              },
            }}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default LanguagesPieChart;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import styles from "../styles/languagesPieChart.module.scss";
interface languagesPieChartProps {
  owner: string;
  repo: string;
}

interface languagePieChartDatum {
  id: string;
  label: string;
  value: string;
}

const LanguagesPieChart: React.FC<languagesPieChartProps> = ({
  owner,
  repo,
}) => {
  const [data, setData] = useState<languagePieChartDatum[]>([]);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
      .then((res) => res.text())
      .then((res) => {
        if (res) {
          const resData = Object.entries(JSON.parse(res));
          let languageData = [];

          let totalBytes: number = 0;

          resData.forEach(([_, value]) => {
            totalBytes += value as number;
          });

          for (let [language, bytes] of resData) {
            const datum: languagePieChartDatum = {
              id: language as string,
              label: language as string,
              value: (((bytes as number) / totalBytes) * 100).toFixed(2),
            };
            languageData.push(datum);
          }

          setData(languageData);
        }
      });
  }, []);

  return (
    <div className={styles.languagesPieChartWrapper}>
      <div className={styles.languagesPieChartWrapper}>
        <div className={styles.languagesPieChart}>
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

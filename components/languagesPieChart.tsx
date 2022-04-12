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
  value: number;
}

const LanguagesPieChart: React.FC<languagesPieChartProps> = ({
  owner,
  repo,
}) => {
  const [data, setData] = useState<languagePieChartDatum[]>([]);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`).then(
      (res) => {
        if (res && res.body) {
          const resData = Object.entries(res.body);
          let languageData = [];

          for (let [language, bytes] of resData) {
            languageData.push({
              id: language,
              label: language,
              value: bytes,
            });
          }

          setData(languageData);
        }
      }
    );
  }, []);

  console.log(data);
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
          />
        </div>
      </div>
    </div>
  );
};

export default LanguagesPieChart;

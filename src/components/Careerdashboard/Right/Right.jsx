import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../../utils/constants";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Spin, Modal } from "antd";
import Chart from "react-apexcharts";
import "./Right.css";

const Right = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationGuidance, setEducationGuidance] = useState([]);
  const [psychometricTestName, setPsychometricTestName] = useState([]);
  // const [psychometricTestId, setPsychometricTestId] = useState([]);

  useEffect(() => {
    getducationGuidance();
    getPsychometricTestNames();
  }, []);

  const getducationGuidance = async () => {
    setLoading(true);
    const response = await getApiWithAuth("psychometric/calculate/");
    console.log("========================res", response);
    if (response?.data?.status === 200) {
      setEducationGuidance(response.data.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const getPsychometricTestNames = async () => {
    const response = await getApiWithAuth(API_URL.GETPSYCHOMETRICTEST);
    console.log("===res get names", response);
    if (response?.data?.status === 200) {
      const filterSCore = response.data.data.filter(
        (item) => item.score === null
      );
      // console.log("===filterScore", filterSCore);
      setPsychometricTestName(filterSCore);
      // const filterId = response.data.data.filter((item) => item.score !== null);
      // setPsychometricTestId(filterId);
    }
  };
  const options = {
    // plotOptions: {
    //   bar: {
    //     horizontal: true
    //   }
    // },
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "20%",
        barHeight: "50%", // Set the fixed height for the bars (adjust the value as needed)
        colors: {
          backgroundBarColors: ["rgba(0, 0, 0, 0.1)", "#1984FF"], // Set the background color of the bars
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    labels: educationGuidance
      .map((item) => item.scores.map((score) => score.name))
      .flat(),
    colors: ["#8BBDDB"],
    series: [
      {
        data: educationGuidance
          .map((item) => item.scores.map((score) => score.score))
          .flat(),
      },
    ],
  };
  useEffect(() => {
    console.log("===educationl guidencee", educationGuidance);
  }, [educationGuidance]);

  useEffect(() => {
    console.log("====psy name", psychometricTestName);
  }, [psychometricTestName]);

  // const rightSideDashBoardGraphTakeTest = async () => {
  //   // setSpinnerLoading(true);
  //   const response = await postApiWithAuth(`/psychometric/take-test/`, {
  //     // test: data.id,
  //     // answers: quizResult,
  //   });
  //   if (response.data.status === 200) {
  //     message.success("Quiz taken successfully");
  //     navigate("/occupation", {
  //       state: { data: response.data.data.test_id },
  //     });

  //     // setSpinnerLoading(false);
  //   } else {
  //     // setSpinnerLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   console.log("====iddddd", psychometricTestId);
  // }, [psychometricTestId]);
  return (
    <>
      <div
        className="h-[100%] w-[100%]  flex flex-col rightContainerStyle"
        // className="rightContainerStyle"
      >
        <div className="w-[90%]">
          <div className="dashboardRightDivv">
            <h1 className="dashboardRightHeadingDiv">Psychometric Tests</h1>
          </div>
          {loading ? (
            <Spin className="spinStyle" />
          ) : educationGuidance.length === 0 ? (
            psychometricTestName.map((item) => (
              <div className="dashboardRightDiv">
                <div className="parentRightDashboardDiv">
                  <div className="parentRightDashboardDivTextDiv">
                    <h1>{item.name}</h1>
                  </div>
                  <div className="parentRightDashboardDivBtnDiv">
                    <button
                      onClick={() =>
                        navigate("/self-assesment-test", {
                          state: { data: item },
                        })
                      }
                    >
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              {educationGuidance.map((item, index) => {
                const labels = item.scores.map((score) => score.name);
                const series = item.scores.map((score) => score.score);

                const chartOptions = {
                  ...options,
                  labels,
                  series: [{ data: series }],
                  plotOptions: {
                    bar: {
                      horizontal: true,
                    },
                  },
                };
                console.log("====itemmmmm", item);
                return (
                  <div key={index} className="ms-3">
                    <div className="h-[30px] flex justify-between items-center mt-5 chartHeadingwBtn">
                      <p className="text-[#474749] mt-3 sm:text-[15px text-[16px] font-bold chartHeading">
                        {item.test_name}
                      </p>
                      <div className="rightGraphBtn">
                        <button
                          onClick={() =>
                            navigate("/self-assesment-test", {
                              state: { data: item },
                            })
                          }
                        >
                          Re-take Test
                        </button>
                      </div>
                    </div>
                    <Chart
                      options={chartOptions}
                      series={chartOptions.series}
                      type="bar"
                      width="100%"
                      height={320}
                    />
                    <hr />
                  </div>
                );
              })}
              {psychometricTestName.map((item) => (
                <div className="dashboardRightDiv">
                  <div className="parentRightDashboardDiv">
                    <div className="parentRightDashboardDivTextDiv">
                      <h1>{item.name}</h1>
                    </div>
                    <div className="parentRightDashboardDivBtnDiv">
                      <button
                        onClick={() =>
                          navigate("/self-assesment-test", {
                            state: { data: item },
                          })
                        }
                        style={{ width: 120 }}
                      >
                        Take Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Right;

import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const RevenueChart: React.FC = () => {

    const data = {
        labels: [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
        ],
        datasets: [
            {
                label: "Doanh Thu (VND)",
                data: [
                    120000000, 190000000, 30000000, 500000000, 240000000, 350000000, 420000000, 380000000, 450000000, 520000000, 480000000, 530000000,
                ],
                borderColor: "pink",
                backgroundColor: "pink",
                tension: 0.4, 
            },
        ],
    };

    // Chart Options
    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                },
            },
            y: {
                min: 1000000,
                max: 900000000, 
                title: {
                    display: true,
                    text: "Mệnh Giá: triệu (VND)",
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className="w-full h-80 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Bảng Doanh Thu Cả Năm
            </h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default RevenueChart;

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function SalesAreaChart({ labels, revenue, count }) {
    console.log(count);
    const data = {
        labels,
        datasets: [
            {
                label: "Sales Revenue",
                data: revenue,
                fill: true,
                borderColor: "rgba(255, 182, 230, 0.95)",
                backgroundColor: "rgba(255, 126, 207, 0.42)",
                tension: 0.35,
                borderWidth: 2,
            },
            {
                label: "Sales Count",
                data: count,
                fill: true,
                borderColor: "rgba(90,200,250,1)", // apple blue
                backgroundColor: "rgba(90,200,250,0.48)",
                tension: 0.35,
                borderWidth: 2,
                yAxisID: "y2",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(28,28,30,0.9)",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                titleColor: "white",
                bodyColor: "white",
            },
        },
        scales: {
            x: {
                ticks: { color: "rgba(255,255,255,0.6)" },
                grid: { color: "rgba(255,255,255,0.05)" },
            },
            y: {
                ticks: {
                    color: "rgba(255, 182, 230, 0.95)",
                    callback: function (value) {
                        return "$" + value;
                    }
                },
                grid: { color: "rgba(255,255,255,0.05)" },
            },
            y2: {
                position: "right",
                ticks: { color: "rgba(90,200,250,0.7)" },
                grid: { drawOnChartArea: false },
            },
        },
    };

    return (
        <div className="w-full h-64 md:h-80 lg:h-96">
            <Line data={data} options={options} />
        </div>
    );
}

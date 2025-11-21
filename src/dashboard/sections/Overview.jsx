import { useEffect, useState } from "react";
import SalesAreaChart from "../components/SalesAreaChart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Overview() {
    const [ revenue, setRevenue ] = useState([]);
    const [ count, setCount ] = useState([]);
    const [ customers, setCutomers] = useState(0);
    const [ sales, setSales ] = useState(0);
    const [ guests, setGuests ] = useState(0);
    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    useEffect(() => {
        async function fetchOverview() {
            try {
                const res = await fetch(`${API_BASE_URL}/overview`, {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch overview");
                const data = await res.json();
                setRevenue(data.revenue ?? []);
                setCount(data.count ?? []);
                setCutomers(data.customers ?? 0);
                setSales(data.sales ?? 0);
                setGuests(data.guests ?? 0);
            } catch (err) {
                console.error(err);
            }
        }
        fetchOverview();
    }, []);

    return (
        <>
            {/* Dashboard cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-2">Total Customers</h2>
                    <p className="text-3xl font-bold">{ customers }</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-2">Sales</h2>
                    <p className="text-3xl font-bold">{ Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                    }).format(sales) }</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-2">Guest Sessions</h2>
                    <p className="text-3xl font-bold">{ guests }</p>
                </div>
            </section>

            {/* Chart */}


            <section className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Last 7 Days Sales</h2>
                <SalesAreaChart labels={labels} revenue={revenue} count={count} />
            </section>

            {/* Additional content */}
            {/* <section className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <ul className="space-y-2">
                    <li className="p-3 rounded-xl bg-white/10">User John signed up</li>
                    <li className="p-3 rounded-xl bg-white/10">
                        Payment processed for order #234
                    </li>
                    <li className="p-3 rounded-xl bg-white/10">
                        New comment on blog post
                    </li>
                </ul>
            </section> */}
        </>
    );
};
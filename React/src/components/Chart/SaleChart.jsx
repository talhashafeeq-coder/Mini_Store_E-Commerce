import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import '../../Style/AdminPage.css'

export default function SaleChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/order/api/order/v1")
            .then((response) => response.json())
            .then((orders) => {
                const citySales = {};
                orders.forEach((order) => {
                    const city = order.shipping_address;
                    citySales[city] = (citySales[city] || 0) + order.total_amount;
                });

                const formattedData = Object.keys(citySales).map((city) => ({
                    city,
                    totalSales: citySales[city],
                }));

                setData(formattedData);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="container">
            <h2 style={{ textAlign: "center", marginBottom: "50px", padding: "10px", background: "rgb(74 94 114)", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", color: "white", fontSize: "12px" }}>
                📊 City-wise Sales
            </h2>
            <div className="row toggle_change">
                <div className="col-md-12">
                    <ResponsiveContainer width="90%" height={200}>
                        <BarChart data={data}>
                            <XAxis dataKey="city" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#333",  
                                    color: "#fff",            
                                    border: "1px solid #fff",
                                    borderRadius: "5px",
                                }}
                                itemStyle={{
                                    color: "#fff",  
                                }}
                            />
                            <Bar dataKey="totalSales" fill="#8884d8" barSize={18} /> {/* Smaller Bars */}
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>
        </div>
    );
};



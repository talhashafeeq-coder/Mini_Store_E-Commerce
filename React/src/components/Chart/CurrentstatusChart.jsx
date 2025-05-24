import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function CurrentstatusChart() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [salesProfitData, setSalesProfitData] = useState([]);

  useEffect(() => {
    
  const fetchData = async () => {
    try {
      // Fetch Sales & Profit Data
      const salesProfitResponse = await axios.get("http://127.0.0.1:5000/order/api/sales-profit");
      const { total_sales, total_profit } = salesProfitResponse.data;

      setSalesProfitData([
        { name: "Sales", value: total_sales },
        { name: "Profit", value: total_profit }
      ]);
    } catch (error) {
      console.error("Error fetching sales and profit data:", error);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const orderResponse = await axios.get("http://127.0.0.1:5000/order/api/order/v1");
        const orders = orderResponse.data;

        // Process Data
        processRevenueData(orders);
        processOrderStatus(orders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 📊 Process Monthly Revenue Data
  const processRevenueData = (orders) => {
    const revenueByMonth = {};

    orders.forEach((order) => {
      const date = new Date(order.order_date);
      const month = date.toLocaleString("default", { month: "short" });

      if (!revenueByMonth[month]) {
        revenueByMonth[month] = 0;
      }
      revenueByMonth[month] += order.total_amount;
    });

    const chartData = Object.keys(revenueByMonth).map((month) => ({
      name: month,
      revenue: revenueByMonth[month],
    }));

    setMonthlyRevenue(chartData);
  };

  // 📦 Process Order Status Data
  const processOrderStatus = (orders) => {
    const statusCounts = { pending: 0, shipped: 0, delivered: 0 };

    orders.forEach((order) => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status] += 1;
      }
    });

    const chartData = Object.keys(statusCounts).map((status) => ({
      name: status,
      count: statusCounts[status],
    }));

    setOrderStatusData(chartData);
  };

  return (
    <div className="container">
      <div className="row">
        {/* 📊 Monthly Revenue Chart */}
        {/* <div className="col-md-4 chart-container">
          <h2 style={{ textAlign: "center", marginBottom: "50px", padding: "10px", backgroundColor: "#8884d8", color: "white", borderRadius: "10px", fontSize: "10px" }}>📊 Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="name" />
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
              <Bar dataKey="revenue" fill="#8884d8" barSize={10} /> 
            </BarChart>
          </ResponsiveContainer>
        </div> */}
        {/* 📊 Sales & Profit Chart */}
        <div className="col-md-4 chart-container">
        <h2 style={{ textAlign: "center", marginBottom: "50px", padding: "10px", backgroundColor: "#8884d8", color: "white", borderRadius: "10px", fontSize: "10px" }}>💰 Sales & Profit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesProfitData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#fff", border: "1px solid #fff", borderRadius: "5px" }}
                itemStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#82ca9d" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📦 Order Status Chart */}
        <div className="col-md-4 chart-container">
          <h2 style={{ textAlign: "center", marginBottom: "50px", padding: "10px", backgroundColor: "#8884d8", color: "white", borderRadius: "10px", fontSize: "10px" }}>📦 Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={orderStatusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                <Cell fill="#FFBB28" />
                <Cell fill="#82ca9d" />
                <Cell fill="#0088FE" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend Section */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "15px", height: "15px", background: "#FFBB28", marginRight: "5px" }}></div>
              <span>Pending</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "15px", height: "15px", background: "#82ca9d", marginRight: "5px" }}></div>
              <span>Shipped</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "15px", height: "15px", background: "#0088FE", marginRight: "5px" }}></div>
              <span>Delivered</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

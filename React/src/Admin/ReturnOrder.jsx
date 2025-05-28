import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import '../Style/ReturnOrder.css'; // Optional: If you want to extract styles

export default function ReturnOrder() {
  const [returns, setReturns] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/return/api/returns/v1");
      const data = response.data;
      setReturns(data);

      const initialStatus = {};
      data.forEach((ret) => {
        initialStatus[ret.id] = ret.status;
      });
      setSelectedStatus(initialStatus);

      const statusSummary = {
        pending: data.filter((r) => r.status.toLowerCase() === "pending").length,
        accepted: data.filter((r) => r.status.toLowerCase() === "accepted").length,
        rejected: data.filter((r) => r.status.toLowerCase() === "rejected").length,
      };

      setStatusCounts(statusSummary);
    } catch (error) {
      toast.error("Error fetching return requests");
    }
  };

  const updateReturnStatus = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/return/api/updateReturn/v1/${id}`, {
        status: selectedStatus[id],
      });
      toast.success(`Return status updated to ${selectedStatus[id]}!`);
      fetchReturns();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const chartData = [
    { name: "Pending", value: statusCounts.pending, color: "#f1c40f" },
    { name: "Accepted", value: statusCounts.accepted, color: "#2ecc71" },
    { name: "Rejected", value: statusCounts.rejected, color: "#e74c3c" },
  ];

  return (
    <div className="container my-5">
      <h2 className="order-heading fancy-heading mb-4">📦 Return Orders Management</h2>

      {/* ✅ Return Table */}
      <div className="table-responsive border rounded shadow-sm">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((ret) => (
              <tr key={ret.id}>
                <td>{ret.order_id}</td>
                <td>{ret.reason}</td>
                <td>
                  <span className={`badge px-3 py-2 rounded-pill ${ret.status.toLowerCase() === "pending"
                    ? "bg-warning text-dark"
                    : ret.status.toLowerCase() === "accepted"
                      ? "bg-success"
                      : "bg-danger"
                    }`}>
                    {ret.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={selectedStatus[ret.id]}
                    onChange={(e) =>
                      setSelectedStatus({ ...selectedStatus, [ret.id]: e.target.value })
                    }
                  >
                    <option value="pending">PENDING</option>
                    <option value="accepted">ACCEPTED</option>
                    <option value="rejected">REJECTED</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => updateReturnStatus(ret.id)}
                    disabled={selectedStatus[ret.id] === ret.status}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pie Chart */}
      <div className="mt-5">
        <h4 className="text-center mb-3">📊 Return Requests Overview</h4>
        <div className="d-flex justify-content-center">
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

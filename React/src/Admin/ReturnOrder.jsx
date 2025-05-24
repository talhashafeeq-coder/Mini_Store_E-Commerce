import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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
      console.log("🔍 Returns API Response:", data)
      setReturns(data);

      // Initialize selectedStatus state with current status of each order
      const initialStatus = {};
      data.forEach((ret) => {
        initialStatus[ret.id] = ret.status;
      });
      setSelectedStatus(initialStatus);

      // ✅ Count status occurrences
      const statusSummary = {
        pending: data.filter((r) => r.status.toLowerCase() === "pending").length,
        accepted: data.filter((r) => r.status.toLowerCase() === "accepted").length,
        rejected: data.filter((r) => r.status.toLowerCase() === "rejected").length,
      };

      setStatusCounts(statusSummary);
    } catch (error) {
      console.error("Error fetching return data", error);
      toast.error("Error fetching return requests");
    }
  };

  const updateReturnStatus = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/return/api/updateReturn/v1/${id}`, {
        status: selectedStatus[id],
      });
      toast.success(`Return status updated to ${selectedStatus[id]}!`);
      fetchReturns(); // Refresh list after update
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  // ✅ Data for Pie Chart
  const chartData = [
    { name: "Pending", value: statusCounts.pending, color: "#f1c40f" },
    { name: "Accepted", value: statusCounts.accepted, color: "#2ecc71" },
    { name: "Rejected", value: statusCounts.rejected, color: "#e74c3c" },
  ];

  return (
    <div className="container p-4">
      <h4>Return Requests</h4>
      <table className="table table-striped table-bordered table-hover">
        <thead>
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
                <span
                  className={`badge ${ret.status.toLowerCase() === "pending"
                      ? "bg-warning"
                      : ret.status.toLowerCase() === "accepted"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                >
                  {ret.status.toUpperCase()} {/* ✅ Display in uppercase for UI consistency */}
                </span>
              </td>
              {/* ✅ Dropdown for selecting new status */}
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
              {/* ✅ Action Button */}
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => updateReturnStatus(ret.id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pie Chart Section */}
      <div className="container mt-4">
        <h4>Return Requests Overview</h4>
        <div className="d-flex justify-content-center">
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
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

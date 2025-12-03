import { useState, useEffect } from "react";
import { getWorkloads, createWorkload, updateWorkload, deleteWorkload } from "../../api/moodWorkloadService";

const WorkloadManagement = () => {
  const [workloads, setWorkloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkload, setEditingWorkload] = useState(null);
  const [formData, setFormData] = useState({
    value: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchWorkloads();
  }, []);

  const fetchWorkloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkloads();
      setWorkloads(response.results || response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        value: parseInt(formData.value),
        description: formData.description,
        image_url: formData.image_url || null,
      };

      if (editingWorkload) {
        await updateWorkload(editingWorkload.id, data);
      } else {
        await createWorkload(data);
      }

      setFormData({ value: "", description: "", image_url: "" });
      setShowForm(false);
      setEditingWorkload(null);
      fetchWorkloads();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (workload) => {
    setEditingWorkload(workload);
    setFormData({
      value: workload.value.toString(),
      description: workload.description,
      image_url: workload.image_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this workload level?")) return;

    setLoading(true);
    try {
      await deleteWorkload(id);
      fetchWorkloads();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWorkload(null);
    setFormData({ value: "", description: "", image_url: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Workload Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition"
        >
          {showForm ? "Cancel" : "+ Add Workload"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            {editingWorkload ? "Edit Workload Level" : "Add New Workload Level"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value (1-5) *
              </label>
              <input
                type="number"
                min="1"
                max="5"
                required
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Very Busy, Moderate, Light"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editingWorkload ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading && !showForm ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0D6C2] mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {workloads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No workload levels yet. Create your first workload level!
            </div>
          ) : (
            workloads
              .sort((a, b) => a.value - b.value)
              .map((workload) => (
                <div
                  key={workload.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFA500] flex items-center justify-center text-white font-bold text-xl">
                      {workload.value}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{workload.description}</h4>
                      <p className="text-sm text-gray-500">Value: {workload.value}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(workload)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workload.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default WorkloadManagement;

import { useState, useEffect } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam } from "../../api/teamService";
import { getUsers } from "../../api/userService";

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    team_name: "",
  });
  const [memberModal, setMemberModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTeams();
      setTeams(response.results || response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.results || response || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, formData);
      } else {
        await createTeam(formData);
      }

      setFormData({ team_name: "" });
      setShowForm(false);
      setEditingTeam(null);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      team_name: team.team_name,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    setLoading(true);
    try {
      await deleteTeam(id);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTeam(null);
    setFormData({ team_name: "" });
  };

  const openMemberModal = (team) => {
    setMemberModal(team);
    setSelectedUser("");
  };

  const closeMemberModal = () => {
    setMemberModal(null);
    setSelectedUser("");
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    try {
      await addMemberToTeam(memberModal.id, selectedUser);
      setSelectedUser("");
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Remove this member from the team?")) return;

    setLoading(true);
    try {
      await removeMemberFromTeam(memberModal.id, userId);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableUsers = () => {
    if (!memberModal) return [];
    const memberIds = memberModal.members?.map(m => m.id) || [];
    return users.filter(u => !memberIds.includes(u.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition"
        >
          {showForm ? "Cancel" : "+ Create Team"}
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
            {editingTeam ? "Edit Team" : "Create New Team"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              placeholder="e.g., Engineering Team, Marketing Team"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editingTeam ? "Update" : "Create"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No teams yet. Create your first team!
            </div>
          ) : (
            teams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{team.team_name}</h4>
                    <p className="text-sm text-gray-500">
                      {team.members?.length || 0} members
                    </p>
                    <p className="text-xs text-gray-400 mt-1">ID: {team.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => openMemberModal(team)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Manage Members
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Member Modal */}
      {memberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Manage {memberModal.team_name} Members
              </h3>
              <button
                onClick={closeMemberModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Add Member */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Member
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
                >
                  <option value="">Select a user...</option>
                  {getAvailableUsers().map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUser || loading}
                  className="px-4 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Current Members */}
            <div>
              <h4 className="font-semibold mb-3">Current Members</h4>
              {memberModal.members?.length === 0 ? (
                <p className="text-gray-500 text-sm">No members yet</p>
              ) : (
                <div className="space-y-2">
                  {memberModal.members?.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{member.full_name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;

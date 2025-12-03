import { useState, useEffect } from "react";
import { getUsers } from "../../api/userService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.results || response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
        />
      </div>

      {/* User List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0D6C2] mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No users found matching your search." : "No users yet."}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#A0D6C2] flex items-center justify-center text-white font-semibold">
                        {user.first_name?.charAt(0) || user.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : user.username}
                        </h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">Role:</span>{" "}
                        <span className="font-medium">
                          {user.is_staff ? (
                            <span className="text-purple-600">Admin</span>
                          ) : (
                            <span className="text-blue-600">User</span>
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>{" "}
                        <span className={`font-medium ${user.is_active ? "text-green-600" : "text-red-600"}`}>
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Joined:</span>{" "}
                        <span className="font-medium">{formatDate(user.date_joined)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Login:</span>{" "}
                        <span className="font-medium">{formatDate(user.last_login)}</span>
                      </div>
                    </div>

                    {user.teams && user.teams.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">Teams: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.teams.map((team, index) => (
                            <span
                              key={typeof team === 'object' ? team.id : index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {typeof team === 'object' ? team.team_name : team}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Users</p>
          <p className="text-2xl font-bold text-blue-800">{users.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Admins</p>
          <p className="text-2xl font-bold text-purple-800">
            {users.filter(u => u.is_staff).length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Active Users</p>
          <p className="text-2xl font-bold text-green-800">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

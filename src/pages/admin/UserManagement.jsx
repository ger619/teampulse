import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser } from "../../api/userService";

const UserManagement = () => {
  const [users, setUsers] = useState([]); // current page view
  const [allUsers, setAllUsers] = useState([]); // full dataset across all pages
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState({ page: 1, next: null, previous: null, count: 0, pageSize: 10 });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    is_staff: false,
    is_active: true,
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(page);
      const results = response.results || response || [];
      setUsers(results);
      setPaging({
        page,
        next: response.next || null,
        previous: response.previous || null,
        count: typeof response.count === "number" ? response.count : results.length,
        pageSize: 10,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all pages and cache in allUsers for global filtering and stats
  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let page = 1;
      let aggregated = [];
      // Loop through pages until no next
      // Safety cap to avoid infinite loops: max 100 pages
      for (let i = 0; i < 100; i++) {
        const response = await getUsers(page);
        const results = response.results || [];
        aggregated = aggregated.concat(results);
        const hasNext = !!response.next;
        if (!hasNext) {
          // Set current page view to first page slice of aggregated
          const pageSize = 10;
          setAllUsers(aggregated);
          setUsers(aggregated.slice(0, pageSize));
          setPaging({
            page: 1,
            next: hasNext ? response.next : null,
            previous: null,
            count: typeof response.count === "number" ? response.count : aggregated.length,
            pageSize,
          });
          break;
        }
        page += 1;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil((paging.count || users.length) / (paging.pageSize || 10)));

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchUsers(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      is_staff: user.is_staff || false,
      is_active: user.is_active !== undefined ? user.is_active : true,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    setLoading(true);
    setError(null);
    try {
      await updateUser(editingUser.id, formData);
      setShowEditModal(false);
      setEditingUser(null);
      await fetchAllUsers(); // Use fetchAllUsers to refresh the complete dataset
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, username) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
      fetchAllUsers(); // Use fetchAllUsers to refresh the complete dataset
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  const filteredUsersAll = allUsers
    .filter(user => !showAdminsOnly || !!user.is_staff)
    .filter(user =>
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Slice filtered users by current page
  const currentPageUsers = (() => {
    const usingFiltered = showAdminsOnly || !!searchTerm;
    const list = usingFiltered ? filteredUsersAll : allUsers;
    const start = (paging.page - 1) * (paging.pageSize || 10);
    const end = start + (paging.pageSize || 10);
    return list.slice(start, end);
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="text-sm text-gray-500">
          Total Users: {allUsers.length} • Admins: {allUsers.filter(u => u.is_staff).length} • This Page: {currentPageUsers.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Search & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
        />
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { setShowAdminsOnly(true); setPaging(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-2 text-sm rounded-md border transition w-full sm:w-auto ${showAdminsOnly ? "bg-purple-600 text-white border-purple-600" : "bg-white hover:bg-gray-50 border-gray-300 text-gray-700"}`}
            title="Show admins"
          >
            Show Admins
          </button>
          {showAdminsOnly || searchTerm ? (
            <button
              type="button"
              onClick={() => { setShowAdminsOnly(false); setSearchTerm(""); setPaging(p => ({ ...p, page: 1 })); }}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 w-full sm:w-auto"
              title="Clear filters"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0D6C2] mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          { ((showAdminsOnly || searchTerm) ? filteredUsersAll : allUsers).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No users found matching your search." : "No users yet."}
            </div>
          ) : (
            currentPageUsers.map((user) => (
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
                        <h4 className="font-semibold text-gray-800 truncate" title={(user.first_name || user.last_name) ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : user.username}>
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                            : user.username}
                        </h4>
                        <p className="text-sm text-gray-500 truncate" title={user.email}>{user.email}</p>
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

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id, user.username)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          { (((showAdminsOnly || searchTerm) ? filteredUsersAll.length : allUsers.length)) > (paging.pageSize || 10) && (
            <div className="flex items-center justify-center gap-2 pt-3 md:pt-4 flex-wrap">
              <button
                onClick={() => goToPage(paging.page - 1)}
                disabled={loading || paging.page === 1}
                className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              {/* Page numbers (compact) */}
              {Array.from({ length: Math.max(1, Math.ceil((((showAdminsOnly || searchTerm) ? filteredUsersAll.length : allUsers.length)) / (paging.pageSize || 10))) }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === paging.page;
                // Show first, last, current, and neighbors; ellipses for gaps
                const shouldShow = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - paging.page) <= 1;
                if (!shouldShow) {
                  // Insert ellipses near boundaries
                  if (pageNum === 2 && paging.page > 3) return <span key={pageNum} className="px-2">…</span>;
                  if (pageNum === totalPages - 1 && paging.page < totalPages - 2) return <span key={pageNum} className="px-2">…</span>;
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm rounded-md border ${isActive ? "bg-[#A0D6C2] text-white border-[#A0D6C2]" : "bg-white hover:bg-gray-50 border-gray-300"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => goToPage(paging.page + 1)}
                disabled={loading || paging.page === Math.max(1, Math.ceil((((showAdminsOnly || searchTerm) ? filteredUsersAll.length : allUsers.length)) / (paging.pageSize || 10)))}
                className="px-3 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit User</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A0D6C2] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_staff"
                  checked={formData.is_staff}
                  onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
                  className="w-4 h-4 text-[#A0D6C2] focus:ring-[#A0D6C2] border-gray-300 rounded"
                />
                <label htmlFor="is_staff" className="text-sm font-medium text-gray-700">
                  Admin (Staff)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#A0D6C2] focus:ring-[#A0D6C2] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#A0D6C2] text-white rounded-lg hover:bg-[#8acdb5] transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Users</p>
          <p className="text-2xl font-bold text-blue-800">{allUsers.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Admins</p>
          <p className="text-2xl font-bold text-purple-800">
            {allUsers.filter(u => u.is_staff).length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Active Users</p>
          <p className="text-2xl font-bold text-green-800">
            {allUsers.filter(u => u.is_active).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
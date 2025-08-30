import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "@/services/api";

const AdminSettingPage = () => {
  const [settings, setSettings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    Final_submmission_Date: "",
    year: new Date().getFullYear(),
  });

  // Get year options like 2023–2030
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URLS.ADMIN_SETTING, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);

    } catch (error) {
      toast.error("डेटा लोड करने में त्रुटि हुई।");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(
          `${API_URLS.ADMIN_SETTING}/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("डेटा सफलतापूर्वक अपडेट हुआ।");
      } else {
        await axios.post(API_URLS.ADMIN_SETTING, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("सेटिंग जोड़ी गई।");
      }
      setIsOpen(false);
      setFormData({ Final_submmission_Date: "", year: new Date().getFullYear() });
      setEditId(null);
      fetchSettings();
    } catch (error) {
      console.error(error);
      toast.error("डेटा सहेजने में त्रुटि हुई।");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URLS.ADMIN_SETTING}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("सेटिंग हटाई गई।");
      fetchSettings();
    } catch (error) {
      console.error(error);
      toast.error("डेटा हटाने में त्रुटि हुई।");
    }
  };

  const openEdit = (setting) => {
    setFormData({
      Final_submmission_Date: setting.Final_submmission_Date?.split("T")[0],
      year: new Date(setting.year).getFullYear(),
    });
    setEditId(setting._id);
    setIsOpen(true);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        
        <button
          onClick={() => {
            setFormData({
              Final_submmission_Date: "",
              year: new Date().getFullYear(),
            });
            setEditId(null);
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Add Setting
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="border px-3 py-2 ">Sr. No</th>
              <th className="border px-3 py-2 ">Final Submission Date</th>
              <th className="border px-3 py-2 ">Year</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((item, index) => (
              <tr key={item._id} className="text-sm">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">
                  {new Date(item.Final_submmission_Date).toLocaleDateString()}
                </td>
                <td className="border px-3 py-2">
                  {new Date(item.year).getFullYear()}
                </td>
                <td className="border px-3 py-2 flex gap-5 items-center justify-center">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-blue-600 hover:bg-blue-800 hover:text-white border  rounded-sm px-2  py-0"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:bg-red-800 hover:text-white border  rounded-sm px-2  py-0"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  कोई डेटा नहीं मिला।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" leave="ease-in duration-200"
            enterFrom="opacity-0" enterTo="opacity-100"
            leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex justify-center items-center">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-semibold mb-4">
                {editId ? "Edit Setting" : "Add Setting"}
              </Dialog.Title>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Final Submission Date
                  </label>
                  <input
                    type="date"
                    value={formData.Final_submmission_Date}
                    onChange={(e) =>
                      setFormData({ ...formData, Final_submmission_Date: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded" 
                  >
                     
                    {getYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {editId ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminSettingPage;

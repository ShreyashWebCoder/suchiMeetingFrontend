import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Papa from "papaparse";
import { Download, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import { Header } from "./Header";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
const { Option } = Select;
import { API_URLS } from "@/services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

// Type for dropdowns
interface DropdownsType {
  stars: any[];
  prakars: any[];
  sanghatans: any[];
  dayitvas: any[];
  kshetras: any[];
  prants: any[];
}
interface HandleSearchSection {
  abha: string;
  kshetra: string;
  prantka: string;
  prantpr: string;
  sabha: string;
  kshetrapr: string;
  exec: string;
  palak: string;
  a_b_baithak: string[];
  prant_pracharak_baithak: string[];
  kshetra_pracharak_baithak: string[];
  kshetra_karyawah_baithak: string;
  prant_karyawah_baithak: string;
  karyakari_mandal_baithak: string;
  bhougolic_palak_adhikari_baithak: string;
}

// Fetch all dropdowns from the backend
const getAllDropdowns = async (): Promise<{ data: DropdownsType }> => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_URLS.ALL_DROPDOWNS, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res;
};

// UserData type
interface UserData {
  id?: string;
  name: string;
  level: string;
  type?: string;
  org?: string;
  duty: string;
  area: string;
  prant: string;
  center: string;
  phone1: string;
  phone2: string;
  email: string;
  abha?: string;
  kshetra?: string;
  prantka?: string;
  exec?: string;
  sabha?: string;
  prantpr?: string;
  kshetrapr?: string;
  palak?: string;
  gatividhi_toli_baithak?: string;
  a_b_baithak?: string;
  prant_pracharak_baithak?: string;
  kshetra_pracharak_baithak?: string;
  kshetra_karyawah_baithak?: string;
  prant_karyawah_baithak?: string;
  bhougolic_palak_adhikari_baithak?: string;
  karyakari_mandal_baithak?: string;
  gender: string;
  present: string;
}
// constants/meetingOptions.js
const MEETING_OPTIONS: Record<string, string[]> = {
  "प्रतिनिधि सभा": [
    "अ. भा. कार्यकारिणी बैठक",
    "क्षेत्र का. प्र. बैठक",
    "प्रांत का. प्र. बैठक",
    "कार्यकारी मंडल",
    "प्रतिनिधी सभा",
    "प्रांत प्र. बैठक",
    "क्षेत्र प्र. बैठक",
    "पालक अधिकारी बैठक",
  ],
};

const UserList = () => {
  const location = useLocation();
  const navState = location.state as {
    title?: string;
    columns?: string[];
    data?: any[];
  };

  const meetingTypeData = sessionStorage.getItem("meetingType");
  const sessionSelectedYear = sessionStorage.getItem("selectedYear");
  const getAlldatas = sessionStorage.getItem("prantUserData");

  // Dropdown state with proper initialization
  const [dropdowns, setDropdowns] = useState<DropdownsType>({
    stars: [],
    prakars: [],
    sanghatans: [],
    dayitvas: [],
    kshetras: [],
    prants: [],
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [meetingType, setMeetingType] = useState(
    meetingTypeData || "प्रतिनिधि सभा"
  );
  const [selectedYear, setSelectedYear] = useState(
    sessionSelectedYear || "2025"
  );

  // Set columns based on meetingType
  const [columns, setColumns] = useState<string[]>(() => {
    if (meetingType === "प्रतिनिधि सभा") {
      return [
        "अ. क्र.",
        "नाम",
        "स्तर",
        "प्रकार",
        "संगठन",
        "दायित्व",
        "क्षेत्र",
        "प्रांत",
        "केंद्र",
        "भ्रमणध्वनी 1",
        "भ्रमणध्वनी 2",
        "ई मेल",
        "अ. भा. कार्यकारिणी बैठक",
        "क्षेत्र का. प्र. बैठक",
        "प्रांत का. प्र. बैठक",
        "कार्यकारी मंडल",
        "प्रतिनिधी सभा",
        "प्रांत प्र. बैठक",
        "क्षेत्र प्र. बैठक",
        "पालक अधिकारी बैठक",
        "महिला / पुरुष",
        "उपस्थित / अनुपस्थित",
      ];
    }
    return navState?.columns || [];
  });

  // Add/Edit dialog state
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: dayjs().format("YYYY-MM-DD"),
    year: new Date().getFullYear(),
    prant: "",
    email: "",
  });
  console.log("Form data:", formData);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setOpen(false);
    // Reset form
    setFormData({
      name: "",
      date: dayjs().format("YYYY-MM-DD"),
      year: new Date().getFullYear(),
      prant: "",
      email: "",
    });
  };

  // Define userDataKeys based on meetingType
  let userDataKeys: (keyof UserData)[] = [];
  if (meetingType === "प्रतिनिधि सभा") {
    userDataKeys = [
      "name",
      "level",
      "type",
      "org",
      "duty",
      "area",
      "prant",
      "center",
      "phone1",
      "phone2",
      "email",
      "abha",
      "kshetra",
      "prantka",
      "exec",
      "sabha",
      "prantpr",
      "kshetrapr",
      "palak",
      "gender",
      "present",
    ];
  }

  const dropdownOptions = MEETING_OPTIONS[meetingType] || [];
  // Filters
  const [filters, setFilters] = useState({
    prant: "",
    org: "",
    duty: "",
    star: "",
    name: "",
    baithak: "",
  });
  // Data
  const [data, setData] = useState<any[]>(navState?.data || []);
  console.log(data);
  const [originalData, setOriginalData] = useState<any[]>(navState?.data || []);
  const [filteredData, setFilteredData] = useState<any[]>(navState?.data || []);
  const [loader, setLoader] = useState(false);
  const prantName = localStorage.getItem("prantName");
  // Clear sessionStorage when meetingType changes
  useEffect(() => {
    sessionStorage.setItem("meetingType", meetingType);
    sessionStorage.removeItem("allUsers"); // Clear stale user data
  }, [meetingType]);

  // Fetch data when meetingType or selectedYear changes
  useEffect(() => {
    if (!navState?.data || navState?.title === "संपूर्ण सूची") {
      fetchPrantData();
    }
  }, [meetingType, selectedYear, navState?.title]);

  // Fetch dropdowns on mount
  useEffect(() => {
    setLoadingDropdowns(true);
    fetchPrantData();
    getAllDropdowns()
      .then((res) => {
        setDropdowns(res.data);
      })
      .finally(() => setLoadingDropdowns(false));
  }, []);

  // Memoized user mapping function
  const mapUserData = useCallback(
    (user: any) => {
      if (meetingType === "प्रतिनिधि सभा") {
        return {
          id: user._id,
          name: user.name || "",
          level: user.star || "",
          type: user.prakar || "",
          org: user.sanghatan || "",
          duty: user.dayitva || "",
          area: user.kshetra || "",
          prant: user.prant || "",
          center: user.kendra || "",
          phone1: user.mobile_no_1 || "",
          phone2: user.mobile_no_2 || "",
          email: user.email || "",
          abha: user.a_b_karykarini_baithak ? "1" : "0",
          kshetra: user.kshetra_k_p_baithak ? "1" : "0",
          prantka: user.prant_k_p_baithak ? "1" : "0",
          exec: user.karyakari_madal ? "1" : "0",
          sabha: user.pratinidhi_sabha ? "1" : "0",
          prantpr: user.prant_p_baithak ? "1" : "0",
          kshetrapr: user.kshetra_p_baithak ? "1" : "0",
          palak: user.palak_adhikari_baithak ? "1" : "0",
          gender:
            user.gender === "m" ? "पुरुष" : user.gender === "f" ? "महिला" : "",
          present: user.attendance === "p" ? "उपस्थित" : "अनुपस्थित",
        };
      }
      return {};
    },
    [meetingType]
  );

  // Fetch Users
  const fetchPrantData = useCallback(async () => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      const prantId = localStorage.getItem("prantId");
      console.log(token);
      let userRes;
      if (meetingType === "प्रतिनिधि सभा") {
        userRes = await axios.get(
          `${API_URLS.GET_PERTICULAR_PRANT_DATA}/${prantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      const mapped = userRes?.data?.map(mapUserData) || [];
      console.log(mapped);
      setData(mapped);
      setOriginalData(mapped);
      setFilteredData(mapped);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("डेटा लोड करने में त्रुटि हुई।");
    } finally {
      setLoader(false);
    }
  }, [meetingType, selectedYear, mapUserData]);

  const handleSearch = (): HandleSearchSection => {
    return {
      abha: "अ. भा. कार्यकारिणी बैठक",
      kshetra: "क्षेत्र का. प्र. बैठक",
      prantka: "प्रांत का. प्र. बैठक",
      prantpr: "प्रांत प्र. बैठक",
      sabha: "प्रतिनिधी सभा",
      kshetrapr: "क्षेत्र प्र. बैठक",
      exec: "कार्यकारी मंडल",
      palak: "पालक अधिकारी बैठक",
      a_b_baithak: ["अ. भा. बैठक"],
      prant_pracharak_baithak: ["प्रांत प्रचारक बैठक"],
      kshetra_pracharak_baithak: ["क्षेत्र प्रचारक बैठक"],
      kshetra_karyawah_baithak: "क्षेत्र कार्यवाह बैठक",
      prant_karyawah_baithak: "प्रांत कार्यवाह बैठक",
      karyakari_mandal_baithak: "कार्यकारी मंडल बैठक",
      bhougolic_palak_adhikari_baithak: "भौगोलिक पालक अधिकारी बैठक",
    };
  };

  useEffect(() => {
    if (navState?.title === "बैठक शः सूची") {
      const meetingbhaithak = filters.baithak;

      // If no baithak selected, show all data
      if (!meetingbhaithak || meetingbhaithak.trim() === "") {
        setFilteredData(originalData);
        return;
      }

      const searchMap = handleSearch();

      // Find matching field (backend key) using marathi meeting name
      const matchingField = Object.entries(searchMap).find(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(meetingbhaithak);
        }
        return value === meetingbhaithak;
      })?.[0]; // => e.g., "a_b_baithak"

      const filtered = originalData.filter((user) => {
        return matchingField && user[matchingField] === "1";
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(originalData); // fallback for other nav states
    }
  }, [filters, originalData, navState?.title]);

  // Debug keys

  // Download Excel
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row: UserData, idx) => {
        const obj: any = {};
        columns.forEach((col, i) => {
          if (col === "अ. क्र.") obj[col] = idx + 1;
          else obj[col] = row[userDataKeys[i - 1] || ""] || "";
        });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suchi");
    XLSX.writeFile(wb, "prant_User.xlsx");
  };

  // Clear Filter handler
  const handleClearFilter = () => {
    setFilters({
      prant: "",
      org: "",
      duty: "",
      star: "",
      name: "",
      baithak: "",
    });
    setFilteredData(originalData);
  };
  const roleId = localStorage.getItem("roleId");
  const [loading, setloading] = useState();
  const handleFormSubmit = async () => {
    const token = localStorage.getItem("token");

    const columns = [
      "अ. क्र.",
      "नाम",
      "दायित्व",
      "प्रांत",
      "क्षेत्र",
      "स्तर",
      "संगठन",
      "केन्द्र",
      "फोन 1",
      "फोन 2",
      "ईमेल",
      "लिंग",
      "उपस्थिति",
      "अ. भा.",
      "क्षेत्र का.",
      "प्रांत का.",
      "कार्यकारिणी",
      "प्रतिनिधि सभा",
      "प्रांत प्र.",
      "क्षेत्र प्र.",
      "पालक",
    ];

    const userDataKeys = Object.keys(filteredData?.[0] || {}).filter(
      (k) => k !== "अ. क्र."
    );

    try {
      setLoader(true);
      const response = await axios.post(
        `${API_URLS.SEND_EMAIL}`,
        {
          name: formData.name,
          date: formData.date,
          email: formData.email,
          year: formData.year,
          prant: prantName,
          filteredData,
          columns,
          userDataKeys,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axios.post(
        `${API_URLS.SUBMIT_DATA}`,
        {
          name: formData.name,
          email: formData.email,
          system_user_id: roleId,
          date: formData.date,
        },

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        toast.success("मेल सफलतापूर्वक भेजा गया।");
        formData.name = "";
        formData.email = "";
        setOpen(false);
        handleSubmit();
      }
    } catch (error) {
      console.error("Mail send error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || "मेल भेजने में त्रुटि हुई।");
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (!navState?.data) return;

    const filtered = originalData.filter((row) => {
      const matchesDuty = filters.duty ? row.duty === filters.duty : true;
      const matchesOrg = filters.org ? row.org === filters.org : true;
      const matchesPrant = filters.prant ? row.prant === filters.prant : true;
      const matchesStar = filters.star ? row.level === filters.star : true;
      const matchesName = filters.name
        ? row.name.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      return (
        matchesDuty && matchesOrg && matchesPrant && matchesStar && matchesName
      );
    });

    setFilteredData(filtered);
  }, [filters, navState?.data]);

  if (loading === true) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loader || loadingDropdowns) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
        <Card className="max-w-7xl mx-auto shadow-lg border-0">
          <CardHeader className="bg-gray-400 rounded-t-lg p-6">
            <CardTitle className="text-2xl text-white font-bold">
              {navState?.title || "सूची"}
            </CardTitle>
            <div className="text-white mt-2 text-lg">
              कुल: {filteredData.length}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div className="w-48">
                <label className="block mb-1 text-gray-700 font-medium">
                  प्रांत चुने
                </label>
                <Select
                  value={prantName}
                  onValueChange={(v) => setFilters((f) => ({ ...f, prant: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="प्रांत चुने" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdowns.prants?.map((opt: any) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <label className="block mb-1 text-gray-700 font-medium">
                  संगठन चुने
                </label>
                <Select
                  value={filters.org}
                  onValueChange={(v) => setFilters((f) => ({ ...f, org: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="संगठन चुने" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdowns.sanghatans?.map((opt: any) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <label className="block mb-1 text-gray-700 font-medium">
                  दायित्व चुने
                </label>
                <Select
                  value={filters.duty}
                  onValueChange={(v) => setFilters((f) => ({ ...f, duty: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="दायित्व चुने" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdowns.dayitvas?.map((opt: any) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <label className="block mb-1 text-gray-700 font-medium">
                  स्तर चुने
                </label>
                <Select
                  value={filters.star}
                  onValueChange={(v) => setFilters((f) => ({ ...f, star: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="स्तर चुने" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdowns.stars?.map((opt: any) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-56">
                <label className="block mb-1 text-gray-700 font-medium">
                  नाम खोजें
                </label>
                <Input
                  placeholder="नाम"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, name: e.target.value.trim() }))
                  }
                />
              </div>
              {/* Show add user button only in संपूर्ण सूची */}

              <Button
                onClick={() => setShowAdd(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                नया उपयोगकर्ता
              </Button>

              <Button
                onClick={handleClearFilter}
                variant="outline"
                className="ml-2"
              >
                Clear Filter
              </Button>
            </div>

            {/* Download button */}
            {filteredData.length > 0 && (
              <div className="mb-6 flex justify-end gap-10">
                <Button
                  onClick={() => setOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                >
                  Submit Data
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  डाउनलोड एक्सेल
                </Button>
              </div>
            )}
            {open && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Submit Data Form
                  </h2>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Data (disabled) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                      disabled
                      className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
                    />
                  </div>

                  {/* Year (disabled) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      disabled
                      className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
                    />
                  </div>

                  {/* Prant Name (disabled) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Prant
                    </label>
                    <input
                      type="text"
                      value={prantName}
                      onChange={(e) => handleChange("prant", e.target.value)}
                      disabled
                      className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFormSubmit}
                      className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-auto border rounded-lg max-h-[60vh]">
              <table className="min-w-[1400px] w-full text-sm text-gray-900">
                <thead className="bg-gradient-to-r from-orange-100 to-blue-100 sticky top-0 z-10">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className={[
                          "px-3 py-2 font-semibold border-b border-gray-200 whitespace-nowrap",
                          col === "नाम" ? "min-w-[180px] text-left" : "",
                          col === "स्तर" ? "min-w-[120px] text-left" : "",
                          col === "प्रकार" ? "min-w-[120px] text-left" : "",
                          col === "संगठन" ? "min-w-[140px] text-left" : "",
                          col === "दायित्व" ? "min-w-[160px] text-left" : "",
                          col === "क्षेत्र" ? "min-w-[140px] text-left" : "",
                          ![
                            "नाम",
                            "स्तर",
                            "प्रकार",
                            "संगठन",
                            "दायित्व",
                            "क्षेत्र",
                          ].includes(col)
                            ? "text-center"
                            : "",
                        ].join(" ")}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-8 text-gray-400"
                      >
                        कोई डेटा नहीं मिला
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr
                        key={row.id}
                        className="hover:bg-blue-50 cursor-pointer transition"
                        onDoubleClick={() => {
                          setEditRow(row);
                          setShowEdit(true);
                        }}
                      >
                        {columns.map((col, i) => (
                          <td
                            key={col}
                            className={[
                              "px-3 py-2 border-b",
                              col === "नाम" ? "min-w-[180px] text-left" : "",
                              col === "स्तर" ? "min-w-[120px] text-left" : "",
                              col === "प्रकार" ? "min-w-[120px] text-left" : "",
                              col === "संगठन" ? "min-w-[140px] text-left" : "",
                              col === "दायित्व"
                                ? "min-w-[160px] text-left"
                                : "",
                              col === "क्षेत्र"
                                ? "min-w-[140px] text-left"
                                : "",
                              ![
                                "नाम",
                                "स्तर",
                                "प्रकार",
                                "संगठन",
                                "दायित्व",
                                "क्षेत्र",
                              ].includes(col)
                                ? "text-center"
                                : "",
                            ].join(" ")}
                          >
                            {col === "अ. क्र."
                              ? idx + 1
                              : row[userDataKeys[i - 1] || ""] || ""}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Dialog */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>नया उपयोगकर्ता जोड़ें</DialogTitle>
            </DialogHeader>
            <AddEditUserForm
              dropdowns={dropdowns}
              onCancel={() => setShowAdd(false)}
              onUserAdded={fetchPrantData}
              meetingType={meetingType}
            />
          </DialogContent>
        </Dialog>
        {/* Edit User Dialog */}
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>यूज़र संपादित करें</DialogTitle>
            </DialogHeader>
            {editRow && (
              <AddEditUserForm
                user={editRow}
                dropdowns={dropdowns}
                onSubmit={(user) => {
                  setData(data.map((r) => (r.id === user.id ? user : r)));
                  setShowEdit(false);
                  setEditRow(null);
                }}
                onCancel={() => setShowEdit(false)}
                onUserAdded={fetchPrantData}
                meetingType={meetingType}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

// Add/Edit User Form Component
interface AddEditUserFormProps {
  user?: Partial<UserData>;
  dropdowns: DropdownsType;
  onCancel: () => void;
  onSubmit?: (data: UserData) => void;
  meetingType: string;
}

const genderOptions = [
  { label: "पुरुष", value: "m" },
  { label: "महिला", value: "f" },
];

const attendanceOptions = [
  { label: "उपस्थित", value: "p" },
  { label: "अनुपस्थित", value: "a" },
];

const AddEditUserForm: React.FC<
  AddEditUserFormProps & { onUserAdded?: () => void }
> = ({
  user = {},
  dropdowns = {},
  onCancel,
  onSubmit,
  onUserAdded,
  meetingType,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const prantId = localStorage.getItem("prantId");
  const prantName = localStorage.getItem("prantName");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserData>({
    defaultValues: {
      name: user.name || "",
      level: user.level || "",
      type: user.type || "",
      org: user.org || "",
      duty: user.duty || "",
      area: user.area || "",
      prant: user.prant || "",
      center: user.center || "",
      phone1: user.phone1 || "",
      phone2: user.phone2 || "",
      email: user.email || "",
      ...(meetingType === "प्रतिनिधि सभा"
        ? {
            abha: user.abha || "0",
            kshetra: user.kshetra || "0",
            prantka: user.prantka || "0",
            exec: user.exec || "0",
            sabha: user.sabha || "1",
            prantpr: user.prantpr || "0",
            kshetrapr: user.kshetrapr || "0",
            palak: user.palak || "0",
          }
        : {}),
      gender:
        user.gender === "महिला"
          ? "f"
          : user.gender === "पुरुष"
            ? "m"
            : user.gender === "f" || user.gender === "m"
              ? user.gender
              : "m",
      present:
        user.present === "उपस्थित"
          ? "p"
          : user.present === "अनुपस्थित"
            ? "a"
            : user.present === "p" || user.present === "a"
              ? user.present
              : "p",
      id: user.id,
    },
  });

  // For Select components, update value in form
  const handleSelect = (name: keyof UserData, value: string) =>
    setValue(name, value, { shouldValidate: true });

  // Helper to get dropdown id by name
  const getDropdownId = (list: any[], name: string) => {
    const found = list?.find((item) => item.name === name);
    return found ? found._id : "";
  };

  // Submit handler for Add or Update
  const handleFormSubmit = async (data: UserData) => {
    setApiError(null);
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      // Prepare payload
      let payload: any = {
        name: data.name,
        star_id: getDropdownId(dropdowns.stars, data.level),
        dayitva_id: getDropdownId(dropdowns.dayitvas, data.duty),
        kshetra_id: getDropdownId(dropdowns.kshetras, data.area),
        prant_id: prantId,
        kendra: data.center,
        mobile_no_1: data.phone1,
        mobile_no_2: data.phone2 || "",
        email: data.email,
        gender: data.gender,
        attendance: data.present,
        year: parseInt(sessionStorage.getItem("selectedYear") || "2025", 10),
        id: user.id,
      };

      if (meetingType === "प्रतिनिधि सभा") {
        payload = {
          ...payload,
          prakar_id: "6842c12f4919f039da177f50",
          sanghatan_id: "6842c4b64919f039da177fd1",
          a_b_karykarini_baithak: data.abha === "1",
          kshetra_k_p_baithak: data.kshetra === "1",
          prant_k_p_baithak: data.prantka === "1",
          karyakari_madal: data.exec === "1",
          pratinidhi_sabha: data.sabha === "1",
          prant_p_baithak: data.prantpr === "1",
          kshetra_p_baithak: data.kshetrapr === "1",
          palak_adhikari_baithak: data.palak === "1",
        };
      }

      // Validate required dropdowns
      if (
        !payload.dayitva_id ||
        !payload.kshetra_id ||
        !payload.prant_id ||
        (meetingType !== "अ.भा.कार्यकारी मंडल" &&
          (!payload.prakar_id || !payload.sanghatan_id))
      ) {
        setApiError("कृपया सभी आवश्यक ड्रॉपडाउन चुनें।");
        setSubmitting(false);
        return;
      }

      let res: any;
      if (meetingType === "प्रतिनिधि सभा") {
        res = await axios.post(`${API_URLS.ADD_NEW_PRATINIDHI_USER}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        throw new Error("Invalid meeting type");
      }

      // Success
      reset();
      setSubmitting(false);
      if (res.data && (res.data.user || res.data.updatedUser)) {
        toast.success(
          user.id
            ? "यूज़र सफलतापूर्वक अपडेट किया गया।"
            : "उपयोगकर्ता सफलतापूर्वक जोड़ा गया।"
        );
        onCancel();
        if (onSubmit && res.data.user) {
          onSubmit({
            ...data,
            id: res.data.user._id,
            level: data.level,
            type: data.type,
            org: data.org,
            duty: data.duty,
            area: data.area,
            prant: data.prant,
            gender: data.gender === "m" ? "पुरुष" : "महिला",
            present: data.present === "p" ? "उपस्थित" : "अनुपस्थित",
          });
        }
        if (onUserAdded) onUserAdded();
      }
    } catch (err: any) {
      setSubmitting(false);
      setApiError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          err.message ||
          "कुछ गलत हो गया।"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-6xl">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              नाम<span className="text-red-500">*</span>
            </label>
            <Input
              {...register("name", { required: "नाम आवश्यक है" })}
              placeholder="नाम दर्ज करें"
              disabled={submitting}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              ई मेल<span className="text-red-500">*</span>
            </label>
            <Input
              {...register("email", { required: "ई मेल आवश्यक है" })}
              placeholder="ई मेल दर्ज करें"
              disabled={submitting}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              भ्रमणध्वनी 1
            </label>
            <Input
              {...register("phone1")}
              placeholder="भ्रमणध्वनी 1 दर्ज करें"
              disabled={submitting}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              भ्रमणध्वनी 2
            </label>
            <Input
              {...register("phone2")}
              placeholder="भ्रमणध्वनी 2 दर्ज करें"
              disabled={submitting}
            />
          </div>
          {/* sanghatan */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              स्तर<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("level")}
              onValueChange={(v) => handleSelect("level", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="स्तर चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns?.stars?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.level && (
              <span className="text-red-500 text-xs">स्तर आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("level", { required: "स्तर आवश्यक है" })}
            />
          </div>
          <div className="flex flex-col disabled:">
            <label className="mb-1 text-gray-700 font-medium">
              प्रकार<span className="text-red-500">*</span>
            </label>
            <Select value="रा. स्व. संघ" disabled={true}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="रा. स्व. संघ">रा. स्व. संघ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col disabled:">
            <label className="mb-1 text-gray-700 font-medium">
              संगठन<span className="text-red-500">*</span>
            </label>
            <Select value="रा. स्व. संघ" disabled={true}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="रा. स्व. संघ">रा. स्व. संघ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              दायित्व<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("duty")}
              onValueChange={(v) => handleSelect("duty", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="दायित्व चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns.dayitvas?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.duty && (
              <span className="text-red-500 text-xs">दायित्व आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("duty", { required: "दायित्व आवश्यक है" })}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              केंद्र<span className="text-red-500">*</span>
            </label>
            <Input
              {...register("center", { required: "केंद्र आवश्यक है" })}
              placeholder="केंद्र दर्ज करें"
              disabled={submitting}
            />
            {errors.center && (
              <span className="text-red-500 text-xs">
                {errors.center.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              क्षेत्र<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("area")}
              onValueChange={(v) => handleSelect("area", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="क्षेत्र चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns.kshetras?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.area && (
              <span className="text-red-500 text-xs">क्षेत्र आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("area", { required: "क्षेत्र आवश्यक है" })}
            />
          </div>
          <div className="flex flex-col disabled:">
            <label className="mb-1 text-gray-700 font-medium">
              प्रांत<span className="text-red-500">*</span>
            </label>
            <Select value={prantName} disabled>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={prantName}>{prantName}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              अ. भा. कार्यकारिणी बैठक
            </label>
            <Select
              value={watch("abha") || "0"}
              onValueChange={(v) => handleSelect("abha", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="अ. भा. कार्यकारिणी बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("abha")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              क्षेत्र का. प्र. बैठक
            </label>
            <Select
              value={watch("kshetra") || "0"}
              onValueChange={(v) => handleSelect("kshetra", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="क्षेत्र का. प्र. बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("kshetra")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              प्रांत का. प्र. बैठक
            </label>
            <Select
              value={watch("prantka") || "0"}
              onValueChange={(v) => handleSelect("prantka", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="प्रांत का. प्र. बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("prantka")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              कार्यकारी मंडल
            </label>
            <Select
              value={watch("exec") || "0"}
              onValueChange={(v) => handleSelect("exec", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="कार्यकारी मंडल चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("exec")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              प्रतिनिधी सभा
            </label>
            <Select
              value={watch("sabha") || "0"}
              onValueChange={(v) => handleSelect("sabha", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="प्रतिनिधी सभा चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("sabha")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              प्रांत प्र. बैठक
            </label>
            <Select
              value={watch("prantpr") || "0"}
              onValueChange={(v) => handleSelect("prantpr", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="प्रांत प्र. बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("prantpr")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              क्षेत्र प्र. बैठक
            </label>
            <Select
              value={watch("kshetrapr") || "0"}
              onValueChange={(v) => handleSelect("kshetrapr", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="क्षेत्र प्र. बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("kshetrapr")} />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              पालक अधिकारी बैठक
            </label>
            <Select
              value={watch("palak") || "0"}
              onValueChange={(v) => handleSelect("palak", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="पालक अधिकारी बैठक चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("palak")} />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              महिला / पुरुष<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("gender")}
              onValueChange={(v) => handleSelect("gender", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="लिंग चुनें" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("gender", { required: "लिंग आवश्यक है" })}
            />
            {errors.gender && (
              <span className="text-red-500 text-xs">
                {errors.gender.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              उपस्थित / अनुपस्थित
            </label>
            <Select
              value={watch("present")}
              onValueChange={(v) => handleSelect("present", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="स्थिति चुनें" />
              </SelectTrigger>
              <SelectContent>
                {attendanceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("present")} />
          </div>
        </div>
      </div>
      {apiError && <div className="text-red-600 text-center">{apiError}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          रद्द करें
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={submitting}
        >
          {submitting ? "सहेज रहा है..." : "सहेजें"}
        </Button>
      </div>
    </form>
  );
};

export default UserList;

import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import { Header } from "./Header";
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
  gatividhi_toli_baithak: string;
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

  // Check if data is an object and filter each array property
  const activeData = {
    stars: res.data.stars.filter((elem) => elem.active === true),
    prakars: res.data.prakars.filter((elem) => elem.active === true),
    sanghatans: res.data.sanghatans.filter((elem) => elem.active === true),
    dayitvas: res.data.dayitvas.filter((elem) => elem.active === true),
    kshetras: res.data.kshetras.filter((elem) => elem.active === true),
    prants: res.data.prants.filter((elem) => elem.active === true),
  };

  console.log("Active data:", activeData);
  return { data: activeData }; // Return activeData wrapped in the expected structure
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
  "प्रांत प्रचारक बैठक": [
    "गतिविधि टोली बैठक 1&2 जुलाई",
    "अ. भा. बैठक 3 जुलाई",
    "प्रांत प्रचारक बैठक 4-6 जुलाई",
    "क्षेत्र प्रचारक बैठक 7-8 जुलाई",
  ],
  "अ.भा.कार्यकारी मंडल": [
    "अ. भा. बैठक",
    "क्षेत्र कार्यवाह बैठक",
    "प्रांत कार्यवाह बैठक",
    "कार्यकारी मंडल बैठक",
    "प्रांत प्रचारक बैठक",
    "क्षेत्र प्रचारक बैठक",
    "भौगोलिक पालक अधिकारी बैठक",
  ],
};

const Report = () => {
  const location = useLocation();
  const navState = location.state as {
    title?: string;
    columns?: string[];
    data?: any[];
  };

  const meetingColumnsToExclude = [
    "अ. भा. कार्यकारिणी बैठक",
    "क्षेत्र का. प्र. बैठक",
    "प्रांत का. प्र. बैठक",
    "कार्यकारी मंडल",
    "प्रतिनिधी सभा",
    "प्रांत प्र. बैठक",
    "क्षेत्र प्र. बैठक",
    "पालक अधिकारी बैठक",
    "गतिविधि टोली बैठक 1&2 जुलाई",
    "अ. भा. बैठक 3 जुलाई",
    "प्रांत प्रचारक बैठक 4-6 जुलाई",
    "क्षेत्र प्रचारक बैठक 7-8 जुलाई",
    "अ. भा. बैठक",
    "क्षेत्र कार्यवाह बैठक",
    "प्रांत कार्यवाह बैठक",
    "कार्यकारी मंडल बैठक",
    "प्रांत प्रचारक बैठक",
    "क्षेत्र प्रचारक बैठक",
    "भौगोलिक पालक अधिकारी बैठक",
  ];

  const meetingTypeData = sessionStorage.getItem("meetingType");
  const sessionSelectedYear = sessionStorage.getItem("selectedYear");

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
    } else if (meetingType === "प्रांत प्रचारक बैठक") {
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
        "गतिविधि टोली बैठक 1&2 जुलाई",
        "अ. भा. बैठक 3 जुलाई",
        "प्रांत प्रचारक बैठक 4-6 जुलाई",
        "क्षेत्र प्रचारक बैठक 7-8 जुलाई",
        "महिला / पुरुष",
        "उपस्थित / अनुपस्थित",
      ];
    } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
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
        "अ. भा. बैठक",
        "क्षेत्र कार्यवाह बैठक",
        "प्रांत कार्यवाह बैठक",
        "कार्यकारी मंडल बैठक",
        "प्रांत प्रचारक बैठक",
        "क्षेत्र प्रचारक बैठक",
        "भौगोलिक पालक अधिकारी बैठक",
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
  } else if (meetingType === "प्रांत प्रचारक बैठक") {
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
      "gatividhi_toli_baithak",
      "a_b_baithak",
      "prant_pracharak_baithak",
      "kshetra_pracharak_baithak",
      "gender",
      "present",
    ];
  } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
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
      "a_b_baithak",
      "kshetra_karyawah_baithak",
      "prant_karyawah_baithak",
      "karyakari_mandal_baithak",
      "prant_pracharak_baithak",
      "kshetra_pracharak_baithak",
      "bhougolic_palak_adhikari_baithak",
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
  const [originalData, setOriginalData] = useState<any[]>(navState?.data || []);
  const [filteredData, setFilteredData] = useState<any[]>(navState?.data || []);
  const [loader, setLoader] = useState(false);

  // console.log("filteredData", filteredData);
  // console.log(columns)
  // console.log(navState)

  // Clear sessionStorage when meetingType changes
  useEffect(() => {
    sessionStorage.setItem("meetingType", meetingType);
    sessionStorage.removeItem("allUsers"); // Clear stale user data
  }, [meetingType]);

  // Fetch dropdowns on mount
  useEffect(() => {
    setLoadingDropdowns(true);
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
          abha: user.a_b_karykarini_baithak === true ? "1" : "0",
          kshetra: user.kshetra_k_p_baithak === true ? "1" : "0",
          prantka: user.prant_k_p_baithak === true ? "1" : "0",
          exec: user.karyakari_madal === true ? "1" : "0",
          sabha: user.pratinidhi_sabha === true ? "1" : "0",
          prantpr: user.prant_p_baithak === true ? "1" : "0",
          kshetrapr: user.kshetra_p_baithak === true ? "1" : "0",
          palak: user.palak_adhikari_baithak === true ? "1" : "0",
          gender:
            user.gender === "m"
              ? "पुरुष"
              : user.gender === "f"
                ? "महिला"
                : "पुरुष",
          present: user.attendance === "p" ? "उपस्थित" : "अनुपस्थित",
        };
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
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
          gatividhi_toli_baithak: user.gatividhi_toli_baithak ? "1" : "0",
          a_b_baithak: user.a_b_baithak ? "1" : "0",
          prant_pracharak_baithak: user.prant_pracharak_baithak ? "1" : "0",
          kshetra_pracharak_baithak: user.kshetra_pracharak_baithak ? "1" : "0",
          gender:
            user.gender === "m"
              ? "पुरुष"
              : user.gender === "f"
                ? "महिला"
                : "पुरुष",
          present: user.attendance === "p" ? "उपस्थित" : "अनुपस्थित",
        };
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
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
          a_b_baithak: user.a_b_baithak ? "1" : "0",
          kshetra_karyawah_baithak: user.kshetra_karyawah_baithak ? "1" : "0",
          prant_karyawah_baithak: user.prant_karyawah_baithak ? "1" : "0",
          karyakari_mandal_baithak: user.karyakari_mandal_baithak ? "1" : "0",
          prant_pracharak_baithak: user.prant_pracharak_baithak ? "1" : "0",
          kshetra_pracharak_baithak: user.kshetra_pracharak_baithak ? "1" : "0",
          bhougolic_palak_adhikari_baithak:
            user.bhougolic_palak_adhikari_baithak ? "1" : "0",
          gender:
            user.gender === "m"
              ? "पुरुष"
              : user.gender === "f"
                ? "महिला"
                : "पुरुष",
          present: user.attendance === "p" ? "उपस्थित" : "अनुपस्थित",
        };
      }
      return {};
    },
    [meetingType]
  );

  // Fetch Users
  const fetchDashboardData = useCallback(async () => {
    setLoader(true);
    try {
      const token = localStorage.getItem("token");
      let userRes;
      if (meetingType === "प्रतिनिधि सभा") {
        userRes = await axios.get(`${API_URLS.ALL_USERS}/${selectedYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
        userRes = await axios.get(
          `${API_URLS.ALL_USERS_PRANT_PRACHARAK}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
        userRes = await axios.get(
          `${API_URLS.ALL_USERS_KARYAKARI_MANDAL}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // console.log(userRes.data);
      const mapped = userRes?.data?.map(mapUserData) || [];
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

  useEffect(() => {
    if (
      !navState?.data ||
      navState?.title === "संपूर्ण सूची" ||
      navState?.title === "बैठक शः सूची" ||
      navState?.title === "बैठक शः संख्या"
    ) {
      fetchDashboardData();
    }
  }, [
    meetingType,
    selectedYear,
    navState?.title,
    navState?.data,
    fetchDashboardData,
  ]);

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
      gatividhi_toli_baithak: "गतिविधि टोली बैठक 1&2 जुलाई",
      a_b_baithak: ["अ. भा. बैठक 3 जुलाई", "अ. भा. बैठक"],
      prant_pracharak_baithak: [
        "प्रांत प्रचारक बैठक 4-6 जुलाई",
        "प्रांत प्रचारक बैठक",
      ],
      kshetra_pracharak_baithak: [
        "क्षेत्र प्रचारक बैठक 7-8 जुलाई",
        "क्षेत्र प्रचारक बैठक",
      ],
      kshetra_karyawah_baithak: "क्षेत्र कार्यवाह बैठक",
      prant_karyawah_baithak: "प्रांत कार्यवाह बैठक",
      karyakari_mandal_baithak: "कार्यकारी मंडल बैठक",
      bhougolic_palak_adhikari_baithak: "भौगोलिक पालक अधिकारी बैठक",
    };
  };

  useEffect(() => {
    if (navState?.title === "बैठक शः सूची") {
      const meetingbhaithak = filters.baithak?.trim();
      if (!meetingbhaithak) {
        setFilteredData(originalData);
        return;
      }

      const searchMap = handleSearch();

      const matchingField = Object.entries(searchMap).find(([key, value]) => {
        if (Array.isArray(value)) {
          return value.some((v) => v.trim() === meetingbhaithak);
        }
        return value.trim() === meetingbhaithak;
      })?.[0];

      if (!matchingField) {
        setFilteredData([]); // no match
        return;
      }

      const filtered = originalData.filter((user) => {
        const val = user[matchingField];
        return val === "1" || val === 1 || val === true;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(originalData);
    }
  }, [filters, originalData, navState?.title]);

  // Debug keys
  // Filter columns when navState.title is "बैठक शः सूची"
  const displayedColumns =
    navState?.title === "बैठक शः सूची" && filters.baithak
      ? [
        ...columns,
        // Only include filters.baithak if it's not already in coreColumns
        ...(columns.includes(filters.baithak) ? [] : [filters.baithak]),
      ].filter(
        (col) =>
          !meetingColumnsToExclude.includes(col) || col === filters.baithak
      )
      : columns;

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
  }, [filters, navState.data]);

  // console.log("Filtered data:", filteredData);
  // console.log("Original data:", originalData);

  // Download Excel
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row: UserData, idx) => {
        const obj: any = {};
        displayedColumns.forEach((col, i) => {
          if (col === "अ. क्र.") obj[col] = idx + 1;
          else
            obj[col] = row[userDataKeys[columns.indexOf(col) - 1] || ""] || "";
        });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suchi");
    XLSX.writeFile(wb, "suchi.xlsx");
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
  // console.log("DisplayedColumns :", displayedColumns);

  // if (loader || loadingDropdowns) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="relative w-12 h-12">
  //         <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //         <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Header />
      {loader || loadingDropdowns ? (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
          <div className="max-w-7xl mx-auto shadow-lg border-0 rounded-lg bg-white">
            {/* Card Header Skeleton */}
            <div className="bg-gray-300 rounded-t-lg p-6 animate-pulse">
              <div className="h-7 bg-gray-400 rounded w-1/4 mb-2"></div>
              <div className="h-5 bg-gray-400 rounded w-1/6"></div>
            </div>

            {/* Card Content Skeleton */}
            <div className="p-6">
              {/* Filters Skeleton */}
              <div className="flex flex-wrap gap-4 mb-6 items-end">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="w-48">
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
                <div className="h-10 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-32 ml-2"></div>
              </div>

              {/* Download Button Skeleton */}
              <div className="mb-6 flex justify-end">
                <div className="h-10 bg-gray-300 rounded w-40"></div>
              </div>

              {/* Table Skeleton */}
              <div className="overflow-auto border rounded-lg max-h-[60vh]">
                <table className="min-w-[1400px] w-full text-sm">
                  <thead className="bg-gradient-to-r from-orange-100 to-blue-100 sticky top-0 z-10">
                    <tr>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 border-b border-gray-200"
                        >
                          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                      <tr key={row} className="animate-pulse">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell) => (
                          <td key={cell} className="px-3 py-3 border-b">
                            <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dialog Skeletons (Add/Edit User) */}
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
            <div className="bg-white rounded-lg w-11/12 max-w-6xl p-6">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((field) => (
                  <div key={field}>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <div className="h-10 bg-gray-300 rounded w-24"></div>
                <div className="h-10 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
                {navState?.title === "बैठक शः सूची" ? (
                  // 👉 Only show बैठक filter
                  <div className="w-64">
                    <label className="block mb-1 text-gray-700 font-medium">
                      बैठक चुने
                    </label>
                    <Select
                      value={filters.baithak}
                      onValueChange={(v) =>
                        setFilters((f) => ({ ...f, baithak: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="बैठक चुने" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  // 👉 All other filters
                  <>
                    <div className="w-48">
                      <label className="block mb-1 text-gray-700 font-medium">
                        प्रांत चुने
                      </label>
                      <Select
                        value={filters.prant}
                        onValueChange={(v) =>
                          setFilters((f) => ({ ...f, prant: v }))
                        }
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
                        onValueChange={(v) =>
                          setFilters((f) => ({ ...f, org: v }))
                        }
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
                        onValueChange={(v) =>
                          setFilters((f) => ({ ...f, duty: v }))
                        }
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
                        onValueChange={(v) =>
                          setFilters((f) => ({ ...f, star: v }))
                        }
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
                          setFilters((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    </div>
                  </>
                )}

                {/* Show add user button only in संपूर्ण सूची */}
                {navState?.title === "संपूर्ण सूची" && (
                  <Button
                    onClick={() => setShowAdd(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    नया उपयोगकर्ता
                  </Button>
                )}

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
                <div className="mb-6 flex justify-end">
                  <Button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    डाउनलोड एक्सेल
                  </Button>
                </div>
              )}
              {/* Table */}
              <div className="overflow-auto border rounded-lg max-h-[60vh]">
                <table className="min-w-[1400px] w-full text-sm text-gray-900">
                  <thead className="bg-gradient-to-r from-orange-100 to-blue-100 sticky top-0 z-10">
                    <tr>
                      {displayedColumns.map((col) => (
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
                          {displayedColumns.map((col, i) => (
                            <td
                              key={col}
                              className={[
                                "px-3 py-2 border-b",
                                col === "नाम" ? "min-w-[180px] text-left" : "",
                                col === "स्तर" ? "min-w-[120px] text-left" : "",
                                col === "प्रकार"
                                  ? "min-w-[120px] text-left"
                                  : "",
                                col === "संगठन"
                                  ? "min-w-[140px] text-left"
                                  : "",
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
                              {/* {col === "अ. क्र."
                              ? idx + 1
                              : row[userDataKeys[i - 1] || ""] || ""} */}

                              {/* {col === "अ. क्र."
                              ? idx + 1
                              : row[
                                    userDataKeys[columns.indexOf(col) - 1] || ""
                                  ] || ""
                                ? row[
                                    userDataKeys[columns.indexOf(col) - 1] || ""
                                  ] || ""
                                : row[col] || ""} */}
                              {col === "अ. क्र."
                                ? idx + 1
                                : row[
                                userDataKeys[columns.indexOf(col) - 1] || ""
                                ] ??
                                row[col] ??
                                ""}
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
                onUserAdded={fetchDashboardData}
                meetingType={meetingType}
                selectedYear={sessionSelectedYear}
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
                  onUserAdded={fetchDashboardData}
                  meetingType={meetingType}
                  selectedYear={sessionSelectedYear}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
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
  selectedYear: string;
}

const genderOptions = [
  { label: "पुरुष", value: "m" },
  { label: "महिला", value: "f" },
];

const attendanceOptions = [
  { label: "उपस्थित", value: "p" },
  { label: "अनुपस्थित", value: "a" },
];

const AddEditUserForm: React.FC<AddEditUserFormProps> = ({
  user = {},
  dropdowns = {},
  onCancel,
  onSubmit,
  onUserAdded,
  meetingType,
  selectedYear,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [sessionSelectedYear, setSessionSelectedYear] = useState(selectedYear);
  const [apiError, setApiError] = useState<string | null>(null);
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
        : meetingType === "प्रांत प्रचारक बैठक"
          ? {
            gatividhi_toli_baithak: user.gatividhi_toli_baithak || "0",
            a_b_baithak: user.a_b_baithak || "0",
            prant_pracharak_baithak: user.prant_pracharak_baithak || "0",
            kshetra_pracharak_baithak: user.kshetra_pracharak_baithak || "0",
          }
          : meetingType === "अ.भा.कार्यकारी मंडल"
            ? {
              a_b_baithak: user.a_b_baithak || "0",
              kshetra_karyawah_baithak: user.kshetra_karyawah_baithak || "0",
              prant_karyawah_baithak: user.prant_karyawah_baithak || "0",
              karyakari_mandal_baithak: user.karyakari_mandal_baithak || "1",
              prant_pracharak_baithak: user.prant_pracharak_baithak || "0",
              kshetra_pracharak_baithak: user.kshetra_pracharak_baithak || "0",
              bhougolic_palak_adhikari_baithak:
                user.bhougolic_palak_adhikari_baithak || "0",
            }
            : {}),
      gender:
        user.gender === "महिला" ? "f" : user.gender === "पुरुष" ? "m" : "f",
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

  const handleSelect = (name: keyof UserData, value: string) =>
    setValue(name, value, { shouldValidate: true });

  const getDropdownId = (list: any[], name: string) => {
    const found = list?.find((item) => item.name === name);
    return found ? found._id : "";
  };

  // console.log(meetingType);
  const handleFormSubmit = async (data: UserData, e) => {
    e.preventDefault();
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
        prant_id: getDropdownId(dropdowns.prants, data.prant),
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
          prakar_id: getDropdownId(dropdowns.prakars, data.type),
          sanghatan_id: getDropdownId(dropdowns.sanghatans, data.org),
          a_b_karykarini_baithak: data.abha === "1",
          kshetra_k_p_baithak: data.kshetra === "1",
          prant_k_p_baithak: data.prantka === "1",
          karyakari_madal: data.exec === "1",
          pratinidhi_sabha: data.sabha === "1",
          prant_p_baithak: data.prantpr === "1",
          kshetra_p_baithak: data.kshetrapr === "1",
          palak_adhikari_baithak: data.palak === "1",
        };
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
        payload = {
          ...payload,
          prakar_id: getDropdownId(dropdowns.prakars, data.type),
          sanghatan_id: getDropdownId(dropdowns.sanghatans, data.org),
          gatividhi_toli_baithak: data.gatividhi_toli_baithak === "1",
          a_b_baithak: data.a_b_baithak === "1",
          prant_pracharak_baithak: data.prant_pracharak_baithak === "1",
          kshetra_pracharak_baithak: data.kshetra_pracharak_baithak === "1",
        };
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
        payload = {
          ...payload,
          prakar_id: getDropdownId(dropdowns.prakars, data.type),
          sanghatan_id: getDropdownId(dropdowns.sanghatans, data.org),
          a_b_baithak: data.a_b_baithak === "1",
          kshetra_karyawah_baithak: data.kshetra_karyawah_baithak === "1",
          prant_karyawah_baithak: data.prant_karyawah_baithak === "1",
          karyakari_mandal_baithak: data.karyakari_mandal_baithak === "1",
          prant_pracharak_baithak: data.prant_pracharak_baithak === "1",
          kshetra_pracharak_baithak: data.kshetra_pracharak_baithak === "1",
          bhougolic_palak_adhikari_baithak:
            data.bhougolic_palak_adhikari_baithak === "1",
        };
      }

      // Validate required dropdowns
      if (
        !payload.star_id ||
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
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
        res = await axios.post(`${API_URLS.ADD_NEW_PRANT_USER}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
        res = await axios.post(
          `${API_URLS.ADD_NEW_KARKAKARI_MANDAL}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        throw new Error("Invalid meeting type");
      }

      // console.log(res.data);

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
            id: res.data.user._id || user.id,
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
        window.location.reload();

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
                {dropdowns.stars?.map((opt: any) => (
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
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              प्रकार<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("type")}
              onValueChange={(v) => handleSelect("type", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="प्रकार चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns.prakars?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <span className="text-red-500 text-xs">प्रकार आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("type", { required: "प्रकार आवश्यक है" })}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              संगठन<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("org")}
              onValueChange={(v) => handleSelect("org", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="संगठन चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns.sanghatans?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.org && (
              <span className="text-red-500 text-xs">संगठन आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("org", { required: "संगठन आवश्यक है" })}
            />
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
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              प्रांत<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("prant")}
              onValueChange={(v) => handleSelect("prant", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="प्रांत चुनें" />
              </SelectTrigger>
              <SelectContent>
                {dropdowns.prants?.map((opt: any) => (
                  <SelectItem key={opt.name} value={opt.name}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.prant && (
              <span className="text-red-500 text-xs">प्रांत आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("prant", { required: "प्रांत आवश्यक है" })}
            />
          </div>
          {meetingType === "प्रतिनिधि सभा" && (
            <>
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
            </>
          )}
          {meetingType === "प्रांत प्रचारक बैठक" && (
            <>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  गतिविधि टोली बैठक 1&2 जुलाई
                </label>
                <Select
                  value={watch("gatividhi_toli_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("gatividhi_toli_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="गतिविधि टोली बैठक 1&2 जुलाई चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("gatividhi_toli_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  अ. भा. बैठक 3 जुलाई
                </label>
                <Select
                  value={watch("a_b_baithak") || "0"}
                  onValueChange={(v) => handleSelect("a_b_baithak", v)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="अ. भा. बैठक 3 जुलाई चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("a_b_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  प्रांत प्रचारक बैठक 4-6 जुलाई
                </label>
                <Select
                  value={watch("prant_pracharak_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("prant_pracharak_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="प्रांत प्रचारक बैठक 4-6 जुलाई चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("prant_pracharak_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  क्षेत्र प्रचारक बैठक 7-8 जुलाई
                </label>
                <Select
                  value={watch("kshetra_pracharak_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("kshetra_pracharak_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="क्षेत्र प्रचारक बैठक 7-8 जुलाई चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("kshetra_pracharak_baithak")}
                />
              </div>
            </>
          )}
          {meetingType === "अ.भा.कार्यकारी मंडल" && (
            <>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  अ. भा. बैठक
                </label>
                <Select
                  value={watch("a_b_baithak") || "0"}
                  onValueChange={(v) => handleSelect("a_b_baithak", v)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="अ. भा. बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("a_b_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  क्षेत्र कार्यवाह बैठक
                </label>
                <Select
                  value={watch("kshetra_karyawah_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("kshetra_karyawah_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="क्षेत्र कार्यवाह बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("kshetra_karyawah_baithak")}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  प्रांत कार्यवाह बैठक
                </label>
                <Select
                  value={watch("prant_karyawah_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("prant_karyawah_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="प्रांत कार्यवाह बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("prant_karyawah_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  कार्यकारी मंडल बैठक
                </label>
                <Select
                  value={watch("karyakari_mandal_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("karyakari_mandal_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="कार्यकारी मंडल बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("karyakari_mandal_baithak")}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  प्रांत प्रचारक बैठक
                </label>
                <Select
                  value={watch("prant_pracharak_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("prant_pracharak_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="प्रांत प्रचारक बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("prant_pracharak_baithak")} />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  क्षेत्र प्रचारक बैठक
                </label>
                <Select
                  value={watch("kshetra_pracharak_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("kshetra_pracharak_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="क्षेत्र प्रचारक बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("kshetra_pracharak_baithak")}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-700 font-medium">
                  भौगोलिक पालक अधिकारी बैठक
                </label>
                <Select
                  value={watch("bhougolic_palak_adhikari_baithak") || "0"}
                  onValueChange={(v) =>
                    handleSelect("bhougolic_palak_adhikari_baithak", v)
                  }
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="भौगोलिक पालक अधिकारी बैठक चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register("bhougolic_palak_adhikari_baithak")}
                />
              </div>
            </>
          )}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              लिंग<span className="text-red-500">*</span>
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
            {errors.gender && (
              <span className="text-red-500 text-xs">
                {errors.gender.message}
              </span>
            )}
            <input
              type="hidden"
              {...register("gender", { required: "लिंग आवश्यक है" })}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">
              उपस्थित / अनुपस्थित<span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("present")}
              onValueChange={(v) => handleSelect("present", v)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="उपस्थित / अनुपस्थित चुनें" />
              </SelectTrigger>
              <SelectContent>
                {attendanceOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.present && (
              <span className="text-red-500 text-xs">उपस्थिति आवश्यक है</span>
            )}
            <input
              type="hidden"
              {...register("present", { required: "उपस्थिति आवश्यक है" })}
            />
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
          {submitting ? "सहेज रहा है..." : user.id ? "अपडेट करें" : "सहेजें"}
        </Button>
      </div>
    </form>
  );
};

export default Report;

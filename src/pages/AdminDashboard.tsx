import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Home, Users, FileText, Settings, Download, Eye } from "lucide-react";
import { Header } from "./Header"; // Adjust the import path as necessary
import axios from "axios";
import { API_URLS } from "@/services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ViewDropdown from "./ViewDropdown";
import AdminSettingsPage from "./Setting";

const Pratinidhi_sabha = "/Pratinidhi_sabha.csv";
const prant_pracharak = "/prant_pracharak.csv";
const karyakari_mandal = "/karyakari_mandal.csv"; // Added for Karyakari Mandal

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [allUsers, setAllUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  const [meetingType, setMeetingType] = useState(
    sessionStorage.getItem("meetingType") || "प्रतिनिधि सभा"
  );
  const sessionSelectedYear = sessionStorage.getItem("selectedYear");

  const [selectedYear, setSelectedYear] = useState(
    sessionSelectedYear || "2025"
  );

  console.log(allUsers);
  // Initialize categories for different meeting types
  const [categories, setCategories] = useState([
    { name: "संपूर्ण सूची", count: 0, color: "bg-blue-500" },
    { name: "क्षेत्र/प्रांत संचालक", count: 0, color: "bg-green-500" },
    { name: "क्षेत्र/प्रांत कार्यवाह", count: 0, color: "bg-purple-500" },
    { name: "क्षेत्र/प्रांत प्रचारक", count: 0, color: "bg-orange-500" },
    { name: "शारीरिक प्रमुख", count: 0, color: "bg-red-500" },
    { name: "बौद्धिक प्रमुख", count: 0, color: "bg-indigo-500" },
    { name: "सेवा प्रमुख", count: 0, color: "bg-pink-500" },
    { name: "व्यवस्था प्रमुख", count: 0, color: "bg-teal-500" },
    { name: "संपर्क प्रमुख", count: 0, color: "bg-teal-500" },
    { name: "प्रचार प्रमुख", count: 0, color: "bg-teal-500" },
    { name: "विभाग प्रचारक", count: 0, color: "bg-teal-500" },
    { name: "प्रतिनिधि", count: 0, color: "bg-teal-500" },
    { name: "पूर्व प्रांत प्रचारक", count: 0, color: "bg-teal-500" },
    { name: "विशेष निमंत्रित", count: 0, color: "bg-teal-500" },
    { name: "स्तर श: सूची", count: 0, color: "bg-teal-500" },
    { name: "विविध क्षेत्र सूची", count: 0, color: "bg-teal-500" },
    { name: "प्रांत श: सूची", count: 0, color: "bg-teal-500" },
    { name: "महिला", count: 0, color: "bg-teal-500" },
    { name: "बैठक शः सूची", count: 0, color: "bg-teal-500" },
    { name: "संघ/विविध क्षेत्र संख्या", count: 0, color: "bg-teal-500" },
    {
      name: "प्रतिनिधी सभा बैठक शः संख्या (प्रांत श:)",
      count: 0,
      color: "bg-teal-500",
    },
    {
      name: "प्रतिनिधी सभा स्तर शः संख्या (प्रांत श:)",
      count: 0,
      color: "bg-teal-500",
    },
  ]);

  const [ppCategories, setPPCategories] = useState([
    { name: "संपूर्ण सूची", count: 0, color: "bg-blue-500" },
    { name: "अ.भा.अधिकारी", count: 0, color: "bg-green-500" },
    { name: "क्षेत्र प्रचारक", count: 0, color: "bg-orange-500" },
    { name: "क्षेत्र प्रचारक प्रमुख", count: 0, color: "bg-red-500" },
    { name: "प्रांत प्रचारक", count: 0, color: "bg-indigo-500" },
    { name: "विविध क्षेत्र", count: 0, color: "bg-pink-500" },
    { name: "बैठक शः संख्या", count: 0, color: "bg-teal-500" },
    { name: "बैठक शः सूची", count: 0, color: "bg-teal-500" },
  ]);

  const [abkCategories, setAbkCategories] = useState([
    { name: "संपूर्ण सूची", count: 0, color: "bg-blue-500" },
    { name: "अ.भा.अधिकारी", count: 0, color: "bg-green-500" },
    { name: "क्षेत्र संघचालक", count: 0, color: "bg-orange-500" },
    { name: "क्षेत्र कार्यवाह", count: 0, color: "bg-red-500" },
    { name: "क्षेत्र प्रचारक", count: 0, color: "bg-indigo-500" },
    { name: "क्षेत्र प्रचारक प्रमुख", count: 0, color: "bg-pink-500" },
    { name: "प्रांत संघचालक", count: 0, color: "bg-teal-500" },
    { name: "प्रांत कार्यवाह", count: 0, color: "bg-teal-500" },
    { name: "प्रांत प्रचारक", count: 0, color: "bg-teal-500" },
    { name: "विविध क्षेत्र", count: 0, color: "bg-teal-500" },
    { name: "बैठक शः संख्या", count: 0, color: "bg-teal-500" },
    { name: "बैठक शः सूची", count: 0, color: "bg-teal-500" },
  ]);

  // Load initial data from sessionStorage
  useEffect(() => {
    const storedUsers = sessionStorage.getItem("allUsers");
    // console.log("Stored Users:", storedUsers);
    if (storedUsers) {
      try {
        setAllUsers(JSON.parse(storedUsers));
      } catch (err) {
        console.error("Error parsing sessionStorage allUsers:", err);
        sessionStorage.removeItem("allUsers");
      }
    }
  }, []);

  // Fetch data when meetingType or selectedYear changes
  useEffect(() => {
    if (meetingType && selectedYear) {
      fetchDashboardData();
    }
  }, [meetingType, selectedYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      let res, userRes;
      if (meetingType === "प्रतिनिधि सभा") {
        res = await axios.get(`${API_URLS.ADMIN_DASHBOARD}/${selectedYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userRes = await axios.get(`${API_URLS.ALL_USERS}/${selectedYear}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("res", res);
        setDashboardData(res.data);
        setAllUsers(userRes.data);
        sessionStorage.setItem("allUsers", JSON.stringify(userRes.data));

        setCategories([
          {
            name: "संपूर्ण सूची",
            count: userRes.data.length,
            color: "bg-blue-500",
          },
          {
            name: "क्षेत्र/प्रांत संचालक",
            count: res.data.sanghachalakDataCount || 0,
            color: "bg-green-500",
          },
          {
            name: "क्षेत्र/प्रांत कार्यवाह",
            count: res.data.karyvahakDataCount || 0,
            color: "bg-purple-500",
          },
          {
            name: "क्षेत्र/प्रांत प्रचारक",
            count: res.data.pracharakDataCount || 0,
            color: "bg-orange-500",
          },
          {
            name: "शारीरिक प्रमुख",
            count: res.data.sharirikPramukDataCount || 0,
            color: "bg-red-500",
          },
          {
            name: "बौद्धिक प्रमुख",
            count: res.data.baudhikPramukhDataCount || 0,
            color: "bg-indigo-500",
          },
          {
            name: "सेवा प्रमुख",
            count: res.data.sevaPramukhDataCount || 0,
            color: "bg-pink-500",
          },
          {
            name: "व्यवस्था प्रमुख",
            count: res.data.vyavasthaPramukhDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "संपर्क प्रमुख",
            count: res.data.samparkPramukhDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "प्रचार प्रमुख",
            count: res.data.pracharPramukhDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "विभाग प्रचारक",
            count: res.data.vibhagPramukhDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "प्रतिनिधि",
            count: res.data.pratinidhiDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "पूर्व प्रांत प्रचारक",
            count: res.data.purvPrantPracharakDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "विशेष निमंत्रित",
            count: res.data.nimarntritDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "स्तर श: सूची",
            count: userRes.data.length,
            color: "bg-teal-500",
          },
          {
            name: "विविध क्षेत्र सूची",
            count: res.data.vividhkshetraDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "प्रांत श: सूची",
            count: res.data.prantShahaDataCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "महिला",
            count: res.data.femaleCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "बैठक शः सूची",
            count: res.data.baithakCount || 0,
            color: "bg-teal-500",
          },
          {
            name: "संघ/विविध क्षेत्र संख्या",
            count: userRes.data.length,
            color: "bg-teal-500",
          },
          {
            name: "प्रतिनिधी सभा बैठक शः संख्या (प्रांत श:)",
            count: userRes.data.length,
            color: "bg-teal-500",
          },
          {
            name: "प्रतिनिधी सभा स्तर शः संख्या (प्रांत श:)",
            count: userRes.data.length,
            color: "bg-teal-500",
          },
        ]);
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
        res = await axios.get(
          `${API_URLS.ADMIN_DASHBOARD_PRANT_PRACHARAK}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        userRes = await axios.get(
          `${API_URLS.ALL_USERS_PRANT_PRACHARAK}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDashboardData(res.data);
        setAllUsers(userRes.data);
        sessionStorage.setItem("allUsers", JSON.stringify(userRes.data));

        setPPCategories([
          {
            name: "संपूर्ण सूची",
            count: res.data.totalUsers || 0,
            color: "bg-blue-500",
          },
          {
            name: "अ.भा.अधिकारी",
            count: res.data.a_b_adhikariTotal || 0,
            color: "bg-green-500",
          },
          {
            name: "क्षेत्र प्रचारक",
            count: res.data.kshetraPracharkTotal || 0,
            color: "bg-orange-500",
          },
          {
            name: "क्षेत्र प्रचारक प्रमुख",
            count: res.data.kshetraPracharkPramukhTotal || 0,
            color: "bg-red-500",
          },
          {
            name: "प्रांत प्रचारक",
            count: res.data.prantPracharkTotal || 0,
            color: "bg-indigo-500",
          },
          {
            name: "विविध क्षेत्र",
            count: res.data.vividhKshetraTotal || 0,
            color: "bg-pink-500",
          },
          {
            name: "बैठक शः संख्या",
            count: res.data.baithakShahsankhya || 0,
            color: "bg-teal-500",
          },
          {
            name: "बैठक शः सूची",
            count: res.data.baithakShahSuchi || 0,
            color: "bg-teal-500",
          },
        ]);
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
        res = await axios.get(
          `${API_URLS.ADMIN_DASHBOARD_KARYAKARI_MANDAL}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("res", res.data);
        userRes = await axios.get(
          `${API_URLS.ALL_USERS_KARYAKARI_MANDAL}/${selectedYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res.data);
        console.log(userRes.data);
        setDashboardData(res.data);
        setAllUsers(userRes.data);
        sessionStorage.setItem("allUsers", JSON.stringify(userRes.data));

        setAbkCategories([
          {
            name: "संपूर्ण सूची",
            count: userRes.data.length || 0,
            color: "bg-blue-500",
          },
          {
            name: "अ.भा.अधिकारी",
            count: res.data.a_b_adhikariTotal || 0,
            color: "bg-green-500",
          },
          {
            name: "क्षेत्र संघचालक",
            count: res.data.kshtrasanchalkaTotal || 0,
            color: "bg-orange-500",
          },
          {
            name: "क्षेत्र कार्यवाह",
            count: res.data.kshetrakaryavah || 0,
            color: "bg-red-500",
          },
          {
            name: "क्षेत्र प्रचारक",
            count: res.data.kshetraPracharakTotal || 0,
            color: "bg-indigo-500",
          },
          {
            name: "क्षेत्र प्रचारक प्रमुख",
            count: res.data.kshetraPracharakPramukhTotal || 0,
            color: "bg-pink-500",
          },
          {
            name: "प्रांत संघचालक",
            count: res.data.prantsanghachalakTotal || 0,
            color: "bg-teal-500",
          },
          {
            name: "प्रांत कार्यवाह",
            count: res.data.prantkaryavahTotal || 0,
            color: "bg-teal-500",
          },
          {
            name: "प्रांत प्रचारक",
            count: res.data.prantPracharak_total || 0,
            color: "bg-teal-500",
          },
          {
            name: "विविध क्षेत्र",
            count: res.data.vividhKshetraTotal || 0,
            color: "bg-teal-500",
          },
          {
            name: "बैठक शः संख्या",
            count: res.data.baithakShahsankhya || 0,
            color: "bg-teal-500",
          },
          {
            name: "बैठक शः सूची",
            count: res.data.baithakShahSuchi || 0,
            color: "bg-teal-500",
          },
        ]);
      }
    } catch (err) {
      console.error("Dashboard Data Error:", err);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Compute display categories based on meeting type
  const displayCategories =
    meetingType === "प्रतिनिधि सभा"
      ? categories
      : meetingType === "प्रांत प्रचारक बैठक"
      ? ppCategories
      : meetingType === "अ.भा.कार्यकारी मंडल"
      ? abkCategories
      : [];

  // Define columns for different meeting types
  const getColumns = () => {
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
        "प्रांत प्रचारक बैठक",
        "क्षेत्र प्रचारक बैठक",
        "भौगोलिक पालक अधिकारी बैठक",
        "महिला / पुरुष",
        "उपस्थित / अनुपस्थित",
      ];
    }
    return [];
  };
  const columns = getColumns();

  const mapUserData = (user) => {
    const baseData = {
      id: user._id || "",
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
      gender:
        user.gender === "m" ? "पुरुष" : user.gender === "f" ? "महिला" : "",
      present: user.attendance === "p" ? "उपस्थित" : "अनुपस्थित",
    };

    if (meetingType === "प्रतिनिधि सभा") {
      return {
        ...baseData,
        abha: user.a_b_karykarini_baithak ? "1" : "0",
        kshetra: user.kshetra_k_p_baithak ? "1" : "0",
        prantka: user.prant_k_p_baithak ? "1" : "0",
        exec: user.karyakari_madal ? "1" : "0",
        sabha: user.pratinidhi_sabha ? "1" : "0",
        prantpr: user.prant_p_baithak ? "1" : "0",
        kshetrapr: user.kshetra_p_baithak ? "1" : "0",
        palak: user.palak_adhikari_baithak ? "1" : "0",
      };
    } else if (meetingType === "प्रांत प्रचारक बैठक") {
      return {
        ...baseData,
        gatividhi_toli_baithak: user.gatividhi_toli_baithak ? "1" : "0",
        a_b_baithak: user.a_b_baithak ? "1" : "0",
        prant_pracharak_baithak: user.prant_pracharak_baithak ? "1" : "0",
        kshetra_pracharak_baithak: user.kshetra_pracharak_baithak ? "1" : "0",
      };
    } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
      return {
        ...baseData,
        a_b_baithak: user.a_b_baithak ? "1" : "0",
        kshetra_karyawah_baithak: user.kshetra_karyawah_baithak ? "1" : "0",
        prant_karyawah_baithak: user.prant_karyawah_baithak ? "1" : "0",
        karyakari_mandal_baithak: user.karyakari_mandal_baithak ? "1" : "0",
        prant_pracharak_baithak: user.prant_pracharak_baithak ? "1" : "0",
        kshetra_pracharak_baithak: user.kshetra_pracharak_baithak ? "1" : "0",
        bhougolic_palak_adhikari_baithak: user.bhougolic_palak_adhikari_baithak
          ? "1"
          : "0",
      };
    }
    return baseData;
  };

  console.log("All Users:", allUsers);

  const DOWNLOAD_CONFIG = {
    "प्रतिनिधि सभा": {
      "संपूर्ण सूची": (users) => users,
      "स्तर श: सूची": (users) => users,
      "क्षेत्र/प्रांत संचालक": (users) =>
        users.filter((u) =>
          [
            "मा. क्षेत्र संघचालक",
            "मा. प्रांत संघचालक",
            "मा. सह क्षेत्र संघचालक",
            "मा. सह प्रांत संघचालक",
          ].includes(u.dayitva)
        ),
      "क्षेत्र/प्रांत कार्यवाह": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र कार्यवाह",
            "प्रांत कार्यवाह",
            "सह क्षेत्र कार्यवाह",
            "सह प्रांत कार्यवाह",
          ].includes(u.dayitva)
        ),
      "क्षेत्र/प्रांत प्रचारक": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र प्रचारक",
            "प्रांत प्रचारक",
            "सह क्षेत्र प्रचारक",
            "सह प्रांत प्रचारक",
          ].includes(u.dayitva)
        ),
      "शारीरिक प्रमुख": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र शारीरिक प्रमुख",
            "प्रांत शारीरिक प्रमुख",
            "सह क्षेत्र शारीरिक प्रमुख",
          ].includes(u.dayitva)
        ),
      "बौद्धिक प्रमुख": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र बौद्धिक प्रमुख",
            "प्रांत बौद्धिक प्रमुख",
            "सह क्षेत्र बौद्धिक प्रमुख",
          ].includes(u.dayitva)
        ),
      "सेवा प्रमुख": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र सेवा प्रमुख",
            "प्रांत सेवा प्रमुख",
            "सह क्षेत्र सेवा प्रमुख",
          ].includes(u.dayitva)
        ),
      "व्यवस्था प्रमुख": (users) =>
        users.filter((u) =>
          ["क्षेत्र व्यवस्था प्रमुख", "प्रांत व्यवस्था प्रमुख"].includes(
            u.dayitva
          )
        ),
      "संपर्क प्रमुख": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र संपर्क प्रमुख",
            "क्षेत्र सह संपर्क प्रमुख",
            "प्रांत संपर्क प्रमुख",
            "संपर्क प्रमुख",
            "सह क्षेत्र संपर्क प्रमुख",
          ].includes(u.dayitva)
        ),
      "प्रचार प्रमुख": (users) =>
        users.filter((u) =>
          [
            "क्षेत्र प्रचार प्रमुख",
            "प्रचार प्रमुख",
            "प्रांत प्रचार प्रमुख",
            "सह क्षेत्र प्रचार प्रमुख",
          ].includes(u.dayitva)
        ),
      "बैठक शः सूची": (users) => users,
      "विभाग प्रचारक": (users) =>
        users.filter((u) => u.dayitva === "विभाग प्रचारक"),
      प्रतिनिधि: (users) => users.filter((u) => u.dayitva === "प्रतिनिधि"),
      "पूर्व प्रांत प्रचारक": (users) =>
        users.filter((u) => u.dayitva === "पूर्व प्रांत प्रचारक"),
      "विशेष निमंत्रित": (users) =>
        users.filter((u) => u.dayitva === "विशेष निमंत्रित"),
      "विविध क्षेत्र सूची": (users) =>
        users.filter(
          (u) => u.star === "विविध क्षेत्र" && u.prakar === "विविध क्षेत्र"
        ),
      "प्रांत श: सूची": (users) =>
        users.filter((u) => u.star === "प्रांत" && u.prakar === "रा. स्व. संघ"),
      महिला: (users) => users.filter((u) => u.gender === "f"),
    },
    "प्रांत प्रचारक बैठक": {
      "संपूर्ण सूची": (users) => users,
      "अ.भा.अधिकारी": (users) => users.filter((u) => u.star === "अ. भा."),
      गतिविधि: (users) => users.filter((u) => u.star === "गतिविधि"),
      "क्षेत्र प्रचारक": (users) =>
        users.filter(
          (u) => u.star === "क्षेत्र" && u.dayitva === "क्षेत्र प्रचारक"
        ),
      "क्षेत्र प्रचारक प्रमुख": (users) =>
        users.filter(
          (u) => u.star === "क्षेत्र" && u.dayitva === "क्षेत्र प्रचारक प्रमुख"
        ),
      "प्रांत प्रचारक": (users) =>
        users.filter(
          (u) => u.star === "प्रांत" && u.dayitva === "प्रांत प्रचारक"
        ),
      "विविध क्षेत्र": (users) =>
        users.filter(
          (u) => u.star === "विविध क्षेत्र" && u.prakar === "विविध क्षेत्र"
        ),
    },
    "अ.भा.कार्यकारी मंडल": {
      "संपूर्ण सूची": (users) => users,
      "अ.भा.अधिकारी": (users) => users.filter((u) => u.star === "अ. भा."),
      गतिविधि: (users) => users.filter((u) => u.star === "गतिविधि"),
      "क्षेत्र संघचालक": (users) =>
        users.filter(
          (u) =>
            u.star === "क्षेत्र" &&
            ["मा. क्षेत्र संघचालक", "मा. सह क्षेत्र संघचालक"].includes(
              u.dayitva
            )
        ),
      "क्षेत्र कार्यवाह": (users) =>
        users.filter(
          (u) =>
            u.star === "क्षेत्र" &&
            ["क्षेत्र कार्यवाह", "सह क्षेत्र कार्यवाह"].includes(u.dayitva)
        ),
      "क्षेत्र प्रचारक": (users) =>
        users.filter(
          (u) =>
            u.star === "क्षेत्र" &&
            ["क्षेत्र प्रचारक", "सह क्षेत्र प्रचारक"].includes(u.dayitva)
        ),
      "क्षेत्र प्रचारक प्रमुख": (users) =>
        users.filter(
          (u) => u.star === "क्षेत्र" && u.dayitva === "क्षेत्र प्रचारक प्रमुख"
        ),
      "प्रांत संघचालक": (users) =>
        users.filter(
          (u) =>
            u.star === "प्रांत" &&
            ["मा. प्रांत संघचालक", "मा. सह प्रांत संघचालक"].includes(u.dayitva)
        ),
      "प्रांत कार्यवाह": (users) =>
        users.filter(
          (u) =>
            u.star === "प्रांत" &&
            ["प्रांत कार्यवाह", "सह प्रांत कार्यवाह"].includes(u.dayitva)
        ),
      "प्रांत प्रचारक": (users) =>
        users.filter(
          (u) =>
            u.star === "प्रांत" &&
            ["प्रांत प्रचारक", "सह प्रांत प्रचारक"].includes(u.dayitva)
        ),
      "विविध क्षेत्र": (users) =>
        users.filter(
          (u) => u.star === "विविध क्षेत्र" && u.prakar === "विविध क्षेत्र"
        ),
    },
  };

  const sanitizeSheetName = (name) =>
    name.replace(/[\\/:?*[\]]/g, "").slice(0, 31);

  const handleDownload = (catName, allUsers) => {
    const users = (DOWNLOAD_CONFIG[meetingType][catName] || (() => []))(
      allUsers
    ).map(mapUserData);
    let ws;
    if (meetingType === "प्रतिनिधि सभा") {
      ws = XLSX.utils.json_to_sheet(
        users.map((row, idx) => ({
          "अ. क्र.": idx + 1,
          नाम: row.name,
          स्तर: row.level,
          प्रकार: row.type,
          संगठन: row.org,
          दायित्व: row.duty,
          क्षेत्र: row.area,
          प्रांत: row.prant,
          केंद्र: row.center,
          "भ्रमणध्वनी 1": row.phone1,
          "भ्रमणध्वनी 2": row.phone2,
          "ई मेल": row.email,
          "अ. भा. कार्यकारिणी बैठक": row.abha,
          "क्षेत्र का. प्र. बैठक": row.kshetra,
          "प्रांत का. प्र. बैठक": row.prantka,
          "कार्यकारी मंडल": row.exec,
          "प्रतिनिधी सभा": row.sabha,
          "प्रांत प्र. बैठक": row.prantpr,
          "क्षेत्र प्र. बैठक": row.kshetrapr,
          "पालक अधिकारी बैठक": row.palak,
          "महिला / पुरुष": row.gender,
          "उपस्थित / अनुपस्थित": row.present,
        }))
      );
    } else if (meetingType === "प्रांत प्रचारक बैठक") {
      ws = XLSX.utils.json_to_sheet(
        users.map((row, idx) => ({
          "अ. क्र.": idx + 1,
          नाम: row.name,
          स्तर: row.level,
          प्रकार: row.type,
          संगठन: row.org,
          दायित्व: row.duty,
          क्षेत्र: row.area,
          प्रांत: row.prant,
          केंद्र: row.center,
          "भ्रमणध्वनी 1": row.phone1,
          "भ्रमणध्वनी 2": row.phone2,
          "ई मेल": row.email,
          "गतिविधि टोली बैठक 1&2 जुलाई": row.gatividhi_toli_baithak,
          "अ. भा. बैठक 3 जुलाई": row.a_b_baithak,
          "प्रांत प्रचारक बैठक 4-6 जुलाई": row.prant_pracharak_baithak,
          "क्षेत्र प्रचारक बैठक 7-8 जुलाई": row.kshetra_pracharak_baithak,
          "महिला / पुरुष": row.gender,
          "उपस्थित / अनुपस्थित": row.present,
        }))
      );
    } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
      ws = XLSX.utils.json_to_sheet(
        users.map((row, idx) => ({
          "अ. क्र.": idx + 1,
          नाम: row.name,
          स्तर: row.level,
          प्रकार: row.type,
          संगठन: row.org,
          दायित्व: row.duty,
          क्षेत्र: row.area,
          प्रांत: row.prant,
          केंद्र: row.center,
          "भ्रमणध्वनी 1": row.phone1,
          "भ्रमणध्वनी 2": row.phone2,
          "ई मेल": row.email,
          "अ. भा. बैठक": row.a_b_baithak,
          "क्षेत्र कार्यवाह बैठक": row.kshetra_karyawah_baithak,
          "प्रांत कार्यवाह बैठक": row.prant_karyawah_baithak,
          "प्रांत प्रचारक बैठक": row.prant_pracharak_baithak,
          "क्षेत्र प्रचारक बैठक": row.kshetra_pracharak_baithak,
          "भौगोलिक पालक अधिकारी बैठक": row.bhougolic_palak_adhikari_baithak,
          "महिला / पुरुष": row.gender,
          "उपस्थित / अनुपस्थित": row.present,
        }))
      );
    }

    const wb = XLSX.utils.book_new();
    const safeSheetName = sanitizeSheetName(catName);
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    XLSX.writeFile(wb, `${safeSheetName}.xlsx`);
  };

  const handleView = (catName, allUsers) => {
    const users = (DOWNLOAD_CONFIG[meetingType][catName] || (() => []))(
      allUsers
    ).map(mapUserData);

    if (
      meetingType === "प्रतिनिधि सभा" &&
      [
        "संघ/विविध क्षेत्र संख्या",
        "प्रतिनिधी सभा बैठक शः संख्या (प्रांत श:)",
        "प्रतिनिधी सभा स्तर शः संख्या (प्रांत श:)",
      ].includes(catName)
    ) {
      navigate("/pratinidhi-report", {
        state: { title: catName },
      });
    } else if (
      meetingType === "प्रांत प्रचारक बैठक" &&
      ["बैठक शः संख्या"].includes(catName)
    ) {
      navigate("/prant-pracharak-report", {
        state: { title: catName },
      });
    } else if (
      meetingType === "अ.भा.कार्यकारी मंडल" &&
      ["बैठक शः संख्या"].includes(catName)
    ) {
      navigate("/ab-baithak-report", {
        state: { title: catName },
      });
    } else {
      navigate("/report", {
        state: {
          title: catName,
          columns,
          data: users,
        },
      });
    }
  };

  const [csvFile, setCsvFile] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [csvSuccess, setCsvSuccess] = useState("");
  const [csvErrorRows, setCsvErrorRows] = useState([]);

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setCsvError("");
    setCsvSuccess("");
    setCsvErrorRows([]);
    setLoading(true);
    if (!csvFile) {
      setCsvError("कृपया CSV फ़ाइल चुनें।");
      console.log("Uploading file:", csvFile);
      return;
    }
    console.log(csvFile);
    setCsvLoading(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    try {
      let typeOfData = "";
      if (meetingType === "प्रतिनिधि सभा") {
        typeOfData = "pratinidhi-sabha";
      } else if (meetingType === "प्रांत प्रचारक बैठक") {
        typeOfData = "prant-pracharak";
      } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
        typeOfData = "karyakari-mandal";
      }
      console.log(`${API_URLS.UPLOAD_USERS}/${typeOfData}`);
      const token = localStorage.getItem("token");
      console.log("Uploading file:", csvFile);
      const res = await axios.post(
        `${API_URLS.UPLOAD_USERS}/${typeOfData}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setCsvSuccess("CSV सफलतापूर्वक अपलोड हो गई!");
      setCsvFile(null);
      setCsvErrorRows([]);
      await fetchDashboardData();
      // Optionally refresh user list here
    } catch (err) {
      setCsvSuccess("");
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          setCsvError(data.message || "CSV में त्रुटियाँ पाई गईं:");
          setCsvErrorRows(data.errors);
        } else if (data.message) {
          setCsvError(`त्रुटि: ${data.message}`);
        } else {
          setCsvError(`त्रुटि: ${JSON.stringify(data)}`);
        }
      } else {
        setCsvError("कुछ गलत हो गया, कृपया पुनः प्रयास करें।");
        console.log("Uploading file:", csvFile);
      }
    } finally {
      setCsvLoading(false);
      setLoading(false);
    }
  };
  const [selectedType, setSelectedType] = useState("");
  const [masterData, setMasterData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // Fetch master data for a given type (e.g. "stars", "prakars", etc.)

  const convertToCSVWithBOM = (data: any[]) => {
    if (!data.length) return "";

    const headers = ["_id", "name"]; // Only export these fields

    const csvRows = [
      headers.join(","), // CSV headers
      ...data.map((row) =>
        headers
          .map((field) => {
            const value = row[field] ?? "";
            return `"${value.toString().replace(/"/g, '""')}"`; // escape double quotes
          })
          .join(",")
      ),
    ];

    // Add UTF-8 BOM so Excel opens in correct encoding
    return "\uFEFF" + csvRows.join("\n");
  };

  // Call this on button click or download trigger
  const handleDownloadCSV = async (type: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(API_URLS.ALL_DROPDOWNS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dropdownData = res.data?.[type] || [];

      const csv = convertToCSVWithBOM(dropdownData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${type}_dropdown.csv`);
    } catch (err) {
      console.error("Error downloading dropdown CSV:", err);
    }
  };

  const based_on_meeting_type_background_color = () => {
    if (meetingType === "प्रतिनिधि सभा") {
      return "bg-gradient-to-r from-indigo-200 to-blue-100";
    } else if (meetingType === "प्रांत प्रचारक बैठक") {
      return "bg-gradient-to-r from-green-300 to-emerald-100";
    } else if (meetingType === "अ.भा.कार्यकारी मंडल") {
      return "bg-gradient-to-r from-red-200 to-pink-100";
    }
  };
  const labelMapping = {
    stars: "स्तर",
    prakars: "प्रकार",
    sanghatans: "संगठन",
    dayitvas: "दायित्व",
    kshetras: "क्षेत्र",
    prants: "प्रांत",
  };
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-transparent">
  //       <div className="relative w-12 h-12">
  //         <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //         <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`min-h-screen ${based_on_meeting_type_background_color()} `}
    >
      <Header />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              राष्ट्रीय स्वयंसेवक संघ - {meetingType} - {selectedYear}
            </h2>
            <p className="text-gray-600">अपडेटेड सूची</p>
          </div>
          <div className="flex gap-4">
            <select
              className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={meetingType}
              onChange={(e) => {
                setMeetingType(e.target.value);
                sessionStorage.setItem("meetingType", e.target.value);
              }}
            >
              <option value="प्रतिनिधि सभा">प्रतिनिधि सभा</option>
              <option value="प्रांत प्रचारक बैठक">प्रांत प्रचारक बैठक</option>
              <option value="अ.भा.कार्यकारी मंडल">अ.भा.कार्यकारी मंडल</option>
            </select>
            <select
              className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                sessionStorage.setItem("selectedYear", e.target.value);
              }}
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen bg-transparent">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-300 border-b-transparent rounded-full animate-[spin_2s_linear_infinite]"></div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="flex items-center justify-around">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Master
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="">
              {displayCategories.length === 0 ? (
                <p className="text-red-600">
                  No data available for the selected meeting type.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayCategories.map((category, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          {[
                            "संघ/विविध क्षेत्र संख्या",
                            "प्रतिनिधी सभा बैठक शः संख्या (प्रांत श:)",
                            "प्रतिनिधी सभा स्तर शः संख्या (प्रांत श:)",
                          ].includes(category.name) ||
                          ([
                            "अ.भा.कार्यकारी मंडल",
                            "प्रांत प्रचारक बैठक",
                          ].includes(meetingType) &&
                            category.name === "बैठक शः संख्या") ? (
                            <div className="mt-5"></div>
                          ) : (
                            `संख्या: ${category.count || 0}`
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => handleView(category.name, allUsers)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          {DOWNLOAD_CONFIG[meetingType][category.name] && (
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
                              onClick={() =>
                                handleDownload(category.name, allUsers)
                              }
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-start justify-between p-10 border border-gray-200 rounded-md">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700">
                    🚀 प्रारंभ करें
                  </h3>
                  <p className="text-gray-700 text-sm">
                    कृपया नीचे दिए गए बटन से <strong>डमी CSV फ़ाइल</strong>{" "}
                    डाउनलोड करें, उपयोगकर्ता जानकारी भरें और फिर अपलोड करें।
                  </p>
                  <a
                    href={
                      meetingType === "प्रांत प्रचारक बैठक"
                        ? prant_pracharak
                        : meetingType === "अ.भा.कार्यकारी मंडल"
                        ? karyakari_mandal
                        : Pratinidhi_sabha
                    }
                    download
                    className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                  >
                    📥 Download Dummy CSV File
                  </a>

                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mt-4">
                    <h4 className="text-sm font-semibold text-orange-800 mb-2">
                      📌 CSV अपलोड निर्देश:
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                      <li>CSV में नाम, मोबाइल, ईमेल, संगठन कॉलम होने चाहिए।</li>
                      <li>फ़ाइल का आकार 2MB से अधिक न हो।</li>
                      <li>गलत डेटा पर त्रुटि दिखाई जाएगी।</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 w-[40%]">
                  <h3 className="text-lg font-semibold text-orange-700">
                    📤 CSV अपलोड करें
                  </h3>
                  <form onSubmit={handleCsvUpload} className="space-y-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                    />
                    <Button
                      type="submit"
                      className="w-56 bg-orange-600 hover:bg-orange-700"
                      disabled={csvLoading}
                    >
                      {csvLoading
                        ? "⬆️ अपलोड हो रहा है..."
                        : "⬆️ CSV से उपयोगकर्ता जोड़ें"}
                    </Button>
                  </form>

                  {csvSuccess && (
                    <div className="text-green-600 text-sm font-medium bg-green-50 p-2 rounded-md border border-green-300">
                      ✅ {csvSuccess}
                    </div>
                  )}

                  {csvError && (
                    <div className="w-56 text-red-600 text-sm font-medium bg-red-50 p-2 rounded-md border border-red-300">
                      ❌ {csvError}
                    </div>
                  )}

                  {csvErrorRows.length > 0 && (
                    <div className="overflow-x-auto max-h-64 mt-2 border border-red-300 rounded-md bg-red-50 text-sm">
                      <table className="w-full">
                        <thead className="text-left bg-red-100 text-red-700">
                          <tr>
                            <th className="px-3 py-2">पंक्ति</th>
                            <th className="px-3 py-2">समस्या</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvErrorRows.map((row, idx) => (
                            <tr
                              key={idx}
                              className="text-red-600 border-t border-red-200"
                            >
                              <td className="px-3 py-2 font-semibold">
                                {row.row}
                              </td>
                              <td className="px-3 py-2">
                                {row.issues.join(", ")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>Masters</CardTitle>
                  <CardDescription>Generate and view Masters</CardDescription>
                </CardHeader>

                <div className="w-full flex flex-wrap items-center justify-start px-10 my-5 gap-10">
                  {Object.entries(labelMapping).map(([key, value]) => (
                    <div
                      key={key}
                      className="w-72 h-28 gap-2 bg-white rounded-lg flex flex-col justify-center"
                    >
                      <div className="w-full h-4 flex items-center justify-between px-5 font-semibold">
                        <h1 className="text-xl">{value}</h1>
                      </div>
                      <div className="w-full flex justify-between items-center px-5 mt-2">
                        <button
                          className="bg-white border rounded px-3 py-1 text-sm"
                          onClick={() => navigate(`/view-dropdown/${key}`)}
                        >
                          View
                        </button>
                        <button
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                          onClick={() => handleDownloadCSV(key)}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {meetingType === "प्रतिनिधि सभा" ? <AdminSettingsPage /> : ""}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

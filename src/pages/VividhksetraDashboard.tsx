import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Eye,
  Download,
  Plus,
} from "lucide-react";
import axios from "axios";
import { API_URLS } from "../services/api";

const VividhksetraDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const sanghatan = localStorage.getItem("sanghatanId") || "Unknown";
  const sanghatanname = localStorage.getItem("sanghatanName") || "Unknown";


  const [totalCount, setTotalCount] = useState(0);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAlldata = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URLS.SANGHATAN}/${sanghatan}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      console.log('Response:', response);
      setAllData(response.data);
      setTotalCount(response.data.length);

      sessionStorage.setItem(
        "sanghatanUserData",
        JSON.stringify(response.data)
      );
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "त्रुटि",
        description: "डेटा लोड करने में समस्या हुई",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlldata();
  }, []);

  const handleViewClick = async () => {
    await getAlldata(); //
    const titleName = localStorage.getItem('sanghatanName');
    console.log('Title Name:', titleName);
    // 👉 Navigate and send the user data to next page
    navigate("/sanghatanuserlist", { state: { 
      titleName: titleName, 
      columns:[],
      data: allData
     } });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">RSS</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Vividhksetra Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="capitalize">
                {sanghatanname}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
            {sanghatanname} - विविधक्षेत्र सूची
          </h2>
          <p className="text-gray-600">विविधक्षेत्रीय सदस्यों की जानकारी</p>
        </div>

        {/* Main Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">संपूर्ण सूची</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-orange-600">
                  {" "}
                  {loading ? "..." : totalCount}
                </span>
                <Badge variant="outline">सदस्य</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewClick}
                  disabled={loading || allData.length === 0}
                  className="flex items-center gap-2 flex-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Categories */}
      </main>
    </div>
  );
};

export default VividhksetraDashboard;

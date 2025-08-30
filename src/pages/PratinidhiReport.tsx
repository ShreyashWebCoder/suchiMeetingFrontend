import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Header } from "./Header";
import axios from "axios";
import { API_URLS } from "@/services/api";

// Types for dropdowns and userData
interface Prant {
  name: string;
}
interface Dropdowns {
  prants?: Prant[];
  [key: string]: any;
}
interface UserData {
  [key: string]: any;
}

// Table expects navState: { title, columns, data }
const PratinidhiReport = () => {
  const location = useLocation();
  const navState = location.state as {
    title?: string;
  };

  const title = navState?.title || "सूची";

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const [karyakariMadalData, setKaryakariMadalData] = useState<any[]>([]);
  const [karyakariMadalColumns, setKaryakariMadalColumns] = useState<string[]>(
    []
  );

  const [allDropDowns, setAllDropDowns] = useState<Dropdowns>({});

  // Get dropdowns and userData from sessionStorage
  const dropdowns: Dropdowns = JSON.parse(
    sessionStorage.getItem("allDropDowns") || "{}"
  );
  const userData: UserData[] = JSON.parse(
    sessionStorage.getItem("allUsers") || "[]"
  );

  // Fetch dropdowns if not in sessionStorage
  const getAllDropdowns = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    return axios.get(API_URLS.ALL_DROPDOWNS, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    if (dropdowns && Object.keys(dropdowns).length > 0) {
      setAllDropDowns(dropdowns);
    } else {
      getAllDropdowns().then((res) => {
        setAllDropDowns(res.data);
        sessionStorage.setItem("allDropDowns", JSON.stringify(res.data));
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!navState?.title || !allDropDowns?.prants) return;

    let tableData: any[] = [];
    let cols: string[] = [];

    // Table logic based on title
    switch (navState.title) {
      case "संघ/विविध क्षेत्र संख्या": {
        tableData = allDropDowns.prants.map((item: any) => ({
          "अ. क्र.": item.name,
          "रा. स्व. संघ": userData.filter(
            (user: any) =>
              user.pratinidhi_sabha === true &&
              user.attendance === "p" &&
              user.prant === item.name &&
              user.prakar === "रा. स्व. संघ"
          ).length,
          "विविध क्षेत्र": userData.filter(
            (user: any) =>
              user.pratinidhi_sabha === true &&
              user.attendance === "p" &&
              user.prant === item.name &&
              user.prakar === "विविध क्षेत्र"
          ).length,
          "Grand Total":
            userData.filter(
              (user: any) =>
                user.pratinidhi_sabha === true &&
                user.attendance === "p" &&
                user.prant === item.name &&
                user.prakar === "रा. स्व. संघ"
            ).length +
            userData.filter(
              (user: any) =>
                user.pratinidhi_sabha === true &&
                user.attendance === "p" &&
                user.prant === item.name &&
                user.prakar === "विविध क्षेत्र"
            ).length,
        }));
        const raSwSanghTotal = tableData.reduce(
          (sum, item) => sum + item["रा. स्व. संघ"],
          0
        );
        const vividhKshetraTotal = tableData.reduce(
          (sum, item) => sum + item["विविध क्षेत्र"],
          0
        );

        const grandTotal = tableData.reduce(
          (sum, item) => sum + item["Grand Total"],
          0
        );

        tableData.push({
          "अ. क्र.": "Grand Total",
          "रा. स्व. संघ": raSwSanghTotal,
          "विविध क्षेत्र": vividhKshetraTotal,
          "Grand Total": grandTotal,
        });
        cols = ["अ. क्र.", "रा. स्व. संघ", "विविध क्षेत्र", "Grand Total"];
        break;
      }
      case "प्रतिनिधी सभा बैठक शः संख्या (प्रांत श:)": {
        tableData = allDropDowns.prants.map((item: any) => ({
          "अ. क्र.": item.name,
          "अ. भा. कार्यकारिणी बैठक": userData.filter(
            (user: any) =>
              user.a_b_karykarini_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "क्षेत्र का. प्र. बैठक": userData.filter(
            (user: any) =>
              user.kshetra_k_p_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "प्रांत का. प्र. बैठक": userData.filter(
            (user: any) =>
              user.prant_k_p_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "कार्यकारी मंडल": userData.filter(
            (user: any) =>
              user.karyakari_madal === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "प्रतिनिधी सभा": userData.filter(
            (user: any) =>
              user.pratinidhi_sabha === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "प्रांत प्र. बैठक": userData.filter(
            (user: any) =>
              user.prant_p_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "क्षेत्र प्र. बैठक": userData.filter(
            (user: any) =>
              user.kshetra_p_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "पालक अधिकारी बैठक": userData.filter(
            (user: any) =>
              user.palak_adhikari_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
        }));
        const totals = (cols) =>
          tableData.reduce((sum, item) => sum + (item[cols] || 0), 0);
        tableData.push({
          "अ. क्र.": "Grand Total",
          "अ. भा. कार्यकारिणी बैठक": totals("अ. भा. कार्यकारिणी बैठक"),
          "क्षेत्र का. प्र. बैठक": totals("क्षेत्र का. प्र. बैठक"),
          "प्रांत का. प्र. बैठक": totals("प्रांत का. प्र. बैठक"),
          "कार्यकारी मंडल": totals("कार्यकारी मंडल"),
          "प्रतिनिधी सभा": totals("प्रतिनिधी सभा"),
          "प्रांत प्र. बैठक": totals("प्रांत प्र. बैठक"),
          "क्षेत्र प्र. बैठक": totals("क्षेत्र प्र. बैठक"),
          "पालक अधिकारी बैठक": totals("पालक अधिकारी बैठक"),
        });
        cols = [
          "अ. क्र.",
          "अ. भा. कार्यकारिणी बैठक",
          "क्षेत्र का. प्र. बैठक",
          "प्रांत का. प्र. बैठक",
          "कार्यकारी मंडल",
          "प्रतिनिधी सभा",
          "प्रांत प्र. बैठक",
          "क्षेत्र प्र. बैठक",
          "पालक अधिकारी बैठक",
        ];
        break;
      }
      case "प्रतिनिधी सभा स्तर शः संख्या (प्रांत श:)": {
        tableData = allDropDowns.prants.map((item: any) => ({
          "अ. क्र.": item.name,
          "अ. भा.": userData.filter(
            (user: any) =>
              user.star === "अ. भा." &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          क्षेत्र: userData.filter(
            (user: any) =>
              user.star === "क्षेत्र" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "पूर्व प्रांत प्रचारक": userData.filter(
            (user: any) =>
              user.star === "पूर्व प्रांत प्रचारक" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          प्रतिनिधी: userData.filter(
            (user: any) =>
              user.star === "प्रतिनिधी" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          प्रांत: userData.filter(
            (user: any) =>
              user.star === "प्रांत" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "विभाग प्रचारक": userData.filter(
            (user: any) =>
              user.star === "विभाग प्रचारक" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "विविध क्षेत्र": userData.filter(
            (user: any) =>
              user.star === "विविध क्षेत्र" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
          "विशेष निमंत्रित": userData.filter(
            (user: any) =>
              user.star === "विशेष निमंत्रित" &&
              user.attendance === "p" &&
              user.prant === item.name
          ).length,
        }));
        const totals = (cols) =>
          tableData.reduce((sum, item) => sum + (item[cols] || 0), 0);
        tableData.push({
          "अ. क्र.": "Grand Total",
          "अ. भा.": totals("अ. भा."),
          क्षेत्र: totals("क्षेत्र"),
          "पूर्व प्रांत प्रचारक": totals("पूर्व प्रांत प्रचारक"),
          प्रतिनिधी: totals("प्रतिनिधी"),
          प्रांत: totals("प्रांत"),
          "विभाग प्रचारक": totals("विभाग प्रचारक"),
          "विविध क्षेत्र": totals("विविध क्षेत्र"),
          "विशेष निमंत्रित": totals("विशेष निमंत्रित"),
        });
        cols = [
          "अ. क्र.",
          "अ. भा.",
          "क्षेत्र",
          "पूर्व प्रांत प्रचारक",
          "प्रतिनिधी",
          "प्रांत",
          "विभाग प्रचारक",
          "विविध क्षेत्र",
          "विशेष निमंत्रित",
        ];
        break;
      }

      default:
        break;
    }
    if (tableData.length && cols.length) {
      setColumns(cols);
      setData(tableData);
    }
  }, [navState?.title, allDropDowns]);

  console.log(navState);

  
  // Download Excel (use visible data and columns)
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((row: any) => {
        const obj: any = {};
        columns.forEach((col) => {
          obj[col] = row[col] ?? "";
        });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suchi");
    XLSX.writeFile(wb, "suchi.xlsx");
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
        <Card className="max-w-7xl mx-auto shadow-lg border-0">
          <CardHeader className="bg-gray-400 rounded-t-lg p-6">
            <CardTitle className="text-2xl text-white font-bold">
              {title}
            </CardTitle>
            {/* <div className="text-white mt-2 text-lg">कुल: {data?.length}</div> */}
            
          </CardHeader>
          <CardContent className="p-6">
            {/* Download button */}

            <div className=" flex items-center justify-between my-4 mt-10 mx-4">
              <h1 className="text-2xl font-bold ">प्रतिनिधि सभा </h1>
              <div className=" ">
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  डाउनलोड एक्सेल
                </Button>
              </div>
            </div>

            {/* Table for pratinidhi sabha */}
            <div className="overflow-auto border rounded-lg max-h-[60vh]">
              <table className="min-w-[1400px] w-full text-sm text-gray-900">
                <thead className="bg-gradient-to-r from-orange-100 to-blue-100 sticky top-0 z-10">
                  <tr>
                    {columns?.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 font-semibold border-b border-gray-200 whitespace-nowrap min-w-[140px] text-left"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns?.length}
                        className="text-center py-8 text-gray-400"
                      >
                        कोई डेटा नहीं मिला
                      </td>
                    </tr>
                  ) : (
                    data?.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className="hover:bg-blue-50 cursor-pointer transition"
                      >
                        {columns?.map((col) => (
                          <td
                            key={col}
                            className="px-3 py-2 border-b min-w-[140px] text-left"
                          >
                            {row[col] ?? ""}
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
      </div>
    </>
  );
};

export default PratinidhiReport;

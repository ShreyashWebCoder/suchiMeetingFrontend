import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Header } from "./Header";
import axios from "axios";
import { API_URLS } from "@/services/api";

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
const AbBaithakReport = () => {
  const location = useLocation();
  const navState = location.state as {
    title?: string;
  };

  const title = navState?.title || "सूची";

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [allDropDowns, setAllDropDowns] = useState<Dropdowns>({});

  const [karyakariMadalData, setKaryakariMadalData] = useState<any[]>([]);
  const [karyakariMadalColumns, setKaryakariMadalColumns] = useState<string[]>(
    []
  );
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
      case "बैठक शः संख्या": {
        tableData = allDropDowns.prants.map((item: any) => ({
          "अ. क्र.": item.name,
          "रा. स्व. संघ": userData.filter(
            (user: any) =>
              user.a_b_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name &&
              user.prakar === "रा. स्व. संघ"
          ).length,
          "विविध क्षेत्र": userData.filter(
            (user: any) =>
              user.a_b_baithak === true &&
              user.attendance === "p" &&
              user.prant === item.name &&
              user.prakar === "विविध क्षेत्र"
          ).length,
          "Grand Total":
            userData.filter(
              (user: any) =>
                user.a_b_baithak === true &&
                user.attendance === "p" &&
                user.prant === item.name &&
                user.prakar === "रा. स्व. संघ"
            ).length +
            userData.filter(
              (user: any) =>
                user.a_b_baithak === true &&
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
      default:
        break;
    }
    if (tableData.length && cols.length) {
      setColumns(cols);
      setData(tableData);
    }
  }, [navState?.title, allDropDowns]);

  // useEffect of कार्यकारी मंडल
  useEffect(() => {
    if (
      navState?.title === "कार्यकारी मंडल बैठक संख्या" ||
      !allDropDowns?.prants
    )
      return;

    let karyakariMadaltableData: any[] = [];
    let karyakariMadalcols: string[] = [
      "अ. क्र.",
      "रा. स्व. संघ",
      "विविध क्षेत्र",
      "Grand Total",
    ];

    karyakariMadaltableData = allDropDowns.prants.map(
      (prantItem: any, index: number) => {
        const usersInPrant = userData.filter(
          (user: any) =>
            user.prant === prantItem.name &&
            user.attendance === "p" &&
            user.karyakari_mandal_baithak === true
        );

        const raSwSanghCount = usersInPrant.filter(
          (user: any) => user.prakar === "रा. स्व. संघ"
        ).length;

        const vividhKshetraCount = usersInPrant.filter(
          (user: any) => user.prakar === "विविध क्षेत्र"
        ).length;

        return {
          "अ. क्र.": prantItem.name,
          "रा. स्व. संघ": raSwSanghCount,
          "विविध क्षेत्र": vividhKshetraCount,
          "Grand Total": raSwSanghCount + vividhKshetraCount,
        };
      }
    );

    // Add grand total row
    const raSwSanghTotal = karyakariMadaltableData.reduce(
      (sum, row) => sum + row["रा. स्व. संघ"],
      0
    );
    const vividhKshetraTotal = karyakariMadaltableData.reduce(
      (sum, row) => sum + row["विविध क्षेत्र"],
      0
    );

    karyakariMadaltableData.push({
      "अ. क्र.": "Grand Total",
      "रा. स्व. संघ": raSwSanghTotal,
      "विविध क्षेत्र": vividhKshetraTotal,
      "Grand Total": raSwSanghTotal + vividhKshetraTotal,
    });

    setKaryakariMadalColumns(karyakariMadalcols);
    setKaryakariMadalData(karyakariMadaltableData);
  }, [navState?.title, allDropDowns, userData]);

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

  const handleKaryakariMadalDownload = () => {
    const ws = XLSX.utils.json_to_sheet(
      karyakariMadalData.map((row: any) => {
        const obj: any = {};
        karyakariMadalColumns.forEach((col) => {
          obj[col] = row[col] ?? "";
        });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "KaryakariMadal");
    XLSX.writeFile(wb, "KaryakariMadal.xlsx");
  };

  // Calculate grand totals for display
  const grandTotal = data.find((row) => row["अ. क्र."] === "Grand Total")?.[
    "Grand Total"
  ] || 0;
  const karyakariMadalGrandTotal = karyakariMadalData.find(
    (row) => row["अ. क्र."] === "Grand Total"
  )?.["Grand Total"] || 0;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
        <Card className="max-w-7xl mx-auto shadow-lg border-0">
          <CardHeader className="bg-gray-400 rounded-t-lg p-6">
            <CardTitle className="text-2xl text-white font-bold">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 ">
            <div className="flex items-center justify-between mb-4">
              {/* Download button */}
              <h1 className="text-2xl font-bold">प्रतिनिधि सभा</h1>
              <div className="flex justify-end">
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  डाउनलोड एक्सेल
                </Button>
              </div>
            </div>
            <div className="my-2 text-lg font-bold">
              Total: {grandTotal}
            </div>

            {/* Table */}
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
            {/* Table for karyakari madal */}
            <div className="flex items-center justify-between my-4 mt-10 mx-4">
              <h1 className="text-2xl font-bold">कार्यकारी मंडल</h1>
              <div className="">
                <Button
                  onClick={handleKaryakariMadalDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  डाउनलोड एक्सेल
                </Button>
              </div>
            </div>
            <div className="my-2 text-lg font-bold">
              Grand Total: {karyakariMadalGrandTotal}
            </div>

            <div className="overflow-auto border rounded-lg max-h-[60vh]">
              <table className="min-w-[1400px] w-full text-sm text-gray-900">
                <thead className="bg-gradient-to-r from-orange-100 to-blue-100 sticky top-0 z-10">
                  <tr>
                    {karyakariMadalColumns?.map((col) => (
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
                  {karyakariMadalData?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={karyakariMadalColumns?.length}
                        className="text-center py-8 text-gray-400"
                      >
                        कोई डेटा नहीं मिला
                      </td>
                    </tr>
                  ) : (
                    karyakariMadalData?.map((row, idx) => (
                      <tr
                        key={row.id || idx}
                        className="hover:bg-blue-50 cursor-pointer transition"
                      >
                        {karyakariMadalColumns?.map((col) => (
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

export default AbBaithakReport;
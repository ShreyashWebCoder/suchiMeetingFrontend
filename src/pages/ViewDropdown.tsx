import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../services/api";
import { Header } from "./Header";
import {
  Table,
  Input,
  Switch,
  Space,
  Typography,
  Divider,
  Spin,
  Modal,
  message,
  Button,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface DataType {
  key: string;
  name: string;
  active: boolean;
  kshetra_id?: string; // Optional for prants
}

const ActiveCircle: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: active ? "#52c41a" : "#ff4d4f", // Green for Active, Red for Inactive
      marginRight: 8,
    }}
  />
);

const ViewDropdownPage = () => {
  const { type } = useParams<{ type: string }>();
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditKey, setCurrentEditKey] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);

  // Kshetra handling
  const [kshetras, setKshetras] = useState<{ _id: string; name: string; active: boolean }[]>([]);
  const [selectedKshetraId, setSelectedKshetraId] = useState<string | null>(null);

  // Define label mapping
  const labelMapping = {
    stars: "स्तर",
    prakar: "प्रकार",
    sanghatans: "संगठन",
    dayitvas: "दायित्व",
    kshetras: "क्षेत्र",
    prants: "प्रांत",
  };

  useEffect(() => {
    if (type) {
      fetchMasterData(type);
      if (type === "prants") {
        fetchKshetras();
      }
    }
  }, [type]);

  const fetchKshetras = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URLS.ALL_DROPDOWNS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKshetras(res.data.kshetras.filter((item: any) => item.active === true) || []);
    } catch (error) {
      console.error("Error fetching kshetras", error);
      message.error("Failed to fetch Kshetra list");
    }
  };

  const fetchMasterData = async (dropdownType: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URLS.ALL_DROPDOWNS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const selectedArray = res.data?.[dropdownType] || [];
      const transformed: DataType[] = selectedArray.map((item: any) => ({
        key: item._id || Date.now().toString(),
        name: item.name,
        active: item.active ?? true,
        kshetra_id: item.kshetra_id || undefined, // Include kshetra_id if available
      }));

      setTableData(transformed);
    } catch (err) {
      console.error(`Error fetching ${dropdownType} data`, err);
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const createMasterData = async (
    type: string,
    name: string,
    active: boolean
  ) => {
    try {
      const token = localStorage.getItem("token");

      const payload: any = { name, active };

      if (type === "prants") {
        if (!selectedKshetraId) {
          message.error("Please select a Kshetra");
          return;
        }
        payload.kshetra_id = selectedKshetraId;
      }

      const response = await axios.post(
        `${API_URLS.MASTER_DATA}/${type}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Master data create successfully");
      fetchMasterData(type);
      return response.data;
    } catch (error: any) {
      console.error("Error:", error);
      message.error(
        error?.response?.data?.message || "Failed to create master data"
      );
    }
  };

  const updateMasterData = async (type: string, key: string, name: string, active: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const payload: any = { name, active };

      if (type === "prants") {
        if (!selectedKshetraId && type === "prants") {
          message.error("Please select a Kshetra");
          return;
        }
        if (selectedKshetraId) {
          payload.kshetra_id = selectedKshetraId;
        }
      }

      const response = await axios.put(
        `${API_URLS.UPDATE_MASTER_DATA}/${type}/${key}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Master data updated successfully");
      fetchMasterData(type);
      return response.data;
    } catch (error: any) {
      console.error("Error:", error);
      message.error(
        error?.response?.data?.message || "Failed to update master data"
      );
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setNewName("");
    setNewActive(true);
    setSelectedKshetraId(null); // reset
    setFormVisible(true);
  };

  const openEditModal = (record: DataType) => {
    setEditMode(true);
    setCurrentEditKey(record.key);
    setNewName(record.name);
    setNewActive(record.active);
    if (type === "prants") {
      setSelectedKshetraId(record.kshetra_id || null);
    }
    setFormVisible(true);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;

    const newItem: DataType = {
      key: Date.now().toString(),
      name: newName.trim(),
      active: newActive,
    };

    await createMasterData(type!, newItem.name, newActive);
    setFormVisible(false);
    window.location.reload()
  };

  const handleUpdate = async () => {
    if (!newName.trim() || !currentEditKey) return;

    await updateMasterData(type!, currentEditKey, newName.trim(), newActive);
    setFormVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Text strong style={{ fontSize: 15 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Space>
          <ActiveCircle active={active} />
          <Text type={active ? "success" : "danger"}>
            {active ? "Active" : "Inactive"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
          Edit
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Title level={3} style={{ textTransform: "capitalize" }}>
            {labelMapping[type as keyof typeof labelMapping] || type} List
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAddModal}
            style={{ alignSelf: "flex-end" }}
          >
            Add {type?.slice(0, -1)}
          </Button>

          <Divider style={{ margin: "12px 0" }} />

          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            size="middle"
            rowKey="key"
            locale={{ emptyText: "No data" }} // Custom empty text
          />

          <Modal
            title={
              editMode
                ? `Edit ${type?.slice(0, -1)}`
                : `Add ${type?.slice(0, -1)}`
            }
            open={formVisible}
            onCancel={() => setFormVisible(false)}
            onOk={editMode ? handleUpdate : handleAdd}
            okText={editMode ? "Update" : "Add"}
            okButtonProps={{ disabled: !newName.trim() }}
            centered
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Input
                placeholder="Enter name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={32}
              />
              <Space align="center">
                <Text strong>Status:</Text>
                <Switch
                  checked={newActive}
                  onChange={setNewActive}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </Space>

              {type === "prants" && (
                <Select
                  showSearch
                  placeholder="Select Kshetra"
                  value={selectedKshetraId || undefined}
                  onChange={(value) => setSelectedKshetraId(value)}
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {kshetras.map((kshetra) => (
                    <Select.Option key={kshetra._id} value={kshetra._id}>
                      {kshetra.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Space>
          </Modal>
        </Space>
      </div>
    </>
  );
};

export default ViewDropdownPage;
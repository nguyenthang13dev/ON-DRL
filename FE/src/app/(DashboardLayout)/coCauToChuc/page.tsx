"use client";
import React, { useEffect, useState } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  TreeItem,
} from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css"; // CSS styles
import Style from "./page.module.css";
import { Button, Dropdown, Input, Popconfirm, Space } from "antd";
import Flex from "@/components/shared-components/Flex";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LockOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { departmentService } from "@/services/department/department.service";
import DepartmentForm from "./DepartmentForm";
import { Department, TreeNode } from "@/types/department/department";
import DepartmentConstant from "@/constants/DepartmentTypeConstant";
import { ItemType } from "antd/es/menu/interface";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Detail from "./Detail";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import UserList from "./UserList";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

const TreeComponent: React.FC = () => {
  //xử lý dữ liệu
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [treeNode, setTreeNode] = useState<TreeItem>({});
  const [searchString, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //xử lý ẩn hiện
  const [deleteId, setDeleteId] = useState<string>();
  const [lockId, setLockId] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [type, setType] = useState<"ADD_ROOT" | "ADD_CHILD" | "EDIT">(
    "ADD_ROOT"
  );

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
  };

  const handleCloseUserList = () => {
    setIsUserListVisible(false);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddNode = (rowInfo: any) => {
    const { path } = rowInfo;
    const newNode: TreeItem = {
      loai: DepartmentConstant.Department,
      isActive: true,
      path,
      id: uuidv4(),
    };
    setTreeNode(newNode);
    setIsModalVisible(true);
    setType("ADD_CHILD");
  };
  const handleSuccess = (treeNode: TreeItem) => {
    if (type === "ADD_ROOT") {
      const newTree = [...treeData, treeNode];
      toast.success("Thêm mới tổ chức thành công");
      setTreeData(newTree);
    }
    if (type === "ADD_CHILD") {
      const { path } = treeNode;
      const newTree = addNodeUnderParent({
        treeData,
        newNode: treeNode,
        parentKey: path[path.length - 1],
        getNodeKey: ({ treeIndex }: any) => treeIndex,
        expandParent: true,
      }).treeData;
      if (newTree) {
        toast.success("Thêm mới phòng ban thành công");
        setTreeData(newTree);
      }
    }
    if (type === "EDIT") {
      const { path } = treeNode;
      debugger;
      const newTree = changeNodeAtPath({
        treeData,
        path,
        getNodeKey: ({ treeIndex }: any) => treeIndex,
        newNode: treeNode,
      });
      toast.success("Lưu thành công");
      setTreeData(newTree);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const saveData: Department[] = flattenTreeData(treeData as TreeNode[]);
      const response = await departmentService.saveDepartmentChanges(saveData);
      if (response.status) {
        toast.success("Lưu các thay đổi thành công");
        fetchData();
      } else {
        toast.error("Lưu các thay dổi thất bại");
      }
    } catch (err) {
      toast.error("Lưu các thay dổi thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveNode = (rowInfo: any) => {
    const { path } = rowInfo;
    const newTree = removeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }: any) => treeIndex,
    });
    if (newTree) {
      toast.success("Xoá thành công");
      setTreeData(newTree);
    }
  };

  const handleEditNode = (currentNode: TreeItem) => {
    const { path, node } = currentNode;
    setTreeNode({ ...node, path });
    setIsModalVisible(true);
    setType("EDIT");
  };

  const handleLockNode = (rowInfo: any) => {
    const { path, node } = rowInfo;
    const updatedNode = {
      ...node,
      isActive: !node.isActive,
    };
    const newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }: any) => treeIndex,
      newNode: updatedNode,
    });
    toast.success(
      `${updatedNode.isActive ? "Mở khoá" : "Khoá"} tổ chức thành công`
    );
    setTreeData(newTree);
  };

  const handExpandNode = (rowInfo: any) => {
    const { path, node } = rowInfo;
    const updatedNode: TreeItem = {
      ...node,
      expanded: !node.expanded,
    };
    const newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey: ({ treeIndex }: any) => treeIndex,
      newNode: updatedNode,
    });
    setTreeData(newTree);
  };

  const handleSearch = (search: string) => {
    setSearchString(search);
  };

  const handleAddRootNode = () => {
    const newRootNode: TreeItem = {
      loai: DepartmentConstant.Organization,
      isActive: true,
      id: uuidv4(),
    };
    setTreeNode(newRootNode);
    setIsModalVisible(true);
    setType("ADD_ROOT");
  };

  const handleViewDetail = async (rowInfo: any) => {
    const treeItem: TreeItem = rowInfo.node;
    setTreeNode(treeItem);
    setIsDetailVisible(true);
    setIsUserListVisible(false);
  };

  const handleViewUserList = async (rowInfo: any) => {
    const treeItem: TreeItem = rowInfo.node;
    setTreeNode(treeItem);
    setIsUserListVisible(true);
    setIsDetailVisible(false);
  };

  function flattenTreeData(
    treeData: TreeNode[],
    parentId: string | null = null,
    level: number = 0
  ): Department[] {
    let flatArray: Department[] = [];

    treeData.forEach((item, index) => {
      const flatItem: Department = {
        id: item.id,
        name: item.title,
        code: item.code,
        diaDanh: item.diaDanh,
        shortName: item.shortName,
        parentId: parentId ?? undefined,
        priority: index + 1,
        level: level,
        loai: item.loai,
        isActive: item.isActive,
        capBac: item.capBac,
        soNgayTiepTrenThang: item.soNgayTiepTrenThang,
      };
      flatArray.push(flatItem);
      if (item.children && item.children.length > 0) {
        flatArray = flatArray.concat(
          flattenTreeData(item.children, item.id, level + 1)
        );
      }
    });

    return flatArray;
  }

  const fetchData = () => {
    departmentService
      .GetHierarchy()
      .then((res) => {
        if (res.status && res.data) {
          setTreeData(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleExport = async (type: "Organization" | "Department") => {
    const excelBase64 = await departmentService.exportExcel(type);
    downloadFileFromBase64(
      excelBase64.data,
      `Danh sách ${type === "Organization" ? "tổ chức" : "phòng ban"}.xlsx`
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AutoBreadcrumb />
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className="mb-2 flex-wrap justify-content-end"
      >
        <Input
          placeholder="Nhập từ khoá..."
          value={searchString}
          onChange={(e) => handleSearch(e.target.value)}
          className={Style.searchInput}
        />
        <div>
          <Button
            onClick={() => {
              handleAddRootNode();
            }}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="small"
          >
            Thêm tổ chức
          </Button>
          <Button
            onClick={() => {
              handleExport("Organization");
            }}
            variant="solid"
            color="cyan"
            icon={<DownloadOutlined />}
            size="small"
            style={{ margin: "10px 0 10px 10px" }}
          >
            Kết xuất tổ chức
          </Button>
          <Button
            onClick={() => {
              handleExport("Department");
            }}
            variant="solid"
            color="cyan"
            icon={<DownloadOutlined />}
            size="small"
            style={{ margin: "10px 0 10px 10px" }}
          >
            Kết xuất phòng ban
          </Button>

          <Button
            color="cyan"
            variant="outlined"
            loading={isLoading}
            onClick={handleSaveChanges}
            icon={<SaveOutlined />}
            style={{ margin: "10px" }}
          >
            Lưu thay đổi
          </Button>
        </div>
      </Flex>

      <div className={Style.customCardShadow}>
        <SortableTree
          treeData={treeData}
          onChange={(tree) => setTreeData(tree)}
          searchQuery={searchString}
          searchMethod={({ node, searchQuery }) =>
            searchQuery
              ? node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                node.code.toLowerCase().includes(searchQuery.toLowerCase())
              : true
          }
          generateNodeProps={(rowInfo) => {
            const department: TreeItem = rowInfo.node;

            const isOrganization =
              department.loai === DepartmentConstant.Organization
                ? true
                : false;

            const items: ItemType[] = [
              {
                label: "Chi tiết",
                key: "1",
                icon: <InfoCircleOutlined />,
                onClick: () => {
                  handleViewDetail(rowInfo);
                },
              },
              {
                label: "Thêm phòng ban",
                key: "2",
                icon: <PlusOutlined />,
                onClick: () => {
                  handleAddNode(rowInfo);
                },
              },
              {
                label: "Sửa",
                key: "3",
                icon: <EditOutlined />,
                onClick: () => {
                  handleEditNode(rowInfo);
                },
              },
              {
                label: "Xóa",
                key: "4",
                danger: true,
                icon: <DeleteOutlined />,
                onClick: () => setDeleteId(department.id),
              },
            ];

            //nếu là tổ chức thì thêm item lock/unlock vào menu
            // nếu là phòng ban thì thêm xem người dùng
            if (isOrganization) {
              items.push({
                label: department.isActive ? "Khoá" : "Mở khoá",
                key: "5",
                onClick: () => setLockId(department.id),
                icon: department.isActive ? (
                  <LockOutlined />
                ) : (
                  <UnlockOutlined />
                ),
              });
            } else {
              const newMenuItem = {
                label: "Cán bộ thuộc phòng ban",
                key: "5",
                icon: <UserOutlined />,
                onClick: () => {
                  handleViewUserList(rowInfo);
                },
              };
              items.splice(1, 0, newMenuItem);
            }

            //xử lý trigger chuột phải/trái vào node
            const handleLeftClick = (event: React.MouseEvent) => {
              if (event.button === 0) {
                handExpandNode(rowInfo);
              }
              if (event.button === 2) {
                event.preventDefault();
              }
            };
            const handleRightClick = (event: React.MouseEvent) => {
              event.preventDefault();
              const element = document.getElementById(department.id);
              if (element) {
                element.click();
              }
            };

            return {
              title: (
                <div
                  className={Style.treeNode}
                  onMouseDown={handleLeftClick}
                  onContextMenu={handleRightClick}
                >
                  <span
                    style={{
                      color: `${department.isActive ? "#3E82F7" : "red"}`,
                    }}
                  >
                    {department.title} <sub>{department.code}</sub>
                  </span>
                  <div>
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <Button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        color="primary"
                        size="middle"
                        type="text"
                        style={{ display: "block" }}
                        id={department.id}
                      >
                        <Space>
                          <MoreOutlined />
                        </Space>
                      </Button>
                    </Dropdown>

                    <Popconfirm
                      title="Xác nhận xóa"
                      description={
                        <span>
                          Bạn có chắc muốn xoá{" "}
                          {isOrganization ? "tổ chức" : "phòng ban"} này không?
                        </span>
                      }
                      okText="Xóa"
                      cancelText="Hủy"
                      open={deleteId === department.id}
                      onConfirm={() => {
                        handleRemoveNode(rowInfo);
                        setDeleteId(undefined);
                      }}
                      onCancel={() => setDeleteId(undefined)}
                    />
                    <Popconfirm
                      open={lockId === department.id}
                      title={`Xác nhận ${
                        department.isActive ? "khoá" : "mở khoá"
                      }`}
                      description={
                        <span>
                          Bạn có chắc muốn{" "}
                          {department.isActive ? "khoá" : "mở khoá"} tổ chức này
                          không?
                        </span>
                      }
                      okText={"Xác nhận"}
                      okButtonProps={{
                        color: "danger",
                        type: "default",
                        variant: "filled",
                      }}
                      cancelText="Hủy"
                      onConfirm={() => {
                        handleLockNode(rowInfo);
                        setLockId(undefined);
                      }}
                      onCancel={() => setLockId(undefined)}
                    />
                  </div>
                </div>
              ),
            };
          }}
        />
        <Detail
          isOpen={isDetailVisible}
          department={treeNode}
          onClose={handleCloseDetail}
        />

        <UserList
          isOpen={isUserListVisible}
          department={treeNode}
          onClose={handleCloseUserList}
        />
      </div>

      <DepartmentForm
        isOpen={isModalVisible}
        data={treeNode}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default TreeComponent;

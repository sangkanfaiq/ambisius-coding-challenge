import { TipLabel, WrapWithTitle } from "@components/custom";
//@ts-ignore
import toRupiah from '@develoka/angka-rupiah-js';
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Space,
  Divider,
  Popconfirm,
  Modal,
  Form,
  Upload,
  Spin,
  Input,
  notification,
  Image,
  Tag,
  Select,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductById,
  getProducts,
  uploadImageBB,
} from "pages/api/config";

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

enum FORM_STATE {
  EDIT = "EDIT",
  CREATE = "CREATE",
}

const statusOption = [
  { label: "Available", text: "Available", value: "1" },
  { label: "Out of stock", text: "Out of stock", value: "2" },
];

const ProductsPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataProducts, setDataProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [fileImageUrl, setFileImageUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({ id: "" });
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
  });

  const [form_input] = Form.useForm();

  useEffect(() => {
    doQueryData(queryParams);
  }, [queryParams]);

  async function doQueryData(params: any) {
    try {
      setIsLoading(true);
      const res = await getProducts(params);
      const data = res.data;

      const formattedDataProducts: any = [];

      for (const i in data) {
        const sanitizeData = {
          key: i,
          id: data[i].id,
          name: data[i].name,
          status: data[i].status,
          image: data[i].image,
          price: data[i].price,
        };
        formattedDataProducts.push(sanitizeData);
      }
      setDataProducts(formattedDataProducts);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const columns: any = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      fixed: "left",
      render: (text: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      render: (text: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (text: any) => {
        function renderImage() {
          if (text) {
            return (
              <Image
                src={text}
                width={100}
                height={150}
                style={{ objectFit: "contain" }}
              />
            );
          }
          return "-";
        }
        return renderImage();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (text: any) => {
        let status = "";
        let color = "";
        if (text === "1") {
          status = "Available";
          color = "success";
        } else if (text === "2") {
          status = "Out of stock";
          color = "error";
        }
        return status ? <Tag color={color}>{status}</Tag> : "-";
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return <div>{text ? `${toRupiah(text, {dot: '.', floatingPoint: 0, formal: false})}` : "-"}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: 100,
      fixed: "right",
      render: (record: any) => {
        return (
          <Space>
            <a title="Edit" onClick={() => openEdit(record)}>
              <EditOutlined style={{ color: "#1677FF" }} />
            </a>
            <Divider type="vertical" />
            <Popconfirm
              placement="left"
              title="Confirm to delete?"
              onConfirm={() => handleDelete(record)}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <a title="Delete">
                <DeleteOutlined style={{ color: "#1677FF" }} />
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  async function handleUpload(info: any) {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);

    const file = fileList && fileList[0]?.originFileObj;

    try {
      setUploading(true);
      const res = await uploadImageBB(file);
      if (res.status === 200) {
        setFileImageUrl(res.data.display_url);
      }
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  function handleAdd() {
    form_input.setFieldsValue({
      state: FORM_STATE.CREATE,
    });
    setShowModal(true);
  }

  async function openEdit(record: any) {
    setShowModal(true);
    setSelectedProduct({ id: record.id });
    record["state"] = FORM_STATE.EDIT;

    try {
      const res = await getProductById(record.id);
      const data = res.data;

      form_input.setFieldsValue({
        ...data,
        state: FORM_STATE.EDIT,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(record: any) {
    console.log(record);
    try {
      const res = await deleteProduct(record.id);
      if (res && res.status === 200) {
        api.success({
          message: "Success",
          description: "Data has been successfully deleted",
        });
        await doQueryData(queryParams);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handlePagination(page: any, pageSize: any) {
    setQueryParams({
      ...queryParams,
      page: page,
      limit: pageSize,
    });
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const fields = await form_input.validateFields();
      const payload = {
        name: fields.name,
        status: fields.status,
        image: fileImageUrl || fields.image,
        price: fields.price,
      };

      if (fields.state === FORM_STATE.EDIT) {
        const product_id = selectedProduct.id;
        const res = await editProduct(product_id, payload);
        if (res.status === 200) {
          api.success({
            message: "Success",
            description: "Data has been successfully updated",
          });
          setSelectedProduct({ id: "" });
        }
      } else {
        const res = await addProduct(payload);
        if (res.status === 201) {
          api.success({
            message: "Success",
            description: "Data has been successfully added",
          });
        }
      }
      form_input.resetFields();
      setShowModal(false);
      setLoading(false);
      await doQueryData(queryParams);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function closeModal() {
    form_input.resetFields();
    setSelectedProduct({ id: "" });
    setShowModal(false);
  }

  function renderModalContent() {
    return (
      <Form {...formLayout} form={form_input}>
        <Form.Item name="state" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Image"
          rules={[
            {
              required: selectedProduct && selectedProduct.id ? false : true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onPreview={() => false}
            onChange={handleUpload}
          >
            {renderUploadButton()}
          </Upload>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: selectedProduct && selectedProduct.id ? false : true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            {
              required: selectedProduct && selectedProduct.id ? false : true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <Select options={statusOption} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: selectedProduct && selectedProduct.id ? false : true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <InputNumber addonBefore="Rp" style={{width: "80%"}}/>
        </Form.Item>
      </Form>
    );
  }

  function renderUploadButton() {
    if (fileList.length > 0) {
      if (uploading) {
        return (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
        );
      }
      if (selectedProduct && selectedProduct.id) {
        return (
          <div>
            <PlusOutlined />
            <div className="mt-2">Upload</div>
          </div>
        );
      } else {
        return null;
      }
    } else {
      return (
        <div>
          <PlusOutlined />
          <div className="mt-2">
            {uploading ? (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
              />
            ) : (
              "Upload"
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen">
      {contextHolder}
      <div className="p-4 bg bg-white">
        <TipLabel title="Menu" />
      </div>
      <div className="p-4 bg bg-white mt-2.5">
        <WrapWithTitle
          title="List Menu"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Product
            </Button>
          }
        >
          <Table
            loading={isLoading}
            columns={columns}
            dataSource={dataProducts}
            pagination={{
              showSizeChanger: true,
              defaultCurrent: 1,
              onChange: handlePagination,
              current: queryParams.page,
              total: dataProducts.length,
              pageSize: queryParams.limit,
              showTotal: (total: any, range: any) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </WrapWithTitle>
      </div>

      <Modal
        title={`${selectedProduct && selectedProduct.id ? "Edit" : "Add"} Products`}
        width={650}
        confirmLoading={loading}
        open={showModal}
        onOk={handleSubmit}
        onCancel={closeModal}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default ProductsPage;

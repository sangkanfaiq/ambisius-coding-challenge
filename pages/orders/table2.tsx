import { Button, Form, Input, Modal, Select, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { WrapWithTitle } from "@components/custom";
//@ts-ignore
import toRupiah from "@develoka/angka-rupiah-js";
import _, { isLength } from "lodash";
import {
  addOrder,
  getOrders,
  getProductById,
  getProducts,
} from "pages/api/config";

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
};

const listQuantity = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "11", value: 11 },
];

const Table2 = ({ tableNumber }: any) => {
  const [api, contextHolder] = notification.useNotification();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listProduct, setListProduct] = useState<any>([]);
  const [dataOrders, setDataOrders] = useState<any>([]);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
  });

  const [form_add] = Form.useForm();

  useEffect(() => {
    doInitialQueryData();
  }, []);

  useEffect(() => {
    doQueryData(queryParams);
  }, [queryParams]);

  async function doInitialQueryData() {
    const res = await getProducts({ page: 1, limit: 100 });

    const dataProduct = res.data;
    const formattedListProduct: any = [];

    for (const data of dataProduct) {
      if (data.status === "1") {
        formattedListProduct.push({
          label: data.name,
          value: data.id,
        });
      }
    }
    setListProduct(formattedListProduct);
  }

  async function doQueryData(params: any) {
    try {
      setIsLoading(true);
      const res = await getOrders(params);
      const data = res.data;
  
      const formattedDataOrders: any = [];
  
      for (const order of data) {
        if (order.table === "2") {
          const key = order.menu.name;
  
          let value = formattedDataOrders.find((order: any) => order.key === key);
  
          if (!value) {
            value = {
              key,
              name: order.menu.name,
              quantity: order.menu.quantity,
              price: order.menu.price,
            };
            formattedDataOrders.push(value);
          } else {
            value.quantity += order.menu.quantity;
            value.price = order.menu.price;
          }
        }
      }
  
      setDataOrders(formattedDataOrders);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      render: (text: any) => {
        return <div>{renderProductName(text)}</div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      render: (text: any) => {
        return <div>{text ? `${text}` : "-"}</div>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text: any) => {
        return (
          <div>
            {text
              ? `${toRupiah(text, {
                  dot: ".",
                  floatingPoint: 0,
                  formal: false,
                })}`
              : "-"}
          </div>
        );
      },
    },
  ];

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    form_add.resetFields();
    setShowModal(false);
  }

  function handlePagination(page: any, pageSize: any) {
    setQueryParams({
      ...queryParams,
      page: page,
      limit: pageSize,
    });
  }

  async function handleChange(value: any) {
    try {
      const res = await getProductById(value);
      const data = res && res.data;

      form_add.setFieldsValue({ price: data.price });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const fields = await form_add.validateFields();
      const payload = {
        menu: {
          name: fields.name,
          quantity: fields.quantity,
          price: fields.price,
        },
        table: tableNumber,
      };

      const res = await addOrder(payload);
      if (res.status === 201) {
        api.success({
          message: "Success",
          description: `Order for table ${tableNumber} has been added`,
        });
      }
      form_add.resetFields();
      setShowModal(false);
      setLoading(false);
      await doQueryData(queryParams);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function renderProductName(text: any) {
    const product = _.find(listProduct, { value: text });
    if (product) {
      return product.label;
    }
  }

  function renderModalContent() {
    return (
      <Form {...formLayout} form={form_add}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <Select
            placeholder="Select menu"
            options={listProduct}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item name="price" label="Price" valuePropName="value">
          <Input style={{ width: "50%" }} addonBefore="Rp" disabled />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            {
              required: true,
              message: "Required! Field cannot be empty.",
            },
          ]}
        >
          <Select options={listQuantity} style={{ width: "50%" }} />
        </Form.Item>
      </Form>
    );
  }

  return (
    <>
      {contextHolder}
      <WrapWithTitle
        title={`List Orders Table ${tableNumber}`}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Add Orders
          </Button>
        }
      >
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={dataOrders}
          pagination={{
            showSizeChanger: true,
            defaultCurrent: 1,
            onChange: handlePagination,
            current: queryParams.page,
            total: dataOrders.length,
            pageSize: queryParams.limit,
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </WrapWithTitle>

      <Modal
        title="Add orders"
        confirmLoading={loading}
        open={showModal}
        onOk={handleSubmit}
        onCancel={closeModal}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default Table2;

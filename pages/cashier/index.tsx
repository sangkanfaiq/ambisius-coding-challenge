import { TipLabel } from "@components/custom";
import { Button, Modal, Table, Typography, Result } from "antd";
import { deleteOrders, getOrders, getProducts } from "pages/api/config";
import React, { useEffect, useState } from "react";
//@ts-ignore
import toRupiah from "@develoka/angka-rupiah-js";
import _ from "lodash";

const { Title, Text } = Typography;

const CashierPage = () => {
  const [dataOrders, setDataOrders] = useState<any>([]);
  const [allDataOrders, setAllDataOrders] = useState<any>([]);
  const [listProduct, setListProduct] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [result, setResult] = useState(false);

  useEffect(() => {
    doQueryData();
  }, []);

  async function doQueryData() {
    try {
      setIsLoading(true);
      const res = await getOrders({ page: 1, limit: 100 });
      const res2 = await getProducts({ page: 1, limit: 100 });

      const data = res.data;
      const dataProduct = res2.data;

      const formattedDataOrders: any = [];
      const formattedListProduct: any = [];

      for (const data of dataProduct) {
        if (data.status === "1") {
          formattedListProduct.push({
            label: data.name,
            value: data.id,
          });
        }
      }

      // Filter data pesanan untuk hanya menampilkan Table 1, Table 2, dan Table 3
      const filteredDataOrders = data.filter((order: any) => {
        return (
          order.table === "1" || order.table === "2" || order.table === "3"
        );
      });

      for (const order of filteredDataOrders) {
        const totalQuantity = order.menu.quantity;
        formattedDataOrders.push({
          key: order.id,
          table: order.table,
          quantity: totalQuantity,
          price: order.menu.price,
          name: order.menu.name,
        });
      }

      // Create an array of formattedDataOrders objects with unique keys
      const uniqueTables = _.uniqBy(formattedDataOrders, uniqueKeyFunction);

      setAllDataOrders(formattedDataOrders);
      setDataOrders(uniqueTables);
      setListProduct(formattedListProduct);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function uniqueKeyFunction(object: any) {
    return object.table;
  }

  function openModal(record: any) {
    setShowModal(true);
    const tableOrders = allDataOrders.filter(
      (data: any) => data.table === record.table
    );
    setSelectedTable(tableOrders);
  }

  const columns: any = [
    {
      title: "List Table",
      dataIndex: "table",
      key: "table",
      fixed: "left",
      render: (text: any) => {
        return <div>{text ? `Table ${text}` : "-"}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      width: 100,
      render: (record: any) => {
        return (
          <Button
            type="primary"
            style={{ width: "80px" }}
            onClick={() => openModal(record)}
          >
            Pay
          </Button>
        );
      },
    },
  ];

  const columnsDetail: any = [
    {
      title: "Menu",
      dataIndex: "name",
      key: "name",
      render: (text: any) => {
        return <div>{text ? renderProductName(text) : "-"}</div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any) => {
        return <div>{text ? `x${text}` : "-"}</div>;
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

  async function handlePay(record: any) {
    console.log(record);

    const itemsToDeleteByTable = record.reduce((acc: any, item: any) => {
      const table = item.table;
      if (!acc[table]) {
        acc[table] = [];
      }
      acc[table].push(item.key);
      return acc;
    }, {});

    for (const table in itemsToDeleteByTable) {
      if (itemsToDeleteByTable.hasOwnProperty(table)) {
        const keysToDelete = itemsToDeleteByTable[table];
        for (const keyToDelete of keysToDelete) {
          try {
            const res = await deleteOrders(keyToDelete);

            if (res.status === 200) {
              setResult(true);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  async function handleClose() {
    setShowModal(false)
    setResult(false)
    await doQueryData()
  }

  function renderProductName(text: any) {
    const product = _.find(listProduct, { value: text });
    if (product) {
      return product.label;
    }
  }

  function renderSummary() {
    const total = _.reduce(
      selectedTable,
      (acc, data) => {
        return acc + data.quantity * data.price;
      },
      0
    );
    return (
      <>
        <div className="mt-10"></div>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <Title level={5} style={{ fontSize: 14 }}>
              Total
            </Title>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Title level={5} style={{ fontSize: 14 }}>
              {toRupiah(total, { dot: ".", floatingPoint: 0, formal: false })}
            </Title>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  }

  function renderContent() {
    if (result) {
      return (
        <Result
          status="success"
          title="Thank you For Your Orders."
          subTitle="We look forward to your next visit!"
          extra={[
            <Button type="primary" onClick={handleClose}>
              Clean & Empty The Table
            </Button>
          ]}
        />
      );
    } else {
      return (
        <Table
          className="markedTable"
          columns={columnsDetail}
          dataSource={selectedTable}
          pagination={false}
          summary={renderSummary}
        />
      );
    }
  }

  function renderTextPay() {
    if (result) {
      return <></>;
    } else {
      return (
        <Button type="primary" onClick={() => handlePay(selectedTable)}>
          Pay now
        </Button>
      );
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 bg bg-white">
        <TipLabel title="Cashier" />
      </div>

      <div className="p-4 bg bg-white mt-2.5">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={dataOrders}
          pagination={false}
        />
      </div>

      <Modal
        title=""
        width={"70%"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={renderTextPay()}
      >
        {renderContent()}
      </Modal>
    </div>
  );
};

export default CashierPage;

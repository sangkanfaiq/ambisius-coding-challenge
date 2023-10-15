import { TipLabel, WrapWithTitle } from "@components/custom";
import { Card, List, Space, Typography } from "antd";
import { getOrders, getProducts } from "pages/api/config";
import React, { useState, useEffect } from "react";
import _ from "lodash";

const { Text } = Typography;

const KitchenPage = () => {
  const [dataOrders, setDataOrders] = useState<any>([]);
  const [listProduct, setListProduct] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    doQueryData();
  }, []);

  async function doQueryData() {
    try {
      setIsLoading(true);
      const res = await getOrders({ page: 1, limit: 100 });
      const res2 = await getProducts({ page: 1, limit: 100 });

      const data = res && res.data;
      const dataProduct = res2 && res2.data;

      const formattedListProduct: any = [];
      const formattedDataOrders: any = [];

      for (const i in data) {
        if (data.hasOwnProperty(i)) {
          const sanitizeData = {
            key: i,
            name: data[i].menu.name,
            quantity: data[i].menu.quantity,
            table: data[i].table,
          };
          formattedDataOrders.push(sanitizeData);
        }
      }

      for (const data of dataProduct) {
        if (data.status === "1") {
          formattedListProduct.push({
            label: data.name,
            value: data.id,
          });
        }
      }

      const groupedDataOrders = formattedDataOrders.reduce(
        (acc: any, order: any) => {
          const tableNumber = order.table;
          if (!acc[tableNumber]) {
            acc[tableNumber] = [];
          }
          acc[tableNumber].push(order);
          return acc;
        },
        {}
      );

      const formattedDataTable = Object.keys(groupedDataOrders).map(
        (tableNumber) => {
          const orders = groupedDataOrders[tableNumber];
          return {
            key: tableNumber,
            title: `Table ${tableNumber}`,
            orders: orders,
          };
        }
      );

      setListProduct(formattedListProduct);
      setDataOrders(formattedDataTable);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function renderProductName(text: any) {
    const product = _.find(listProduct, { value: text });
    if (product) {
      return product.label;
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 bg bg-white">
        <TipLabel title="Kitchen" />
      </div>

      <div className="p-4 bg bg-white mt-2.5">
        <WrapWithTitle title="List Orders">
          <List
            className="mt-10"
            grid={{ gutter: 16, column: 4 }}
            dataSource={dataOrders}
            renderItem={(item: any) => (
              <List.Item>
                <Card title={item.title}>
                  <Space direction="vertical" size={15}>
                    {item?.orders?.map((order: any) => (
                      <Space key={order.key}>
                        <Text>{`x${order.quantity}`}</Text>
                        <Text>{renderProductName(order.name)}</Text>
                      </Space>
                    ))}
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </WrapWithTitle>
      </div>
    </div>
  );
};

export default KitchenPage;

import React from "react";
import { Space, Typography } from "antd";

const { Title, Text } = Typography;

export const WrapWithTitle = ({ title, extra, children }: any) => {
  return (
    <div>
      <div className="flex justify-between mb-4 mt-12">
        <Text style={{ fontSize: 18 }}>{title}</Text>
        <div>{extra}</div>
      </div>
      {children}
    </div>
  );
};

export const TipLabel = ({ title }: any) => {
  return (
    <div className="flex flex-col">
      <Space>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
      </Space>
    </div>
  );
};

// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, notification, Form, Input } from 'antd';
import type { FormProps } from 'antd';

const Create: React.FC = () => {
  const savedToken = localStorage.getItem("token");
  console.log('savedToken:', savedToken);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };

  type FieldType = {
    name?: string;
    description?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values:", values);
    
    axios.get("https://task-manager.codionslab.com/api/v1/admin/project/create", values, options)
    .then(response=>{
      console.log("response:", response);
      notification.success({message: response})
    }).catch(error=>{notification.error(error)})
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Project Name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create New project
          </Button>
        </Form.Item>
      </Form> 
    </>
  );
};

export default Create;

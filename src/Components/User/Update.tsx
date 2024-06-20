import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';

type FieldType = {
  name?: string;
  email? : string;
  password?: string;
  remember?: string;
};
const location = useLocation()
// console.log("location.state:", location.state);


const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  // console.log('Success:', values);
  // const navigate = useNavigate();
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const Update: React.FC = () => (
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
      rules={[{ required: true, message: 'Please input your name!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item<FieldType>
      name="remember"
      valuePropName="checked"
      wrapperCol={{ offset: 8, span: 16 }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default Update;
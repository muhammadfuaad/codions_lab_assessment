import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router';

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean; 
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    axios.post('https://task-manager.codionslab.com/api/v1/login', values)
      .then(response => {
        console.log('response.data:', response.data);
        const token = response.data.data.token;
        const user = response.data.data.user;
        localStorage.setItem("token", `${token}`);
        localStorage.setItem('user', JSON.stringify(user));
        const savedToken = localStorage.getItem("token");
        console.log('savedToken:', savedToken);
        console.log('localStorage:', localStorage);

  
        console.log('token:', token);
        console.log('(login api) user:', user);
  
        notification.success({
          message: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
  
        navigate("/profile");
      })
      .catch(error => {
        console.error('error', error);
  
        notification.error({
          message: 'Login Failed',
          description: 'Please check your credentials and try again.',
        });
      });
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
  <div className='bg-gray-100 p-12 rounded-xl'>
    <h2 className='font-bold text-2xl mb-16'>Login</h2>
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
  </div>
)};

export default Login;

import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Corrected import

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  remember?: boolean; // Changed to boolean
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = location.state ? location.state : null
  console.log("user:", user);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    (!location.state ? axios.post('https://task-manager.codionslab.com/api/v1/register', values)
      .then(response => {
        console.log('response.data:', response.data);
        const token = response.data.data.token;
        const user = response.data.data.user;

        navigate("/profile", { state: { token, user } }); 

        notification.success({
          message: 'Registration Successful',
          description: `Welcome, ${user.name}!`,
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
        notification.error({
          message: 'Registration Failed',
          description: 'Please try again.',
        });
      }) :
      axios.put(`https://task-manager.codionslab.com/api/v1/admin/user/${user.id}`, {...values,
        is_active: user.is_active}, user.options)
      .then(response => {
        console.log('response.data:', response.data);
        const token = response.data.data.token;
        const user = response.data.data.user;

        navigate("/profile", { state: { token, user } });

        notification.success({
          message: 'Updated Successfully',
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
        notification.error({
          message: 'Registration Failed',
          description: 'Please try again.',
        });
      })

    )
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

    </div>
  );
};

export default Register;

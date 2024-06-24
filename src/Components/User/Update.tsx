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

const Update: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = location.state ? location.state : null
  console.log("user:", user);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  };
  

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
      axios.put(`https://task-manager.codionslab.com/api/v1/admin/user/${user.id}`, {...values,
        is_active: user.is_active}, user.options)
      .then(response => {
        console.log('response.data:', response.data);

        navigate("/users");

        notification.success({
          message: 'Updated Successfully',
        });
      }
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
    <>
      <h2>{user.isUserEdit ? "Update User" : user.isEdit ? "Update Your Details" : "Register"}</h2>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        // initialValues={{ name: user.name, email: user.email, password: user.password, role: user.role, remember: true }}
        initialValues={user.isUserEdit ? { name: user.name, email: user.email, password: user.password, role: user.role, 
          remember: true } : user.isEdit ? {name: user.userData.name, email: user.userData.email, password: user.userData.password, role: user.userData.role, 
            remember: true} : {remember: true}}

        // initialValues={{ remember: true }}
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

        {(user.isEdit || user.isUserEdit) && 
          <Form.Item<FieldType>
            label="Role"
            name="role"
            rules={[{ required: true, }]}
          >
            <Input />
          </Form.Item>
        }


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

    </>
  );
};

export default Update;

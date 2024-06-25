// import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, notification } from 'antd';
import type { FormProps } from 'antd';
import { useLocation } from 'react-router';

const TaskForm: React.FC = () => {
  const savedToken = localStorage.getItem("token");
  console.log('savedToken:', savedToken);
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };

  const location = useLocation()
  const state = location.state
  const {id, name, description, due_date, status} = state.task
  const projectId = state.id
  console.log("location:", location);

  console.log("state:", state);
  
  type FieldType = {
    name?: string;
    description?: string;
    due_date?: string;
    status?: string; 
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log("values:", values);
    axios.put(`https://task-manager.codionslab.com/api/v1/project/${projectId}/task/${id}`, values, options)
    .then(response => {
      notification.success({message: "Task Updated Successfully"})
    })
    .catch(error => {
      console.log("error:", error);
    });
    
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <h3>Update Task</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={(location !== null) ? { name, description, due_date, status, remember: true } : {remember: true }}
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

        <Form.Item<FieldType>
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Project Description' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType='submit'>
            Update
          </Button>
        </Form.Item>
      </Form> 
    </>
  );
};

export default TaskForm;
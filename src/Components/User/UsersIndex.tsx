import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert } from 'antd';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const UsersIndex: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer 1',
      },
    };
    axios.get('https://task-manager.codionslab.com/api/v1/admin/user')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the users');
        setLoading(false);
        console.log("error:", error);
        
      });
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
  ];

  return (
    <Table dataSource={users} columns={columns} rowKey="id" />
  );
};

export default UsersIndex;

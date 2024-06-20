import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert } from 'antd';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    console.log('savedToken:', savedToken);
    
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${savedToken}`,
      },
    };
    axios.get('https://task-manager.codionslab.com/api/v1/profile', options)
      .then(response => {
        setLoading(false);
        console.log("response:", response);
        console.log("response.data.data:", response.data.data);
        setUserData(response.data.data);
      })
      .catch(error => {
        setError('There was an error fetching the user data');
        setLoading(false);
        console.log("error:", error);
      });
  }, []);

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const columns = [
    {
      title: 'Id',
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
    }
  ];

  const dataSource = userData ? [userData] : [];

  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </>
  );
};

export default Profile;

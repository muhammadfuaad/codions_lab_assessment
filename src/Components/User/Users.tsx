import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Tag, Button, notification } from 'antd';
import { useNavigate } from 'react-router';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const data = localStorage.getItem("user")
  const user = JSON.parse(data)
  console.log('token:', token);
  console.log('user:', user);
  const navigate = useNavigate()
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    
    axios.get('https://task-manager.codionslab.com/api/v1/admin/user', options)
      .then(response => {
        
        setUsers(response.data.data.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the users');
        setLoading(false);
        console.log("error:", error);
        
      });

  }, []);

     // user actions
     const deleteUser = (id: number) => {
      console.log(`${id} clicked`);
      setLoading(true)
      axios.delete(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, options)
      .then(response => {
        setLoading(false)
        console.log("response:", response);
        notification.success({message: "User deleted successfully"})
        const newUsers = users.filter((user)=>user.id !== id)
        setUsers(newUsers)
      })
      .catch(error => {
        console.log("error:", error);
      });
    }
  
    const updateUser = (id) => {
      console.log(`${id} clicked`);
      const user = users.find((user)=> user.id === id)
      const isUserEdit = true
      navigate("/edit_user", { state: {id: user.id, name: user.name, email: user.email, password: user.password, role: user.role,
        is_active: user.is_active, token: token, options, isUserEdit} });
    }

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
      title: 'Roles',
      key: 'role',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={(role == "admin") ? "#f50" : "#2db7f5"}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => deleteUser(record.id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => updateUser(record.id)}>
            Update
          </Button>
        </>
      ),
    }
  ];

  return (
    <>
      {user.role == "admin" && (
        <>
          <Button type="primary" onClick={() => navigate("/edit_user", {state: {token: token}})}>
            New User
          </Button>
          <h3>Registered Users: {users && users.length}</h3>
          <Table dataSource={users} columns={columns} rowKey="id" />
        </>
      )}
    </>
  );
};

export default Users;

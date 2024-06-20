import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, notification } from 'antd';
import { useNavigate } from 'react-router';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const savedToken = localStorage.getItem("token");
  console.log('savedToken:', savedToken);
  
  const options = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${savedToken}`,
    },
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [users, setUsers] = useState<Users | null>(null);

  const [pageUrl, setPageUrl] = useState(null)
  const [projects, setProjects] = useState([])

  const handleDelete = (id) => {
    console.log(`${id} clicked`);
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, options)
      .then(response => {
        console.log("response:", response);
      })
      .catch(error => {
        console.log("error:", error);
      });
    
  }

  const handleUpdate = (id) => {
    console.log(`${id} clicked`);
    const user = users.find((user)=> user.id === id)
    
    navigate("/register", { state: {name: user.name, email: user.email, password: user.password} });
    axios.put(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, options)
      .then(response => {
        console.log("response:", response);
      })
      .catch(error => {
        console.log("error:", error);
      });
    
  }

  useEffect(() => {
    
    axios.get('https://task-manager.codionslab.com/api/v1/profile', options)
      .then(response => {
        setLoading(false);
        console.log("response:", response);
        console.log("response.data.data:", response.data.data);
        setUserData(response.data.data);
      })
      .catch(error => {
        setError('Please Login');
        setLoading(false);
        console.log("error:", error);
      });

      axios.get('https://task-manager.codionslab.com/api/v1/project', options)
      .then(response => {
        // setLoading(false);
        console.log("2nd response:", response);
        console.log("2nd response.data.data:", response.data.data);
        // setUserData(response.data.data);
        const firstPageUrl = response.data.data.first_page_url;
        console.log("firstPageUrl:", firstPageUrl);
        setPageUrl(firstPageUrl)

        axios.get("https://task-manager.codionslab.com/api/v1/project?page=1" , options).then(response => {
          // setLoading(false);
          console.log("3rd response:", response);
          console.log("3rd response.data.data:", response.data.data);
          console.log("3rd response.data.data.data:", response.data.data.data);
          setProjects(response.data.data.data)

        })
        .catch(error => {
          // setError('Please Login');
          setLoading(false);
          console.log("error:", error);
        });

        axios.get("https://task-manager.codionslab.com/api/v1/admin/user" , options).then(response => {
          // setLoading(false);
          console.log("(users index api) response:", response);
          console.log("(users index api) response.data.data:", response.data.data);
          console.log("(users index api) response.data.data.data:", response.data.data.data);
          setUsers(response.data.data.data)

          // setProjects(response.data.data.data)

        })
        .catch(error => {
          // setError('Please Login');
          setLoading(false);
          console.log("error:", error);
        });
      })
      .catch(error => {
        // setError('Please Login');
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

  const columns2 = [
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
          <Button type="link" onClick={() => handleUpdate(record.id)}>
            Update
          </Button>
        </>
      ),
    }
  ];

  const dataSource1 = userData ? [userData] : [];
  
  const handleLogOut = () => {
    axios.post('https://task-manager.codionslab.com/api/v1/logout', {},  options)
      .then(response => {
        console.log("response:", response);
        notification.success({
          message: 'Logged Out Successfully',
        });
      })
      .catch(error => {
        console.log("error:", error);
      });
      return <Alert message="Logged Out Succesfully" description={error} type="error" showIcon />;
  }

  return (
    <>
      <Table dataSource={dataSource1} columns={columns} rowKey="id" />
      <p>There are {projects.length} projects assigned to you.</p>
      {projects && projects.map((project)=>{
        return <>
          <p><span className='font-bold bg-black'>Id: </span>{project.id}</p>
          <p><span>Name: </span>{project.name}</p>
          <p><span>Description: </span>{project.description}</p>
        </>

       })}
       <p>Users: {users && users.length}</p>
       <Table dataSource={users} columns={columns2} rowKey="id" />
       
      <Button type="primary" onClick={handleLogOut}>
        Log Out
      </Button>
    </>
  );
};

export default Profile;

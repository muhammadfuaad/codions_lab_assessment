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
  const [pageUrl, setPageUrl] = useState(null)

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

  const dataSource = userData ? [userData] : [];
  
  const handleLogOut = () => {
    const savedToken = localStorage.getItem("token");
    console.log('savedToken:', savedToken);

    const options = {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    };
    axios.post('https://task-manager.codionslab.com/api/v1/logout', {},  options)
      .then(response => {
        console.log("response:", response);
      })
      .catch(error => {
        console.log("error:", error);
      });
      return <Alert message="Logged Out Succesfully" description={error} type="error" showIcon />;
  }

  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
      <button onClick={handleLogOut}>Log Out</button>
    </>
  );
};

export default Profile;

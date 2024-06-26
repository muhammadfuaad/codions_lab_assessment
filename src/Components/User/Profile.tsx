import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, notification, Card, Space, Tag, Avatar, Select, Dropdown } from 'antd';
import { useNavigate } from 'react-router';
// import { DownOutlined } from '@ant-design/icons';
import { addUsers } from '../../Redux/UsersSlice';
import store from '../../Redux/Store';
import { useSelector, useDispatch } from 'react-redux';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
  const [totalProjects, setTotalProjects] = useState([])
  const [assignedProjects, setAssignedProjects] = useState([])
  // project actions
  const deleteProject = (id: number) => {
    console.log(`${id} clicked`);
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/project/${id}`, options)
      .then(response => {
        console.log("(delete project api) response:", response);
        notification.success({
          message: 'Project Deleted Successfully',
        });
      })
      .catch(error => {
        console.log("(delete project api) error:", error);
      });
  }

  const updateProject = (id: number) => {
    console.log(`${id} clicked`);
    const isUpdate = true
    navigate("/project", {state: {id, savedToken, isUpdate}} )
  }

    // user actions
  const deleteUser = (id: number) => {
    console.log(`${id} clicked`);
    axios.delete(`https://task-manager.codionslab.com/api/v1/admin/user/${id}`, options)
    .then(response => {
      console.log("response:", response);
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
      is_active: user.is_active, token: savedToken, options, isUserEdit} });
  }

  const handleUpdate = () => {
    const isEdit = true
    navigate("/edit_user", { state: {userData, isEdit} });
  }

  useEffect(() => {
    // it fetches user data
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

    // It fetches the projects assigned to user
    axios.get('https://task-manager.codionslab.com/api/v1/project', options)
    .then(response => {
      // setLoading(false);
      console.log("(user projects) response:", response);
      console.log("(user projects) response.data.data:", response.data.data);
      // setUserData(response.data.data);
      const firstPageUrl = response.data.data.first_page_url;
      console.log("firstPageUrl:", firstPageUrl);
      setPageUrl(firstPageUrl)
      setAssignedProjects(response.data.data.data)

      // axios.get("https://task-manager.codionslab.com/api/v1/project?page=1" , options).then(response => {
      //   // setLoading(false);
      //   console.log("3rd response:", response);
      //   console.log("3rd response.data.data:", response.data.data);
      //   console.log("3rd response.data.data.data:", response.data.data.data);
      //   setProjects(response.data.data.data)
      // })
      // .catch(error => {
      //   // setError('Please Login');
      //   setLoading(false);
      //   console.log("error:", error);
      // });
    })
    .catch(error => {
      // setError('Please Login');
      setLoading(false);
      console.log("error:", error);
    });

    

  }, []);

  useEffect(() => {
    console.log("userData:", userData);
    console.log("totalProjects:", totalProjects);
    console.log("assignedProjects:", assignedProjects);

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

  const dataSource1 = userData ? [userData] : [];
  
  const handleLogOut = () => {
    axios.post('https://task-manager.codionslab.com/api/v1/logout', {},  options)
      .then(response => {
        console.log("response:", response);
        notification.success({
          message: 'Logged Out Successfully',
        });
        navigate("/login")
      })
      .catch(error => {
        console.log("error:", error);
      });
      return <Alert message="Logged Out Succesfully" description={error} type="error" showIcon />;
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    if (e.key == 2) {
      handleLogOut()
    } else if (e.key == 1) {
      handleUpdate()
    }
  };
  
  const items: MenuProps['items'] = [
    {
      label: 'Update Your Profile',
      key: '1',
    },
    {
      label: 'Log Out',
      key: '2',
    }
  ];
  
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  return (
    <div className='bg-gray-100 p-12 rounded-xl'>
      <div className='flex justify-between'>
        <div></div>
        <h2 className='font-bold text-2xl mb-16'>Dashboard</h2>
        <Dropdown menu={menuProps}>
          <Avatar size={25} gap={2}>{userData.name[0]}</Avatar>
        </Dropdown>
      </div>
      <Table dataSource={dataSource1} columns={columns} rowKey="id" />
      <p className='text-md'><span className='font-bold'>Assigned Projects: </span>{assignedProjects.length == 0 ? "No Assigned Project" : assignedProjects.length}</p> 
      {assignedProjects && assignedProjects.map((project)=> 
        {const {name, description} = project
          return ( 
            <>
              <p><span className='font-bold bg-black'>Id: </span>{project.id}</p>
              <p><span>Name: </span>{name}</p>
              <p><span>Description: </span>{description}</p>
            </>
          )
        })
      }
      {userData.role === "admin" &&
        <div className="flex gap-4">
          <Button type="primary" onClick={()=>{navigate("/projects", {state: users})}}>All Projects</Button>
          <Button type="primary" onClick={()=>{navigate("/users", {state: users})}}>All Users</Button>
        </div>
      }
    </div>
  );
};

export default Profile;

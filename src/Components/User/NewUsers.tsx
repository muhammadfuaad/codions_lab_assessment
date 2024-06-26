import React, { useEffect, useState } from 'react';
import { List, Avatar, Pagination, Space } from 'antd';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

type PaginationData = {
  current_page: number;
  data: User[];
  total: number;
  per_page: number;
};

const NewUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://task-manager.codionslab.com/api/v1/admin/user?page=${page}`);
      const data: { data: PaginationData } = await response.json();
      setUsers(data.data.data);
      setTotalUsers(data.data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={users}
        renderItem={user => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{user.name[0]}</Avatar>}
              title={user.name}
              description={user.email}
            />
            <Space>
              <div>Role: {user.role}</div>
              <div>Active: {user.is_active ? 'Yes' : 'No'}</div>
            </Space>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        total={totalUsers}
        pageSize={10} // Set this to the number of items per page from the API response
        onChange={handlePageChange}
      />
    </div>
  );
};

export default NewUsers;

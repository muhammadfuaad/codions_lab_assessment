import React from 'react';
import { useState, useEffect } from 'react';
const Test: React.FC = () => {
  
  const [list, setList] = useState([])
  const arr =[1,2,3,4,5]
  useEffect(()=>{
    arr.forEach((element)=>{setList((prevList)=>[...prevList, element])})
  }, [])
  console.log("list:", list);
  
  return (
    <div>
      {list.map((item)=>item)}
    </div>
  );
};

export default Test;

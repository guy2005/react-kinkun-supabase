import React from 'react'
import { useState } from 'react';
import food from './../assets/restaurant.png'
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import Footer from './../compos/Footer'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
function Home() {
  const navigate = useNavigate();
  const [ secureCode , setsecureCode] = useState('');

  //ตรวจสอบว่ากรอกข้อมูลครบหรือยัง
  const handleClick = () => {
    if(secureCode === ''){
      // alert('กรอกให้ครบ');
      Swal.fire({
        icon: 'warning',
        iconColor: 'red',
        title: 'กรุณากรอกรหัสเข้าใช้งาน',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6'
      })    
      return;
    }

  // ตรวจสอบว่ากรอกรหัสผ่านถูกหรือป่าว
  // ถ้ากรอกถูกให้ไปหน้า showallkinkun 
    if(secureCode.toUpperCase() === 'SAU'){ // .toUpperCase() เเค่เอาไว้ตัวที่ป้อนมาเป็นพิมพ์ใหญ่
      navigate('/showallkinkun') // // navigate เป็นค่าตัวเเทนของ useNavigate() ทำหน้าที่ลิ้งไปหน้า '/showallkinkun'
    }else{
      // alert('กรอกรหัสผ่านให้ถูกต้อง')
      Swal.fire({
        icon: 'warning',
        iconColor: 'red',
        title: 'กรุณากรอกรหัสเข้าใช้งานให้ถูกต้อง',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6'
      })    
    }

  }
  return (
    <>
      <div>
        <div className='w-10/12 mx-auto border border-gray-300 mt-20 shadow-md p-6 rounded-lg'>
          <h1 className='text-2xl font-bold text-center text-blue-700'>
            Kinkun app (Supabase)
          </h1>
          <h1 className='text-2xl font-bold text-center text-blue-700'>
            บันทึกการกิน
          </h1>

          <img src={food} alt="กินกิน" className='block mx-auto w-30 mt-5' />
          <input type="text"  placeholder='Enter secure code' 
            value={secureCode} onChange={(e)=>{setsecureCode(e.target.value)}}
            className='p-3 border border-gray-400 rounded-md mt-5 w-full'/>
          <button onClick={handleClick} 
            className='w-full bg-blue-700 p-3 rounded-md text-white mt-5 hover:blue-800 cursor-pointer'>
            เข้าใช้งาน
          </button>

          <div className='mt-5 flex justify-center gap-5'>
            <a href="#"><FaFacebook className='text-2xl text-gray-500 hover:text-red-700'/></a>
            <a href="#"><FaLine className='text-2xl text-gray-500 hover:text-red-700'/></a>
            <a href="#"><FaGithub className='text-2xl text-gray-500 hover:text-red-700'/></a>
          </div>
          
        </div>
        <Footer/>
      </div>
    </>
  )
}

export default Home
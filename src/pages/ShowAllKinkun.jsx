import React from "react";
import food from './../assets/restaurant.png'
import Footer from './../compos/Footer'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient";

function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(()=>{ 
    // โค้ดที่จะทำงานเมื่อมี Effect เกิดขึ้นกับ Component
    // ดึงข้อมูลการกินทั้งหมดจาก supabase โดยสร้างเป็นฟังชั่น
    const fetchKinkuns = async () =>{
      try { 
        const {data, error} = await   supabase
                                      .from('kinkun_tb')
                                      .select("*")
                                      .order('created_at', {ascending: false});
        
        if(error){
          alert('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
          console.error('Fetch error:', error);
        }else{
          setKinkuns(data); 
        }
      } catch(ex) {
        alert('เกิดข้อผิดพลาด กรถณาลองใหม่อีกครั้ง');
        console.error('Fetch error:', ex); 
      }
    }; 

    
    fetchKinkuns();
    
  }, [])
  

  return (
    <>
      <div>
        <div className="w-10/12 mx-auto border border-gray-300 mt-20 shadow-md p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-center text-blue-700">
            Kinkun app (Supabase)
          </h1>
          <h1 className="text-2xl font-bold text-center text-blue-700">
            บันทึกการกิน
          </h1>

          <img src={food} alt="กินกิน" className="block mx-auto w-30 mt-5" />

          {/* ส่วนเเสดงปุ่มเพิ่ม เพื่อเปิดหน้าจอ /addkinkun */}
          <div className="my-8 flex justify-end">
            <Link to="/addkinkun" className="bg-blue-700 p-3 rounded hover:bg-blue-800 text-white">
              เพิ่มการกิน
            </Link>
          </div>

          {/* ส่วนเเสดงข้อมูลการกินทั้งหมดที่สั่งมาจาก /addkinkun โดยจะเเสดงเป็นตาราง*/}
          <table className="w-full border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-gray-700 p-2">รูป</th>
                <th className="border border-gray-700 p-2">กินอะไร</th>
                <th className="border border-gray-700 p-2">กินที่ไหน</th>
                <th className="border border-gray-700 p-2">กินไปเท่าไหร่</th>
                <th className="border border-gray-700 p-2">วันไหน</th>
                <th className="border border-gray-700 p-2">ACTION</th>
              </tr>

            </thead>
            <tbody>
              {kinkuns.map((kinkun)=>(
                <tr key={kinkun.id}>
                  <td className="border border-gray-700 p-2 text-center">
                    {
                      kinkun.food_image_url === '' || kinkun.food_image_url === null
                      ? '_'
                      : <img src={kinkun.food_image_url} alt="" className="w-20 mx-auto"/>
                    }
                  </td>
                  <td className="border border-gray-700 p-2">{kinkun.food_name}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_where}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_pay}</td>
                  <td className="border border-gray-700 p-2">
                    {new Date(kinkun.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="border border-gray-700 p-2">
                    เเก้ไข | ลบ
                  </td>
                </tr>
              ))}


            </tbody>
          </table>

        </div>

        <Footer/>

      </div>      
    </>
  );
}

export default ShowAllKinkun;
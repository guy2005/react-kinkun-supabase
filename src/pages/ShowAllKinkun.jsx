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
    // fetchkinkun จะเป็นเเค่ตัวกรองข้อมูลที่จะเอาไปใช้
    const fetchKinkuns = async () =>{ // ถ้าไม่ใช้ async จะใช้  await ไม่ได้
      try { // ที่ต้องมี data, error เพราะ ต้องเก็บ ข้อมูลที่ได้มาจากsupabase(data) เเละ เก็บข้อผิดพลาดเอาไปเเสดง(error)
        const {data, error} = await   supabase // await มีไว้หยุดการทำงานชั่วคราว เพื่อที่จะไปเอาข้อมูลมา
                                      .from('kinkun_tb') // เลือก ตารางจาก โปรเจคไหน
                                      .select("*") // เอาทุกอย่าง
                                      .order('created_at', {ascending: false}); // เลียงจากค่าตัวเลขตอนที่ป้อนมากที่สุดไปน้อยสุด
        
        if(error){
          alert('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
          console.error('Fetch error:', error);
        }else{
          setKinkuns(data); // ทำให้ setkinkuns มีค่าของ data
        }
      } catch(ex) { // มีหน้าที่ตรวจจับข้อผิดพลาดโดยเฉพาะ เเละ ถ้าเกิดข้อผิดพลาดจะไม่ทำให้หน้าจอขาว เเต่เป็นเเจ้งเตือนเเทน
        alert('เกิดข้อผิดพลาด กรถณาลองใหม่อีกครั้ง');
        console.error('Fetch error:', ex); 
      }
    }; 

    
    fetchKinkuns(); // เรียกใช้ข้อมูลที่ผ่านการกรองมาเเล้ว
    
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
              {kinkuns.map((kinkun)=>( // เอาค่าที่อยู่ใน kinkuns ที่วนลูปจนครบทุกตัวเเล้วมาเก็บใน kinkun 
                <tr key={kinkun.id}> {/*kinkun.id คือ PK ที่เราตั้งไว้ใน supabase เพื่อที่มันจะได้ไม่เเสดงค่าซ้ำกัน*/}
                  <td className="border border-gray-700 p-2 text-center">
                    {
                      kinkun.food_image_url === '' || kinkun.food_image_url === null
                      ? '_' // ถ้า True (?) หมายความว่า ไม่มีรูปภาพ บันทึกไว้โค้ดจะแสดงผลเป็น '_' (ขีดล่าง) แทน
                      : <img src={kinkun.food_image_url} alt="" className="w-20 mx-auto"/>
                      // ถ้า False (:): หมายความว่า มี URL รูปภาพอยู่โค้ดจะแสดงผลเป็นรูปภาพที่ใส่ไว้ใน supabase
                      // ? :  ทำหน้าที่ แทน if(?) else(:) 
                    }
                  </td>
                  <td className="border border-gray-700 p-2">{kinkun.food_name}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_where}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_pay}</td>
                  <td className="border border-gray-700 p-2">
                    {new Date(kinkun.created_at).toLocaleDateString('th-TH')} {/* เอาไว้เปลี่ยนค่าที่เราอยากได้ใน kinkun.created_at (เปลี่ยนเวลาเป็นไทย) */}
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
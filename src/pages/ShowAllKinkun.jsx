import React from "react";
import sertaurant from "./../assets/restaurant.png"
import Footer from "./../compos/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient";
import Swal from "sweetalert2";
 
export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);
<<<<<<< HEAD
 
  useEffect(() => {
    try {
      // โค้ดที่จะให้ทำงานเมื่อมี Effect เกิดขึ้นกับ Component
      // ดึงข้อมูลการกินทั้งหมดจาก Supabase โดยสร้างเป็นฟังก์ชัน
      const fetchKinkuns = async () => {
        // ตึงจาก Supabase
        const { data, error } = await supabase
          .from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });
        // ดึงมาแล้ว ให้ตรวจสอบ error
        if (error) {
          // alert('เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง');
          Swal.fire({
            icon: "warning",
            iconColor: "#E89E07",
            title: "เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง",
            showConfirmButton: true,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#3085d6",
          });
          console.log("Fetch error :", error);
        } else {
          //เอาค่าที่ดึงมาไปเก็บไว้ที่ state: kinkuns
          setKinkuns(data);
        }
      };
 
      // เรียกใช้ฟังก์ชันดึงข้อมูล
      fetchKinkuns();
    } catch (ex) {
      // alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง");
      Swal.fire({
        icon: "warning",
        iconColor: "#E89E07",
        title: "เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#3085d6",
      });
      console.log("Fetch error :", ex);
    }
  }, []);
 
  //สร้างฟัง์ชันลบข้อมูลออกจาก table และ storage บน Supabase
  const handleDeleteClick = async (id, food_image_url) => {
    // แสดงข้อความยืนยันการลบข้อมูล
    const result = await Swal.fire({
      icon: "question",
      iconColor: "#E81A07",
      title: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลการกินนี้ ?",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#E81A07",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#3085d6",
    });
 
    //ตรวจสอบ result ว่าผู้ใช้เลือกตกลง หรือยกเลิก
    if(result){
      // ลบรูปออกจาก storage บน supabase ถ้ามี
      if(food_image_url != ''){
        //ตัดเอาแค่ชื่อรูป
        const image_name = food_image_url.split('/').pop();
 
        const {error} = await supabase.storage.from('kinkun_tb').remove([image_name]);
 
        if(error){
          alert("เกิดข้อผิดพลาดในการลบรูปภาพ กรุณาลองใหม่อีกครั้ง");
          return;
        }
      }
 
      // ลบข้อมูลออกจาก table บน supabase
      const { error } = await supabase.from('kinkun_tb').delete().eq('id', id);
 
      if(error){
          alert("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
          return;
      }
 
      alert("ลบข้อมูลการกินเรียบร้อยแล้ว");
 
      //ลบข้อมูลออกจาก UI
      setKinkuns(kinkuns.filter((kinkun) => kinkun.id !== id));
      //หรือ window.location.reload()
    }    
  }
 
  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>
 
        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลการกิน
        </h1>
 
        <img src={sertaurant} alt="กินกัน" className="block mx-auto w-20 mt-5" />
 
        {/* ส่วนแสดงปุ่มเพิ่ม เพื่อเปิดหน้าจอ /addkinkun */}
        <div className="my-8 flex justify-end">
          <Link
            to="/addkinkun"
            className="bg-blue-700 p-3 rounded
                                               hover:bg-blue-800 text-white"
          >
            เพิ่มการกิน
          </Link>
=======

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

>>>>>>> a3e16d3ab12b886944f55457c8c87ceb4124c9e5
        </div>
 
        {/* ส่วนแสดงข้อมูลการกินทั้งหมดที่ดึงมาจาก Supabase โดยจะแสดงเป็นตาราง*/}
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
            {kinkuns.map((kinkun) => (
              <tr key={kinkun.id}>
                <td className="border border-gray-700 p-2 text-center">
                  {kinkun.food_image_url == "" ||
                  kinkun.food_image_url == null ? (
                    "-"
                  ) : (
                    <img
                      src={kinkun.food_image_url}
                      alt="รูปอาหาร"
                      className="w-20 mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_name}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_where}
                </td>
                <td className="border border-gray-700 p-2">
                  {kinkun.food_pay}
                </td>
                <td className="border border-gray-700 p-2">
                  {new Date(kinkun.created_at).toLocaleDateString("th-TH")}
                </td>
                <td className="border border-gray-700 p-2">
                  <Link className="text-red-500 underline mx-2 cursor-pointer"
                        to={'/editkinkun'+ kinkun.id}>แก้ไข</Link>
                  
                  |
                  <button   className="text-red-500 underline mx-2 cursor-pointer"
                            onClick={()=>handleDeleteClick(kinkun.id, kinkun.food_image_url)}>
                    ลบ
                  </button>                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <Footer />
    </div>
  );
}
 
 
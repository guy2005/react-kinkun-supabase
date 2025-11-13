import React from "react";
import food from "./../assets/restaurant.png"
import Footer from "./../compos/Footer"
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "./../lib/supabaseClient"

export default function AddKinkun() {
  // สร้าง state เพื่อจัดการกับข้อมูลต่างๆบน component
  const [food_name, setFood_name] = useState("");
  const [food_where, setFood_where] = useState("");
  const [food_pay, setFood_pay] = useState("");
  const [foodFlie, setFoodFile] = useState(null);
  const [foodName, setFoodName] = useState("");

  // ฟังก์ชั่นเลือกรูปและแสดงรูป
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFoodFile(file);
      setFoodName(URL.createObjectURL(file));
    }
  };

  // ฟังก์ชัน warningAlert
  const warningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      iconColor: "#E81A07",
      title: msg,
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#E81A07",
    });
  };

  // ฟังก์ชั่น successAlert
  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      iconColor: "#108723",
      title: msg,
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#108723",
    }).then(() =>{
      document.location.href = "/showallkinkun";
    });
  };

  // ฟังก์ชันบันทึกข้อมูลและอัปโหลดรูปไปที่ Supabase
  const handleSaveClick = async (e) => {
    e.preventDefault();

    // Validate UI
    if (food_name.trim().length === 0) {
      return warningAlert("กรุณากรอกชื่ออาหาร ?");
    } else if (food_where.trim().length === 0) {
      return warningAlert("กรุณากรอกว่ากินอาหารที่ไหน ?");
    } else if (food_pay.trim().length === 0) {
      return warningAlert("กรุณากรอกกินไปเท่าไหร่ ?");
    }

    // Upload รูปไปที่ Supabase storage
    let food_image_url = "";

    if (foodFlie) {
      const newFileName = Date.now() + "-" + foodFlie.name;

      const { error } = await supabase.storage
        .from("kinkun_bk")
        .upload(newFileName, foodFlie);

      if (error) {
        warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง");
        return;
      }

      const { data } = supabase.storage
        .from("kinkun_bk")
        .getPublicUrl(newFileName);

      food_image_url = data.publicUrl;
    }

    // Insert ข้อมูลลงตาราง
    const { error } = await supabase.from("kinkun_tb").insert({
      food_name,
      food_where,
      food_pay,
      food_image_url
    })

    if (error) {
      warningAlert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่อีกครั้ง");
      return;
    }

    successAlert("บันทึกเพิ่มการกินเรียบร้อยแล้ว");
  };

  return (
    <>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          เพิ่มข้อมูลการกิน
        </h1>
        <img src={food} alt="อาหาร" className="block mx-auto w-30 mt-5" />

        <form onSubmit={handleSaveClick}>
          <div>
            <label>กินอะไร</label>
            <input
              value={food_name}
              onChange={(e) => setFood_name(e.target.value)}
              placeholder="เช่น Pizza, KFC, ....."
              type="text"
              className="border border-gray-400 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินที่ไหน</label>
            <input
              value={food_where}
              onChange={(e) => setFood_where(e.target.value)}
              placeholder="เช่น Pizza หน้ามอเอเชีย, KFC หนองแขม, ....."
              type="text"
              className="border border-gray-400 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>กินไปเท่าไหร่ ?</label>
            <input
              value={food_pay}
              onChange={(e) => setFood_pay(e.target.value)}
              placeholder="เช่น 100, 200, 50, ....."
              type="number"
              className="border border-gray-400 w-full p-2 mt-2 rounded"
            />
          </div>

          <div className="mt-3">
            <label>รูปกิน ?</label>
            <input
              onChange={handleSelectImageAndPreview}
              type="file"
              className="hidden"
              id="selectImage"
              accept="image/*"
            />
            <label
              htmlFor="selectImage"
              className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer block w-22"
            >
              เลือกรูป
            </label>

            <div className="mt-3">
              {foodName && <img src={foodName} alt="รูปกิน" className="w-30" />}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer p-2 text-white rounded"
            >
              บันทึกการกิน
            </button>
          </div>
        </form>

        <div className="text-center my-4">
          <Link to="/showallkinkun" className="hover:text-blue-700">
            กลับไปหน้าแสดงข้อมูลการกิน
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

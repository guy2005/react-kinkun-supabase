import React, { useState, useEffect } from "react";
import food from "./../assets/restaurant.png"
import Footer from "./../compos/Footer"
import { Link } from "react-router-dom";
import { supabase } from "./../lib/supabaseClient"
import Swal from "sweetalert2";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจาก Supabase
    const fetchKinkuns = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        Swal.fire({
          icon: "warning",
          iconColor: "#E89E07",
          title: msg,
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#3085d6",
        });
        console.error("Fetch error:", error);
      } else {
        setKinkuns(data);
      }
    };

    fetchKinkuns();
  }, []);

  // สร้างฟังก์ชันลบข้อมูลออกจาก table และ storage บน supabase
  const handleDeleteClick = async (id, food_image_url) => {
    // แสดงข้อความยืนยันการลบข้อมูล
    const result = await Swal.fire({
      icon: "question",
      iconColor: "#E81A07",
      title: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้",
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#E81A07",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "#3085d6",
    });

    // ตรวจสอบ reuslt ว่าผู้ใช้เลือกตกลง หรือยกเลิก
    if (result) {
      // ลบรูปออกจาก storage บน supabase ถ้ามี
      if (food_image_url != "") {
        // ตัดเอาแค่ชื่อรูป
        const image_name = food_image_url.split("/").pop();

        const { error } = await supabase.storage
          .from("kinkun_bk")
          .remove([image_name]);

        if (error) {
          alert("เกิดข้อผิดพลาดในการลบรูปภาพ กรุณาลองใหม่อีกครั้ง");
          return;
        }
      }

      // ลบรูปออกจาก table บน supabase
      const { error } = await supabase.from("kinkun_tb").delete().eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาดในการลบรูปภาพ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      alert("ลบช้อมูลการกินเรียบร้อยแล้ว");

      // ลบข้อมูลออกจากหน้าจอ
      setKinkuns(kinkuns.filter((kinkun) => kinkun.id !== id));
    }
  };

  return (
    <>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลการกิน
        </h1>

        <img src={food} alt="อาหาร" className="block mx-auto w-25 mt-5" />

        {/* ปุ่มเพิ่มข้อมูล */}
        <div className="my-8 flex justify-end">
          <Link
            to='/addkinkun'
            className="bg-blue-700 p-3 rounded hover:bg-blue-800 text-white"
          >
            เพิ่มการกิน
          </Link>
        </div>

        {/* ตารางแสดงข้อมูล */}
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
                  {kinkun.food_image_url ? (
                    <img
                      src={kinkun.food_image_url}
                      alt="รูปอาหาร"
                      className="w-20 mx-auto"
                    />
                  ) : (
                    "-"
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
                  <Link to={`/editkinkun/${kinkun.id}`}>
                  <button className="text-green-500 underline mx-2 cursor-pointer">
                    แก้ไข
                  </button>|
                  </Link>
                  <button
                    className="text-red-500 underline mx-2 cursor-pointer"
                    onClick={() =>
                      handleDeleteClick(kinkun.id, kinkun.food_image_url)
                    }
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
}
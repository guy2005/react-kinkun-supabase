import React, { useState, useEffect } from "react";
import food from "./../assets/restaurant.png";
import Footer from "./../compos/Footer";
import { Link } from "react-router-dom";
import { supabase } from "./../lib/supabaseClient";
import Swal from "sweetalert2";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  // ดึงข้อมูลทั้งหมด
  useEffect(() => {
    const fetchKinkuns = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        Swal.fire({
          icon: "warning",
          iconColor: "#E89E07",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง",
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

  // ลบข้อมูล + รูปภาพ
  const handleDeleteClick = async (id, food_image_url) => {
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

    if (result.isConfirmed) {
      // ลบรูปออกจาก storage
      if (food_image_url) {
        const image_name = food_image_url.split("/").pop();
        const { error } = await supabase.storage
          .from("kinkun_tb")
          .remove([image_name]);

        if (error) {
          Swal.fire("เกิดข้อผิดพลาดในการลบรูปภาพ", "", "error");
          return;
        }
      }

      // ลบข้อมูลจาก table
      const { error } = await supabase
        .from("kinkun_tb")
        .delete()
        .eq("id", id);

      if (error) {
        Swal.fire("เกิดข้อผิดพลาดในการลบข้อมูล", "", "error");
        return;
      }

      Swal.fire("ลบข้อมูลเรียบร้อยแล้ว", "", "success");

      // อัปเดตหน้า UI
      setKinkuns(kinkuns.filter((k) => k.id !== id));
    }
  };

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>

        <h1 className="text-2xl font-bold text-center text-blue-700">
          ข้อมูลการกิน
        </h1>

        <img src={food} alt="อาหาร" className="block mx-auto w-20 mt-5" />

        {/* ปุ่มเพิ่มข้อมูล */}
        <div className="my-8 flex justify-end">
          <Link
            to="/addkinkun"
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

                <td className="border border-gray-700 p-2 text-center">
                  <Link
                    to={`/editkinkun/${kinkun.id}`}
                    className="text-green-500 underline mx-2"
                  >
                    แก้ไข
                  </Link>
                  |
                  <button
                    className="text-red-500 underline mx-2"
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
    </div>
  );
}

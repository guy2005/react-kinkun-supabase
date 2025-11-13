
import React, { useEffect, useState } from "react";
import food from "./../assets/restaurant.png"
import Footer from "./../compos/Footer"
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "./../lib/supabaseClient"

export default function EditKinkun() {
  const { id } = useParams();


  const [food_name, setFood_name] = useState("");
  const [food_where, setFood_where] = useState("");
  const [food_pay, setFood_pay] = useState("");
  const [foodFile, setFoodFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [food_image_url, setFood_image_url] = useState("");


  useEffect(() => {
    const fetchKinkun = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          text: error.message,
          confirmButtonColor: "#E81A07",
        });
        console.error("Fetch error:", error);
      } else {
        setFood_name(data.food_name);
        setFood_where(data.food_where);
        setFood_pay(data.food_pay);
        setFood_image_url(data.food_image_url);
        setPreviewImage(data.food_image_url);
      }
    };

    fetchKinkun();
  }, [id]);

  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoodFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const warningAlert = (msg) => {
    Swal.fire({
      icon: "warning",
      title: msg,
      confirmButtonColor: "#E81A07",
    });
  };

  const successAlert = (msg) => {
    Swal.fire({
      icon: "success",
      title: msg,
      confirmButtonColor: "#108723",
    }).then(() => {
      document.location.href = "/showallkinkun";
    });
  };

  const handleSaveUpdateClick = async (e) => {
    e.preventDefault();

    // ✅ Validate input
    if (food_name.trim() === "") return warningAlert("กรุณากรอกชื่ออาหาร ?");
    if (food_where.trim() === "") return warningAlert("กรุณากรอกสถานที่ ?");
    if (food_pay.trim() === "") return warningAlert("กรุณากรอกราคา ?");

    let imageUrl = food_image_url; // ถ้าไม่เลือกรูปใหม่ ใช้รูปเดิม

    // ✅ ถ้ามีการเลือกรูปใหม่ ให้อัปโหลด
    if (foodFile) {
      try {
        // ลบรูปเก่าออกก่อน (ถ้ามี)
        if (food_image_url) {
          const oldImageName = food_image_url.split("/").pop();
          await supabase.storage.from("kinkun_bk").remove([oldImageName]);
        }

        // อัปโหลดรูปใหม่
        const newFileName = `${Date.now()}_${foodFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("kinkun_bk")
          .upload(newFileName, foodFile);

        if (uploadError) {
          console.error(uploadError);
          return warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
        }

        // ดึง public URL
        const { data: publicUrlData } = supabase
          .storage
          .from("kinkun_bk")
          .getPublicUrl(newFileName);

        imageUrl = publicUrlData.publicUrl;
      } catch (err) {
        console.error("Upload error:", err);
        return warningAlert("อัปโหลดรูปไม่สำเร็จ");
      }
    }

    // ✅ อัปเดตข้อมูลในตาราง
    const { error: updateError } = await supabase
      .from("kinkun_tb")
      .update({
        food_name,
        food_where,
        food_pay,
        food_image_url: imageUrl,
      })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      return warningAlert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }

    successAlert("แก้ไขข้อมูลสำเร็จแล้ว 🎉");
  };
  return (
    <>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun App (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          แก้ไขข้อมูลการกิน
        </h1>
        <img src={food} alt="อาหาร" className="block mx-auto w-30 mt-5" />

        <form onSubmit={handleSaveUpdateClick}>
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
              placeholder="เช่น Pizza หน้ามอ, KFC หนองแขม, ....."
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
              {previewImage && (
                <img src={previewImage} alt="รูปกิน" className="w-30" />
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer p-2 text-white rounded"
            >
              บันทึกแก้ไขการกิน
            </button>
          </div>
        </form>

        <div className="text-center my-4">
          <Link to='/showallkinkun' className="hover:text-blue-700">
            กลับไปหน้าแสดงข้อมูลการกิน
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

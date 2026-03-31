'use client';

import { useState } from "react";
import type { ContactRequest } from "../_type/ContactRequest";

type Form = {
  name: string,
  email: string,
  message: string
}

export default function ContactForm() {
  const defaultFormValue = { name: "", email: "", message: "" };

  const [form, setForm] = useState<Form>(defaultFormValue);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setForm(defaultFormValue);
  };

  // バリデートと送信時の処理
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleValidate = async () => {
    const newErrors: Partial<Form> = {};

    // お名前のチェック
    if (!form.name) {
      newErrors.name = "お名前は必須です。";
    } else if (form.name.length > 31) {
      newErrors.name = "お名前は30文字以内で入力してください。";
    }

    // メールアドレスのチェック
    const regex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (!form.email) {
      newErrors.email = "メールアドレスは必須です。";
    } else if (!regex.test(form.email)) {
      newErrors.email = "メールアドレスの形式が正しくありません。";
    }

    // 本文のチェック
    if (!form.message) {
      newErrors.message = "本文は必須です。";
    } else if (form.message.length > 501) {
      newErrors.message = "本文は500文字以内で入力してください。";
    }

    setErrors(newErrors);

    // 早期リターンで先にエラーを終わらせる
    if (Object.keys(newErrors).length !== 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 分割代入でformから必要なデータだけを取り出す
      const { name, email, message } = form;

      //requestBodyをつくる　略記法をつかう
      const requestBody: ContactRequest = { name, email, message }

      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

      if (response.ok) {
        alert("送信しました");
        handleReset();
      } else {
        // 意図的のcatch（送信処理エラーが起きたトクの処理）へ飛ばす
        throw new Error("サーバーエラー");
      }
    } catch (error) {
      alert("通信に失敗しました。ネット環境を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-[10px] w-[90%]">
        <h1 className="mb-[40px] text-xl font-bold">お問い合わせフォーム</h1>

        <form action="">
          <div className="w-full flex justify-between items-center mb-[20px]">
            <label htmlFor="name" className="max-w-[170px] w-full font-semibold">お名前</label>
            <div className="max-w-[70%] w-full">
              <input
                id="name"
                name="name"
                type="text"
                className="w-full p-[16px] border-black border rounded-sm"
                value={form.name}
                onChange={handleForm}
                disabled={false}
              />
              <br />
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>
          </div>
          <div className="w-full flex justify-between items-center mb-[20px]">
            <label htmlFor="email" className="max-w-[170px] w-full font-semibold">メールアドレス</label>
            <div className="max-w-[70%] w-full">
              <input
                id="email"
                name="email"
                type="text"
                className="w-full p-[16px] border-black border rounded-sm"
                value={form.email}
                onChange={handleForm}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
          </div>
          <div className="w-full flex justify-between items-center mb-[20px]">
            <label htmlFor="message" className="max-w-[170px] w-full font-semibold">本文</label>
            <div className="max-w-[70%] w-full">
              <textarea
                id="message"
                name="message"
                className="w-full p-[16px] border-black border rounded-sm"
                value={form.message}
                onChange={handleForm}
                disabled={isSubmitting}
              ></textarea>
              {errors.message && (
                <p className="text-red-600">{errors.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-[20px] mt-[30px]">
            <button
              type="button"
              className="text-base font-bold text-white bg-black pt-[5px] pb-[5px] pr-[15px] pl-[15px] rounded-sm cursor-pointer"
              onClick={handleValidate}
              disabled={isSubmitting}
            >
              送信
            </button>
            <button
              type="button"
              className="text-base font-bold bg-gray-300 pt-[5px] pb-[5px] pr-[15px] pl-[15px] rounded-sm cursor-pointer"
              onClick={handleReset}
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

'use client';

// import { useState } from "react";
import type { ContactRequest } from "../_type/ContactRequest";
import { useForm, SubmitHandler } from "react-hook-form"

type FormInputs = {
  name: string,
  email: string,
  message: string
}

export default function ContactForm() {
  const defaultValues = { name: "", email: "", message: "" };

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      isDirty,
      isValid,
      isSubmitting,
      errors,
    }
  } = useForm<FormInputs>({
    defaultValues,
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("送信しました");
        reset();
      } else {
        throw new Error("サーバーエラー");
      }
    } catch (error) {
      alert("通信に失敗しました。ネット環境を確認してください。");
    }
  }

  return (
    <>
      <div className="p-2.5 w-[90%]">
        <h1 className="mb-10 text-xl font-bold">お問い合わせフォーム</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex justify-between items-center mb-5">
            <label htmlFor="name" className="max-w-42.5 w-full font-semibold">お名前</label>
            <div className="max-w-[70%] w-full">
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "お名前が入力されていません。",
                })}
                className="w-full p-4 border-black border rounded-sm"
                disabled={isSubmitting}
              />
              <br />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>
          </div>

          <div className="w-full flex justify-between items-center mb-5">
            <label htmlFor="email" className="max-w-42.5 w-full font-semibold">メールアドレス</label>
            <div className="max-w-[70%] w-full">
              <input
                id="email"
                type="text"
                {...register("email", {
                  required: "メールアドレスが入力されていません。",
                  pattern: {
                    value: /[\w\.-]+@[\w\.-]+\.\w{2,4}/,
                    message: "正しいメールアドレス形式で入力してください"
                  }
                })}
                className="w-full p-4 border-black border rounded-sm"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="w-full flex justify-between items-center mb-5">
            <label htmlFor="message" className="max-w-42.5 w-full font-semibold">本文</label>
            <div className="max-w-[70%] w-full">
              <textarea
                id="message"
                {...register("message", {
                  required: "本文が入力されていません。",
                })}
                className="w-full p-4 border-black border rounded-sm"
                disabled={isSubmitting}
              ></textarea>
              {errors.message && (
                <p className="text-red-600">{errors.message.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-7.5">
            <button
              type="submit"
              className="text-base font-bold text-white bg-black pt-1.25 pb-1.25 pr-3.75 pl-3.75 rounded-sm cursor-pointer"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              送信
            </button>
            <button
              type="button"
              className="text-base font-bold bg-gray-300 pt-1.25 pb-1.25 pr-3.75 pl-3.75 rounded-sm cursor-pointer"
              onClick={() => reset()}
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

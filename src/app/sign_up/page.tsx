'use client'

import { supabase } from "@/app/_libs/supabase"
import { useForm, SubmitHandler } from "react-hook-form"

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export type Inputs = {
  email: string,
  password: string
}

export default function Page() {

  const defaultValues = {
    email: "",
    password: ""
  }

  // react hook from の初期設定
  const {
    register, // inputとRHF(react-hook-form)を紐付けるための関数
    handleSubmit,
    setError,
    formState: {
      isDirty,
      isValid,
      isSubmitting,
      errors,
    },
    reset,
  } = useForm<Inputs>({
    defaultValues,
    mode: "all",
  });

  // フォーム送信処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${appUrl}/login`,
        },
      })

      if (error) {
        // Supabaseからのエラーをサーバーエラーとしてセット
        setError("root.serverError", {
          type: "manual",
          message: error.message
        })
        return
      }

      // 成功したらフォームをリセット
      reset();
      alert('確認メールを送信しました。メール内のリンクをクリックしてください。')
    } catch (error) {
      console.error("エラー:", error);
      setError("root.serverError", {
        type: "manual",
        message: "送信に失敗しました。もう一度お試しください。"
      })
    }
  };

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">

        {isSubmitting && <div className="result">送信中</div>}
        {errors.root?.serverError && (
          <div className="bg-red-700 text-white p-2 rounded-lg text-sm text-center">
            {errors.root.serverError.message}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "メールアドレスが入力されていません。",
              pattern: {
                value: /[\w\.-]+@[\w\.-]+\.\w{2,4}/,
                message: "正しいメールアドレス形式で入力してください"
              }
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
          />
          {errors.email &&
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          }
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "パスワードが入力されていません。",
              minLength: { value: 6, message: "6文字以上で入力してください" }
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
          />
          {errors.password &&
            <span className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </span>
          }
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center"
            disabled={!isDirty || !isValid}>
            登録
          </button>
        </div>
      </form>
    </div>
  )

}
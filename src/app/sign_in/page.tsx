'use client'

import { supabase } from "@/app/_libs/supabase"
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from "react-hook-form"

export type Inputs = {
  email: string,
  password: string
}

export default function Page() {
  const router = useRouter()

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
    }
  } = useForm<Inputs>({
    defaultValues,
    mode: "all",
  });

  // フォーム送信処理
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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
      router.replace('/admin/posts');
      router.refresh()
    } catch (error) {
      console.error("エラー:", error);
      setError("root.serverError", {
        type: "manual",
        message: "ログインに失敗しました。もう一度お試しください。"
      })
    }
  };

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">

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
            disabled={isSubmitting}
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
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="••••••••"
            disabled={isSubmitting}
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
            disabled={!isDirty || !isValid || isSubmitting}>
            ログイン
          </button>
        </div>
      </form>
    </div>
  )
}

// export default function Page(){
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     setIsLoading(true)

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) {
//       alert('ログインに失敗しました')
//     } else {
//       router.replace('/admin/posts')
//     }
//     setIsLoading(false)
//   }


//   return (
//     <div className="flex justify-center pt-60">
//       <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-100">
//         <div>
//           <label 
//             htmlFor="email"
//             className="block mb-2 text-sm font-medium text-gray-900">
//               メールアドレス
//           </label>
//           <input 
//             type="email"
//             name="email"
//             id="email"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="name@company.com"
//             required
//             onChange={(e) => setEmail(e.target.value)}
//             // value={email}
//             disabled={isLoading}/>
//         </div>

//         <div>
//           <label 
//             htmlFor="password"
//             className="block mb-2 text-sm font-medium text-gray-900">
//               パスワード
//           </label>
//           <input 
//             type="password"
//             name="password"
//             id="password"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//             placeholder="••••••••"
//             required
//             onChange={(e) => setPassword(e.target.value)}
//             // value={password}
//             disabled={isLoading}/>
//         </div>

//         <div>
//           <button
//             type="submit"
//             className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//             disabled={isLoading}>
//             ログイン
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }
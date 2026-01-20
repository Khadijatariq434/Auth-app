// app/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center text-gray-400">Loading reset form...</div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
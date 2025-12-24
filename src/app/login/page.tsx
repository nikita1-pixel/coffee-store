import Login from "@/components/Login";
import React from "react";

const LoginPage = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[url('/images/espresso-bg.png')] bg-cover p-8">
            <Login />
        </main>
    );
};

export default LoginPage;